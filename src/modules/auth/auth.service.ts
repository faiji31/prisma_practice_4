import { prisma } from "../../../lib/prisma"
import { IloginUser } from "./auth.interface"
import bcyrpt from 'bcrypt'


const loginUser=async(payload:IloginUser)=>{

    const {email,password} = payload 
    const user = await prisma.user.findFirstOrThrow({
        where:{email}
    })
    const passwordMatched = await bcyrpt.compare(password,user.password)

    if(!passwordMatched){
        throw new Error("Password is not matched!")
    }
    return user

}


export const authService={
    loginUser
}