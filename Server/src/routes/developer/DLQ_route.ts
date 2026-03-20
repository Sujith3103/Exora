import { Router } from "express";
import { AuthenticateMiddleware } from "../../middleware";
import { getDeadLetterQueueEvents } from "../../controllers/developer/deadLetterQueue-controller";

const router = Router()

router.get('',AuthenticateMiddleware,getDeadLetterQueueEvents)

export default router
    