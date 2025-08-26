import { Worker } from "bullmq";
import { PrismaClient } from "@prisma/client";
import { QueueConnection } from "../../connection";
import { ClickEvent } from "../../config";
import { handleClicked_Category, handleClicked_Course } from "../handlers";

const prisma = new PrismaClient()

export const clickWorker = new Worker("click-events", async (job) => {

  const clickEvent:ClickEvent = {
    ...job.data
  }

  if(clickEvent.type === 'category'){
    await handleClicked_Category(clickEvent)
  }
  
},
  { connection: QueueConnection, concurrency: 5 } // process multiple click events in parallel
);

clickWorker.on("completed", (job) => {
  console.log(`Click processed: ${job.id}`);
});

clickWorker.on("failed", (job, err) => {
  console.error(`Click job failed: ${job?.id}`, err);
});
