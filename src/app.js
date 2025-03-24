import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();


app.use(cors({
    origin:(`${process.env.CORS_ORIGIN}`),
    credentials:true
}))

// setting for app
app.use(express.json({limit:"10kb"}))
app.use(express.urlencoded({extended:true,limit:"10kb"}))
app.use(express.static("public"))
app.use(cookieParser())




// router  import

import userRoutes from './routes/user.routes.js'
import videoRoutes from './routes/video.routes.js'

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/videos",videoRoutes )




export {app}