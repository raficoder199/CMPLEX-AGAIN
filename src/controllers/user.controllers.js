import { asyncHandler } from "../utils/AsyncHandler.js";

const registerUser = asyncHandler(async(req,res)=>{

    res.status(200).json({
        messege:"raficoder199"
    })

})

export {registerUser}