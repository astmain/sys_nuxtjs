import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const search = query.search as string || ''
    const status = query.status ? Number(query.status) : undefined
    const type = query.type as string || ''
    const parentId = query.parentId ? Number(query.parentId) : undefined

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
        { description: { contains: search } }
      ]
    }
    
    if (status !== undefined) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    if (parentId !== undefined) {
      where.parentId = parentId
    }

    const [permissions, total] = await Promise.all([
      prisma.permission.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          parent: true,
          children: true,
          rolePermissions: {
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
      prisma.permission.count({ where })
    ])

    return {
      success: true,
      data: {
        list: permissions,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('获取权限列表失败:', error)
    return {
      success: false,
      message: '获取权限列表失败'
    }
  }
})
