import { upload } from '../middlewares/multer.middleware.js';
import { Router } from 'express';
import { changeCurrentPassword, getUserChannel, getUserProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updateCoverImage, updateUserProfile } from '../controllers/user.controllers.js';
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

router.route("/update-password").post(verifyJWT,changeCurrentPassword)

router.route("/user-profile").get(verifyJWT,getUserProfile)

router.route("/update-account").patch(verifyJWT,updateUserProfile)

router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"), updateAvatar)

router.route("/update-coverimage").patch(verifyJWT, upload.single("coverImage"), updateCoverImage)

router.route("/c/:username").get(verifyJWT,getUserChannel)

router.route("/watch-history").get(verifyJWT,getWatchHistory)


export default router