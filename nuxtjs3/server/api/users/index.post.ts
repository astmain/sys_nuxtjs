import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, email, password, realName, phone, departmentIds, roleIds } = body

    // 验证必填字段
    if (!username || !email || !password) {
      return {
        success: false,
        message: '用户名、邮箱和密码不能为空'
      }
    }

    // 检查用户名和邮箱是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      return {
        success: false,
        message: '用户名或邮箱已存在'
      }
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        realName,
        phone
      }
    })

    // 添加用户部门关联
    if (departmentIds && departmentIds.length > 0) {
      await prisma.userDepartment.createMany({
        data: departmentIds.map((departmentId: number) => ({
          userId: user.id,
          departmentId
        }))
      })
    }

    // 添加用户角色关联
    if (roleIds && roleIds.length > 0) {
      await prisma.userRole.createMany({
        data: roleIds.map((roleId: number) => ({
          userId: user.id,
          roleId
        }))
      })
    }

    return {
      success: true,
      message: '用户创建成功',
      data: user
    }
  } catch (error) {
    console.error('创建用户失败:', error)
    return {
      success: false,
      message: '创建用户失败'
    }
  }
})
