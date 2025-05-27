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
      name: '',
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

// const logAllTeams = () => {
//   console.log('All Teams:', teams.value)
//   // Optionally, you can process or save the data here
// }

onMounted(() => {
  initializeTeams()
})
</script>

<template>
  <div class="brackets-view">
    <h1>Brackets View</h1>
    <!-- <v-btn color="primary" class="mb-4" @click="logAllTeams">Show All Teams' Values</v-btn> -->
    <div v-if="teams.length">
      <v-virtual-scroll :items="teams" height="calc(100vh - 80px)" item-height="48">
        <template v-slot:default="{ item }">
          <TeamRow :key="item.id" :team="item" @update-team="updateTeam" />
        </template>
      </v-virtual-scroll>
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
  height: 100%;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}
</style>
