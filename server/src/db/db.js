import mongoose from "mongoose"
import { DB_NAME } from "../../constants.js"
import express from "express"

const app = express()

const connectDB = async()=>{
    try{
       const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)

       console.log("DB INSTANCE: ", connectionInstance.connection.host);
       
    
        app.on("error",(err)=>{
            console.log("CONNECTION ERROR: ", err)
            throw err
        })   
       
    }catch{
         app.on("error",(err)=>{
            console.log("CONNECTION ERROR: ", err)
            throw err
        }) 
        console.error("Oops, there is some problem in connection !!")
        process.exit(1)
    }
}

export default connectDB