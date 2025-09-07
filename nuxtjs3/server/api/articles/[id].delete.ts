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

    // 检查文章是否存在
    const article = await prisma.article.findUnique({
      where: { id }
    })

    if (!article) {
      return {
        success: false,
        message: '文章不存在'
      }
    }

    // 删除文章（级联删除相关数据）
    await prisma.article.delete({
      where: { id }
    })

    return {
      success: true,
      message: '文章删除成功'
    }
  } catch (error) {
    console.error('删除文章失败:', error)
    return {
      success: false,
      message: '删除文章失败'
    }
  }
})
