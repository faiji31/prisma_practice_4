import { prisma } from "../../../lib/prisma"
import { IloginUser } from "./auth.interface"
import bcyrpt from 'bcrypt'
import jwt from 'jsonwebtoken'


const loginUser=async(payload:IloginUser)=>{

    const {email,password} = payload 
    const user = await prisma.user.findFirstOrThrow({
        where:{email}
    })
    const passwordMatched = await bcyrpt.compare(password,user.password)

    if(!passwordMatched){
        throw new Error("Password is not matched!")
    }
  

    const accessToken = jwt.sign({
        id:user.id,
        email:user.email,
        name:user.name,
        role:user.role
    },"accessSecret",{
        expiresIn:"1d"

    })
    const refreshToken = jwt.sign({
         id:user.id,
        email:user.email,
        name:user.name,
        role:user.role
    },"refreshSecret",{
        expiresIn:"7d"
    })
    return {
        accessToken,
        refreshToken
    }

}


export const authService={
    loginUser
}