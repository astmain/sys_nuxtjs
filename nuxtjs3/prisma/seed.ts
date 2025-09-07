import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化数据...')

  // 创建默认权限 - 使用 upsert 避免重复创建
  const permissionData = [
    {
      name: '用户管理',
      code: 'user:read',
      type: 'menu',
      description: '查看用户列表'
    },
    {
      name: '创建用户',
      code: 'user:create',
      type: 'button',
      description: '创建新用户'
    },
    {
      name: '编辑用户',
      code: 'user:update',
      type: 'button',
      description: '编辑用户信息'
    },
    {
      name: '删除用户',
      code: 'user:delete',
      type: 'button',
      description: '删除用户'
    },
    {
      name: '部门管理',
      code: 'department:read',
      type: 'menu',
      description: '查看部门列表'
    },
    {
      name: '角色管理',
      code: 'role:read',
      type: 'menu',
      description: '查看角色列表'
    },
    {
      name: '权限管理',
      code: 'permission:read',
      type: 'menu',
      description: '查看权限列表'
    },
    {
      name: '文章管理',
      code: 'article:read',
      type: 'menu',
      description: '查看文章列表'
    },
    {
      name: '分类管理',
      code: 'category:read',
      type: 'menu',
      description: '查看分类列表'
    }
  ]

  const permissions = await Promise.all(
    permissionData.map(data =>
      prisma.permission.upsert({
        where: { code: data.code },
        update: data,
        create: data
      })
    )
  )

  console.log('权限创建完成')

  // 创建默认角色 - 使用 upsert 避免重复创建
  const adminRole = await prisma.role.upsert({
    where: { name: '超级管理员' },
    update: { description: '拥有所有权限' },
    create: {
      name: '超级管理员',
      description: '拥有所有权限'
    }
  })

  const editorRole = await prisma.role.upsert({
    where: { name: '编辑' },
    update: { description: '文章编辑权限' },
    create: {
      name: '编辑',
      description: '文章编辑权限'
    }
  })

  console.log('角色创建完成')

  // 为超级管理员分配所有权限 - 先删除现有权限再重新分配
  await prisma.rolePermission.deleteMany({
    where: { roleId: adminRole.id }
  })
  await prisma.rolePermission.createMany({
    data: permissions.map(permission => ({
      roleId: adminRole.id,
      permissionId: permission.id
    }))
  })

  // 为编辑分配文章相关权限 - 先删除现有权限再重新分配
  const articlePermissions = permissions.filter(p => 
    p.code.includes('article') || p.code.includes('category')
  )
  await prisma.rolePermission.deleteMany({
    where: { roleId: editorRole.id }
  })
  await prisma.rolePermission.createMany({
    data: articlePermissions.map(permission => ({
      roleId: editorRole.id,
      permissionId: permission.id
    }))
  })

  console.log('角色权限分配完成')

  // 创建默认部门 - 使用 upsert 避免重复创建
  const techDept = await prisma.department.upsert({
    where: { name: '技术部' },
    update: { description: '负责技术开发' },
    create: {
      name: '技术部',
      description: '负责技术开发'
    }
  })

  const contentDept = await prisma.department.upsert({
    where: { name: '内容部' },
    update: { description: '负责内容创作' },
    create: {
      name: '内容部',
      description: '负责内容创作'
    }
  })

  console.log('部门创建完成')

  // 为部门分配角色 - 先删除现有关系再重新分配
  await prisma.departmentRole.deleteMany({
    where: {
      OR: [
        { departmentId: techDept.id },
        { departmentId: contentDept.id }
      ]
    }
  })
  await prisma.departmentRole.createMany({
    data: [
      { departmentId: techDept.id, roleId: adminRole.id },
      { departmentId: contentDept.id, roleId: editorRole.id }
    ]
  })

  console.log('部门角色分配完成')

  // 创建默认用户 - 使用 upsert 避免重复创建
  const hashedPassword = await bcrypt.hash('123456', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      email: 'admin@example.com',
      password: hashedPassword,
      realName: '系统管理员',
      phone: '13800138000'
    },
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      realName: '系统管理员',
      phone: '13800138000'
    }
  })

  const editorUser = await prisma.user.upsert({
    where: { username: 'editor' },
    update: {
      email: 'editor@example.com',
      password: hashedPassword,
      realName: '内容编辑',
      phone: '13800138001'
    },
    create: {
      username: 'editor',
      email: 'editor@example.com',
      password: hashedPassword,
      realName: '内容编辑',
      phone: '13800138001'
    }
  })

  console.log('用户创建完成')

  // 为用户分配角色 - 先删除现有关系再重新分配
  await prisma.userRole.deleteMany({
    where: {
      OR: [
        { userId: adminUser.id },
        { userId: editorUser.id }
      ]
    }
  })
  await prisma.userRole.createMany({
    data: [
      { userId: adminUser.id, roleId: adminRole.id },
      { userId: editorUser.id, roleId: editorRole.id }
    ]
  })

  // 为用户分配部门 - 先删除现有关系再重新分配
  await prisma.userDepartment.deleteMany({
    where: {
      OR: [
        { userId: adminUser.id },
        { userId: editorUser.id }
      ]
    }
  })
  await prisma.userDepartment.createMany({
    data: [
      { userId: adminUser.id, departmentId: techDept.id },
      { userId: editorUser.id, departmentId: contentDept.id }
    ]
  })

  console.log('用户角色和部门分配完成')

  // 创建默认分类 - 使用 upsert 避免重复创建
  const techCategory = await prisma.category.upsert({
    where: { name: '技术文章' },
    update: { description: '技术相关文章' },
    create: {
      name: '技术文章',
      description: '技术相关文章'
    }
  })

  const newsCategory = await prisma.category.upsert({
    where: { name: '新闻资讯' },
    update: { description: '新闻资讯类文章' },
    create: {
      name: '新闻资讯',
      description: '新闻资讯类文章'
    }
  })

  console.log('分类创建完成')

  console.log('数据初始化完成！')
  console.log('默认管理员账户: admin / 123456')
  console.log('默认编辑账户: editor / 123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
