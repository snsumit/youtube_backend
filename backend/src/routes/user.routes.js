import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router()


router.route('/register').post(upload.fields([
    {
        name:'avatar',
        maxCount:1,
    },
    {
        name:'coverImage',
        maxCount:1
    }
]),userController.registerUser)


router.route('/login').post(userController.loginUser)
router.route('/logout').post(verifyJWT,userController.logoutUser)
router.route('/refresh-token').post(userController.refreshAccessToken)
router.route('/change-password').post(verifyJWT,userController.changeCurrentPassword)
router.route('/getCurrentUser').get(verifyJWT,userController.getCurrentUser)

export default router