<script setup>
import { RouterLink } from 'vue-router'
import { useAppStateStore } from '../store/appState'
import { allNavigableViews } from '../constants/constants'

const store = useAppStateStore()
</script>

<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer
        :expand-on-hover="store.isNavigationMini"
        :rail="store.isNavigationMini"
        permanent
        :width="240"
        class="navigation-drawer"
      >
        <v-list density="compact" nav class="nav-list">
          <template v-for="item in allNavigableViews" :key="item.name">
            <RouterLink v-if="store.viewVisibility[item.name]" :to="item.path" class="nav-link">
              <v-list-item :prepend-icon="item.icon">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </RouterLink>
          </template>
          <RouterLink to="/Settings" class="nav-link settings-link">
            <v-list-item prepend-icon="mdi-cog">
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>
          </RouterLink>
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
  display: block;
}

.v-list-item-title {
  padding-left: 8px;
}

.v-list-item:hover {
  background-color: rgb(var(--v-theme-hover-item)) !important;
}

.nav-link.router-link-active .v-list-item {
  background-color: rgb(var(--v-theme-active-item-bg)) !important;
}

.nav-link.router-link-active .clickable-icon,
.nav-link.router-link-active .v-list-item-title {
  color: rgb(var(--v-theme-active-item)) !important;
}

.nav-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.settings-link {
  margin-top: auto;
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

:deep(.v-navigation-drawer--is-hovering) + .v-main .fixed-header,
:deep(.v-navigation-drawer--active:not(.v-navigation-drawer--rail)) + .v-main .fixed-header {
  left: calc(240px + 16px);
}

:deep(.v-navigation-drawer--is-hovering) ~ .v-main,
:deep(.v-navigation-drawer--active:not(.v-navigation-drawer--rail)) ~ .v-main {
  margin-left: calc(240px + 16px);
}

:deep(.v-main .fixed-header) {
  background-color: rgb(var(--v-theme-app-bar));
  color: rgb(var(--v-theme-on-surface));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
