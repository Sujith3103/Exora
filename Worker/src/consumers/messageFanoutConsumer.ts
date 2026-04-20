import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { messageCompletedClient, messageProcessingClient, publisher, redis, retrySchedulerClient, streamAck, streamReader } from "../utils/redisClient";

type RedisStreamMessage = {
    id: string;
    message: Record<string, string>;
};

type RedisStreamResponse = {
    name: string;
    messages: RedisStreamMessage[];
}[];

type LogExecution = {
    stage: string,
    status: "FAILED" | "SUCCESS" | "PROCESSING",
    message: string,
    isError: boolean,
    error: unknown
}

const BATCH_SIZE = 5;  // How many messages you pull
const BLOCK_MS = 10;   // How long redis waits
const CONCURRENCY = 5; // How many you process in parallel

let isRunning = true;

const sampleError = {
    message: "Request failed with status code 503",
    response: {
        status: 503,
        data: "Service Unavailable"
    }
}

const logExecutionMessages = ['processing pipeline 1','completed processing pipeline 1','processing pipeline 2','completed processing pipeline 2','acknowledging stream']

const baseDelay = 1000; // 1 sec
const maxDelay = 10000; // 1 min

function getBackoffDelay(retryCount: number) {
    const jitter = Math.random() * 200; // avoid thundering herd
    return Math.min(baseDelay * (2 ** retryCount) + jitter, maxDelay);
}
export function serializeError(err: any) {
    return {
        message: err?.message || "unknown error",
        name: err?.name || "Error",
        status: err?.response?.status || err?.status || null,
        code: err?.code || null,

        // optional (be careful with size)
        stack: err?.stack || null,

        // useful for axios
        data: err?.response?.data || null,
    };
}

process.on("SIGINT", () => { console.log("Shutting down consumer..."); isRunning = false; });
process.on("SIGTERM", () => { console.log("Shutting down consumer..."); isRunning = false; });

