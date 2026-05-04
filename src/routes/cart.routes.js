import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { addToCart, clearCart, getCart, removeFromCart, updateQuantity } from "../controllers/cart.controllers.js";

const router = Router();

router.route('/addToCart').post(verifyJWT, addToCart)
router.route('/getCart').get(verifyJWT, getCart)
router.route('/clearCart').delete(verifyJWT, clearCart)
router.route('/deleteItem/:id').delete(verifyJWT, removeFromCart)
router.route('/updateQuantity/:id').put(verifyJWT, updateQuantity)

export default router