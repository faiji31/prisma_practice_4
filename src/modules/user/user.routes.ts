import { NextFunction, Request, Response, Router } from "express"
import { prisma } from "../../../lib/prisma"
import config from "../../config"
import { userController } from "./user.controller"
import { jwtutlis } from "../../utlis/jwt"
import { Role } from "../../../generated/prisma/enums"
import httpstats from "http-status"




const router = Router()

declare global {
    namespace Express {
        interface Request{
            user?:{
                 email:string,
                 id:string,
                 role:Role,
                 name:string            }
        }
    }
}


router.post('/register',userController.registerUser)
router.get('/me',(req:Request,res:Response,next:NextFunction)=>{
  console.log(req.cookies)
  const {accessToken} = req.cookies
    console.log(accessToken)
  
    const verifiedToken = jwtutlis.verifyToken(accessToken,config.jwt_access_secret)

  

    
  
    if(typeof verifiedToken ==="string"){
      throw new Error(verifiedToken)
    }
     const {email,name,role,id} = verifiedToken
    
    const requireqdrole = [Role.Admin,Role.Author,Role.User]

    if(!requireqdrole.includes(role)){
       return  res.status(403).json({
        success:false,
        statscode:httpstats.FORBIDDEN,
        message:"Forbidden!",

       })
    }
    req.user ={
        email,id,role,name
    }
  next()
},userController.getMyProfile)

export const userRoutes = router

