import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  console.log("hello.get");


  const list = await prisma.tb_demo.findMany()
  console.log("list", list)

  return {
    code: 200,
    msg: "success",
    rersult: {
      name: "hello.get",
      count: 100,
      list: list,
    },
  };
});
