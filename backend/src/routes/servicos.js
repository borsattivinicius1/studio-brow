import express from "express"
import { PrismaClient } from "@prisma/client"

const router = express.Router()
const prisma = new PrismaClient()

// LISTAR SERVIÇOS
router.get("/", async (req,res)=>{

  const servicos = await prisma.servico.findMany()

  res.json(servicos)

})

// CRIAR SERVIÇO
router.post("/", async (req,res)=>{

  const { nome, preco, duracao } = req.body

  const servico = await prisma.servico.create({
    data:{
      nome,
      preco,
      duracao
    }
  })

  res.json(servico)

})

export default router