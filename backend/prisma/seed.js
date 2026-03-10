import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main(){

  // CRIA ADMIN
  const senhaHash = await bcrypt.hash("123456",10)

  await prisma.user.create({
    data:{
      nome:"Admin",
      email:"admin@email.com",
      senha:senhaHash,
      role:"ADMIN"
    },
    
    
  })

  // CRIA SERVIÇOS
  await prisma.servico.createMany({
    data:[
      {
        nome:"Design de Sobrancelha",
        preco:40,
        duracao:30
      },
      {
        nome:"Henna",
        preco:50,
        duracao:40
      },
      {
        nome:"Limpeza de Sobrancelha",
        preco:30,
        duracao:20
      }
    ]
  })

  console.log("Admin e serviços criados")

}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })