import { upload } from '../middlewares/multer.middleware.js';
import { Router } from 'express';
const router = Router()     
import { verifyJWT } from '../middlewares/auth.middleware.js';

import { publishVideo } from '../controllers/video.controller.js';




router.route('/publish-video').post(verifyJWT, upload.fields([
    {
        name: "thumbnail",
        maxCount: 1
    },
    {
        name: "video",
        maxCount: 1
    }
]),
    publishVideo
)

export default router