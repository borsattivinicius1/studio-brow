import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  const senhaHash = await bcrypt.hash("123456", 10)

  await prisma.user.create({
    data: {
      nome: "Admin",
      email: "admin@email.com",
      senha: senhaHash,
      role: "ADMIN"
    }
  })

  console.log("Admin criado com sucesso!")
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })