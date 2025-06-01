<script setup>
import NavigationPanel from './components/NavigationPanel.vue'
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

body {
  background-color: #1e2a38;
  color: #ffffff;
}

.app-dark-theme {
  background-color: #1e2a38;
  color: #ffffff;
}

.v-toolbar,
.v-card {
  background-color: #1e2a38;
  color: #ffffff;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: #ffffff;
}
</style>
