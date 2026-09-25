import cookieParser from "cookie-parser";
import express, { application, Application, Request, Response } from "express";
import cors from 'cors'
import config from "./config";
import httpStatus from 'http-status'
import { prisma } from "../lib/prisma";
import bcyrpt from 'bcrypt'
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";

import { commentRoutes } from "./modules/comment/comment.routes";
import { PostRoutes } from "./modules/post/post.routes";



const app:Application = express()


app.use(cors({
    origin:config.app_url,
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.get("/",(req:Request,res:Response)=>{
    res.send("Hello world!")
})


app.use("/api/users",userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/posts',PostRoutes)
app.use('/api/comments',commentRoutes)


export default app