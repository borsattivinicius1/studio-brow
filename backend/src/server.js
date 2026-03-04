import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.routes.js"

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use(express.json())

app.get("/", async (req, res) => {
  const usuarios = await prisma.usuario.findMany();

  res.json({
    message: "Backend Studio Brow rodando 🚀",
    totalUsuarios: usuarios.length
  });
});

app.listen(3535, () => {
  console.log("🚀 Servidor rodando na porta 3535");
});