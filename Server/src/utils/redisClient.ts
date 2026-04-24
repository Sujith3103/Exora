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
export const redis_rateLimit = createClient(config);

export const publisher = redis.duplicate();

export const subscriber = redis.duplicate();

export async function connectRedis() {
  try {
    // Error handlers (IMPORTANT)
    redis.on("error", (err) => console.error("❌ Redis error", err));
    publisher.on("error", (err) => console.error("❌ Publisher error", err));
    subscriber.on("error", (err) => console.error("❌ Subscriber error", err));
    redis_rateLimit.on("error", (err) => console.error("❌ Subscriber error", err));

    // Connect all clients
    if (!redis.isOpen) await redis.connect();
    if (!publisher.isOpen) await publisher.connect();
    if (!subscriber.isOpen) await subscriber.connect();
    if (!redis_rateLimit.isOpen) await redis_rateLimit.connect();

    console.log("✅ Redis clients connected (data / pub / sub)");
  } catch (err) {
    console.error("❌ Failed to connect Redis", err);
    process.exit(1);
  }
}
