import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return {
        success: false,
        message: '部门ID不能为空'
      }
    }

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        userDepartments: {
          include: {
            user: true
          }
        },
        departmentRoles: {
          include: {
            role: true
          }
        }
      }
    })

    if (!department) {
      return {
        success: false,
        message: '部门不存在'
      }
    }

    return {
      success: true,
      data: department
    }
  } catch (error) {
    console.error('获取部门详情失败:', error)
    return {
      success: false,
      message: '获取部门详情失败'
    }
  }
})
