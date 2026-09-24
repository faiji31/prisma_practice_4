import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../../../lib/prisma";
import config from "../../config";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utlis/catchAsync";
import { sendResponse } from "../../utlis/sendResponse";
import jwt from 'jsonwebtoken'
import { jwtutlis } from "../../utlis/jwt";




const registerUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const payload = req.body
    const user = await userService.registerUserIntoDB(payload)

    sendResponse(res,{
        success:true,
        statusCode: httpStatus.CREATED,
      message: "User is register successfully!!",
      data:{user}

    })

   
})
const getMyProfile = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{



  // const {accessToken} = req.cookies
  // console.log(req.user, "my profile")

  // // const verifiedToken = jwtutlis.verifyToken(accessToken,config.jwt_access_secret)

  // // if(typeof verifiedToken ==="string"){
  // //   throw new Error(verifiedToken)
  // }

  const profile = await userService.getMyProfileIntoDB(req.user?.id as string)

  sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"user profile fetched successfully!",
    data:{profile}
  })
})
const UpdateMyProfile = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   const userid = req.user?.id as string 
   const payload = req.body

   const UpdatedProfile =  await userService.UpdateMyProfileIntoDB(userid,payload)

   sendResponse(res,{
          success:true,
          statusCode:httpStatus.OK,
          message:"user profile updated successfully!",
          data:{
            UpdatedProfile
          }
   })
  })
export const userController = {
  registerUser,
  getMyProfile,
  UpdateMyProfile
};
