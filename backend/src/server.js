import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import agendamentosRoutes from "./routes/agendamentos.js"
import servicosRoutes from "./routes/servicos.js"


const app = express();
const prisma = new PrismaClient();

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/agendamentos", agendamentosRoutes)
app.use("/servicos", servicosRoutes)



app.get("/", async (req, res) => {
  const usuarios = await prisma.user.findMany();

  app.post("/login", async (req,res)=>{

  const {email,password} = req.body

  const user = await prisma.user.findUnique({
    where:{email}
  })

  if(!user){
    return res.status(401).json({error:"User not found"})
  }

  if(user.password !== password){
    return res.status(401).json({error:"Invalid password"})
  }

  return res.json({
    token:"TOKEN_AQUI",
    tipo:user.tipo
  })
})

  res.json({
    message: "Backend Studio Brow rodando 🚀",
    totalUsuarios: usuarios.length
  });
});

app.get("/teste", authMiddleware, (req, res) => {
  res.json({
    message: "Você está autenticado",
    user: req.user
  });
});

app.listen(3535, () => {
  console.log("🚀 Servidor rodando na porta 3535");
});

