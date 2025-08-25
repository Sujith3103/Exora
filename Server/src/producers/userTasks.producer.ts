import { Queue } from 'bullmq';
import { QueueConnection } from '../connection';
import { clickQueue } from '../services/click-event';
import { ClickEvent } from '../config';
import { stream } from '../utils/redisClient';

const userTasksQueue = new Queue('user-tasks', { connection: QueueConnection });

export async function addLoginJob(userId: string) {
  await userTasksQueue.add('onLogin', { userId });
}

export async function sendLoginAlert(email: string) {
  await userTasksQueue.add('loginAlert', { email })
}

type lectureAsset = {
  file: [],
  createdLectureAsset: []
}

export async function upload({ file, createdLectureAsset }: lectureAsset) {
  await userTasksQueue.add('upload:lecture-asset', { file, createdLectureAsset })
}
export async function enqueueClickEvent(event: ClickEvent) {

  await clickQueue.add("recordClick", event, {
    removeOnComplete: true,
    attempts: 3, // retry on failure
    removeOnFail: true,
  });

}