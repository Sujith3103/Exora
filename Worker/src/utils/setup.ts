import { processAnalyticsEvent } from "../consumers/analyticsConsumer";
import { processCounterEvent } from "../consumers/counterConsumer";
import { processDbEvents } from "../consumers/dbConsumer";
import { redis } from "./redisClient";

export async function setupClickEventStream() {
  try {
    // Ensure stream and groups exist
    await Promise.all([
      redis.xGroupCreate("click-events-stream", "db-consumer-group", "$", { MKSTREAM: true }),
      redis.xGroupCreate("click-events-stream", "counter-consumer-group", "$", { MKSTREAM: true }),
      redis.xGroupCreate("click-events-stream", "analytics-consumer-group", "$", { MKSTREAM: true }),
    ]);
    console.log("✅ Consumer groups ready");
  } catch (err: any) {
    if (err?.message?.includes("BUSYGROUP")) {
      console.log("⚠️ Groups already exist, skipping");
    } else {
      throw err;
    }
  }

  // ✅ Only start consumers after groups are ready
  await Promise.all([
    // processDbEvents(),
    processCounterEvent(),
    processAnalyticsEvent(),
  ]);
}
