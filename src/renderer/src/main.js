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
    defaultTheme: 'light', // You can change this or load from localStorage later
    themes: {
      dark: {
        dark: true, // Crucial: Identifies this as a dark theme
        colors: {
          background: '#1e2a38', // Main background for app
          surface: '#1e2a38', // Background for components like cards, dialogs
          primary: '#00c853', // Primary action color
          secondary: '#b0bec5', // Secondary action color
          error: '#f44336',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#ff9800',
          // Text & Icon colors on top of theme colors
          'on-background': '#FFFFFF',
          'on-surface': '#FFFFFF',
          'on-primary': '#000000', // Text on primary buttons
          'on-secondary': '#000000',
          'on-error': '#FFFFFF',
          'on-info': '#FFFFFF',
          'on-success': '#FFFFFF',
          'on-warning': '#000000',
          // You can add custom named colors too
          'app-bar': '#1e2a38', // Example if app bar needs a specific dark color
          'navigation-drawer': '#1e2a38', // Example
          'input-background': '#1e2a38',
          'input-text': '#FFFFFF',
          'input-label': 'rgba(255, 255, 255, 0.7)',
          'input-border': 'rgba(255, 255, 255, 0.2)',
          'hover-item': '#34495e',
          'active-item': '#00c853', // For active nav links text/icon
          'active-item-bg': '#1e2a38' // For active nav links background
        }
      },
      light: {
        dark: false, // Crucial: Identifies this as a light theme
        colors: {
          background: '#FFFFFF',
          surface: '#F5F5F5', // Slightly off-white for cards
          primary: '#00c853', // Consider if a darker shade of green is better for light
          secondary: '#607D8B', // Example: Slate Gray
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
          'input-background': '#E0E0E0', // Light grey for inputs
          'input-text': '#000000',
          'input-label': 'rgba(0, 0, 0, 0.6)',
          'input-border': 'rgba(0, 0, 0, 0.2)',
          'hover-item': '#E0E0E0',
          'active-item': '#00c853',
          'active-item-bg': '#D1FAD7' // Light primary variant for active bg
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
