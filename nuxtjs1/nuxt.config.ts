// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },





  devServer: {
    port: 8080,
    host: '127.0.0.1',
  },



  modules: [
    '@element-plus/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],
  elementPlus: { /** Options */ }
});
