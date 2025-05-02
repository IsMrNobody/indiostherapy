// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
  build: {
    transpile: ['vuetify'],
  },
  // Agregamos Pinia como módulo para gestión de estado
  modules: [
    '@pinia/nuxt',
  ],
  // Configuración de variables de entorno accesibles en tiempo de ejecución
  runtimeConfig: {
    public: {
      sweetApiUrl: process.env.SWEET_API_URL || 'http://localhost:3000',
      API_GEM: process.env.API_GEM || ''
    }
  },
  app: {
    head: {
      title: 'InDios Therapy - Terapias Corporales y Bienestar',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Centro especializado en terapias corporales y masajes terapéuticos para tu bienestar físico y mental.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})