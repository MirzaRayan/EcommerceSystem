import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { addToCart, getCart } from "../controllers/cart.controllers.js";

const router = Router();

router.route('/addToCart').post(verifyJWT, addToCart)
router.route('/getCart').get(verifyJWT, getCart)


export default router