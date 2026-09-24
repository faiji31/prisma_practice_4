import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../../../lib/prisma";
import config from "../../config";
import { userController } from "./user.controller";
import { jwtutlis } from "../../utlis/jwt";
import { Role } from "../../../generated/prisma/enums";
import httpstats from "http-status";
import { catchAsync } from "../../utlis/catchAsync";
import { JwtPayload } from "jsonwebtoken";

const router = Router();

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

const auth = (...requireqdrole:Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken
    //    || req.headers.authorization?.startsWith("Bearer")
    //     ? req.headers.authorization?.split(" ")[1]
    //     : req.headers.authorization;

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

router.post("/register", userController.registerUser);
router.get(
  "/me",
//   (req: Request, res: Response, next: NextFunction) => {
//     console.log(req.cookies);
//     const { accessToken } = req.cookies;
//     console.log(accessToken);

//     const verifiedToken = jwtutlis.verifyToken(
//       accessToken,
//       config.jwt_access_secret,
//     );

//     if (!verifiedToken.success) {
//       throw new Error(verifiedToken.error);
//     }

//     const { email, name, role, id } = verifiedToken.data as JwtPayload;

//     const requireqdrole = [Role.Admin, Role.Author, Role.User];

//     if (!requireqdrole.includes(role)) {
//       return res.status(403).json({
//         success: false,
//         statscode: httpstats.FORBIDDEN,
//         message: "Forbidden!",
//       });
//     }
//     req.user = {
//       email,
//       id,
//       role,
//       name,
//     };
//     next();
//   },
auth(Role.Admin,Role.User,Role.Author),
  userController.getMyProfile,
);

export const userRoutes = router;
