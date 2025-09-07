# 用户管理权限系统

基于 Nuxt 3 + Prisma + Element Plus 构建的现代化用户管理权限系统。

## 功能特性

- 👥 **用户管理** - 完整的用户账户管理，支持用户注册、登录、权限控制
- 🏢 **部门管理** - 层级化部门管理，支持部门树形结构和权限分配
- 🔐 **角色权限** - 灵活的角色权限系统，支持细粒度权限控制
- 📝 **文章管理** - 完整的文章发布流程，支持草稿、审核、发布
- 📂 **分类管理** - 层级化分类管理，支持无限级分类结构
- ⚡ **现代化技术** - 基于 Nuxt 3、Prisma、Element Plus 等现代技术栈

## 技术栈

- **前端**: Nuxt 3, Vue 3, Element Plus, Pinia
- **后端**: Nuxt 3 Server API
- **数据库**: SQLite (可切换到 PostgreSQL/MySQL)
- **ORM**: Prisma
- **认证**: JWT
- **密码加密**: bcryptjs

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 初始化数据库

```bash
# 生成 Prisma 客户端
npm run dev:generate

# 推送数据库结构
npm run dev:push

# 初始化默认数据
npm run dev:seed
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:8080

## 默认账户

- **管理员**: admin / 123456
- **编辑**: editor / 123456

## 数据库结构

### 核心表

- `users` - 用户表
- `departments` - 部门表
- `roles` - 角色表
- `permissions` - 权限表
- `articles` - 文章表
- `categories` - 分类表

### 关联表

- `user_departments` - 用户部门关联
- `user_roles` - 用户角色关联
- `department_roles` - 部门角色关联
- `role_permissions` - 角色权限关联
- `article_reviews` - 文章审核记录

## API 接口

### 认证接口

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/profile` - 获取用户信息

### 用户管理

- `GET /api/users` - 获取用户列表
- `POST /api/users` - 创建用户
- `GET /api/users/:id` - 获取用户详情
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户

### 部门管理

- `GET /api/departments` - 获取部门列表
- `POST /api/departments` - 创建部门
- `GET /api/departments/:id` - 获取部门详情
- `PUT /api/departments/:id` - 更新部门
- `DELETE /api/departments/:id` - 删除部门

### 角色管理

- `GET /api/roles` - 获取角色列表
- `POST /api/roles` - 创建角色
- `GET /api/roles/:id` - 获取角色详情
- `PUT /api/roles/:id` - 更新角色
- `DELETE /api/roles/:id` - 删除角色

### 权限管理

- `GET /api/permissions` - 获取权限列表
- `POST /api/permissions` - 创建权限
- `GET /api/permissions/:id` - 获取权限详情
- `PUT /api/permissions/:id` - 更新权限
- `DELETE /api/permissions/:id` - 删除权限

### 文章管理

- `GET /api/articles` - 获取文章列表
- `POST /api/articles` - 创建文章
- `GET /api/articles/:id` - 获取文章详情
- `PUT /api/articles/:id` - 更新文章
- `DELETE /api/articles/:id` - 删除文章
- `POST /api/articles/review` - 文章审核

### 分类管理

- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 创建分类
- `GET /api/categories/:id` - 获取分类详情
- `PUT /api/categories/:id` - 更新分类
- `DELETE /api/categories/:id` - 删除分类

## 权限系统

系统采用基于角色的访问控制（RBAC）模型：

1. **用户** 可以属于多个 **部门**
2. **用户** 可以拥有多个 **角色**
3. **部门** 可以分配多个 **角色**
4. **角色** 可以拥有多个 **权限**

权限检查通过中间件实现，支持：
- 页面级权限控制
- 按钮级权限控制
- API级权限控制

## 开发说明

### 添加新权限

1. 在 `prisma/seed.ts` 中添加权限定义
2. 在 `middleware/permission.ts` 中添加权限映射
3. 在前端组件中使用 `authStore.hasPermission()` 检查权限

### 添加新页面

1. 在 `pages/admin/` 下创建页面文件
2. 使用 `admin` 布局
3. 添加 `auth` 和 `permission` 中间件
4. 在 `layouts/admin.vue` 中添加导航链接

## 部署

### 生产环境构建

```bash
npm run build
npm run generate
```

### 数据库迁移

```bash
npx prisma migrate deploy
```

## 许可证

MIT License
