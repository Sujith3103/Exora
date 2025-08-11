import { Router } from "express";
import { ChangeRole, EditUserProfile, EditUserSecurity, getUserProfileData, getUserSecurityData } from "../controllers/user-controllers";
import { AuthenticateMiddleware } from "../middleware";

const router = Router()

router.put('/change-role',AuthenticateMiddleware,ChangeRole)
router.post('/edit-profile',AuthenticateMiddleware,EditUserProfile)
router.post('/edit-security',AuthenticateMiddleware,EditUserSecurity)
router.get('/get-profile',AuthenticateMiddleware,getUserProfileData)
router.get('/get-security',AuthenticateMiddleware,getUserSecurityData)

export default router
