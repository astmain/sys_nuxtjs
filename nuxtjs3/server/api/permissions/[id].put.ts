import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    const { name, code, description, type, parentId, level, sort, status } = body

    if (!id) {
      return {
        success: false,
        message: '权限ID不能为空'
      }
    }

    // 检查权限是否存在
    const existingPermission = await prisma.permission.findUnique({
      where: { id }
    })

    if (!existingPermission) {
      return {
        success: false,
        message: '权限不存在'
      }
    }

    // 检查权限名称和代码是否被其他权限使用
    if (name || code) {
      const conflictPermission = await prisma.permission.findFirst({
        where: {
          id: { not: id },
          OR: [
            ...(name ? [{ name }] : []),
            ...(code ? [{ code }] : [])
          ]
        }
      })

      if (conflictPermission) {
        return {
          success: false,
          message: '权限名称或代码已被其他权限使用'
        }
      }
    }

    // 计算层级
    let calculatedLevel = existingPermission.level
    if (parentId !== undefined) {
      if (parentId) {
        const parent = await prisma.permission.findUnique({
          where: { id: parentId }
        })
        if (parent) {
          calculatedLevel = parent.level + 1
        }
      } else {
        calculatedLevel = 1
      }
    }

    // 准备更新数据
    const updateData: any = {}
    if (name) updateData.name = name
    if (code) updateData.code = code
    if (description !== undefined) updateData.description = description
    if (type) updateData.type = type
    if (parentId !== undefined) updateData.parentId = parentId
    if (level !== undefined) updateData.level = level || calculatedLevel
    if (sort !== undefined) updateData.sort = sort
    if (status !== undefined) updateData.status = status

    // 更新权限信息
    const permission = await prisma.permission.update({
      where: { id },
      data: updateData
    })

    return {
      success: true,
      message: '权限更新成功',
      data: permission
    }
  } catch (error) {
    console.error('更新权限失败:', error)
    return {
      success: false,
      message: '更新权限失败'
    }
  }
})
