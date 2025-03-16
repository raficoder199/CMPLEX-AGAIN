import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import { User } from "../models/user.model.js";
import { UploadOnCLoudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res)=>{

    // get user details from frontend
    // validarion -not empty
    // check if user exists already
    // check for images, check for avatar
    // upload them on cloudinary
    // create user object - entry in db
    // remove password and refresh token from response
    // check all data is user got correct
    // return res

    const {fullname, email,password,username} = req.body;

    
    
    if(
        [email,username,fullname,password].some((field)=>field?.trim()=== "")
    ){
        throw new ApiError(400,"all fields are required")
    }

  const existedUser =  await User.findOne({
        $or:[
            {email}, {username}
        ]
     })
     if(existedUser){
        throw new ApiError("email or username already exists",409)
    }
   
     const avatarLocalPath = req.files?.avatar[0]?.path;
   //   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
      coverImageLocalPath = req.files.coverImage[0].path
   }

     if(!avatarLocalPath){
        throw new ApiError(400,"avatar is required")
     }

     const avatar = await  UploadOnCLoudinary(avatarLocalPath)
     const coverImage = await UploadOnCLoudinary(coverImageLocalPath)

     if(!avatar){
        throw new ApiError(500,"failed to upload avatar")
     }

     const user = await User.create({
        fullname,
        email,
        password,
        username,
        avatar:avatar.url,
        coverImage: coverImage?.url
     })
      
     const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
     )
     if (!createdUser){
        throw new ApiError(500,"failed to create user")
     }

     
     return res.status(201).json(
        new ApiResponse(200,createdUser, "user registered successfully")
     )



     
})

export {registerUser}