import { prisma } from "../../../lib/prisma";
import config from "../../config";
import { jwtutlis } from "../../utlis/jwt";
import { IloginUser } from "./auth.interface";
import bcyrpt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

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

export const authService = {
  loginUser,
};
