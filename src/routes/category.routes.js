import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { isAdmin }  from '../middlewares/Admin.middleware.js'
import { createCategory, deleteCategory, updateCategory } from "../controllers/category.controllers.js";

const router = Router();


// protected routes
router.route('/createCategory').post(verifyJWT, isAdmin, createCategory)
router.route('/update/:id').put(verifyJWT, isAdmin, updateCategory)
router.route('/delete/:id').delete(verifyJWT, isAdmin, deleteCategory)




export default router