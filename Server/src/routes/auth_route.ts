
import { register } from "../controllers/auth-controllers";

import { Router } from "express";

const router = Router()

router.post('/register',register)
// router.get('/login',)

export default router