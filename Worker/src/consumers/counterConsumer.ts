import { ClickEvent } from "../config";
import { redis } from "../utils/redisClient";
import pMap from "p-map";

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

// Trending key in Redis (time-windowed)
const TRENDING_KEY = "trending:courses"; // sorted set: courseId -> score
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

                        const userId = clickEvent.userId;
                        const targetId = clickEvent.targetId; // courseId
                        if (!userId || !targetId) {
                            console.warn("Invalid message payload", clickEvent);
                            await redis.xAck("click-events-stream", "counter-consumer-group", id);
                            return;
                        }

                        const isNew = await redis.set(`${DEDUP_KEY}:${clickEvent.type}:${clickEvent.targetId}:user:${userId}`, "1", { NX: true, EX: 600 })

                        if (isNew) {
                            await redis.zIncrBy(`trending:category:${clickEvent.categoryId}`, 1, `course:${clickEvent.targetId}`)
                        }
                        
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
