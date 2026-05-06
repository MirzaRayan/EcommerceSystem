import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { isAdmin } from "../middlewares/Admin.middleware.js";
import { getMyOrders, getSingleOrder, placeOrder, updateOrderStatus, getAllOrders } from "../controllers/order.controllers.js";

const router = Router();



router.route('/placeOrder').post(verifyJWT, placeOrder)
router.route('/getMyOrder').get(verifyJWT, getMyOrders)
router.route('/getSingleOrder/:id').get(verifyJWT, getSingleOrder)

// Admin routes
router.route('/status/:id').put(verifyJWT, isAdmin, updateOrderStatus)
router.route('/getAllOrders').get(verifyJWT, isAdmin, getAllOrders)






export default router