<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer expand-on-hover rail permanent :width="240" class="navigation-drawer">
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
        </v-list>
      </v-navigation-drawer>
      <v-main class="main-content">
        <router-view v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <keep-alive include="BracketsView">
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
}

.v-list-item-title {
  padding-left: 8px;
}

.v-list-item:hover {
  background-color: #34495e !important;
}

.router-link-active {
  color: #00c853 !important;
  background-color: #2c3e50 !important;
}

:deep(.v-navigation-drawer) {
  background-color: #1e2a38;
  color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
}

.main-content {
  margin-left: 56px;
  transition: margin-left 0.2s ease;
  overflow-y: auto;
  height: 100vh;
}

:deep(.v-navigation-drawer--is-hovering) + .v-main,
:deep(.v-navigation-drawer--is-expanded) + .v-main {
  margin-left: 240px;
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
