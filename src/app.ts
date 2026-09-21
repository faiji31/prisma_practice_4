import cookieParser from "cookie-parser";
import express, { application, Application, Request, Response } from "express";
import cors from 'cors'
import config from "./config";
import httpStatus from 'http-status'
import { prisma } from "../lib/prisma";
import bcyrpt from 'bcrypt'



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


app.post("/api/users/register",async(req:Request,res:Response)=>{
    const {name,email,profilephoto,password}= req.body


    const isUserexits = await prisma.user.findUnique({
        where:{email}
    })
    if(isUserexits){
        throw new Error("user is not exits!")
    }

    const hashPassword = await bcyrpt.hash(password,Number(config.bcrypt_salt_rounds))


   const createduser = await prisma.user.create({
    data:{
        name,email, password:hashPassword
    },
    
   })

    await prisma.profile.create({
    data:{
        userId:createduser.id,
        profilephoto

    }
   })

   const user = await prisma.user.findUnique({
    where:{
        id:createduser.id,
        email:createduser.email
    },
    include:{
        profile:true
    },
    omit:{
        password:true
    }
   })

    res.status(httpStatus.CREATED).json({
        success:true,
        statusCode:httpStatus.CREATED,
        message:"User is register successfully!!",
        data:{
            user
        }
    })
})


export default app