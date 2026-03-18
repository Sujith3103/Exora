import { idempotencyClient, messageCompletedClient, messageProcessingClient, publisher, redis, retrySchedulerClient, streamAck, streamReader } from "../utils/redisClient";

type RedisStreamMessage = {
    id: string;
    message: Record<string, string>;
};

type RedisStreamResponse = {
    name: string;
    messages: RedisStreamMessage[];
}[];


const BATCH_SIZE = 5;  // How many messages you pull
const BLOCK_MS = 10;   // How long redis waits
const CONCURRENCY = 5; // How many you process in parallel

let isRunning = true;

const baseDelay = 1000; // 1 sec
const maxDelay = 60000; // 1 min

function getBackoffDelay(retryCount: number) {
    const jitter = Math.random() * 200; // avoid thundering herd
    return Math.min(baseDelay * (2 ** retryCount) + jitter, maxDelay);
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
                    console.log("msg : ",msg)
                    try {
                        const payload = msg.message;

                        let parsedMessage;
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
                        console.log(parsedMessage)

                        const lockKey = `lock:${messageId}`;
                        const completedKey = `completed:${messageId}`;

                        const pipeline = messageProcessingClient.multi()
                        const pipeline2 = messageCompletedClient.multi()

                        // throw new Error("Testing catch block");

                        pipeline.set(lockKey, '1', { NX: true, EX: 60 })
                        pipeline.exists(completedKey);

                        const [lockRes, isCompleted] = await pipeline.exec()

                        if (!lockRes) {
                            console.log("already being processed")
                            return
                        }

                        if (isCompleted) {
                            console.log("Duplicate skipped");
                            return;
                        }


                        pipeline2.publish("message-events", JSON.stringify(message))
                        pipeline2.set(completedKey, '1', { EX: 3600 })

                        await pipeline2.exec()
                        await streamAck.xAck(
                            "message-events-stream",
                            "fanout-consumer-group",
                            msg.id
                        );

                    } catch (err) {
                        console.error("Processing failed:", msg);

                        const retryCount = Number(msg.message.retryCount);
                        if (retryCount >= 5) {
                            console.log("push to dead letter queue")
                            return
                        }

                        const delay = getBackoffDelay(retryCount);
                        const nextRetryAt = Date.now() + delay;

                        const retryPayload = {
                            ...msg.message,
                            retryCount: retryCount + 1,
                            nextRetryAt
                        };
                        console.time("retry-schedule")

                        const retrySchedulerPipeline = retrySchedulerClient.multi()

                        retrySchedulerPipeline.zAdd("retry:zset", {
                            score: nextRetryAt,
                            value: JSON.stringify(retryPayload)
                        })
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