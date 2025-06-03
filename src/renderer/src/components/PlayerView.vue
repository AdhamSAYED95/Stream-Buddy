<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import PlayerRow from './PlayerRow.vue'

const players = ref({
  PlayerName: '',
  TeamName: '',
  FavouriteWeapon: '',
  EconomyScore: 0,
  HeroImage: null,
  Kills: 0,
  Deaths: 0,
  Assists: 0
})

const clearPlayerData = () => {
  players.value = {
    PlayerName: '',
    TeamName: '',
    FavouriteWeapon: '',
    EconomyScore: 0,
    HeroImage: null,
    Kills: 0,
    Deaths: 0,
    Assists: 0
  }
}

const updatePlayer = (updatedPlayer) => {
  players.value = { ...players.value, ...updatedPlayer }
}

const createPlayerJson = async () => {
  const jsonData = JSON.stringify(players.value, null, 2)
  const defaultPath = await window.api.getDefaultPath()
  const savePath = localStorage.getItem('json-save-path') || defaultPath
  await window.api.createFile(`${savePath}/ViewData/PlayersStats.json`, jsonData)
}

watch(
  players,
  (val) => {
    const jsonData = JSON.stringify(val)
    localStorage.setItem('players', jsonData)
    console.log('localStorageww size for players:', jsonData.length, 'bytes')
  },
  { deep: true }
)

onMounted(() => {
  window.addEventListener('clear-all-input-data', clearPlayerData)
  const saved = localStorage.getItem('players')
  if (saved) players.value = JSON.parse(saved)
})

onUnmounted(() => {
  window.removeEventListener('clear-all-input-data', clearPlayerData)
})
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
