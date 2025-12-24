import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import jwt from 'jsonwebtoken'
import { User } from "../models/user.models.js";


// first thing first, this middleware is used primarilly for to get the credentials or data of the current user by its token
// which it then used to fetch the id of the logged in user
// so that is can log out the user by using it's id
// that's it 
// that's why we using it
// it's like without any data given by the user like who i am and the stuff,
//  we get the current user's data with the magic of the server, yk.
export const verifyJWT = asyncHandler(async (req , _ ,  next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401, "Unauthorized Token")
        }
    
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select(" -password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user
        next()

    } catch (error) {

        throw new ApiError(401, error?.message || "Invalid Access Token")
        
    }
})