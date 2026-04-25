import { Router } from "express";
import { ChangeRole, EditUserProfile, EditUserSecurity, getUserBoughtCourses, getUserBoughtCoursesIds, getUserProfileData, getUserSecurityData } from "../../controllers/user-controllers";
import { AuthenticateMiddleware } from "../../middleware";
import { AddItemsToCart, addMultipleItemsToCart, getUserCartDetails, removeItemFromCart, updateCartItemStatus } from "../../controllers/user/cart-controller";
import {  rateLimitMiddleWare } from "../../middleware/rateLimit";

const router = Router()

router.put('/change-role', AuthenticateMiddleware, rateLimitMiddleWare(),ChangeRole)


router.post('/edit-profile', AuthenticateMiddleware, rateLimitMiddleWare(),EditUserProfile)
router.post('/edit-security', AuthenticateMiddleware, rateLimitMiddleWare(),EditUserSecurity)

//get - profile
router.get('/get-profile', AuthenticateMiddleware, rateLimitMiddleWare(),getUserProfileData)
router.get('/get-security', AuthenticateMiddleware, rateLimitMiddleWare(),getUserSecurityData)
router.get('/my-learning', AuthenticateMiddleware, rateLimitMiddleWare(),getUserBoughtCourses)
router.get('/my-learning/only-ids', AuthenticateMiddleware, rateLimitMiddleWare(),getUserBoughtCoursesIds)

 
router.patch('/role', AuthenticateMiddleware, rateLimitMiddleWare(), ChangeRole)

export default router
