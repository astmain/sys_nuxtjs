export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // 权限检查映射
  const permissionMap: Record<string, string[]> = {
    '/admin/users': ['user:read'],
    '/admin/departments': ['department:read'],
    '/admin/roles': ['role:read'],
    '/admin/permissions': ['permission:read'],
    '/admin/articles': ['article:read'],
    '/admin/categories': ['category:read']
  }

  const requiredPermissions = permissionMap[to.path]
  
  if (requiredPermissions && !authStore.hasAnyPermission(requiredPermissions)) {
    throw createError({
      statusCode: 403,
      statusMessage: '没有权限访问此页面'
    })
  }
})
