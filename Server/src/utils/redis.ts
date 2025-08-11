import { createClient } from "redis";

export const client = createClient({
  username: 'default',
  password: 'QCUBYBja7gnbBQV54md5FEQbKgsD8UK9',
  socket: {
    host: 'redis-12784.crce206.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 12784
  }
});
client.on('error', (err:Error) => console.log('Redis Client Error', err));

export async function initRedis() {
  await client.connect();
  console.log("Redis connected");
}

// await redisClient.hSet(`user:profile:${userId}`, {
//   name: "John",
//   email: "john@example.com",
//   // ...
// });
// await redisClient.expire(`user:profile:${userId}`, 600); // 10 min TTL
