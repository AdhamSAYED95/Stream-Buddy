<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import NavigationPanel from './components/NavigationPanel.vue'
const router = useRouter()

const theme = useTheme()

router.afterEach((to) => {
  localStorage.setItem('lastRoute', to.fullPath)
})

onMounted(() => {
  const lastRoute = localStorage.getItem('lastRoute')
  if (lastRoute && lastRoute !== router.currentRoute.value.fullPath) {
    router.replace(lastRoute)
  }

  const savedTheme = localStorage.getItem('user-theme')
  if (savedTheme) {
    theme.global.name.value = savedTheme
  }
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
