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


  const {accessToken} = req.cookies
  console.log(accessToken)

  const verifiedToken = jwtutlis.verifyToken(accessToken,config.jwt_access_secret)

  if(typeof verifiedToken ==="string"){
    throw new Error(verifiedToken)
  }

  const profile = await userService.getMyProfileIntoDB(verifiedToken.id)

  sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"user profile fetched successfully!",
    data:{profile}
  })
})
export const userController = {
  registerUser,
  getMyProfile
};
