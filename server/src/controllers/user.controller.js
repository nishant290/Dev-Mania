import {asyncHandler} from '../utils/asyncHandler.js'
import { uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'

// asynchandler is higher order function. 
// it takes the function as params which will become requestHandler (as the syntax of asyncHandler).
// requestHandler aslo return the function. In that function it returns a promise, that promise also calls the requestHandler to resolve.
// so in the below case the fun "async(req,res)=>{...}" is a requestHandler
// so the promise which is returned will call the requestHandler (in our case the fun "async(req,res)=>{...}") for resolve.
// using this higher order function, we don't have to use try catch in the below code.

const generateAccessAndRefreshToken = async (userId)=>{

    try {
    // first thing first is we'll find the user by it's ID, which is provided in params.
    const user = await User.findById(userId)

    // now we have generate the Access Token and Refresh Token by using the built in function created in the user model.
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    // here, we set and save the refreshToken in DB for the mothfckin user.
    user.refreshToken = refreshToken

    // after this, let's save the user's refreshToken without accessing any credentials.
    await user.save({ validateBeforeSave: false})

    // and return the tokens
    return {accessToken, refreshToken}

    }catch(error) {        
        throw new ApiError(500,"Something went wrong while genereating the Access and Refresh Token.")
    }
    
}

const registerUser = asyncHandler(async(req,res)=>{
  
    // first we break the request body into variables
   const {email, fullName, username, password} = req.body

   console.log("the REQUEST: ", req.body)

   // and then we check if any of the fields are empty
   // if any of the fields are empty, we throw an error
   
   // here we are using some() method to check if any of the fields are empty
   // we used trim() method to remove any leading or trailing spaces
   // if any of the fields are empty, we throw an error with status code 400

   if([email, fullName, username, password].some(fields=>fields.trim() === ""))
    {
        throw new ApiError(400,"All the fields are required !!");        
    }

    //here, we check if the user already exists in the database or not.
    // $or is a operator in MongoDB which is used to find documents that match any of the given conditions.
    // in this case, we are checking if the username or email already exists in the database

    const existedUser = await User.findOne({
        $or : [{username},{email}]
    })

    // // after that we check if the user already exists or not
    if(existedUser){
        throw new ApiError(409, "User already exists !!");
    }

    console.log(req.files)
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const postImageLocalPath = req.files?.postImage[0]?.path;

    console.log(avatarLocalPath)

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatarUpload = await uploadOnCloudinary(avatarLocalPath)

    if(!avatarUpload){
        throw new ApiError(400, "Avatar file is not getting upload !!")
    }

    const user  = await User.create({
        fullName,
        avatar: avatarUpload.url,
        email,
        password, 
        username: username.toLowerCase()
    })

    // this thing is used majorly to send the response without giving the credentials like 
    // PASSWORD and REFRESH TOKEN
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while creating the user !!")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully !!")
    )
   
})



const loginUser = asyncHandler(async(req,res)=>{
    
    // we'll give the functionality to enter either username or email in credential for the ease of User.
    const{validator, password} = req.body 

    // console.log("the REQUEST: ", req.body)

    const user = await User.findOne({

        // cheking nonchalantly that what is the validator from these shii, yk.
        $or : [{username:validator},{email:validator}] 
    })

    if(!user){
        throw new ApiError(404, "The User is NOT Registerd !!")
    }

    const correctPassword = await user.isPasswordCorrect(password)

    if(!correctPassword){
        throw new ApiError(401, "The Password is incorrect !!")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    // this thing is used majorly to send the response without giving the credentials like 
    // PASSWORD and REFRESH TOKEN
    const loggedUser = await User.findById(user._id).select(" -password -refreshToken ")

    // these options are used for cookies. Why ? How ? that...i have to check.
    const options = {
        httpOnly : true,
        secure: true
    }

    // here, we have to send the response, in this we'll also include the "COOKIESSSSS" 
    return res
    .status(200)
    .cookie("accessToken",accessToken,options) // this cookie will handle the accessToken. How ?? idk.
    .cookie("refreshToken",refreshToken,options) // same for this MF. but, for refresToken
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedUser, accessToken, refreshToken // this shii , is for tokens if somehow the app don't use the cookies.
            }, 
            "User logged in successfully !!"
        )
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    console.log(req.params)

    // the shitty method we'll gonna use is findByIdAndUpdate()
    // in this method we'll pass three params 
    await User.findByIdAndUpdate(
        req.user._id, // the req.user we got from the "verifyJWT" middleware
        {
            // here we use the mongoose operator $set to undefine the refreshtoken
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true   // the new: true is for to update the use data in which the use's refreshtoken is not defined
                        // which we gonna send in the response to the user.
        }
    )

    // now we need the options here
    const options = {
        httpOnly : true,
        secure: true
    }

    // the final step, to send the response
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
    
})

// this function is used to UPDATE the refresh token when it's expired.
const UpdateRefreshToken = asyncHandler(async(req,res)=>{

    try {
        // first thing first, get the refreshToken
        const takenRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
        if(!takenRefreshToken){
            throw new ApiError(401, "No Rfresh Token Found !!")
        }
    
        // after that verify it using the .verify() function
        // then it'll return the decoded token 
        const decodedToken = jwt.verify(
            takenRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        // in that decodedToken there will be payload
        // in that payload we have provided the user_id
        // so using that id we can find the user
        const user = await User.findById(decodedToken?._id)
    
        // after finding the user 
        // generate the new refresh and access token for that
        // and store it in the variables
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        const options = {
            httpOnly:true,
            secure:true
        }
    
        // after that return the response
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, refreshToken: newRefreshToken
                },
                "Refresh Token Updated !!"
            )
        )
    } catch (error) {
        throw new ApiError(400, "Something Wrong while generating the refresh token !!")
    }
})


export {registerUser,loginUser,logoutUser,UpdateRefreshToken}