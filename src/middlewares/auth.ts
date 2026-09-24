import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utlis/catchAsync";
import { jwtutlis } from "../utlis/jwt";
import config from "../config";
import { prisma } from "../../lib/prisma";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        id: string;
        role: Role;
        name: string;
      };
    }
  }
}
export const auth = (...requireqdrole:Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken ? req.cookies.accessToken :
        req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error("You are not logged in please access this resoruce");
    }
    const verifiedToken = jwtutlis.verifyToken(
      token,
      config.jwt_access_secret,
    );

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }
     const { email, name, role, id } = verifiedToken.data as JwtPayload;

     if(requireqdrole.length &&!requireqdrole.includes(role)){
    throw new Error("Forbidden")
  }

  const user = await prisma.user.findUnique({
    where:{
        id,name,email,role
    }
    
  })
  if(!user){
        throw new Error("user not found")
    }
    if(user.activeStatus==="BLOCKED"){
        throw new Error("Your acc has been blocked .please contact support team")
    }
    req.user={
        email,name,id,role
    }
    next()
  });
  
  
};