import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    const { name, description, parentId, level, sort, status, roleIds } = body

    if (!id) {
      return {
        success: false,
        message: '部门ID不能为空'
      }
    }

    // 检查部门是否存在
    const existingDepartment = await prisma.department.findUnique({
      where: { id }
    })

    if (!existingDepartment) {
      return {
        success: false,
        message: '部门不存在'
      }
    }

    // 检查部门名称是否被其他部门使用
    if (name) {
      const conflictDepartment = await prisma.department.findFirst({
        where: {
          id: { not: id },
          name
        }
      })

      if (conflictDepartment) {
        return {
          success: false,
          message: '部门名称已被其他部门使用'
        }
      }
    }

    // 计算层级
    let calculatedLevel = existingDepartment.level
    if (parentId !== undefined) {
      if (parentId) {
        const parent = await prisma.department.findUnique({
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
    if (description !== undefined) updateData.description = description
    if (parentId !== undefined) updateData.parentId = parentId
    if (level !== undefined) updateData.level = level || calculatedLevel
    if (sort !== undefined) updateData.sort = sort
    if (status !== undefined) updateData.status = status

    // 更新部门信息
    const department = await prisma.department.update({
      where: { id },
      data: updateData
    })

    // 更新部门角色关联
    if (roleIds !== undefined) {
      // 删除现有关联
      await prisma.departmentRole.deleteMany({
        where: { departmentId: id }
      })
      
      // 创建新关联
      if (roleIds.length > 0) {
        await prisma.departmentRole.createMany({
          data: roleIds.map((roleId: number) => ({
            departmentId: id,
            roleId
          }))
        })
      }
    }

    return {
      success: true,
      message: '部门更新成功',
      data: department
    }
  } catch (error) {
    console.error('更新部门失败:', error)
    return {
      success: false,
      message: '更新部门失败'
    }
  }
})
