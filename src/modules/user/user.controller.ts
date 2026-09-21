import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../../../lib/prisma";
import config from "../../config";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utlis/catchAsync";
import { sendResponse } from "../../utlis/sendResponse";




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
export const userController = {
  registerUser,
};
