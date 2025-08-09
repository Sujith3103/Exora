import { Worker } from "bullmq";
import { QueueConnection } from "../../connection";

async function handleOnLogin(jobData: any) {
  console.log('Handling login job with data:', jobData);
}


export const userTasksWorker = new Worker('user-tasks', async (job) => {
    console.log("Worker file has started");
    switch (job.name) {
        case 'onLogin':
            console.log("worked queue",job.data)
            await handleOnLogin(job.data);

            break;
        default:
            console.warn(`Unknown job: ${job.name}`);
    }
}, {
    connection: QueueConnection,
});

userTasksWorker.on('completed', (job) => {
    console.log(`Job completed: ${job.name}`);
});

userTasksWorker.on('failed', (job, err) => {
    console.error(`Job failed: ${job?.name}`, err);
});

