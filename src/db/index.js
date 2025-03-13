import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB= async ()=>{
    try {
       const connectionIntase = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`connection and hosted at: ${connectionIntase.connection.host}`)
        
    } catch (error) {
        console.log("error connecting to database", error);
        
        
    }
}

export default connectDB;