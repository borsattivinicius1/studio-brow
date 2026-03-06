import express from "express"
import { PrismaClient } from "@prisma/client"

const router = express.Router()
const prisma = new PrismaClient()

// CRIAR AGENDAMENTO
router.post("/", async (req,res)=>{

  try{

    const { data, userId, servicoId } = req.body

    const agendamento = await prisma.agendamento.create({
      data:{
        data: new Date(data),
        userId,
        servicoId
      }
    })

    res.json(agendamento)

  }catch(error){

    console.log(error)

    res.status(500).json({
      error:"Erro ao criar agendamento"
    })

  }

})

// LISTAR AGENDAMENTOS
router.get("/", async (req,res)=>{

  const agendamentos = await prisma.agendamento.findMany({
    include:{
      user:true,
      servico:true
    }
  })

  res.json(agendamentos)

})

export default router