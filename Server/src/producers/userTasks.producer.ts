import { Queue } from 'bullmq';
import { QueueConnection } from '../connection';

const userTasksQueue = new Queue('user-tasks', { connection: QueueConnection });

export async function addLoginJob(userId: string) {
  await userTasksQueue.add('onLogin', { userId });
}

export async function sendLoginAlert(email: string){
  await userTasksQueue.add('loginAlert',{email})
}