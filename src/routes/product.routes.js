import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { isAdmin } from "../middlewares/Admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct } from "../controllers/product.controllers.js";

const router = Router();

// public routes
router.route('/allProducts').get(getAllProducts)
router.route('/singleProduct/:id').get(getSingleProduct)


// protected routes
router.route('/createProduct').post(verifyJWT, isAdmin, upload.single('image'), createProduct)
router.route('/deleteProduct/:id').delete(verifyJWT, isAdmin, deleteProduct)


export default router