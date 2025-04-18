import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

// Cloudinary configuration


 cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET
});


const UploadOnCLoudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null


        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been successfully uploaded
        // console.log("fille uploaded on cloudinary", response.url)

        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove temporary file from server
        return null
        
    }

}

export { UploadOnCLoudinary}