import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { placeOrder } from "../controllers/order.controllers.js";

const router = Router();


router.route('/placeOrder').post(verifyJWT, placeOrder)






export default router