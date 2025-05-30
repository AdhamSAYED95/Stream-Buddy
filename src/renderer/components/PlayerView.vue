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
  Assists: 0,
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
    Assists: 0,
  }
}

const updatePlayer = (updatedPlayer) => {
  players.value = { ...players.value, ...updatedPlayer }
}

const createPlayerJson = async () => {
  const jsonData = JSON.stringify(players.value, null, 2)
  await window.electronAPI.createFile('ViewsData\\PlayersStats.json', jsonData)
}

onMounted(() => {
  initializePlayers()
})
</script>

<template>
  <div class="players-view">
    <h1 class="sticky">Players Stats</h1>
    <v-btn color="primary" class="mb-4 sticky" @click="createPlayerJson"
      >Create Player's file</v-btn
    >
    <PlayerRow :player="players" @update-player="updatePlayer" />
  </div>
</template>

<style scoped>
.players-view {
  padding: 20px;
  font-family: Arial, sans-serif;
  height: 100%;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.sticky {
  position: sticky;
  top: 20px; /* Distance from top when sticky; adjust as needed */
  z-index: 1000; /* Ensure they stay above other content */
}

/* Ensure button retains its original styling */
.mb-4 {
  margin-bottom: 16px; /* Vuetify’s mb-4 applies 16px; explicitly define to ensure clarity */
}
</style>
