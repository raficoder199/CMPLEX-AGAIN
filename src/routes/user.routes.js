import { upload } from '../middlewares/multer.middleware.js';
import { Router } from 'express';
import { changeCurrentPassword, loginUser, logoutUser, refreshAccessToken, registerUser } from '../controllers/user.controllers.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';


const router = Router()

router.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route('/login').post(loginUser)

//secured routes
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/refreshToken').post( refreshAccessToken)

router.route("/updatepassword").post(verifyJWT,changeCurrentPassword)


export default router