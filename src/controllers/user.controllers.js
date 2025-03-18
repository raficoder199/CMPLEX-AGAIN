import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import { User } from "../models/user.model.js";
import { UploadOnCLoudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";




const generateAccessTokenandRefreshToken = async(userid)=>{
     
  try {
             const user = await User.findById(userid)
             const accessToken = await user.generateAccessToken()
             const refreshToken = await user.generateRefreshToken()

             user.refreshToken = refreshToken;
             await user.save({ validationBeforeSave: false })

             return { accessToken, refreshToken };


             
  } catch (error) {
   console.log(error, "Error aiseee")
   
  }

}

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
0
     
     return res.status(201).json(
        new ApiResponse(200,createdUser, "user registered successfully")
     )



     
})

const loginUser = asyncHandler(async(req,res)=>{
           // get user details from frontend- verify via email and password
           // check email is a user or not
           // check the plain password with bcrypt password
           // generate access token and refresh token
           // remove access token and refresh token from response
           //send to cookie
           // return res

           const {email,username,password} = req.body;
            if(!email && !username){
                throw new ApiError(400, "email or username   is required")
            }

           
          
            const user = await User.findOne({ 
                $or:[
                    {email},
                    {username}
                ]
            }); 


        

        if(!user){
         throw new ApiError(410, "user does not exist")
        }
        



        const isPasswordValid =await user.isPasswordCorrect(password)

        

        if(!isPasswordValid){
            throw new ApiError(401, "invalid email or password")
        }
         
        const {accessToken, refreshToken} = await generateAccessTokenandRefreshToken(user._id)

        const options = {
             httponly:true,
             secure:true
        }

        res.status(200).cookie("accessToken", accessToken,options).cookie("refreshToken", refreshToken,options).json({
         user,
         message: "user logged in successfully"
        })

       



})

const logoutUser = asyncHandler (async(req,res)=>{

   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{refreshToken: undefined}
        },
        {
            new:true
        }
    )
    const options = {
        httponly:true,
        secure:true
   }

   res.status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json({
        message: "user logged out successfully"
    })

})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request");


    }

    try {
       const decodedtoken =  jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET

         )

        const user = await User.findById(decodedtoken?._id)

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "your token maybe expired or used!");

        }

       const {accessToken,refreshToken} = await generateAccessTokenandRefreshToken(user._id)

       const options = {
            httpOnly:true,
            secure:true
       }

       res.status(201)
       .cookie("accessToken", accessToken,options)
       .cookie("refreshToken", refreshToken)
       .json({
        user,
        message: "user token refreshed  successfully"
       })

        
    } catch (error) {
        console.log(error.message,410)
        
    }
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{

    const{oldPassword, newPassword,confirmPassword} = req.body;

    if((!newPassword ===confirmPassword)){
        throw new ApiError(400, "new password and confirm password should match")
    };

   const user =  await User.findById(req.user?._id)

   if(!user){
    throw new ApiError(400, "user not found")
   }

   const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword)
   if(!isOldPasswordCorrect){
       throw new ApiError(400, "current password is incorrect")
   }
   user.password = newPassword;

   await user.save({validateBeforeSave: false})
  
   return res.status(200)
   .json(new ApiResponse(
     200,
     
     "password changed successfully"
  
   ))

});

const getUserProfile = asyncHandler(async(req,res)=>{
      
    const user = await User.findById(req.user._id)

    if(!user){
        throw new ApiError(400, "user not found")
    }
    return res.status(200)
    .json(new ApiResponse(
         200,
         user,
         "user profile fetched successfully"
       ))

})

const updateUserProfile = asyncHandler(async(req,res)=>{
    const {fullname, email} =req.body;

    if(!fullname || !email){
        throw new ApiError(400, "fullname and email are required")
    }
  const user = await User.findByIdAndUpdate(req.user._id,{
     $set:{fullname, email}
     
   },
   {
    new:true
   }
).select("-password")
     return res.status(200)
     .json(new ApiResponse(
         200,
         user,
         "user profile updated successfully"
       ))
   
});

const updateAvatar = asyncHandler(async(req,res)=>{

    const avatarLocalPath = req.file?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "avatar is missing")
    }

    const avatar = await  UploadOnCLoudinary(avatarLocalPath)
    if(!avatar){
        throw new ApiError(500,"failed to upload avatar")
    }
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                avatar: avatar?.url
            }
        },
        {
            new:true
        }
    
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(
         200,
         avatar?.url,
         "user avatar updated successfully"
       ))


})


const updateCoverImage = asyncHandler(async(req,res)=>{

    const coverImageLocalPath = req.file?.coverImage[0]?.path;
    if(!coverImageLocalPath){
        throw new ApiError(400, "coverImage is missing")
    }

    const coverImage = await  UploadOnCLoudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(500,"failed to upload coverImage")
    }
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                coverImage: coverImage?.url
            }
        },
        {
            new:true
        }
    
    ).select("-password")
    
    return res.status(200)
    .json(new ApiResponse(
         200,
         coverImage?.url,
         "user coverImage updated successfully"
       ))


})

export {
registerUser,
loginUser,
logoutUser,
refreshAccessToken,
changeCurrentPassword,
getUserProfile,
updateUserProfile,
updateAvatar,
updateCoverImage}