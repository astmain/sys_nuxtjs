export const useTheme = () => {
  const isDark = ref(false)

  // 从本地存储读取主题设置
  const loadTheme = () => {
    if (process.client) {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        isDark.value = savedTheme === 'dark'
      } else {
        // 检测系统主题偏好
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      applyTheme()
    }
  }

  // 应用主题
  const applyTheme = () => {
    if (process.client) {
      const html = document.documentElement
      if (isDark.value) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
  }

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (process.client) {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
    applyTheme()
  }

  // 设置主题
  const setTheme = (theme: 'light' | 'dark') => {
    isDark.value = theme === 'dark'
    if (process.client) {
      localStorage.setItem('theme', theme)
    }
    applyTheme()
  }

  // 监听系统主题变化
  const watchSystemTheme = () => {
    if (process.client) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          isDark.value = e.matches
          applyTheme()
        }
      })
    }
  }

  // 初始化
  onMounted(() => {
    loadTheme()
    watchSystemTheme()
  })

  return {
    isDark: readonly(isDark),
    toggleTheme,
    setTheme,
    applyTheme
  }
}
