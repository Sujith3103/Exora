import { Router } from "express";
import { AuthenticateMiddleware } from "../../middleware";
import { createNewCoupon, deleteCoupon, editCoupon, getAllCoupons, getCouponAnalytics } from "../../controllers/instructor/coupon-controller";
import { rateLimitMiddleWare } from "../../middleware/rateLimit";

const router = Router()


router.post('/',AuthenticateMiddleware,rateLimitMiddleWare(),createNewCoupon)

router.put('/:couponId', AuthenticateMiddleware, rateLimitMiddleWare(),editCoupon)

router.get('/', AuthenticateMiddleware, rateLimitMiddleWare(),getAllCoupons)
router.get('/analytics', AuthenticateMiddleware, rateLimitMiddleWare(),getCouponAnalytics)

router.delete('/:couponId', AuthenticateMiddleware, rateLimitMiddleWare(),deleteCoupon)


export default router
