import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    const { username, email, password, realName, phone, status, departmentIds, roleIds } = body

    if (!id) {
      return {
        success: false,
        message: '用户ID不能为空'
      }
    }

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return {
        success: false,
        message: '用户不存在'
      }
    }

    // 检查用户名和邮箱是否被其他用户使用
    if (username || email) {
      const conflictUser = await prisma.user.findFirst({
        where: {
          id: { not: id },
          OR: [
            ...(username ? [{ username }] : []),
            ...(email ? [{ email }] : [])
          ]
        }
      })

      if (conflictUser) {
        return {
          success: false,
          message: '用户名或邮箱已被其他用户使用'
        }
      }
    }

    // 准备更新数据
    const updateData: any = {}
    if (username) updateData.username = username
    if (email) updateData.email = email
    if (realName !== undefined) updateData.realName = realName
    if (phone !== undefined) updateData.phone = phone
    if (status !== undefined) updateData.status = status
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    // 更新用户信息
    const user = await prisma.user.update({
      where: { id },
      data: updateData
    })

    // 更新用户部门关联
    if (departmentIds !== undefined) {
      // 删除现有关联
      await prisma.userDepartment.deleteMany({
        where: { userId: id }
      })
      
      // 创建新关联
      if (departmentIds.length > 0) {
        await prisma.userDepartment.createMany({
          data: departmentIds.map((departmentId: number) => ({
            userId: id,
            departmentId
          }))
        })
      }
    }

    // 更新用户角色关联
    if (roleIds !== undefined) {
      // 删除现有关联
      await prisma.userRole.deleteMany({
        where: { userId: id }
      })
      
      // 创建新关联
      if (roleIds.length > 0) {
        await prisma.userRole.createMany({
          data: roleIds.map((roleId: number) => ({
            userId: id,
            roleId
          }))
        })
      }
    }

    return {
      success: true,
      message: '用户更新成功',
      data: user
    }
  } catch (error) {
    console.error('更新用户失败:', error)
    return {
      success: false,
      message: '更新用户失败'
    }
  }
})
