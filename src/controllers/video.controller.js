import mongoose,{isValidObjectId} from "mongoose"
import { UploadOnCLoudinary } from "../utils/cloudinary.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"

const publishVideo = asyncHandler(async(req,res)=>{
    const {title, description } = req.body
    
    if(!title ||!description) {
        throw new ApiError("All fields are required",400)
    }

    const videoFilePath = req.files.video[0].path;
    const thumbnailFilePath = req.files.thumbnail[0].path;

    const videoUpload = await UploadOnCLoudinary(videoFilePath, "video");
    const thumbnailUpload = await UploadOnCLoudinary(thumbnailFilePath, "image");

    if (!videoUpload || !thumbnailUpload) {
        throw new ApiError("Failed to upload files", 500);
    }

    const video = await Video.create({
        title,
        description,
        videoUrl: videoUpload.secure_url,
        thumbnailUrl: thumbnailUpload.secure_url,
        publicId: videoUpload.public_id,
        user: req.user._id
    });

    res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});




export{
publishVideo
}