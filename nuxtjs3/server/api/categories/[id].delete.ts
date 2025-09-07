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

    // 检查分类是否存在
    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      return {
        success: false,
        message: '分类不存在'
      }
    }

    // 检查是否有子分类
    const childrenCount = await prisma.category.count({
      where: { parentId: id }
    })

    if (childrenCount > 0) {
      return {
        success: false,
        message: '该分类下还有子分类，无法删除'
      }
    }

    // 检查是否有文章关联
    const articleCount = await prisma.article.count({
      where: { categoryId: id }
    })

    if (articleCount > 0) {
      return {
        success: false,
        message: '该分类下还有文章，无法删除'
      }
    }

    // 删除分类（级联删除相关数据）
    await prisma.category.delete({
      where: { id }
    })

    return {
      success: true,
      message: '分类删除成功'
    }
  } catch (error) {
    console.error('删除分类失败:', error)
    return {
      success: false,
      message: '删除分类失败'
    }
  }
})
