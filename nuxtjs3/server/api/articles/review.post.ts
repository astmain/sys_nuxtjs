import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { articleId, reviewerId, status, comment } = body

    // 验证必填字段
    if (!articleId || !reviewerId || !status) {
      return {
        success: false,
        message: '文章ID、审核人ID和审核状态不能为空'
      }
    }

    // 检查文章是否存在
    const article = await prisma.article.findUnique({
      where: { id: articleId }
    })

    if (!article) {
      return {
        success: false,
        message: '文章不存在'
      }
    }

    // 检查审核人是否存在
    const reviewer = await prisma.user.findUnique({
      where: { id: reviewerId }
    })

    if (!reviewer) {
      return {
        success: false,
        message: '审核人不存在'
      }
    }

    // 创建审核记录
    const review = await prisma.articleReview.create({
      data: {
        articleId,
        reviewerId,
        status,
        comment
      }
    })

    // 更新文章状态
    const articleStatus = status === 1 ? 2 : 3 // 1:通过->2:已发布, 2:拒绝->3:已拒绝
    await prisma.article.update({
      where: { id: articleId },
      data: { 
        status: articleStatus,
        publishedAt: status === 1 ? new Date() : null
      }
    })

    return {
      success: true,
      message: '审核完成',
      data: review
    }
  } catch (error) {
    console.error('文章审核失败:', error)
    return {
      success: false,
      message: '文章审核失败'
    }
  }
})
