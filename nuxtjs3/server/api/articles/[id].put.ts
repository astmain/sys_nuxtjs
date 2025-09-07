import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    const { title, content, summary, coverImage, categoryId, status, isTop } = body

    if (!id) {
      return {
        success: false,
        message: '文章ID不能为空'
      }
    }

    // 检查文章是否存在
    const existingArticle = await prisma.article.findUnique({
      where: { id }
    })

    if (!existingArticle) {
      return {
        success: false,
        message: '文章不存在'
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

    // 准备更新数据
    const updateData: any = {}
    if (title) updateData.title = title
    if (content) updateData.content = content
    if (summary !== undefined) updateData.summary = summary
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (categoryId !== undefined) updateData.categoryId = categoryId
    if (status !== undefined) updateData.status = status
    if (isTop !== undefined) updateData.isTop = isTop

    // 如果状态变为已发布，设置发布时间
    if (status === 2 && existingArticle.status !== 2) {
      updateData.publishedAt = new Date()
    }

    // 更新文章信息
    const article = await prisma.article.update({
      where: { id },
      data: updateData
    })

    return {
      success: true,
      message: '文章更新成功',
      data: article
    }
  } catch (error) {
    console.error('更新文章失败:', error)
    return {
      success: false,
      message: '更新文章失败'
    }
  }
})
