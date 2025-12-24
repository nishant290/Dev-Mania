import multer from 'multer'

// this is the multer middleware for handling file uploads
// multer is a middleware for handling multipart/form-data, which is used for uploading files

 const storage = await multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,'public/temp/')
    },
    filename:function (req,file,cb) {
        cb(null,file.originalname)
    }
 })

export const upload = multer({
    storage,
})