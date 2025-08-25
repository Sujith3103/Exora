import dotenv from 'dotenv'
dotenv.config(); // <-- load env first

import { instructorTaskWorker, userTasksWorker } from "./user-tasks/worker";
import { clickWorker } from './click-event/worker/inedx';

console.log("worker running")

userTasksWorker
instructorTaskWorker
clickWorker