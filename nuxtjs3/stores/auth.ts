import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: null as string | null,
    isAuthenticated: false
  }),

  getters: {
    userPermissions: (state) => {
      if (!state.user) return []
      
      const permissions = new Set()
      state.user.userRoles?.forEach((userRole: any) => {
        userRole.role?.rolePermissions?.forEach((rolePermission: any) => {
          permissions.add(rolePermission.permission.code)
        })
      })
      
      return Array.from(permissions)
    },

    userDepartments: (state) => {
      if (!state.user) return []
      return state.user.userDepartments?.map((ud: any) => ud.department) || []
    },

    userRoles: (state) => {
      if (!state.user) return []
      return state.user.userRoles?.map((ur: any) => ur.role) || []
    }
  },

  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        const { data } = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials
        })

        if (data) {
          this.user = data.user
          this.token = data.token
          this.isAuthenticated = true
          
          // 保存到本地存储
          if (process.client) {
            localStorage.setItem('token', data.token)
          }
        }

        return data
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },

    async register(userData: {
      username: string
      email: string
      password: string
      realName?: string
      phone?: string
    }) {
      try {
        const { data } = await $fetch('/api/auth/register', {
          method: 'POST',
          body: userData
        })

        return data
      } catch (error) {
        console.error('注册失败:', error)
        throw error
      }
    },

    async fetchProfile() {
      try {
        if (!this.token) return

        const response = await $fetch('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }) as any

        if (response?.data) {
          this.user = response.data
          this.isAuthenticated = true
        }

        return response?.data
      } catch (error) {
        console.error('获取用户信息失败:', error)
        this.logout()
        throw error
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      if (process.client) {
        localStorage.removeItem('token')
      }
    },

    hasPermission(permission: string) {
      return this.userPermissions.includes(permission)
    },

    hasAnyPermission(permissions: string[]) {
      return permissions.some(permission => this.userPermissions.includes(permission))
    },

    hasAllPermissions(permissions: string[]) {
      return permissions.every(permission => this.userPermissions.includes(permission))
    },

    // 初始化认证状态
    async initAuth() {
      if (process.client) {
        const token = localStorage.getItem('token')
        if (token) {
          this.token = token
          try {
            await this.fetchProfile()
          } catch (error) {
            this.logout()
          }
        }
      }
    }
  }
})
