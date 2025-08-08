
import { loginUser, register } from "../controllers/auth-controllers";

import { Router } from "express";
import { AuthenticateMiddleware } from "../middleware";

const router = Router()

router.post('/register', register)
router.post('/login', loginUser)
router.get('/check-auth', AuthenticateMiddleware, (req: any, res: any) => {
    const user = req.user;

    return res.status(200).json({
        success: true,
        message: 'authenticated user',
        data: {
            user
        }
    })
})
// router.get('/login',)

export default router