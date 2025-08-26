// redisClient.js
import { createClient } from "redis";

const config = {
  username: 'default',
  password: 'QCUBYBja7gnbBQV54md5FEQbKgsD8UK9',
  socket: {
    host: 'redis-12784.crce206.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 12784
  }
};

export const redis = createClient(config);


export async function connectRedis() {
  if (!redis.isOpen) await redis.connect();
  console.log("✅ Redis connected");
}