import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

// routes imports

import userRouter from "./src/routes/user.routes.js"
import profileRouter from "./src/routes/profile.routes.js"
import postRouter from "./src/routes/post.router.js"

app.use('/api/v1/users',userRouter)
app.use('/api/v1/profile',profileRouter)
app.use('/api/v1',postRouter)

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});     

export {app}