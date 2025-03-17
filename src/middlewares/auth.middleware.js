import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';


export const verifyJWT = asyncHandler(async(req,res,next)=>{

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if(!token) {
            throw new ApiError(401, "unauthorized", "no token provided")
        }

    const decodedtoken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

     const user= await User.findById(decodedtoken?._id).select("-password -refreshToken")
     if(!user){
        throw new ApiError(401, "unauthorized", "invalid token user.")
     }

     req.user = user;
        next()

        
    } catch (error) {
        throw new ApiError(419, error.messege, "invalid token")
        
    }

})