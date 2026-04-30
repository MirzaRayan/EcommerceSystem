import { User } from "../models/User.models.js"
import jwt from 'jsonwebtoken'

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers?.authorization?.replace("Bearer ", "")

        if(!token) {
            return res.status(401).json({
                message: 'UnAuthorized req'
            })
        }


        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken._id).select('-password')

        if(!user) {
            return res.status(401).json({
                message: 'Invalid Token'
            })
        }

        req.user = user
        next();


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error in Auth middleware'
        })
    }
}