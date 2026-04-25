import { Router } from "express";
import { composeNewMessage, getAllMessages, getMessageById, toggleUnread } from "../../controllers/user/message-controller";
import { AuthenticateMiddleware } from "../../middleware";
import { rateLimitMiddleWare } from "../../middleware/rateLimit";

const router = Router()

router.post('/message/compose', AuthenticateMiddleware, rateLimitMiddleWare(), composeNewMessage)

router.patch('/message/:id/unread', AuthenticateMiddleware, rateLimitMiddleWare(),toggleUnread)

router.get('/messages', AuthenticateMiddleware, rateLimitMiddleWare(), getAllMessages)
router.get('/message/:conversationId', AuthenticateMiddleware, rateLimitMiddleWare(),getMessageById)

export default router