import { Request, Response } from "express"
import { prisma } from "../../../lib/prisma"
import config from "../../config"
import httpStatus from 'http-status'
import { userService } from "./user.service"
import { json } from "node:stream/consumers"



const registerUser = async(req:Request,res:Response)=>{
   try {
     const payload = req.body

    const user = await userService.registerUserIntoDB(payload)

    res.status(httpStatus.CREATED).json({
        success:true,
        statusCode:httpStatus.CREATED,
        message:"User is register successfully!!",
        data:{
            user
        }
        
    })
   
    
   } catch (error) {
    console.log(error)
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success:false,
        message:"Failed to register user!!",
        statusCode:httpStatus.INTERNAL_SERVER_ERROR,
        error:(error as Error).message

    })
    
   }
}

export const userController = {
  registerUser
}