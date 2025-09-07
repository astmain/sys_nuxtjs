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

    // 检查部门是否存在
    const department = await prisma.department.findUnique({
      where: { id }
    })

    if (!department) {
      return {
        success: false,
        message: '部门不存在'
      }
    }

    // 检查是否有子部门
    const childrenCount = await prisma.department.count({
      where: { parentId: id }
    })

    if (childrenCount > 0) {
      return {
        success: false,
        message: '该部门下还有子部门，无法删除'
      }
    }

    // 检查是否有用户关联
    const userCount = await prisma.userDepartment.count({
      where: { departmentId: id }
    })

    if (userCount > 0) {
      return {
        success: false,
        message: '该部门下还有用户，无法删除'
      }
    }

    // 删除部门（级联删除相关数据）
    await prisma.department.delete({
      where: { id }
    })

    return {
      success: true,
      message: '部门删除成功'
    }
  } catch (error) {
    console.error('删除部门失败:', error)
    return {
      success: false,
      message: '删除部门失败'
    }
  }
})
