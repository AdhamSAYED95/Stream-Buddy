<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <v-layout>
    <v-navigation-drawer expand-on-hover rail>
      <v-list density="compact" nav>
        <v-list-item>
          <RouterLink to="/TeamsView" class="nav-link">
            <v-list-item-title>Teams</v-list-item-title>
          </RouterLink>
        </v-list-item>
        <v-list-item>
          <RouterLink to="/PlayerStats" class="nav-link">
            <v-list-item-title>Player Stats</v-list-item-title>
          </RouterLink>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-layout>
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
  background-color: #34495e !important; /* Grey highlight on hover */
}

.router-link-active {
  color: #00c853 !important;
  background-color: #2c3e50 !important;
}
</style>
