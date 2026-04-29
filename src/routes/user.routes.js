import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Limiter } from "../middlewares/rateLimmiter.middleware.js";

const router = Router()


router.route('/register').post(upload.fields([
    {
        name: 'avatar',
        maxCount: 1
    }
]),registerUser)

router.route('/login').post(Limiter, loginUser)




export default router