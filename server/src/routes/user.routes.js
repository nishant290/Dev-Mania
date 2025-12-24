import { Router } from "express"; 
import { registerUser,loginUser, UpdateRefreshToken, logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";      
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

// this route is for user registration
// it uses the multer middleware to handle file uploads

// here we used upload.fields() method to handle multiple file uploads
// the first parameter is an array of objects, each object contains the name of the field and

router.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
    ])    
,registerUser)

router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/refresh-token').post(UpdateRefreshToken)

export default router