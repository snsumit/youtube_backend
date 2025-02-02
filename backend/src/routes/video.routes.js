import express from "express"
import videoController from "../controllers/video.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"
const router=express.Router()
router.route('/upload-video').post(verifyJWT,upload.fields([
    {
        name:"videoFile",
        maxCount:1,
    },
    {
        name:"thumbnail",
        maxCount:1
    }
]),videoController.publishVideo)
router.route('/update-video').post(verifyJWT,upload.single("thumbnail"),videoController.videoFileUpdate)
router.route('/getVideoById').get(verifyJWT,videoController.getVideoById)
router.route('/delete-video').delete(verifyJWT,videoController.deleteVideo)
export default router;