import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { getMyOrders, getSingleOrder, placeOrder } from "../controllers/order.controllers.js";

const router = Router();


router.route('/placeOrder').post(verifyJWT, placeOrder)
router.route('/getMyOrder').get(verifyJWT, getMyOrders)
router.route('/getSingleOrder/:id').get(verifyJWT, getSingleOrder)






export default router