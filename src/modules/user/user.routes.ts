import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../../../lib/prisma";
import config from "../../config";
import { userController } from "./user.controller";
import { jwtutlis } from "../../utlis/jwt";
import { Role } from "../../../generated/prisma/enums";
import httpstats from "http-status";
import { catchAsync } from "../../utlis/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { auth } from "../../middlewares/auth";

const router = Router();





router.post("/register", userController.registerUser);
router.get(
  "/me",

router.put("/my-profile",auth(Role.Admin,Role.Author,Role.User),userController.UpdateMyProfile),
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
