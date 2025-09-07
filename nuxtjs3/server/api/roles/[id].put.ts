import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    const { name, description, status, permissionIds } = body

    if (!id) {
      return {
        success: false,
        message: '角色ID不能为空'
      }
    }

    // 检查角色是否存在
    const existingRole = await prisma.role.findUnique({
      where: { id }
    })

    if (!existingRole) {
      return {
        success: false,
        message: '角色不存在'
      }
    }

    // 检查角色名称是否被其他角色使用
    if (name) {
      const conflictRole = await prisma.role.findFirst({
        where: {
          id: { not: id },
          name
        }
      })

      if (conflictRole) {
        return {
          success: false,
          message: '角色名称已被其他角色使用'
        }
      }
    }

    // 准备更新数据
    const updateData: any = {}
    if (name) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status

    // 更新角色信息
    const role = await prisma.role.update({
      where: { id },
      data: updateData
    })

    // 更新角色权限关联
    if (permissionIds !== undefined) {
      // 删除现有关联
      await prisma.rolePermission.deleteMany({
        where: { roleId: id }
      })
      
      // 创建新关联
      if (permissionIds.length > 0) {
        await prisma.rolePermission.createMany({
          data: permissionIds.map((permissionId: number) => ({
            roleId: id,
            permissionId
          }))
        })
      }
    }

    return {
      success: true,
      message: '角色更新成功',
      data: role
    }
  } catch (error) {
    console.error('更新角色失败:', error)
    return {
      success: false,
      message: '更新角色失败'
    }
  }
})
