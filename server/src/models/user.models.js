import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            unique:true,
            lowercase:true,
            required:[true, "Please enter the Name."],
            trim:true,
            index:true
        },
        fullName:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:[true, "Please enter the Email."],
            trim: true,
            unique:true,
            lowercase:true,
        },
        password:{
            type:String,
            required:[true, "Please enter the Password."],
            minlength:6,
        },
        avatar:{
            type:String,
            default:String
        },
        refreshToken:{
            type:String
        }
        
    },
    {timestamps:true}
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()   
    
    // .isModified() is a built-in function which checks that the field is modified or not

    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

// two methods for jwt. 1. generate access toke and 2. generate refresh token

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// second method for jwt 

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id,            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)