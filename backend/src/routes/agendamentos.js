import express from "express"
import { PrismaClient } from "@prisma/client"

const router = express.Router()
const prisma = new PrismaClient()

// CRIAR AGENDAMENTO
router.post("/", async (req,res)=>{

  try{

    const { data, userId, servicoId } = req.body

    const dataAgendamento = new Date(data)

    // verificar se já existe agendamento no mesmo horário
    const existente = await prisma.agendamento.findFirst({
      where:{
        data: dataAgendamento
      }
    })

    if(existente){
      return res.status(400).json({
        error:"Este horário já está agendado"
      })
    }

    const agendamento = await prisma.agendamento.create({
      data:{
        data: dataAgendamento,
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



// CANCELAR AGENDAMENTO
router.delete("/:id", async (req,res)=>{

  try{

    const { id } = req.params

    const agendamento = await prisma.agendamento.findUnique({
      where:{
        id:Number(id)
      }
    })

    if(!agendamento){
      return res.status(404).json({
        error:"Agendamento não encontrado"
      })
    }

    await prisma.agendamento.delete({
      where:{
        id:Number(id)
      }
    })

    res.json({
      message:"Agendamento cancelado"
    })

  }catch(error){

    console.log(error)

    res.status(500).json({
      error:"Erro ao cancelar agendamento"
    })

  }

})

export default router