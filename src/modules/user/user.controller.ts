import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../../../lib/prisma";
import config from "../../config";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { json } from "node:stream/consumers";

const catchAsync =  (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to register user!!",
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        error: (error as Error).message,
      });
    }
  };
};

// const registerUser = async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;

//     const user = await userService.registerUserIntoDB(payload);

//     res.status(httpStatus.CREATED).json({
//       success: true,
//       statusCode: httpStatus.CREATED,
//       message: "User is register successfully!!",
//       data: {
//         user,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Failed to register user!!",
//       statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//       error: (error as Error).message,
//     });
//   }
// };


const registerUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const payload = req.body
    const user = await userService.registerUserIntoDB(payload)

     res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User is register successfully!!",
      data: {
        user,
      },
    });
})
export const userController = {
  registerUser,
};
