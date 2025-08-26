import dayjs from "dayjs";
import { ClickEvent } from "../config";
import { redis } from "../utils/redisClient";
import pMap from "p-map";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

type RedisStreamMessage = {
    id: string;
    message: Record<string, string>;
};

type RedisStreamResponse = {
    name: string;
    messages: RedisStreamMessage[];
}[];

const BATCH_SIZE = 10;
const BLOCK_MS = 5000;
const CONCURRENCY = 5;
const hourBucket = dayjs().utc().format("YYYYMM")
// e.g., "2025082611"
// const TRENDING_KEY = "trending:courses"; // sorted set: courseId -> score
const DEDUP_KEY = "dedup:clicks";        // hash: messageId -> processed flag

export const processCounterEvent = async () => {
    console.log("Counter Consumer Loop Started");

    while (true) {
        try {
            const response = await redis.xReadGroup(
                "counter-consumer-group",
                "counter-worker-1",
                [{ key: "click-events-stream", id: ">" }],
                { COUNT: BATCH_SIZE, BLOCK: BLOCK_MS }
            );

            if (!Array.isArray(response) || response.length === 0) continue;

            const streams = response as RedisStreamResponse;


            for (const stream of streams) {
                await pMap(stream.messages,
                    async (msg) => {
                        const { id, message } = msg

                        const clickEvent = message as unknown as ClickEvent;
                        console.log("type :  ",clickEvent.type)
                        if (clickEvent.type !== "course") {
                            // just skip this message
                            await redis.xAck("click-events-stream", "counter-consumer-group", id);
                            return;
                        }

                        const userId = clickEvent.userId;
                        const targetId = clickEvent.targetId; // courseId
                        if (!userId || !targetId) {
                            console.warn("Invalid message payload", clickEvent);
                            await redis.xAck("click-events-stream", "counter-consumer-group", id);
                            return;
                        }

                        const isNew = await redis.set(`${DEDUP_KEY}:${clickEvent.type}:${clickEvent.targetId}:user:${userId}`, "1", { NX: true, EX: 600 })

                        if (isNew) {
                            const bucketKey = `trending:category:${clickEvent.categoryId}:${hourBucket}`;
                            const exists = await redis.exists(bucketKey);

                            await redis.zIncrBy(bucketKey, 1, `course:${clickEvent.targetId}`);
                            console.log("counter finish")
                            if (!exists) {
                                await redis.expire(bucketKey, 60 * 60 * 25);
                            }
                        }
                        console.log("added : ",clickEvent)
                        await redis.xAck("click-events-stream", "counter-consumer-group", id);

                    }
                )
            }
        } catch (err) {
            console.error("Counter worker error:", err);
            // don’t exit loop → keep retrying
        }
    }
};

