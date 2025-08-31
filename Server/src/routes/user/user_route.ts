import { Router } from "express";
import { ChangeRole, EditUserProfile, EditUserSecurity, getUserProfileData, getUserSecurityData } from "../../controllers/user-controllers";
import { AuthenticateMiddleware } from "../../middleware";
import { AddItemsToCart, addMultipleItemsToCart, getUserCartDetails, removeItemFromCart, updateCartItemStatus } from "../../controllers/user/cart-controller";

const router = Router()

router.put('/change-role',AuthenticateMiddleware,ChangeRole)


router.post('/edit-profile',AuthenticateMiddleware,EditUserProfile)
router.post('/edit-security',AuthenticateMiddleware,EditUserSecurity)
router.post('/cart/items',AuthenticateMiddleware,AddItemsToCart )
router.post('/cart/items/batch', AuthenticateMiddleware, addMultipleItemsToCart)


router.patch('/cart/items/status/:itemId',AuthenticateMiddleware,updateCartItemStatus)

//get - profile
router.get('/get-profile',AuthenticateMiddleware,getUserProfileData)
router.get('/get-security',AuthenticateMiddleware,getUserSecurityData)

//get - cart
router.get('/cart',AuthenticateMiddleware,getUserCartDetails)

// Remove item from cart
router.delete('/cart/items/:itemId',AuthenticateMiddleware, removeItemFromCart)

export default router
