import { Router } from "express";
import { AuthenticateMiddleware } from "../../middleware";
import { createNewCoupon, getAllCoupons } from "../../controllers/instructor/coupon-controller";

const router = Router()


router.post('/',AuthenticateMiddleware,createNewCoupon)
router.get('/',AuthenticateMiddleware,getAllCoupons)

export default router
