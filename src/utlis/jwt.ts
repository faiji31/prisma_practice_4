import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

const createToken =(payload:JwtPayload,secret:string,expiresIn:SignOptions)=>{
    const Token =jwt.sign(payload,secret,{expiresIn} as SignOptions)
    return Token

}


export const jwtutlis = {
    createToken
}