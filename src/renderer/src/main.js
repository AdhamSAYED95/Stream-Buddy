import App from './App.vue'

import { createApp } from 'vue'
import router from './router/index.js'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          background: '#1e2a38',
          surface: '#2c3e50',
          primary: '#00c853',
          secondary: '#b0bec5',
          error: '#f44336',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#ff9800'
        }
      }
    }
  },
  components,
  directives,
  icons: {
    defaultSet: 'mdi'
  }
})

createApp(App).use(vuetify).use(router).mount('#app')
