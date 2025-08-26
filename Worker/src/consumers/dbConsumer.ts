import { ClickEvent } from "../config";
import { prisma } from "../utils/prisma";
import pMap from "p-map"; // npm install p-map
import { redis } from "../utils/redisClient";

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
const CONCURRENCY = 5; // number of messages to process in parallel

// Helper: parse a Redis record to ClickEvent safely
function parseClickEvent(record: RedisStreamMessage): ClickEvent {
  const raw = record.message;

  let metadata: ClickEvent["metadata"];
  try {
    metadata = raw.metadata ? JSON.parse(raw.metadata) : undefined;
  } catch (e) {
    console.warn("Invalid metadata JSON, ignoring:", raw.metadata);
    metadata = undefined;
  }

  return {
    userId: raw.userId,
    type: raw.type as ClickEvent["type"],
    targetId: raw.targetId,
    categoryId: raw.categoryId,
    categoryName: raw.categoryName,
    instructorId: raw.instructorId,
    action: (raw.action as ClickEvent["action"]) || "click",
    timestamp: raw.timestamp || new Date().toISOString(),
    metadata,
  };
}

let isRunning = true;

// Graceful shutdown
process.on("SIGINT", () => { console.log("Shutting down consumer..."); isRunning = false; });
process.on("SIGTERM", () => { console.log("Shutting down consumer..."); isRunning = false; });

export async function processDbEvents() {
  console.log("DB Consumer Loop Started");

  while (isRunning) {
    try {
      const response = await redis.xReadGroup(
        "db-consumer-group",
        "db-worker-1",
        [{ key: "click-events-stream", id: ">" }],
        { COUNT: BATCH_SIZE, BLOCK: BLOCK_MS }
      );

      if (!Array.isArray(response) || response.length === 0) continue;

      const streams = response as RedisStreamResponse;
      console.log("db",response)
      for (const streamData of streams) {
        // Process messages concurrently with a limit
        await pMap(streamData.messages, async (record:any) => {
          const clickEvent = parseClickEvent(record);

          // Transaction: insert and trim old clicks
          await prisma.$transaction(async (tx) => {
            await tx.userClick.create({
              data: {
                clickType: clickEvent.type,
                targetId: clickEvent.targetId,
                userId: clickEvent.userId,
              },
            });

            // Trim old clicks > 150 per user
            await tx.$executeRaw`DELETE FROM "UserClick" WHERE id IN (
              SELECT id FROM (
                SELECT id, ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "timestamp" DESC) AS rn
                FROM "UserClick"
                WHERE "userId" = ${clickEvent.userId}
              ) sub WHERE rn > 150
            )`;
          });

          // Acknowledge message
          await redis.xAck("click-events-stream", "db-consumer-group", record.id);

          console.log("Processed ClickEvent:", clickEvent);
        }, { concurrency: CONCURRENCY });
      }
    } catch (err) {
      console.error("Error in DB consumer:", err);
      // Optional: backoff on repeated errors
      await new Promise((res) => setTimeout(res, 2000));
    }
  }

  console.log("DB Consumer Loop stopped");
}
