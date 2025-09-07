import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')

    if (!token) {
      return {
        success: false,
        message: '未提供认证令牌'
      }
    }

    // 验证JWT token
    const decoded = jwt.verify(token, 'your-secret-key') as any

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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
        message: '用户不存在'
      }
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user

    return {
      success: true,
      data: userWithoutPassword
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return {
      success: false,
      message: '认证失败'
    }
  }
})
