import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const search = query.search as string || ''
    const status = query.status ? Number(query.status) : undefined

    const where: any = {}
    
    if (search) {
      where.OR = [
        { username: { contains: search } },
        { email: { contains: search } },
        { realName: { contains: search } }
      ]
    }
    
    if (status !== undefined) {
      where.status = status
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          userDepartments: {
            include: {
              department: true
            }
          },
          userRoles: {
            include: {
              role: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count({ where })
    ])

    return {
      success: true,
      data: {
        list: users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return {
      success: false,
      message: '获取用户列表失败'
    }
  }
})
