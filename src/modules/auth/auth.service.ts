import { prisma } from "../../../lib/prisma";
import config from "../../config";
import { jwtutlis } from "../../utlis/jwt";
import { IloginUser } from "./auth.interface";
import bcyrpt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const loginUser = async (payload: IloginUser) => {
  const { email, password } = payload;
  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });
  const passwordMatched = await bcyrpt.compare(password, user.password);

  if (!passwordMatched) {
    throw new Error("Password is not matched!");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  
  const accessToken = jwtutlis.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions ,
  );
  

  const refreshToken = jwtutlis.createToken(
    jwtPayload,
    config.jwt_referesh_secret,
    config.jwt_refreseh_expires_in as SignOptions,
  );
  return {
    accessToken,
    refreshToken,
  };
};
const refreshToken=async(refreshToken:string)=>{
   const verifyRefreshToken = jwtutlis.verifyToken(refreshToken,config.jwt_referesh_secret)

   if(!verifyRefreshToken.success){
    throw new Error(verifyRefreshToken.error)
   }

   const {id} = verifyRefreshToken.data as JwtPayload

   const user = await prisma.user.findUniqueOrThrow({
    where:{id}
   })
   if(user.activeStatus==="BLOCKED"){
    throw new Error("user is blocked")
   }

   const jwtPayload ={
    id,
    name:user.name,
    role:user.role,
    email:user.email
   }

   const accessToken = jwtutlis.createToken(
    jwtPayload, config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions
   )

   return {accessToken}
}

export const authService = {
  loginUser,refreshToken
};
