// utils/redisStreamSetup.ts
import { processCounterEvent } from "../consumers/counterConsumer";
import { processDbEvents } from "../consumers/dbConsumer";
import { redis } from "./redisClient";

export async function setupClickEventStream() {
  try {
    // Create consumer group for DB updates
    await redis.xGroupCreate(
      "click-events-stream",      // stream key
      "db-consumer-group",        // group name
      "$",                        // start point (only new messages)
      { MKSTREAM: true }          // create stream if doesn't exist
    );

    // Create consumer group for counters
    await redis.xGroupCreate(
      "click-events-stream",
      "counter-consumer-group",
      "$",
      { MKSTREAM: true }
    );

    console.log("✅ Consumer groups ready");
  } catch (err: any) {
    if (err?.message?.includes("BUSYGROUP")) {
      console.log("⚠️ Groups already exist, skipping");
    } else {
      throw err;
    }
  }

  //  processDbEvents()
   processCounterEvent()
}

