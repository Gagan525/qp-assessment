import { PrismaClient } from "@prisma/client";
import { users } from "./user";
import { groceryItems } from "./groceryItems";


const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
  await prisma.groceryItem.createMany({
    data: groceryItems,
    skipDuplicates: true
  })
}

main()
.catch((e) => {
  console.log(e);
  process.exit(1);
})
.finally(() => {
  prisma.$disconnect();
})
