// queues/purchaseQueue.ts
import { Queue } from "bullmq";
import { QueueConnection } from "../connection";

export const purchaseQueue = new Queue("purchase-events", {
  connection: QueueConnection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,    
    attempts: 5,        
    backoff: {
      type: "exponential",
      delay: 10000,       
    },
  },
});

