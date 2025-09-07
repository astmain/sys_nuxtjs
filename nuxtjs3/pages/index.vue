<template>
  <div>
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        欢迎使用管理系统
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        基于 Nuxt 3 + Prisma + Element Plus 构建的现代化管理系统
      </p>
      
      <div class="flex justify-center space-x-4">
        <NuxtLink
          to="/login"
          class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          登录系统
        </NuxtLink>
        <NuxtLink
          to="/register"
          class="bg-white text-indigo-600 px-6 py-3 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          注册账户
        </NuxtLink>
      </div>
    </div>

    <!-- 功能特性 -->
    <div class="mt-16">
      <h2 class="text-2xl font-bold text-center text-gray-900 mb-8">
        系统功能
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-3xl mb-4">👥</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">用户管理</h3>
          <p class="text-gray-600">完整的用户账户管理，支持用户注册、登录、权限控制</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-3xl mb-4">🏢</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">部门管理</h3>
          <p class="text-gray-600">层级化部门管理，支持部门树形结构和权限分配</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-3xl mb-4">🔐</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">角色权限</h3>
          <p class="text-gray-600">灵活的角色权限系统，支持细粒度权限控制</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-3xl mb-4">📝</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">文章管理</h3>
          <p class="text-gray-600">完整的文章发布流程，支持草稿、审核、发布</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-3xl mb-4">📂</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">分类管理</h3>
          <p class="text-gray-600">层级化分类管理，支持无限级分类结构</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-3xl mb-4">⚡</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">现代化技术</h3>
          <p class="text-gray-600">基于 Nuxt 3、Prisma、Element Plus 等现代技术栈</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 如果用户已登录，重定向到管理后台
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.isAuthenticated) {
    navigateTo('/admin')
  }
})
</script>
