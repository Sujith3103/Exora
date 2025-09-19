import { Router } from "express";
import { AuthenticateMiddleware } from "../../middleware";
import { AddItemsToCart, addMultipleItemsToCart, getUserCartDetails, removeItemFromCart, updateCartItemStatus } from "../../controllers/user/cart-controller";

const router = Router()

router.post('/items',AuthenticateMiddleware,AddItemsToCart )
router.post('/items/batch', AuthenticateMiddleware, addMultipleItemsToCart)

router.patch('/items/status/:itemId',AuthenticateMiddleware,updateCartItemStatus)

//get - cart
router.get('',AuthenticateMiddleware,getUserCartDetails)

// Remove item from cart
router.delete('/items/:itemId',AuthenticateMiddleware, removeItemFromCart)


export default router