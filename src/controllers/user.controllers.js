import { User } from "../models/User.models.js";
import { uploadOnCloudinary } from '../services/cloudinary.js'


const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required',
            })
        }

        const existedUser = await User.findOne({
            email
        })

        if(existedUser) {
            return res.status(400).json({
                message: 'User with this email already exists'
            })
        }
        
        
        const avatarLocalPath = req.files?.avatar[0]?.path

        if(!avatarLocalPath) {
            return res.status(400).json({
                message: 'Avatar file is required',
            })
        }
        

        const avatar = await uploadOnCloudinary(avatarLocalPath)

        if(!avatar) {
            return res.status(400).json({
                message: 'Avatar is required'
            })
        }


        const newUser = await User.create({
            name,
            email,
            password,
            avatar: avatar.url,
        })

        return res.status(201).json({
            message: 'User created Successfully',
            data: newUser
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error while registering User'
        })
    }
}


export {
    registerUser,
}