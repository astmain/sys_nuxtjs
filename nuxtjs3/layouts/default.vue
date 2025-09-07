<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900">
              管理系统
            </NuxtLink>
          </div>
          
          <div class="flex items-center space-x-4">
            <template v-if="authStore.isAuthenticated">
              <span class="text-sm text-gray-700">
                欢迎，{{ authStore.user?.realName || authStore.user?.username }}
              </span>
              <el-button @click="handleLogout" type="danger" size="small">
                退出登录
              </el-button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="text-sm text-gray-700 hover:text-gray-900">
                登录
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  navigateTo('/login')
}

// 初始化认证状态
onMounted(() => {
  authStore.initAuth()
})
</script>