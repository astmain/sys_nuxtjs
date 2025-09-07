import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return {
        success: false,
        message: '用户ID不能为空'
      }
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        userDepartments: {
          include: {
            department: true
          }
        },
        userRoles: {
          include: {
            role: true
          }
        }
      }
    })

    if (!user) {
      return {
        success: false,
        message: '用户不存在'
      }
    }

    return {
      success: true,
      data: user
    }
  } catch (error) {
    console.error('获取用户详情失败:', error)
    return {
      success: false,
      message: '获取用户详情失败'
    }
  }
})
