import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, code, description, type, parentId, level, sort } = body

    // 验证必填字段
    if (!name || !code || !type) {
      return {
        success: false,
        message: '权限名称、代码和类型不能为空'
      }
    }

    // 检查权限名称和代码是否已存在
    const existingPermission = await prisma.permission.findFirst({
      where: {
        OR: [
          { name },
          { code }
        ]
      }
    })

    if (existingPermission) {
      return {
        success: false,
        message: '权限名称或代码已存在'
      }
    }

    // 计算层级
    let calculatedLevel = 1
    if (parentId) {
      const parent = await prisma.permission.findUnique({
        where: { id: parentId }
      })
      if (parent) {
        calculatedLevel = parent.level + 1
      }
    }

    // 创建权限
    const permission = await prisma.permission.create({
      data: {
        name,
        code,
        description,
        type,
        parentId,
        level: level || calculatedLevel,
        sort: sort || 0
      }
    })

    return {
      success: true,
      message: '权限创建成功',
      data: permission
    }
  } catch (error) {
    console.error('创建权限失败:', error)
    return {
      success: false,
      message: '创建权限失败'
    }
  }
})
