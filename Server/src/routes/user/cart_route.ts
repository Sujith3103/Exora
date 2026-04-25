import { Router } from "express";
import { AuthenticateMiddleware } from "../../middleware";
import { AddItemsToCart, addMultipleItemsToCart, getUserCartDetails, removeItemFromCart, updateCartItemStatus } from "../../controllers/user/cart-controller";
import { rateLimitMiddleWare } from "../../middleware/rateLimit";

const router = Router()

router.post('/items',AuthenticateMiddleware, rateLimitMiddleWare(),AddItemsToCart )
router.post('/items/batch', AuthenticateMiddleware, rateLimitMiddleWare(), addMultipleItemsToCart)

router.patch('/items/status/:itemId',AuthenticateMiddleware, rateLimitMiddleWare(),updateCartItemStatus)

//get - cart
router.get('',AuthenticateMiddleware, rateLimitMiddleWare(),getUserCartDetails)

// Remove item from cart
router.delete('/items/:itemId',AuthenticateMiddleware, rateLimitMiddleWare(), removeItemFromCart)


export default router