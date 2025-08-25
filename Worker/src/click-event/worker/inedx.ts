import { Worker } from "bullmq";
import { stream } from "../../utils/redisClient";
import { PrismaClient } from "@prisma/client";
import { QueueConnection } from "../../connection";
import { ClickEvent } from "../../config";
import { handleClicked_Category, handleClicked_Course } from "../handlers";

const prisma = new PrismaClient()

export const clickWorker = new Worker("click-events",async (job) => {

  console.log("worker for click started")

    const fields = job.data as ClickEvent;

    // 1️⃣ Update recently viewed in Redis
    if (fields.type === "course" && fields.userId) {
      handleClicked_Course(fields)
    }

    if(fields.type === 'category' && fields.userId){
      handleClicked_Category(fields)
    }

    // // 3️⃣ Optional: trigger recommendation scoring
    // if (fields.type === "course" && fields.categoryId) {
    //   await stream.zIncrBy(`category:${fields.categoryId}:trending`, 1, fields.targetId);
    // }
  },
  { connection: QueueConnection, concurrency: 5 } // process multiple click events in parallel
);

clickWorker.on("completed", (job) => {
  console.log(`Click processed: ${job.id}`);
});

clickWorker.on("failed", (job, err) => {
  console.error(`Click job failed: ${job?.id}`, err);
});
