import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from '../models/user.models.js'
import { Post } from "../models/post.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const createPost = asyncHandler(async (req, res) => {

    const { title, content, hashtags } = req.body

    console.log("HASHTAGS: ", hashtags)

    if ([title, content].some(fields => fields.trim() === "")) {
        throw new ApiError(400, "All the fields are required !!");
    }

    const user = await User.findOne({ refreshToken: req.cookies?.refreshToken })

    if (!user) {
        throw new ApiError(400, "User not found !!")
    }


    const postImageLocalPath = req.files?.postImage[0]?.path;
    console.log('POST IMAGE PATH:', req.files?.postImage[0]?.path)

    if (!postImageLocalPath) {
        console.log('POST IMAGE: ', postImageLocalPath)
        throw new ApiError(400, "postImage file is required")
    }

    const postImageUpload = await uploadOnCloudinary(postImageLocalPath)

    if (!postImageUpload) {
        throw new ApiError(400, "postImage file is not getting upload !!")
    }

    const response = await Post.create({
        content: content,
        title: title,
        postImage: postImageUpload.url,
        owner: user._id,
        hashtags: Array.isArray(hashtags) ? hashtags : []
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, response, "The post created successfully")
        )
})

const allPosts = asyncHandler(async (req, res) => {

    try {
        const posts = await Post.find({}).populate("owner", "username fullName avatar").exec()

        if (posts.length === 0) {
            throw new ApiError(400, "Yo, Can't fetch the posts")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, posts, "Posts fetched successfully !!")
            )

    } catch (error) {
        throw new ApiError(400, "Error while fetching the posts", error.message)
    }
})

const postData = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            throw new ApiError(400, "Error to find the post id !!")
        }

        const post = await Post.findById(id).populate("owner", "username fullName avatar")

        if (!post) {
            throw new ApiError(400, "Error to fetch the post data !!")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, post, "post fetched successfully !!")
            )
    } catch (error) {
        throw new ApiError(400, "Error while fetching the post data", error.message)
    }
})

const likePost = asyncHandler(async (req, res) => {

    try {
        const { id } = req.params
        const {isLiked} = req.body

        console.log("Liked: ", isLiked)

        if (!id) {
            throw new ApiError(400, "Error to find the post id !!")
        }


        const response = await Post.updateOne(
            { _id: id },
            { $inc: { likes: isLiked ? 1 : -1} }
        )

        
        if (response.matchedCount === 0) {
            throw new ApiError(404, "Post not found!")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, response, "Post liked successfully !!")
            )


    } catch (error) {
        console.log("Like operation gets unsuccessfull !!", error.message)
    }
})

export { createPost, allPosts, postData, likePost }