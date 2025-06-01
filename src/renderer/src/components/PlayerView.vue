<script setup>
import { ref, onMounted } from 'vue'
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

const initializePlayers = () => {
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
  console.log(jsonData)
  await window.api.createFile('ViewsData/PlayersStats.json', jsonData)
}

onMounted(() => {
  initializePlayers()
})
</script>

<template>
  <div class="players-view">
    <div class="fixed-header">
      <h1>Players Stats</h1>
      <v-btn color="primary" class="mb-4" @click="createPlayerJson">Create Player's file</v-btn>
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
  background-color: #1e2a38;
  padding: 16px 16px 16px 16px;
  transition: left 0.2s ease;
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
