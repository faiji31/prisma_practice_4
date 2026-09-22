import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utlis/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utlis/sendResponse";
import httpStatus from "http-status";

const loginUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const payload = req.body
    const loginUser = await authService.loginUser(payload)

    sendResponse(res,{
        success:true,
        message:"user logged in successfully!",
        statusCode:httpStatus.OK,
        data:loginUser
    })

})


export const authController ={
    loginUser
}