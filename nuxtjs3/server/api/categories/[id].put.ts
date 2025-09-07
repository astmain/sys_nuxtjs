import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    const { name, description, parentId, level, sort, status } = body

    if (!id) {
      return {
        success: false,
        message: '分类ID不能为空'
      }
    }

    // 检查分类是否存在
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return {
        success: false,
        message: '分类不存在'
      }
    }

    // 检查分类名称是否被其他分类使用
    if (name) {
      const conflictCategory = await prisma.category.findFirst({
        where: {
          id: { not: id },
          name
        }
      })

      if (conflictCategory) {
        return {
          success: false,
          message: '分类名称已被其他分类使用'
        }
      }
    }

    // 计算层级
    let calculatedLevel = existingCategory.level
    if (parentId !== undefined) {
      if (parentId) {
        const parent = await prisma.category.findUnique({
          where: { id: parentId }
        })
        if (parent) {
          calculatedLevel = parent.level + 1
        }
      } else {
        calculatedLevel = 1
      }
    }

    // 准备更新数据
    const updateData: any = {}
    if (name) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (parentId !== undefined) updateData.parentId = parentId
    if (level !== undefined) updateData.level = level || calculatedLevel
    if (sort !== undefined) updateData.sort = sort
    if (status !== undefined) updateData.status = status

    // 更新分类信息
    const category = await prisma.category.update({
      where: { id },
      data: updateData
    })

    return {
      success: true,
      message: '分类更新成功',
      data: category
    }
  } catch (error) {
    console.error('更新分类失败:', error)
    return {
      success: false,
      message: '更新分类失败'
    }
  }
})
