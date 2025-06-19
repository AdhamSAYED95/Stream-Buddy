<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAppStateStore, allNavigableViews } from './store/appState'
import NavigationPanel from './components/NavigationPanel.vue'

const router = useRouter()
const theme = useTheme()
const store = useAppStateStore()

window.addEventListener('error', (event) => {
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
})

window.addEventListener('unhandledrejection', (event) => {
  if (window.electronLogger) {
    window.electronLogger.sendRejection({
      reason: event.reason?.stack || event.reason?.toString() || 'Unknown rejection'
    })
  }
})

router.afterEach((to) => {
  localStorage.setItem('lastRoute', to.fullPath)
})

onMounted(async () => {
  const lastRoute = localStorage.getItem('lastRoute')
  if (lastRoute && lastRoute !== router.currentRoute.value.fullPath) {
    router.replace(lastRoute)
  }

  store.resetUpdateState()

  await store.initializeStore()

  await store.initializeJsonSavePath()
  store.initializeViewVisibility(allNavigableViews)

  await store.getAppVersion()

  window.api.onUpdateStatus((status, info) => {
    store.setUpdateStatus(status, info)
  })

  watch(
    () => store.isDarkMode,
    (newValue) => {
      theme.global.name.value = newValue ? 'dark' : 'light'
    },
    { immediate: true }
  )
})
</script>

<template>
  <NavigationPanel />
</template>

<style>
html,
body,
#app,
.v-application {
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: rgb(var(--v-theme-on-background));
}
</style>
