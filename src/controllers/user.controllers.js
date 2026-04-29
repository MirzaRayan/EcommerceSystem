import { User } from "../models/User.models.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";
import bcrypt from 'bcrypt'

const methodToGenerateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    return accessToken;
  } catch (error) {
    console.log("Error while generating Access Token");
  }
};

const options = {
  httpOnly: true,
  secure: false,
};

// User controllers

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existedUser = await User.findOne({
      email,
    });

    if (existedUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
      return res.status(400).json({
        message: "Avatar file is required",
      });
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
      return res.status(400).json({
        message: "Avatar is required",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      avatar: avatar.url,
    });

    return res.status(201).json({
      message: "User created Successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error while registering User",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exists",
      });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    const accessToken = await methodToGenerateAccessToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password");

    return res.status(200).cookie("accessToken", accessToken, options).json({
      message: "User LoggedIn successfully",
      data: loggedInUser,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error while logging in User",
    });
  }
};

const getLoggedInUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User data fetched successfully",
      data: user,
    });
  } catch (error) {}
};

const logoutUser = async (req, res) => {
  try {
    return res.status(200).clearCookie("accessToken", options).json({
      message: "User loggedOut successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error while logging out user",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const key = Object.keys(req.body);

    const allowedFields = ["name", "email"];

    const isAllowed = key.every((fields) => allowedFields.includes(fields));

    if (!isAllowed) {
      return res.status(403).json({
        message: "you cannot change these fields",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "data updated Successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error while updating user profile",
    });
  }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if(!oldPassword || !newPassword ) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        if(oldPassword === newPassword) {
            return res.status(400).json({
                message: 'newPassword should be different than the old one'
            })
        }

        if(newPassword.length < 6) {
            return res.status(400).json({
                message: 'Min 6 character'
            })
        }

        const user = await User.findById(req.user._id)

        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if(!isPasswordCorrect) {
            return res.status(401).json({
                message: 'In correct password'
            })
        }

        user.password = newPassword

        await user.save();

        return res.status(200).json({
            message: 'password change successfully'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server error while changing password'
        })
    }
}





export {
  registerUser,
  loginUser,
  getLoggedInUserData,
  logoutUser,
  updateProfile,
  changePassword
};
