import { Queue } from "bullmq";
import { QueueConnection } from "../connection";

export const clickQueue = new Queue("click-events", {
  connection: QueueConnection,
});
