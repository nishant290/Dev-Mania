import { Follower } from "../models/follower.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";


const userProfile = asyncHandler(async (req, res) => {

   try {
      const { username } = req.params

      console.log("USERNAME", username)

      if (!username?.trim()) {
         throw new ApiError(400, "Unable to get username !!")
      }

      const user = await User.findOne({ refreshToken: req.cookies?.refreshToken })


      const userProfileData = await User.aggregate([
         {
            $match: {
               username: username?.toLowerCase()
            }
         },
         {
            $lookup: {
               from: "followers",
               localField: "_id",
               foreignField: "followers",
               as: "followers"
            }
         },
         {
            $lookup: {
               from: "followers",
               localField: "_id",
               foreignField: "following",
               as: "following"
            }
         },
         {
            $lookup: {
               from: "posts", 
               localField: "_id",
               foreignField: "owner",
               as: "posts"
            }
         },
         {
            $lookup: {
               from: "followers",
               let: { targetId: "$_id", loggedId: user._id },
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $and: [
                              { $eq: ["$followers", "$$targetId"] },   // profile being visited
                              { $eq: ["$following", "$$loggedId"] }    // logged-in user
                           ]
                        }
                     }
                  }
               ],
               as: "followRelation"
            }
         },
         {
            $addFields: {
               followersCount: {
                  $size: "$followers"
               },
               followingCount: {
                  $size: "$following"
               },
               postsCount: {
                  $size: "$posts"
               },
               isFollowing: {
                  $gt: [{ $size: "$followRelation" }, 0]
               },
               isOwnProfile: {
                  $eq: ["$_id", user._id]
               }
            }
         },
         {
            $project: {
               fullName: 1,
               username: 1,
               followersCount: 1,
               followingCount: 1,
               postsCount: 1,
               avatar: 1,
               isFollowing: 1,
               isOwnProfile: 1,
            }
         }
      ])

      if (!userProfileData?.length) {
         throw new ApiError(500, "Failed to fetch user's profile data")
      }

      return res
         .status(200)
         .json(
            new ApiResponse(
               200,
               userProfileData[0],
               "User's Profile Data fetched successfully"
            )
         )
   } catch (error) {
      throw new ApiError(400, error?.message)
   }
})

const allUsersProfiles = asyncHandler(async (req, res) => {
   try {
      const users = await User.find({}).select("-password -refreshToken")

      console.log(users)

      if (!users) {
         throw new ApiError(500, "Can't fetch all the users !!")
      }

      return res
         .status(200)
         .json(
            new ApiResponse(200, users, "All the users of DB")
         )
   } catch (error) {
      throw new ApiError(400,"Error while fetching all the users", error)
   }
})

const userFollow = asyncHandler(async (req, res) => {

   try {

      const { username } = req.params
      console.log("USERNAME", username)

      if (!username?.trim()) {
         throw new ApiError(400, "Unable to get username !!")
      }

      const loggedUser = await User.findOne({ refreshToken: req.cookies?.refreshToken })
      const targetUser = await User.findOne({ username: username })

      if (loggedUser.toString() === targetUser.toString()) {
         throw new ApiError(400, "You can't follow your self !!")
      }

      const alreadyFollowing = await Follower.findOne({
         followers: targetUser._id,
         following: loggedUser._id,
      })

      if (alreadyFollowing) {
         throw new ApiError(400, "The user is already following !!")
      }

      const response = await Follower.create({
         followers: targetUser._id,
         following: loggedUser._id,
      })

      console.log(response)

      return res
         .status(200)
         .json(new ApiResponse(200, response, "User followed successfully !!"))

   } catch (error) {
      throw new ApiError(400, "User follow problem", error)
   }
})

export { userProfile, allUsersProfiles, userFollow }