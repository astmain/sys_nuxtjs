import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, description, parentId, level, sort } = body

    // 验证必填字段
    if (!name) {
      return {
        success: false,
        message: '分类名称不能为空'
      }
    }

    // 检查分类名称是否已存在
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    })

    if (existingCategory) {
      return {
        success: false,
        message: '分类名称已存在'
      }
    }

    // 计算层级
    let calculatedLevel = 1
    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId }
      })
      if (parent) {
        calculatedLevel = parent.level + 1
      }
    }

    // 创建分类
    const category = await prisma.category.create({
      data: {
        name,
        description,
        parentId,
        level: level || calculatedLevel,
        sort: sort || 0
      }
    })

    return {
      success: true,
      message: '分类创建成功',
      data: category
    }
  } catch (error) {
    console.error('创建分类失败:', error)
    return {
      success: false,
      message: '创建分类失败'
    }
  }
})
