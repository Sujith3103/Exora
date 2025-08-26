import dotenv from "dotenv";
dotenv.config();

import { instructorTaskWorker, userTasksWorker } from "./user-tasks/worker";
import { setupClickEventStream } from "./utils/setup";
import { clickWorker } from "./click-event/worker";
import { connectRedis, redis } from "./utils/redisClient";

console.log("worker running");

async function startWorkers() {
  // Wait for Redis to connect first
  await connectRedis();

  // Set up consumer groups
  await setupClickEventStream();

  // Start worker loops
  userTasksWorker;
  instructorTaskWorker;
  clickWorker;
}

startWorkers().catch((err) => {
  console.error("Worker startup error:", err);
});

// --- Graceful shutdown ---
process.on("SIGINT", async () => {
  console.log("Shutting down worker...");
  try {
    await redis.quit();
  } catch (err) {
    console.error("Error closing Redis:", err);
  } finally {
    process.exit(0);
  }
});

process.on("SIGTERM", async () => {
  console.log("Worker terminated...");
  try {
    await redis.quit();
  } catch (err) {
    console.error("Error closing Redis:", err);
  } finally {
    process.exit(0);
  }
});
