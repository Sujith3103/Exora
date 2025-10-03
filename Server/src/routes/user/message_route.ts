import { Router } from "express";
import { composeNewMessage } from "../../controllers/user/message-controller";
import { AuthenticateMiddleware } from "../../middleware";

const router = Router()

router.post('/compose', AuthenticateMiddleware, composeNewMessage)


export default router