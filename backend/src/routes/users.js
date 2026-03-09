import express from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const router = express.Router()
const prisma = new PrismaClient()

// CRIAR USUÁRIO
router.post("/", async (req,res)=>{

  try{

    const { nome, email, senha } = req.body

    const existe = await prisma.user.findUnique({
      where:{ email }
    })

    if(existe){
      return res.status(400).json({
        error:"Email já cadastrado"
      })
    }

    const senhaHash = await bcrypt.hash(senha,10)

    const user = await prisma.user.create({
      data:{
        nome,
        email,
        senha:senhaHash
      }
    })

    res.json(user)

  }catch(error){

    console.log(error)

    res.status(500).json({
      error:"Erro ao criar usuário"
    })

  }

})

export default router