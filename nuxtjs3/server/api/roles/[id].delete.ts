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

    // 检查角色是否存在
    const role = await prisma.role.findUnique({
      where: { id }
    })

    if (!role) {
      return {
        success: false,
        message: '角色不存在'
      }
    }

    // 检查是否有用户关联
    const userCount = await prisma.userRole.count({
      where: { roleId: id }
    })

    if (userCount > 0) {
      return {
        success: false,
        message: '该角色下还有用户，无法删除'
      }
    }

    // 检查是否有部门关联
    const departmentCount = await prisma.departmentRole.count({
      where: { roleId: id }
    })

    if (departmentCount > 0) {
      return {
        success: false,
        message: '该角色下还有部门，无法删除'
      }
    }

    // 删除角色（级联删除相关数据）
    await prisma.role.delete({
      where: { id }
    })

    return {
      success: true,
      message: '角色删除成功'
    }
  } catch (error) {
    console.error('删除角色失败:', error)
    return {
      success: false,
      message: '删除角色失败'
    }
  }
})
