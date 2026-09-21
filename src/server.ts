import { prisma } from "../lib/prisma";
import app from "./app"
import config from "./config";


const PORT = config.port

async function main(){
  try {
    await prisma.$connect()
    app.listen(PORT,()=>{
        console.log(`server is running on port:${PORT}`)
    })
    
  } catch (error) {
    console.log(error)
    await prisma.$disconnect()
    process.exit(1)
    
  }
}

main()