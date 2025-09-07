import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return {
        success: false,
        message: '权限ID不能为空'
      }
    }

    const permission = await prisma.permission.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        rolePermissions: {
          include: {
            role: true
          }
        }
      }
    })

    if (!permission) {
      return {
        success: false,
        message: '权限不存在'
      }
    }

    return {
      success: true,
      data: permission
    }
  } catch (error) {
    console.error('获取权限详情失败:', error)
    return {
      success: false,
      message: '获取权限详情失败'
    }
  }
})
