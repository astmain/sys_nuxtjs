import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, description, permissionIds } = body

    // 验证必填字段
    if (!name) {
      return {
        success: false,
        message: '角色名称不能为空'
      }
    }

    // 检查角色名称是否已存在
    const existingRole = await prisma.role.findUnique({
      where: { name }
    })

    if (existingRole) {
      return {
        success: false,
        message: '角色名称已存在'
      }
    }

    // 创建角色
    const role = await prisma.role.create({
      data: {
        name,
        description
      }
    })

    // 添加角色权限关联
    if (permissionIds && permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId: number) => ({
          roleId: role.id,
          permissionId
        }))
      })
    }

    return {
      success: true,
      message: '角色创建成功',
      data: role
    }
  } catch (error) {
    console.error('创建角色失败:', error)
    return {
      success: false,
      message: '创建角色失败'
    }
  }
})
