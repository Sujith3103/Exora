import dotenv from 'dotenv'
dotenv.config(); // <-- load env first

import { userTasksWorker } from "./user-tasks/worker";

console.log("worker running")

userTasksWorker
