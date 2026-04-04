import { Router } from "express";
import { AuthenticateMiddleware } from "../../middleware";
import { getDeadLetterQueueEvents, getDLQExecutionTimeline } from "../../controllers/developer/deadLetterQueue-controller";

const router = Router()

router.get('',AuthenticateMiddleware,getDeadLetterQueueEvents)
router.get('/execution/timeline/:id', AuthenticateMiddleware, getDLQExecutionTimeline)

export default router   