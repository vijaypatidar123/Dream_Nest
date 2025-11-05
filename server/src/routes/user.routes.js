import {Router} from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getTripList,
    addListingToWishlist,
    getPropertyList,
    getReservationList
} from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        }
    ]),
    registerUser
)

// router.route('/register').post(
//     uploadSingle('avatar'),
//     registerUser
//   )

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"),updateUserAvatar)
// router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
// router.route("/history").get(verifyJWT, getWatchHistory)

router.route("/:userId/trips").get(verifyJWT,getTripList)
router.route("/:userId/:listingId").patch(verifyJWT,addListingToWishlist)
router.route("/:userId/properties").get(verifyJWT, getPropertyList)
router.route("/:userId/reservations").get(verifyJWT, getReservationList)

export default router