import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

    // 验证必填字段
    if (!username || !password) {
      return {
        success: false,
        message: '用户名和密码不能为空'
      }
    }

    // 查找用户
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ],
        status: 1 // 只允许正常状态的用户登录
      },
      include: {
        userDepartments: {
          include: {
            department: true
          }
        },
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!user) {
      return {
        success: false,
        message: '用户名或密码错误'
      }
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return {
        success: false,
        message: '用户名或密码错误'
      }
    }

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username,
        email: user.email
      },
      'your-secret-key', // 在生产环境中应该使用环境变量
      { expiresIn: '24h' }
    )

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user

    return {
      success: true,
      message: '登录成功',
      data: {
        user: userWithoutPassword,
        token
      }
    }
  } catch (error) {
    console.error('登录失败:', error)
    return {
      success: false,
      message: '登录失败'
    }
  }
})
