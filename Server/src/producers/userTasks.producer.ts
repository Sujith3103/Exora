import { Queue } from 'bullmq';
import { QueueConnection } from '../connection';
import { clickQueue } from '../services/click-event';
import { ClickEvent } from '../config';

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

export const enqueueClickEvent = async (clickEvent: ClickEvent) => {
  await clickQueue.add("track-click", clickEvent, {
    removeOnComplete: true,
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnFail:true
  });
};
