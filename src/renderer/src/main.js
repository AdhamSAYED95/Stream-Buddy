import App from './App.vue'

import { createApp } from 'vue'
import router from './router/index.js'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { VDateInput } from 'vuetify/labs/VDateInput'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#1e2a38',
          surface: '#1e2a38',
          primary: '#00c853',
          secondary: '#b0bec5',
          error: '#f44336',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#ff9800',

          'on-background': '#FFFFFF',
          'on-surface': '#FFFFFF',
          'on-primary': '#000000',
          'on-secondary': '#000000',
          'on-error': '#FFFFFF',
          'on-info': '#FFFFFF',
          'on-success': '#FFFFFF',
          'on-warning': '#000000',

          'app-bar': '#1e2a38',
          'navigation-drawer': '#1e2a38',
          'input-background': '#1e2a38',
          'input-text': '#FFFFFF',
          'input-label': 'rgba(255, 255, 255, 0.7)',
          'input-border': 'rgba(255, 255, 255, 0.2)',
          'hover-item': '#34495e',
          'active-item': '#00c853',
          'active-item-bg': '#1e2a38'
        }
      },
      light: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#F5F5F5',
          primary: '#00c853',
          secondary: '#607D8B',
          error: '#B00020',
          info: '#1976D2',
          success: '#388E3C',
          warning: '#FBC02D',
          'on-background': '#000000',
          'on-surface': '#000000',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          'on-error': '#FFFFFF',
          'on-info': '#FFFFFF',
          'on-success': '#FFFFFF',
          'on-warning': '#000000',
          'app-bar': '#F5F5F5',
          'navigation-drawer': '#FFFFFF',
          'input-background': '#E0E0E0',
          'input-text': '#000000',
          'input-label': 'rgba(0, 0, 0, 0.6)',
          'input-border': 'rgba(0, 0, 0, 0.2)',
          'hover-item': '#E0E0E0',
          'active-item': '#00c853',
          'active-item-bg': '#D1FAD7'
        }
      }
    }
  },
  components: {
    VDateInput
  },
  directives,
  icons: {
    defaultSet: 'mdi'
  }
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.config.errorHandler = (event) => {
  if (window.electronLogger) {
    window.electronLogger.sendError({
      type: 'Window Error',
      message: event.message,
      error: event.error?.stack || event.error?.toString(),
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
  }
}

app.use(vuetify).use(router).use(pinia).mount('#app')
