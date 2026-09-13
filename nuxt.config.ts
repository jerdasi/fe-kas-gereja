// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', "@pinia/nuxt", "pinia-plugin-persistedstate/nuxt"],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  devServer: {
    host: '0.0.0.0',
    port: 3000 // optional
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-09-13',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
