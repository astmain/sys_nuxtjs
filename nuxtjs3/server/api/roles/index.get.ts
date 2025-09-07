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
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }
    
    if (status !== undefined) {
      where.status = status
    }

    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          userRoles: {
            include: {
              user: true
            }
          },
          departmentRoles: {
            include: {
              department: true
            }
          },
          rolePermissions: {
            include: {
              permission: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.role.count({ where })
    ])

    return {
      success: true,
      data: {
        list: roles,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
    return {
      success: false,
      message: '获取角色列表失败'
    }
  }
})
