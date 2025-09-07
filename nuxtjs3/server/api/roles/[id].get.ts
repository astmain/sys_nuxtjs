import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return {
        success: false,
        message: '角色ID不能为空'
      }
    }

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            user: true
          }
        },
        departmentRoles: {
          include: {
            department: true
          }
        },
        rolePermissions: {
          include: {
            permission: true
          }
        }
      }
    })

    if (!role) {
      return {
        success: false,
        message: '角色不存在'
      }
    }

    return {
      success: true,
      data: role
    }
  } catch (error) {
    console.error('获取角色详情失败:', error)
    return {
      success: false,
      message: '获取角色详情失败'
    }
  }
})
