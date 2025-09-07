import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const search = query.search as string || ''
    const status = query.status ? Number(query.status) : undefined
    const parentId = query.parentId ? Number(query.parentId) : undefined

    const where: any = {}
    
    if (search) {
      where.name = { contains: search }
    }
    
    if (status !== undefined) {
      where.status = status
    }

    if (parentId !== undefined) {
      where.parentId = parentId
    }

    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          parent: true,
          children: true,
          userDepartments: {
            include: {
              user: true
            }
          },
          departmentRoles: {
            include: {
              role: true
            }
          }
        },
        orderBy: [
          { level: 'asc' },
          { sort: 'asc' }
        ]
      }),
      prisma.department.count({ where })
    ])

    return {
      success: true,
      data: {
        list: departments,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('获取部门列表失败:', error)
    return {
      success: false,
      message: '获取部门列表失败'
    }
  }
})
