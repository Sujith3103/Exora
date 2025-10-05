import { Router } from "express";
import { composeNewMessage, getAllMessages } from "../../controllers/user/message-controller";
import { AuthenticateMiddleware } from "../../middleware";

const router = Router()

router.post('/message/compose', AuthenticateMiddleware, composeNewMessage)

router.get('/messages', AuthenticateMiddleware, getAllMessages)

export default router