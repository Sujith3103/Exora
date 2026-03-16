// redisClient.js
import { createClient } from "redis";

const config = {
  username: "default",
  password: "QCUBYBja7gnbBQV54md5FEQbKgsD8UK9",
  socket: {
    host: "redis-12784.crce206.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 12784,
  },
};

export const redis = createClient(config);
export const streamReader = createClient(config);
export const streamAck = createClient(config);

export const publisher = redis.duplicate();

export const subscriber = redis.duplicate();

export async function connectRedis() {
  try {

    redis.on("error", (err) => console.error("❌ Redis error", err));
    streamReader.on("error", (err) => console.error("❌ Stream reader error", err));
    streamAck.on("error", (err) => console.error("❌ Stream reader error", err));
    publisher.on("error", (err) => console.error("❌ Publisher error", err));
    subscriber.on("error", (err) => console.error("❌ Subscriber error", err));

    await Promise.all([
      redis.connect().catch(() => { }),
      streamReader.connect().catch(() => { }),
      streamAck.connect().catch(() => { }),
      publisher.connect().catch(() => { }),
      subscriber.connect().catch(() => { })
    ]);

    console.log("✅ Redis clients connected (data / stream / pub / sub)");

  } catch (err) {
    console.error("❌ Failed to connect Redis", err);
    process.exit(1);
  }
}
