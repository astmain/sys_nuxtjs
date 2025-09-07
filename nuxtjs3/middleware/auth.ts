export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // 需要认证的路由
  const protectedRoutes = ['/admin', '/dashboard', '/users', '/departments', '/roles', '/permissions', '/articles', '/categories']
  
  const isProtectedRoute = protectedRoutes.some(route => to.path.startsWith(route))

  if (isProtectedRoute && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // 已登录用户访问登录页面，重定向到首页
  if (to.path === '/login' && authStore.isAuthenticated) {
    return navigateTo('/')
  }
})
