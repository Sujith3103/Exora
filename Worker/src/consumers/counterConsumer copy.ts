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
        await pMap(
          stream.messages,
          async (msg) => {
            const { id, message } = msg;
            const userId = message.userId;
            const targetId = message.targetId; // courseId
            if (!userId || !targetId) {
              console.warn("Invalid message payload", message);
              await redis.xAck("click-events-stream", "counter-consumer-group", id);
              return;
            }

            // ---- Idempotency: check if this message was already processed
            const alreadyProcessed = await redis.hSetNX(DEDUP_KEY, id, "1");
            if (!alreadyProcessed) {
              // Someone retried the same message → just ack
              await redis.xAck("click-events-stream", "counter-consumer-group", id);
              return;
            }

            // ---- Dedup per user+course (avoid spam clicks)
            const userCourseKey = `user:${userId}:course:${targetId}:click`;
            const firstClick = await redis.set(userCourseKey, "1", {
              NX: true,
              EX: 60 * 60, // 1 hour dedup window
            });

            if (firstClick) {
              // Only count the first click in this window
              await redis.zIncrBy(TRENDING_KEY, 1, targetId);
            }

            // ---- Acknowledge after successful processing
            await redis.xAck("click-events-stream", "counter-consumer-group", id);
          },
          { concurrency: CONCURRENCY }
        );
      }
    } catch (err) {
      console.error("Counter worker error:", err);
      // don’t exit loop → keep retrying
    }
  }
};
