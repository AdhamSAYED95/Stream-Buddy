<script setup>
import { ref, onMounted } from 'vue'
import TeamRow from './TeamRow.vue'

const teams = ref([])

const initializeTeams = () => {
  const initialTeams = []
  for (let i = 0; i < 32; i++) {
    initialTeams.push({
      id: i,
      imageFile: null,
      flagFile: null,
      name: ``,
      score: 0,
    })
  }
  teams.value = initialTeams
}

const updateTeam = (updatedTeam) => {
  const index = teams.value.findIndex((t) => t.id === updatedTeam.id)
  if (index !== -1) {
    teams.value[index] = updatedTeam
  }
}

onMounted(() => {
  initializeTeams()
})
</script>

<template>
  <div class="brackets-view">
    <h1>Tournament Brackets</h1>
    <div v-if="teams.length">
      <TeamRow v-for="team in teams" :key="team.id" :team="team" @update-team="updateTeam" />
    </div>
    <div v-else>
      <p>Loading teams...</p>
    </div>
  </div>
</template>

<style scoped>
.brackets-view {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}
</style>
