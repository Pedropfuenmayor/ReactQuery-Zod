import { PrismaClient} from "@prisma/client";
import type { Todo } from '../models'

const prisma = new PrismaClient();

const todos: Todo[] = [
  {
    id: 1,
    name: "Make Shoppings",
    done: false,
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const todo of todos) {
    const todoCreated = await prisma.todo.create({
      data: todo,
    });
    console.log(`Created todo with id: ${todoCreated.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
