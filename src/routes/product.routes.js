import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { isAdmin } from "../middlewares/Admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct } from "../controllers/product.controllers.js";

const router = Router();


router.route('/createProduct').post(verifyJWT, isAdmin, upload.single('image'), createProduct)


export default router