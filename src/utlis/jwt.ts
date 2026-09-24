import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

const createToken =(payload:JwtPayload,secret:string,expiresIn:SignOptions)=>{
    const Token =jwt.sign(payload,secret,{expiresIn} as SignOptions)
    return Token

}

const verifyToken = (token:string,secret:string)=>{
    try {
        const verifiedToken = jwt.verify(token,secret)
        return verifiedToken
    } catch (error:any) {
        throw new Error(error.message)
    }
}


export const jwtutlis = {
    createToken, verifyToken
}