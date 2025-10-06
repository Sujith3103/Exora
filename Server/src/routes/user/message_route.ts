import { Router } from "express";
import { composeNewMessage, getAllMessages, toggleUnread } from "../../controllers/user/message-controller";
import { AuthenticateMiddleware } from "../../middleware";

const router = Router()

router.post('/message/compose', AuthenticateMiddleware, composeNewMessage)

router.patch('/message/:id/unread', AuthenticateMiddleware,toggleUnread)

router.get('/messages', AuthenticateMiddleware, getAllMessages)


export default router