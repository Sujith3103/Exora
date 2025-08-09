import { Router } from "express";
import { ChangeRole } from "../controllers/user-controllers";
import { AuthenticateMiddleware } from "../middleware";

const router = Router()

router.put('/change-role',AuthenticateMiddleware,ChangeRole)

export default router