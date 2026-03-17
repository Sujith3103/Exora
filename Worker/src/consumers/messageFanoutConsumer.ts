import { idempotencyClient, messageProcessingClient, publisher, redis, streamAck, streamReader } from "../utils/redisClient";

type RedisStreamMessage = {
    id: string;
    message: Record<string, string>;
};

type RedisStreamResponse = {
    name: string;
    messages: RedisStreamMessage[];
}[];


const BATCH_SIZE = 20;
const BLOCK_MS = 10;
const CONCURRENCY = 5;

let isRunning = true;

process.on("SIGINT", () => { console.log("Shutting down consumer..."); isRunning = false; });
process.on("SIGTERM", () => { console.log("Shutting down consumer..."); isRunning = false; });

export const processMessageFanOutEvent = async () => {

    while (isRunning) {

        console.log("GONNA READ THE GROUP   ")
        console.time("read");

        const response = await streamReader.xReadGroup(
            "fanout-consumer-group",
            "fanout-worker-1",
            [{ key: "message-events-stream", id: ">" }],
            { COUNT: BATCH_SIZE, BLOCK: BLOCK_MS }
        )
        console.timeEnd("read");
        if (response) {
            console.log("got stuff here")
        }
        if (!response) continue

        const streams = response as RedisStreamResponse;

        for (const streamData of streams) {

            const ids = streamData.messages.map(msg => msg.id);
            console.log(ids)
            await Promise.all(
                streamData.messages.map(async (msg) => {
                    const payload = msg.message;

                    let parsedMessage;
                    try {
                        parsedMessage = {
                            message: JSON.parse(payload.message),
                            messageId: payload.messageId
                        };
                    } catch (err) {
                        console.error("❌ JSON parse failed", err);
                        return;
                    }

                    const { messageId, message } = parsedMessage;

                    const lockKey = `lock:${messageId}`;
                    const completedKey = `completed:${messageId}`;

                    try {
                        const lock = await messageProcessingClient.set(lockKey, "1", {
                            NX: true,
                            EX: 60
                        });

                        if (!lock) {
                            console.log("Already processing");
                            return;
                        }

                        const isCompleted = await idempotencyClient.exists(completedKey);
                        if (isCompleted) {
                            console.log("Duplicate skipped");
                            return;
                        }

                        await publisher.publish(
                            "message-events",
                            JSON.stringify(message)
                        );

                        console.log("✅ Published:", messageId);

                        await idempotencyClient.set(completedKey, "1", {
                            EX: 3600 
                        });

                    } catch (err) {
                        console.error("❌ Processing failed:", messageId, err);

                        // 👉 Hook: retry stream (add your retry logic here)
                        // await retryClient.xAdd("retry-stream", "*", { ... })

                    }
                })
            );
            const ack = await streamAck.xAck(
                "message-events-stream",
                "fanout-consumer-group",
                ids[0]
            );
            console.log("ack completed : ", ack)
        }
    }

}