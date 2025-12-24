import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

// this is a configuration of the cloudinary, it setups the basic credentials of the cloudinary to connect
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// now we will create the function to upload the files on cloudinary
const uploadOnCloudinary = async function (localPath) {
    try{
        // first we'll check that the local path exists or not 
        if(!localPath) return null

        // if it exists then create response and return it
        const response = await cloudinary.uploader.upload(localPath,{
            resource_type:"auto"
        })

        // let's review the response
        console.log("This is a response of cloudinary file upload", response)

        // this will unlink the file path for os, basically it will delete the locally saved temporary file in local storage
        fs.unlinkSync(localPath)
        
        // then return the response
        return response;

    }catch(error){ // ALWAYS CATCH THE ERROR AND PRINT IT TO KNOW WHAT IS WRONG

        // remove the locally saved temporary file as the upload operation got failed
        console.log(error)
        fs.unlinkSync(localPath)
        return null
    }
}

export {uploadOnCloudinary};
