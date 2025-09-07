<template>
  <div class="space-y-8">
    <!-- 欢迎区域 -->
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      <div class="relative">
        <h1 class="text-4xl font-bold mb-2">欢迎回来！</h1>
        <p class="text-blue-100 text-lg">管理系统为您提供全面的数据概览</p>
        <div class="mt-4 flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-sm">系统运行正常</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span class="text-sm">数据同步中</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200/50">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">总用户数</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.users }}</p>
              <p class="text-xs text-green-600 mt-1">+12% 较上月</p>
            </div>
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span class="text-2xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      <div class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200/50">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">部门数量</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.departments }}</p>
              <p class="text-xs text-blue-600 mt-1">+3 新增部门</p>
            </div>
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span class="text-2xl">🏢</span>
            </div>
          </div>
        </div>
      </div>

      <div class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200/50">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">文章总数</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.articles }}</p>
              <p class="text-xs text-yellow-600 mt-1">+8 今日发布</p>
            </div>
            <div class="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span class="text-2xl">📝</span>
            </div>
          </div>
        </div>
      </div>

      <div class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200/50">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">分类数量</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.categories }}</p>
              <p class="text-xs text-purple-600 mt-1">+1 新增分类</p>
            </div>
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span class="text-2xl">📂</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 最近活动 -->
      <div class="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
        <div class="p-6 border-b border-gray-200/50">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900">最近活动</h3>
            <el-button size="small" class="rounded-xl">查看全部</el-button>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-6">
            <div v-for="(activity, index) in recentActivities" :key="index" class="flex items-start space-x-4 group">
              <div class="relative">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <span class="text-white text-lg">{{ activity.icon }}</span>
                </div>
                <div v-if="index !== recentActivities.length - 1" class="absolute top-12 left-1/2 w-0.5 h-8 bg-gray-200 transform -translate-x-1/2"></div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {{ activity.description }}
                </p>
                <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
        <div class="p-6 border-b border-gray-200/50">
          <h3 class="text-xl font-bold text-gray-900">快速操作</h3>
        </div>
        <div class="p-6 space-y-4">
          <NuxtLink to="/admin/users" class="flex items-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
              <span class="text-white text-lg">👥</span>
            </div>
            <div>
              <p class="font-medium text-gray-900">用户管理</p>
              <p class="text-sm text-gray-600">管理用户账户</p>
            </div>
          </NuxtLink>
          
          <NuxtLink to="/admin/articles" class="flex items-center p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-100 hover:from-yellow-100 hover:to-orange-200 transition-all duration-200 group">
            <div class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
              <span class="text-white text-lg">📝</span>
            </div>
            <div>
              <p class="font-medium text-gray-900">文章管理</p>
              <p class="text-sm text-gray-600">创建和编辑文章</p>
            </div>
          </NuxtLink>
          
          <NuxtLink to="/admin/departments" class="flex items-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-200 group">
            <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
              <span class="text-white text-lg">🏢</span>
            </div>
            <div>
              <p class="font-medium text-gray-900">部门管理</p>
              <p class="text-sm text-gray-600">组织架构管理</p>
            </div>
          </NuxtLink>
          
          <NuxtLink to="/admin/roles" class="flex items-center p-4 rounded-xl bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-200 group">
            <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
              <span class="text-white text-lg">🔐</span>
            </div>
            <div>
              <p class="font-medium text-gray-900">角色管理</p>
              <p class="text-sm text-gray-600">权限角色配置</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'permission']
})

const stats = ref({
  users: 0,
  departments: 0,
  articles: 0,
  categories: 0
})

const recentActivities = ref([
  {
    icon: '👤',
    description: '新用户注册',
    time: '2分钟前'
  },
  {
    icon: '📝',
    description: '发布了新文章',
    time: '1小时前'
  },
  {
    icon: '🏢',
    description: '创建了新部门',
    time: '3小时前'
  },
  {
    icon: '🔐',
    description: '更新了角色权限',
    time: '1天前'
  }
])

// 获取统计数据
const fetchStats = async () => {
  try {
    // 这里可以调用API获取实际数据
    // const [usersRes, departmentsRes, articlesRes, categoriesRes] = await Promise.all([
    //   $fetch('/api/users?limit=1'),
    //   $fetch('/api/departments?limit=1'),
    //   $fetch('/api/articles?limit=1'),
    //   $fetch('/api/categories?limit=1')
    // ])
    
    // stats.value = {
    //   users: usersRes.data.total,
    //   departments: departmentsRes.data.total,
    //   articles: articlesRes.data.total,
    //   categories: categoriesRes.data.total
    // }
    
    // 模拟数据
    stats.value = {
      users: 156,
      departments: 12,
      articles: 89,
      categories: 8
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(() => {
  fetchStats()
})
</script>
