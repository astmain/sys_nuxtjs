import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return {
        success: false,
        message: '分类ID不能为空'
      }
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        articles: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                realName: true
              }
            }
          }
        }
      }
    })

    if (!category) {
      return {
        success: false,
        message: '分类不存在'
      }
    }

    return {
      success: true,
      data: category
    }
  } catch (error) {
    console.error('获取分类详情失败:', error)
    return {
      success: false,
      message: '获取分类详情失败'
    }
  }
})
