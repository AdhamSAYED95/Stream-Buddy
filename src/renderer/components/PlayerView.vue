<script setup>
import { ref, onMounted } from 'vue'
import PlayerRow from './PlayerRow.vue'

const players = ref([])

const initializePlayers = () => {
  const initialPlayers = []
  for (let i = 0; i < 1; i++) {
    initialPlayers.push({
      id: i,
      PlayerName: ``,
      TeamName: ``,
      FavouriteWeapon: ``,
      EconomyScore: 0,
      HeroImage: null,
      Kills: 0,
      Deaths: 0,
      Assists: 0,
    })
  }
  players.value = initialPlayers
}

const updatePlayer = (updatedPlayer) => {
  const index = players.value.findIndex((p) => p.id === updatedPlayer.id)
  if (index !== -1) {
    players.value[index] = updatedPlayer
  }
}
onMounted(() => {
  initializePlayers()
})
</script>

<template>
  <div class="players-view">
    <h1>Players Stats</h1>
    <div v-if="players.length">
      <PlayerRow
        v-for="player in players"
        :key="player.id"
        :player="player"
        @update-player="updatePlayer"
      />
    </div>
    <div v-else>
      <p>Loading players...</p>
    </div>
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
  margin-bottom: 30px;
}
</style>
