import { prisma } from "../../../lib/prisma";
import config from "../../config";
import { Iuser } from "./user.interface";
import bcyrpt from 'bcrypt'


const registerUserIntoDB =async(payload:Iuser)=>{
    const {name,email,password,profilephoto} = payload
     const isUserexits = await prisma.user.findUnique({
        where:{email}
    })
    if(isUserexits){
        throw new Error("user is not exits!")
    }

    const hashPassword = await bcyrpt.hash(password,Number(config.bcrypt_salt_rounds))


   const createduser = await prisma.user.create({
    data:{
        name,email, password:hashPassword,
        profile:{
            create:{
                profilephoto
            }
        }
       
    }
    
    
    
   })




   const user = await prisma.user.findUnique({
    where:{
        id:createduser.id,
        email:createduser.email
    },
    include:{
        profile:true
    },
    omit:{
        password:true
    }
   })
   return user
}

const getMyProfileIntoDB=async(userid:string)=>{
  const user = await prisma.user.findUniqueOrThrow({
    where:{id:userid},
    omit:{
        password:true
    },
    include:{
        profile:true
    }
  })
  return user
}

export const userService={
    registerUserIntoDB,
    getMyProfileIntoDB
}