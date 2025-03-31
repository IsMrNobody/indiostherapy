import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      themes: {
        light: {
          colors: {
            primary: '#4A5D4C',    // Deep sage green
            secondary: '#D8D0C5',  // Warm beige
            accent: '#8B7355',     // Earth brown
            surface: '#F5F2EE',    // Light cream
            background: '#FFFFFF'   // White
          }
        }
      }
    }
  })

  app.vueApp.use(vuetify)
})