import { Router } from "express";
import { AuthenticateMiddleware } from "../../middleware";
import { createNewCoupon, deleteCoupon, editCoupon, getAllCoupons, getCouponAnalytics } from "../../controllers/instructor/coupon-controller";

const router = Router()


router.post('/',AuthenticateMiddleware,createNewCoupon)

router.put('/:couponId',AuthenticateMiddleware,editCoupon)

router.get('/',AuthenticateMiddleware,getAllCoupons)
router.get('/analytics',AuthenticateMiddleware,getCouponAnalytics)

router.delete('/:couponId',AuthenticateMiddleware,deleteCoupon)


export default router
