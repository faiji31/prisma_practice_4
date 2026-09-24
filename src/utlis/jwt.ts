import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

const createToken =(payload:JwtPayload,secret:string,expiresIn:SignOptions)=>{
    const Token =jwt.sign(payload,secret,{expiresIn} as SignOptions)
    return Token

}

const verifyToken = (token:string,secret:string)=>{
    try {
        const verifiedToken = jwt.verify(token,secret)
        return {
            success:true,
            data:verifiedToken
        }
    } catch (error:any) {
        console.log("token verification failed",error)
        return {
            success:false,
            error:error.message
        }
    }
}


export const jwtutlis = {
    createToken, verifyToken
}