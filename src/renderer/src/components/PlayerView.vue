<script setup>
import { computed } from 'vue'
import PlayerRow from './PlayerRow.vue'
import { useAppStateStore } from '../store/appState'

const store = useAppStateStore()
const players = computed({
  get: () => store.players,
  set: (value) => (store.players = value)
})

const clearPlayerData = () => {
  store.players = {
    PlayerName: '',
    TeamName: '',
    FavouriteWeapon: '',
    EconomyScore: 0,
    HeroImage: '',
    Kills: 0,
    Deaths: 0,
    Assists: 0
  }
}

const updatePlayer = (updatedPlayer) => {
  store.players = { ...store.players, ...updatedPlayer }
}

const createPlayerJson = async () => {
  const jsonData = JSON.stringify(store.players, null, 2)
  const defaultPath = await window.api.getDefaultPath()
  const savePath = localStorage.getItem('json-save-path') || defaultPath
  await window.api.createFile(`${savePath}/ViewData/PlayersStats.json`, jsonData)
}
</script>

<template>
  <div class="players-view">
    <div class="fixed-header">
      <h1>Players Stats</h1>
      <v-btn color="primary" class="mb-4 mr-16" @click="createPlayerJson"
        >Create Player's file</v-btn
      >
      <v-btn color="red" class="mb-4" @click="clearPlayerData">Clear Player Data</v-btn>
    </div>
    <div class="content">
      <PlayerRow :player="players" @update-player="updatePlayer" />
    </div>
  </div>
</template>

<style scoped>
.players-view {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 56px;
  right: 0;
  z-index: 999;

  padding: 16px;
  transition: left 0.2s ease;
}

.players-view .fixed-header h1 {
  color: rgb(var(--v-theme-on-surface));
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #ffffff;
}

.mb-4 {
  margin-bottom: 16px;
}

.content {
  padding-top: 116px;
  transition: margin-left 0.2s ease;
}
</style>
