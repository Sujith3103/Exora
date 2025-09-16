import { Router } from "express";
import { AuthenticateMiddleware } from "../../middleware";
import { createNewCoupon, deleteCoupon, editCoupon, getAllCoupons } from "../../controllers/instructor/coupon-controller";

const router = Router()


router.post('/',AuthenticateMiddleware,createNewCoupon)

router.put('/:couponId',AuthenticateMiddleware,editCoupon)

router.get('/',AuthenticateMiddleware,getAllCoupons)

router.delete('/:couponId',AuthenticateMiddleware,deleteCoupon)


export default router
