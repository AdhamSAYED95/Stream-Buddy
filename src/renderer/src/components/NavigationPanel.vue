<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'

const navigationMode = ref('mini')

function updateNavigationMode(mode) {
  navigationMode.value = mode
}

onMounted(() => {
  const savedNavMode = localStorage.getItem('navigation-mode')
  if (savedNavMode) {
    navigationMode.value = savedNavMode
  }
})
</script>

<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer
        :expand-on-hover="navigationMode === 'mini'"
        :rail="navigationMode === 'mini'"
        permanent
        :width="240"
        class="navigation-drawer"
      >
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home">
            <RouterLink to="/" class="nav-link">
              <v-list-item-title>Home</v-list-item-title>
            </RouterLink>
          </v-list-item>
          <v-list-item prepend-icon="mdi-tournament">
            <RouterLink to="/TeamsView" class="nav-link">
              <v-list-item-title>Brackets View</v-list-item-title>
            </RouterLink>
          </v-list-item>
          <v-list-item prepend-icon="mdi-account-star">
            <RouterLink to="/PlayerStats" class="nav-link">
              <v-list-item-title>Players Stats</v-list-item-title>
            </RouterLink>
          </v-list-item>
          <v-list-item prepend-icon="mdi-calendar-today">
            <RouterLink to="/TodayMatches" class="nav-link">
              <v-list-item-title>Today's Matches</v-list-item-title>
            </RouterLink>
          </v-list-item>
          <v-list-item prepend-icon="mdi-cog">
            <RouterLink to="/Settings" class="nav-link">
              <v-list-item-title>Settings</v-list-item-title>
            </RouterLink>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main class="main-content">
        <router-view v-slot="{ Component }" @update:navigation-mode="updateNavigationMode">
          <Transition name="fade" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </Transition>
        </router-view>
      </v-main>
    </v-layout>
  </v-app>
</template>

<style scoped>
.nav-link {
  text-decoration: none;
  color: inherit;
  width: 100%;
  display: block;
}

.v-list-item-title {
  padding-left: 8px;
}

.v-list-item:hover {
  background-color: rgb(var(--v-theme-hover-item)) !important;
}

/* Style for the active route link */
.v-list-item .router-link-active .v-list-item-title,
.v-list-item .router-link-active .v-icon {
  color: rgb(var(--v-theme-active-item)) !important;
}

.v-list-item.router-link-active {
  background-color: rgb(var(--v-theme-active-item-bg)) !important;
}

/* Custom class for the pin toggle button for specific styling if needed */
.pin-toggle-list-item {
  cursor: pointer;
}
.pin-toggle-list-item:hover .v-list-item-title,
.pin-toggle-list-item:hover .v-icon {
  color: rgb(var(--v-theme-on-surface));
}

:deep(.v-navigation-drawer) {
  background-color: rgb(var(--v-theme-navigation-drawer));
  color: rgb(var(--v-theme-on-surface));
  position: fixed !important;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  overflow-y: hidden;
}

.main-content {
  margin-left: 56px;
  transition: margin-left 0.2s ease;
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
  padding: 16px;
}

/* Adjust fixed-header and main-content when drawer expands */
:deep(.v-navigation-drawer--is-hovering) + .v-main .fixed-header,
:deep(.v-navigation-drawer--active:not(.v-navigation-drawer--rail)) + .v-main .fixed-header {
  left: calc(240px + 16px); /* Drawer width + padding */
}

:deep(.v-navigation-drawer--is-hovering) ~ .v-main,
:deep(.v-navigation-drawer--active:not(.v-navigation-drawer--rail)) ~ .v-main {
  margin-left: calc(240px + 16px);
}

:deep(.v-main .fixed-header) {
  background-color: rgb(var(--v-theme-app-bar));
  color: rgb(var(--v-theme-on-surface));
}

/* Define the fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
