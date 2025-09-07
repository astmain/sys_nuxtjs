import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return {
        success: false,
        message: '文章ID不能为空'
      }
    }

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            realName: true,
            avatar: true
          }
        },
        category: true,
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                username: true,
                realName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!article) {
      return {
        success: false,
        message: '文章不存在'
      }
    }

    return {
      success: true,
      data: article
    }
  } catch (error) {
    console.error('获取文章详情失败:', error)
    return {
      success: false,
      message: '获取文章详情失败'
    }
  }
})
