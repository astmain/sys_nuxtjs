import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const search = query.search as string || ''
    const status = query.status ? Number(query.status) : undefined
    const categoryId = query.categoryId ? Number(query.categoryId) : undefined
    const authorId = query.authorId ? Number(query.authorId) : undefined

    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
        { content: { contains: search } }
      ]
    }
    
    if (status !== undefined) {
      where.status = status
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (authorId) {
      where.authorId = authorId
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              realName: true,
              avatar: true
            }
          },
          category: true,
          reviews: {
            include: {
              reviewer: {
                select: {
                  id: true,
                  username: true,
                  realName: true
                }
              }
            }
          }
        },
        orderBy: [
          { isTop: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.article.count({ where })
    ])

    return {
      success: true,
      data: {
        list: articles,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return {
      success: false,
      message: '获取文章列表失败'
    }
  }
})
