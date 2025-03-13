import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path:"./env"
})



connectDB()















// first way

// import express from "express";
// const app = express();

// ( async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log(error);
//             throw error;
            
//         })

//         app.listen(`${process.env.PORT}`)
//     } catch (error) {
//         console.error
        
//     }

// })()