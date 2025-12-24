import { Router } from "express";
import { createPost, allPosts, postData, likePost } from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/home/post").post(
     upload.fields([
            {
                name:"postImage",
                maxCount:1
            },
        ]) 
    ,createPost)

router.route("/home").get(allPosts)
router.route('/home/post/:id').get(postData)
router.route('/home/post/like/:id').post(likePost)

export default router    