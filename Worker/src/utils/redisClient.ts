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

export const pub = createClient(config);
export const sub = createClient(config);
export const stream = createClient(config);

(async () => {
  await pub.connect();
  await sub.connect();
  await stream.connect();
  console.log("Redis Pub/Sub/Stream connected");
})();


