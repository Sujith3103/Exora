import { Router } from "express";
import { ChangeRole, EditUserProfile, EditUserSecurity } from "../controllers/user-controllers";
import { AuthenticateMiddleware } from "../middleware";

const router = Router()

router.put('/change-role',AuthenticateMiddleware,ChangeRole)
router.post('/edit-profile',AuthenticateMiddleware,EditUserProfile)
router.post('/edit-security',AuthenticateMiddleware,EditUserSecurity)

export default router
