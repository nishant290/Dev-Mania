import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        required:true
    },
    commentedAt:{
        type:Date,
        default:Date.now,
    }
})

const postSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true,
        
    },
    title:{
        type:String,
        required:true,
    },
    postImage:{
        type:String,
    },
    views:{
        type:Number,
        default:0
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    likes:{
        type:Number,
        default:0
    },
    hashtags:[
        {
            type:String,
        }
    ],
    
    
},
    {timestamps:true}
)


export const Post = mongoose.model("Post", postSchema)