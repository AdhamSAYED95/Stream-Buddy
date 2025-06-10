<script setup></script>

<template>
  <div class="home-container">
    <h1 class="welcome-message">Welcome to Stream Buddy</h1>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  color: rgb(var(--v-theme-on-surface)); /* Changed from #ffffff */
  padding: 8px;
}

.welcome-message {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
}
</style>
