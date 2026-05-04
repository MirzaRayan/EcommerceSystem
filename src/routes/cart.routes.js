import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { addToCart } from "../controllers/cart.controllers.js";

const router = Router();

router.route('/addToCart').post(verifyJWT, addToCart)



export default router