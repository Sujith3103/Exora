
import { loginUser, register } from "../controllers/auth-controllers";

import { Router } from "express";

const router = Router()

router.post('/register',register)
router.post('/login',loginUser)
// router.get('/login',)

export default router