import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {ApiError} from "../utils/apiError.js"

const cookieOptions = {
    httpOnly : true,
    secure : true
}

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        await user.save({validateBeforeSave : false})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Error occur while generating the tokens");
    }
}

const registerUser = asyncHandler(async(req, res)=>{
    const {name, email, password, role} = req.body;
    if(!name || !email || !password){
        console.log("All fields are required");
        throw new ApiError(400, "All fields are required")
    }

    const userExist = await User.findOne({email});
    if(userExist){
        console.log("User already exist with the given email. Please try to login");
        throw new ApiError(400, "User already exist with the given email. Please try to login")
    }
    const parts = name.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.length > 1 ? parts[1] : parts[0];
    const avatar = `https://ui-avatars.com/api/?name=${firstName}+${lastName}`;

    const user = await User.create({
        name,
        email,
        role,
        avatar,
        password
    })
    await user.save();
    if(!user){
        console.error("Error while creating new user in db");
        throw new ApiError(500, "Error while creating new user in db")
    }
    console.log("User created successfully");

    return res.status(200).json(
        new ApiResponse(
            200, // status code
            {
                user
            }, // data
            "User registered successfully" //message
        )
    )
})

const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    if(!email, !password){
        throw new ApiError(404, "All fields are required");
    }
    const userExist = await User.findOne({email});
    if(!userExist){
        throw new ApiError(404, "User doesn't exist with given email. Please check your email");
    }
    // check for password validation
    const isValidPassword = await userExist.isPasswordCorrect(password)

    if(!isValidPassword){
        throw new ApiError(402, "Check your password");
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(userExist._id)

    return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(
            200,
            {
                user : userExist, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    // delete the cookies
    // remove the accessToken, refreshToken

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    );

    return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged out successfully"
        )
    )

})

const getCurrentUser = asyncHandler(async(req, res) =>{
    
    const user = await User.findById(
        req.user?._id
        ).select("-password -refreshToken").populate("projects")
    console.log("User : ", user)
   
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {user},
            "Current user fetched successfully"
        )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
}