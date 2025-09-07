import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, email, password, realName, phone } = body

    // 验证必填字段
    if (!username || !email || !password) {
      return {
        success: false,
        message: '用户名、邮箱和密码不能为空'
      }
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: '邮箱格式不正确'
      }
    }

    // 验证密码强度
    if (password.length < 6) {
      return {
        success: false,
        message: '密码长度至少6位'
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

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user

    return {
      success: true,
      message: '注册成功',
      data: userWithoutPassword
    }
  } catch (error) {
    console.error('注册失败:', error)
    return {
      success: false,
      message: '注册失败'
    }
  }
})
