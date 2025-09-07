<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- 侧边栏 -->
    <div class="fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-sm shadow-2xl border-r border-gray-200/50">
      <!-- Logo区域 -->
      <div class="flex h-20 items-center px-6 border-b border-gray-200/50">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span class="text-white text-lg font-bold">M</span>
          </div>
          <div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              管理系统
            </h1>
            <p class="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </div>
      
      <!-- 导航菜单 -->
      <nav class="mt-8 px-4">
        <div class="space-y-2">
          <NuxtLink
            to="/admin"
            class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
            :class="$route.path === '/admin' 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
              : 'text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-105'"
          >
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                 :class="$route.path === '/admin' 
                   ? 'bg-white/20' 
                   : 'bg-blue-100 group-hover:bg-blue-200'">
              <span class="text-lg">📊</span>
            </div>
            <span>仪表盘</span>
            <div v-if="$route.path === '/admin'" class="ml-auto w-2 h-2 bg-white rounded-full"></div>
          </NuxtLink>
          
          <NuxtLink
            to="/admin/users"
            class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
            :class="$route.path.startsWith('/admin/users') 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
              : 'text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-105'"
          >
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                 :class="$route.path.startsWith('/admin/users') 
                   ? 'bg-white/20' 
                   : 'bg-green-100 group-hover:bg-green-200'">
              <span class="text-lg">👥</span>
            </div>
            <span>用户管理</span>
            <div v-if="$route.path.startsWith('/admin/users')" class="ml-auto w-2 h-2 bg-white rounded-full"></div>
          </NuxtLink>
          
          <NuxtLink
            to="/admin/departments"
            class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
            :class="$route.path.startsWith('/admin/departments') 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
              : 'text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-105'"
          >
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                 :class="$route.path.startsWith('/admin/departments') 
                   ? 'bg-white/20' 
                   : 'bg-orange-100 group-hover:bg-orange-200'">
              <span class="text-lg">🏢</span>
            </div>
            <span>部门管理</span>
            <div v-if="$route.path.startsWith('/admin/departments')" class="ml-auto w-2 h-2 bg-white rounded-full"></div>
          </NuxtLink>
          
          <NuxtLink
            to="/admin/roles"
            class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
            :class="$route.path.startsWith('/admin/roles') 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
              : 'text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-105'"
          >
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                 :class="$route.path.startsWith('/admin/roles') 
                   ? 'bg-white/20' 
                   : 'bg-red-100 group-hover:bg-red-200'">
              <span class="text-lg">🔐</span>
            </div>
            <span>角色管理</span>
            <div v-if="$route.path.startsWith('/admin/roles')" class="ml-auto w-2 h-2 bg-white rounded-full"></div>
          </NuxtLink>
          
          <NuxtLink
            to="/admin/permissions"
            class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
            :class="$route.path.startsWith('/admin/permissions') 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
              : 'text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-105'"
          >
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                 :class="$route.path.startsWith('/admin/permissions') 
                   ? 'bg-white/20' 
                   : 'bg-purple-100 group-hover:bg-purple-200'">
              <span class="text-lg">⚙️</span>
            </div>
            <span>权限管理</span>
            <div v-if="$route.path.startsWith('/admin/permissions')" class="ml-auto w-2 h-2 bg-white rounded-full"></div>
          </NuxtLink>
          
          <NuxtLink
            to="/admin/articles"
            class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
            :class="$route.path.startsWith('/admin/articles') 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
              : 'text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-105'"
          >
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                 :class="$route.path.startsWith('/admin/articles') 
                   ? 'bg-white/20' 
                   : 'bg-yellow-100 group-hover:bg-yellow-200'">
              <span class="text-lg">📝</span>
            </div>
            <span>文章管理</span>
            <div v-if="$route.path.startsWith('/admin/articles')" class="ml-auto w-2 h-2 bg-white rounded-full"></div>
          </NuxtLink>
          
          <NuxtLink
            to="/admin/categories"
            class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
            :class="$route.path.startsWith('/admin/categories') 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
              : 'text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-105'"
          >
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200"
                 :class="$route.path.startsWith('/admin/categories') 
                   ? 'bg-white/20' 
                   : 'bg-indigo-100 group-hover:bg-indigo-200'">
              <span class="text-lg">📂</span>
            </div>
            <span>分类管理</span>
            <div v-if="$route.path.startsWith('/admin/categories')" class="ml-auto w-2 h-2 bg-white rounded-full"></div>
          </NuxtLink>
        </div>
      </nav>
    </div>

    <!-- 主内容区域 -->
    <div class="pl-72">
      <!-- 顶部导航栏 -->
      <header class="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div class="px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {{ pageTitle }}
              </h2>
              <p class="text-sm text-gray-500 mt-1">欢迎使用管理系统</p>
            </div>
            
            <div class="flex items-center space-x-4">
              <!-- 主题切换按钮 -->
              <el-button 
                @click="toggleTheme" 
                :type="isDark ? 'primary' : 'default'"
                size="default"
                class="rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <span class="mr-2">{{ isDark ? '🌙' : '☀️' }}</span>
                {{ isDark ? '深色' : '浅色' }}
              </el-button>

              <!-- 用户信息 -->
              <div class="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-semibold">
                    {{ (authStore.user?.realName || authStore.user?.username || 'U').charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ authStore.user?.realName || authStore.user?.username }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">管理员</p>
                </div>
              </div>
              
              <!-- 退出按钮 -->
              <el-button 
                @click="handleLogout" 
                type="danger" 
                size="default"
                class="rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <span class="mr-2">🚪</span>
                退出登录
              </el-button>
            </div>
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="p-8">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/admin': '仪表盘',
    '/admin/users': '用户管理',
    '/admin/departments': '部门管理',
    '/admin/roles': '角色管理',
    '/admin/permissions': '权限管理',
    '/admin/articles': '文章管理',
    '/admin/categories': '分类管理'
  }
  
  const route = useRoute()
  return titles[route.path] || '管理系统'
})

const handleLogout = () => {
  authStore.logout()
  navigateTo('/login')
}

// 初始化认证状态
onMounted(() => {
  authStore.initAuth()
})
</script>
