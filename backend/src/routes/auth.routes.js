import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = Router()
const prisma = new PrismaClient()

router.post("/login", async (req, res) => {
  const { email, senha } = req.body

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return res.status(400).json({ error: "Usuário não encontrado" })
  }

  const senhaValida = await bcrypt.compare(senha, user.senha)

  if (!senhaValida) {
    return res.status(400).json({ error: "Senha incorreta" })
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    "SEGREDO_SUPER_SECRETO",
    { expiresIn: "1d" }
  )

  res.json({
    token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role
    }
  })
})

export default router