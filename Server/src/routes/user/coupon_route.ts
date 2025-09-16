import { Router } from "express";
import { validateCoupon, valideateCouponOnLogin } from "../../controllers/user/coupon-controller";
import { AuthenticateMiddleware } from "../../middleware";

const router = Router()

router.post('/on-login', valideateCouponOnLogin)

router.post('/', validateCoupon)

export default router   