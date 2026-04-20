import { Router } from "express";
import { AuthenticateMiddleware } from "../../middleware";
import { getDeadLetterQueueEvents, getDLQExecutionTimeline, replayDLQEvent } from "../../controllers/developer/deadLetterQueue-controller";

const router = Router()

router.get('',AuthenticateMiddleware,getDeadLetterQueueEvents)
router.get('/execution/timeline/:id', AuthenticateMiddleware, getDLQExecutionTimeline)

router.post('/replay',AuthenticateMiddleware,replayDLQEvent)

export default router   