export const processMessageFanOutEvent = async () => {

    while (isRunning) {

        // console.log("GONNA READ THE GROUP   ")
        // console.time("read");

        const response = await streamReader.xReadGroup(
            "fanout-consumer-group",
            "fanout-worker-1",
            [{ key: "message-events-stream", id: ">" }],
            { COUNT: BATCH_SIZE, BLOCK: BLOCK_MS }
        )
        // console.timeEnd("read");
        if (response) {
            console.log("got stuff here")
        }
        if (!response) continue

        const streams = response as RedisStreamResponse;

        for (const streamData of streams) {

            const ids = streamData.messages.map(msg => msg.id);
            console.log(ids)
        
            console.time("batch-process")
            await Promise.all(
                streamData.messages.map(async (msg) => {
                    console.log("msg -01 : ", msg)

                    const logExecution: LogExecution[] = []
                    let parsedMessage;

                    try {
                        const payload = msg.message;

                        //PARSING THE MESSAGE
                        try {
                            parsedMessage = {
                                message: JSON.parse(payload.message),
                                messageId: payload.messageId,
                                retryCount: JSON.parse(payload.retryCount)
                            };
                        } catch (err) {
                            console.error("JSON parse failed", err);
                            return;
                        }
                        
                        const { messageId, message, retryCount } = parsedMessage;
                        console.log("Parsed message: ", parsedMessage)

                        const lockKey = `lock:${messageId}`;
                        const completedKey = `completed:${messageId}`;

                        logExecution.push({
                            stage: 'pipeline-1',
                            status: 'PROCESSING',
                            error: '',
                            isError: false,
                            message: 'Processing pipeline 1'
                        })
                        //PIPELINE FOR LOCKKEY AND COMPLETEDKEY
                        const pipeline = messageProcessingClient.multi()
                        const pipeline2 = messageCompletedClient.multi()



                        pipeline.set(lockKey, '1', { NX: true, EX: 5 })
                        pipeline.exists(completedKey);

                        const pipeline1Results = await pipeline.exec() as any[];
                        console.log("pipeline results:  ", pipeline1Results)
                        const [lockRes, isCompleted] = pipeline1Results;

                        if (!lockRes) {
                            console.log("already being processed");
                            return;
                        }

                        if (isCompleted) {
                            console.log("Duplicate skipped");
                            return;
                        }

                        logExecution.push({
                            stage: 'pipeline-1',
                            status: 'SUCCESS',
                            error: '',
                            isError: false,
                            message: 'Completed processing pipeline 1'
                        })
                        const err = new Error(sampleError.message);
                        (err as any).response = sampleError.response;

                        throw err;
                        logExecution.push({
                            stage: 'pipeline-2',
                            status: 'PROCESSING',
                            error: '',
                            isError: false,
                            message: 'Processing pipeline 2'
                        })
                        //PIPELINE FOR PUBLISH AND SET COMPLETED KEY
                        pipeline2.publish("message-events", JSON.stringify(message))
                        pipeline2.set(completedKey, '1', { EX: 3600 })

                        const pipeline2Results = await pipeline2.exec()
                        logExecution.push({
                            stage: 'pipeline-2',
                            status: 'SUCCESS',
                            error: '',
                            isError: false,
                            message: 'Completed processing pipeline 2'
                        })
                        await streamAck.xAck(
                            "message-events-stream",
                            "fanout-consumer-group",
                            msg.id
                        );
                        logExecution.push({
                            stage: 'ack-stream',
                            status: 'SUCCESS',
                            error: '',
                            isError: false,
                            message: 'Acknowledged stream'
                        })
                    }
           
                    catch (Err) {
                        console.log("error : ",Err)
                        logExecution.push({
                            stage: 'Error',
                            status: 'FAILED',     
                            error: JSON.stringify(Err),
                            isError: true,
                            message: logExecutionMessages[logExecution.length+1] || ''
                        })  
                        console.log("msg : ", msg.message)
                        const metadata = JSON.parse(msg.message.message)
                        const retryCount = Number(msg.message.retryCount);
                        const attemptType = msg.message.attemptType
                        //pushing to DLQ
                        if (retryCount == 5) {
                            console.log("push to dead letter queue")
                            const result = await Promise.all([
                                await retrySchedulerClient.sAdd("dead-letter-queue",
                                    JSON.stringify({
                                        msg
                                    })
                                ),
                                await prisma.deadLetterQueue.create({
                                    data: {
                                        eventId: msg.message.messageId,
                                        eventMetaData: metadata,
                                        eventType: 'message',
                                        failedAt: new Date(),
                                        retryCount: Number(msg.message.retryCount),
                                        status: 'failed',

                                    }
                                }),
                                await prisma.retryAttempt.create({
                                    data: {
                                        attemptNo: retryCount,
                                        attemptType: 'FINAL',
                                        status: 'FAILED',
                                        eventId: msg.message.messageId,
                                        metadata: logExecution as Prisma.InputJsonValue,
                                        error: JSON.stringify(serializeError(Err))
                                    }
                                })
                            ])
                            return
                        }

                        // -----------------MANUAL RETRY----------------------
                        if (attemptType === 'MANUAL') {

                            await prisma.retryAttempt.create({
                                data: {
                                    attemptNo: retryCount,
                                    attemptType: 'MANUAL',
                                    status: 'FAILED',
                                    eventId: msg.message.messageId,
                                    metadata: logExecution as Prisma.InputJsonValue,
                                    error: JSON.stringify(serializeError(Err))
                                }
                            })

                            const updatedDLQ = await prisma.deadLetterQueue.update({
                                 data: {
                                    eventMetaData: metadata,
                                    failedAt: new Date(),
                                    retryCount: Number(msg.message.retryCount),
                                    status: 'failed',
                                }, 
                                where: {
                                    eventId: msg.message.messageId
                                }
                            })

                            const lastAttempt = await prisma.retryAttempt.findFirst({
                                where: { eventId: msg.message.messageId },
                                orderBy: { attemptNo: 'desc' }
                            });
                            console.log("last attempt : ",lastAttempt)

                            const dlqEvent = {
                                lastAttempt,updatedDLQ,userId:msg.message.userId
                            }

                            await publisher.publish("dlq-replay-events", JSON.stringify(dlqEvent))
                        }

                        const delay = getBackoffDelay(retryCount);
                        const nextRetryAt = Date.now() + delay;

                        let retryPayload
                        if (retryCount == 4) {
                            retryPayload = {
                                ...msg.message,
                                retryCount: retryCount + 1,
                                nextRetryAt,
                                attemptType: 'FINAL'
                            };
                        }
                        else {
                            retryPayload = {
                                ...msg.message,
                                retryCount: retryCount + 1,
                                nextRetryAt,
                            };
                        }
                        //THE DATA SENT TO THE RETRY CONSUMER

                        console.time("retry-schedule")

                        const retrySchedulerPipeline = retrySchedulerClient.multi()

                        if (attemptType !== 'MANUAL' && attemptType != undefined) {   
                            console.log("-----------------gonna retry again------------------",attemptType)
                            retrySchedulerPipeline.zAdd("retry:zset", {
                                score: nextRetryAt,
                                value: JSON.stringify(retryPayload)
                            })
                        }
                        retrySchedulerPipeline.xAck(
                            "message-events-stream",
                            "fanout-consumer-group",
                            msg.id
                        );
                        await retrySchedulerPipeline.exec()

                        console.timeEnd("retry-schedule")
                    }

                })
            );
            console.timeEnd("batch-process")
        }
    }

}   