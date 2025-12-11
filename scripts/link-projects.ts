import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "file:./data/prod.db"
    }
  }
})

async function main() {
  const user = await prisma.user.findFirst()
  
  if (!user) {
    console.log("No users found. Please sign in first.")
    return
  }

  console.log(`Linking orphan projects to user: ${user.name} (${user.id})`)

  const result = await prisma.project.updateMany({
    where: {
      userId: null
    },
    data: {
      userId: user.id
    }
  })

  console.log(`Updated ${result.count} projects.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
