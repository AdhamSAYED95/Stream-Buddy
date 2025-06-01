<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue' // 1. Import ref

// 2. Reactive variable to control drawer pinning state
// false = hover behavior, true = permanently expanded
const isDrawerPinned = ref(false)

// 3. Function to toggle the state
function togglePinDrawer() {
  isDrawerPinned.value = !isDrawerPinned.value
}
</script>

<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer
        :expand-on-hover="!isDrawerPinned"
        :rail="!isDrawerPinned"
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

          <v-divider class="my-2"></v-divider>
          <v-list-item
            :prepend-icon="isDrawerPinned ? 'mdi-pin-off-outline' : 'mdi-pin-outline'"
            :title="isDrawerPinned ? 'Switch to hover expand' : 'Pin navigation open'"
            class="pin-toggle-list-item"
            @click="togglePinDrawer"
          >
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main class="main-content">
        <router-view v-slot="{ Component }">
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
  display: block; /* Ensure RouterLink fills the item for clickability */
}

.v-list-item-title {
  padding-left: 8px;
}

.v-list-item:hover {
  background-color: #34495e !important;
}

/* Style for the active route link */
.v-list-item .router-link-active .v-list-item-title, /* Target title specifically for active */
.v-list-item .router-link-active .v-icon {
  /* Target icon if you want to color it too */
  color: #00c853 !important;
}

.v-list-item.router-link-active {
  /* If you want to style the item background itself */
  background-color: #2c3e50 !important;
}

/* Custom class for the pin toggle button for specific styling if needed */
.pin-toggle-list-item {
  cursor: pointer;
}
.pin-toggle-list-item:hover .v-list-item-title,
.pin-toggle-list-item:hover .v-icon {
  color: #ffffff; /* Example hover color for pin toggle text/icon */
}

:deep(.v-navigation-drawer) {
  background-color: #1e2a38;
  color: #ffffff;
  position: fixed !important;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  overflow-y: hidden; /* Consider setting to 'auto' if content might overflow */
}

.main-content {
  margin-left: 56px; /* Default for rail */
  transition: margin-left 0.2s ease;
  min-height: 100vh;
  background-color: #1e2a38;
  padding: 16px;
}

/* These selectors should cover both states:
   - hover over rail: .v-navigation-drawer--is-hovering
   - rail=false (pinned open): .v-navigation-drawer--is-expanded (Vuetify adds this when not rail and open)
*/
:deep(.v-navigation-drawer--is-hovering) + .v-main,
:deep(.v-navigation-drawer--active:not(.v-navigation-drawer--rail)) + .v-main {
  /* More explicit for "pinned" state */
  margin-left: 240px; /* Drawer width */
}

:deep(.v-navigation-drawer--is-hovering) ~ .v-main .fixed-header,
:deep(.v-navigation-drawer--active:not(.v-navigation-drawer--rail)) ~ .v-main .fixed-header {
  left: 256px; /* v-main's margin-left (240px) + padding (16px) */
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
