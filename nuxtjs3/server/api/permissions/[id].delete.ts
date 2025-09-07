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

    // 检查权限是否存在
    const permission = await prisma.permission.findUnique({
      where: { id }
    })

    if (!permission) {
      return {
        success: false,
        message: '权限不存在'
      }
    }

    // 检查是否有子权限
    const childrenCount = await prisma.permission.count({
      where: { parentId: id }
    })

    if (childrenCount > 0) {
      return {
        success: false,
        message: '该权限下还有子权限，无法删除'
      }
    }

    // 检查是否有角色关联
    const roleCount = await prisma.rolePermission.count({
      where: { permissionId: id }
    })

    if (roleCount > 0) {
      return {
        success: false,
        message: '该权限下还有角色，无法删除'
      }
    }

    // 删除权限（级联删除相关数据）
    await prisma.permission.delete({
      where: { id }
    })

    return {
      success: true,
      message: '权限删除成功'
    }
  } catch (error) {
    console.error('删除权限失败:', error)
    return {
      success: false,
      message: '删除权限失败'
    }
  }
})
