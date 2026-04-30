import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { isAdmin }  from '../middlewares/Admin.middleware.js'
import { createCategory } from "../controllers/category.controllers.js";

const router = Router();


// protected routes
router.route('/createCategory').post(verifyJWT, isAdmin, createCategory)





export default router