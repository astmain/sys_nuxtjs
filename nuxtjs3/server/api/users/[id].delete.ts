import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
      return {
        success: false,
        message: '用户ID不能为空'
      }
    }

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return {
        success: false,
        message: '用户不存在'
      }
    }

    // 删除用户（级联删除相关数据）
    await prisma.user.delete({
      where: { id }
    })

    return {
      success: true,
      message: '用户删除成功'
    }
  } catch (error) {
    console.error('删除用户失败:', error)
    return {
      success: false,
      message: '删除用户失败'
    }
  }
})
