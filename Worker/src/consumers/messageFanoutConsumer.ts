import { publisher, redis, streamAck, streamReader } from "../utils/redisClient";

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

                    const parsedMessage = JSON.parse(payload.message);

                    console.log("Parsed:", parsedMessage);

                    const publish = await publisher.publish("message-events", payload.message);
                    console.log("published : ", publish)
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