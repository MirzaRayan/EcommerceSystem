import { Router } from "express";
import { changePassword, getLoggedInUserData, loginUser, logoutUser, registerUser, updateAvatar, updateProfile } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Limiter } from "../middlewares/rateLimmiter.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router()


router.route('/register').post(upload.fields([
    {
        name: 'avatar',
        maxCount: 1
    }
]),registerUser)

router.route('/login').post(Limiter, loginUser)

// protected Routes

router.route('/me').get(verifyJWT, getLoggedInUserData)
router.route('/logout').get(verifyJWT, logoutUser)
router.route('/update').put(verifyJWT, updateProfile)
router.route('/change-password').put(verifyJWT, changePassword)
router.route('/update-avatar').put(verifyJWT,upload.single('avatar'), updateAvatar)



export default router