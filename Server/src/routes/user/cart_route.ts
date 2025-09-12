import { Router } from "express";
import { AuthenticateMiddleware } from "../../middleware";
import { AddItemsToCart, addMultipleItemsToCart, getUserCartDetails, removeItemFromCart, updateCartItemStatus } from "../../controllers/user/cart-controller";

const router = Router()

router.post('/cart/items',AuthenticateMiddleware,AddItemsToCart )
router.post('/cart/items/batch', AuthenticateMiddleware, addMultipleItemsToCart)

router.patch('/cart/items/status/:itemId',AuthenticateMiddleware,updateCartItemStatus)

//get - cart
router.get('/cart',AuthenticateMiddleware,getUserCartDetails)

// Remove item from cart
router.delete('/cart/items/:itemId',AuthenticateMiddleware, removeItemFromCart)


export default router