import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, description, parentId, level, sort, roleIds } = body

    // 验证必填字段
    if (!name) {
      return {
        success: false,
        message: '部门名称不能为空'
      }
    }

    // 检查部门名称是否已存在
    const existingDepartment = await prisma.department.findUnique({
      where: { name }
    })

    if (existingDepartment) {
      return {
        success: false,
        message: '部门名称已存在'
      }
    }

    // 计算层级
    let calculatedLevel = 1
    if (parentId) {
      const parent = await prisma.department.findUnique({
        where: { id: parentId }
      })
      if (parent) {
        calculatedLevel = parent.level + 1
      }
    }

    // 创建部门
    const department = await prisma.department.create({
      data: {
        name,
        description,
        parentId,
        level: level || calculatedLevel,
        sort: sort || 0
      }
    })

    // 添加部门角色关联
    if (roleIds && roleIds.length > 0) {
      await prisma.departmentRole.createMany({
        data: roleIds.map((roleId: number) => ({
          departmentId: department.id,
          roleId
        }))
      })
    }

    return {
      success: true,
      message: '部门创建成功',
      data: department
    }
  } catch (error) {
    console.error('创建部门失败:', error)
    return {
      success: false,
      message: '创建部门失败'
    }
  }
})
