import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { title, content, summary, coverImage, categoryId, authorId, status } = body

    // 验证必填字段
    if (!title || !content || !authorId) {
      return {
        success: false,
        message: '标题、内容和作者不能为空'
      }
    }

    // 检查作者是否存在
    const author = await prisma.user.findUnique({
      where: { id: authorId }
    })

    if (!author) {
      return {
        success: false,
        message: '作者不存在'
      }
    }

    // 检查分类是否存在
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      })

      if (!category) {
        return {
          success: false,
          message: '分类不存在'
        }
      }
    }

    // 创建文章
    const article = await prisma.article.create({
      data: {
        title,
        content,
        summary,
        coverImage,
        categoryId,
        authorId,
        status: status || 0 // 默认为草稿
      }
    })

    return {
      success: true,
      message: '文章创建成功',
      data: article
    }
  } catch (error) {
    console.error('创建文章失败:', error)
    return {
      success: false,
      message: '创建文章失败'
    }
  }
})
