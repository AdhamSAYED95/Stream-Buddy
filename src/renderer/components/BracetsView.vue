<script setup>
import { ref, onMounted } from 'vue'
import TeamRow from './TeamRow.vue'

const teams = ref({})

const initializeTeams = () => {
  const initialTeamsObject = {}
  for (let i = 1; i < 33; i++) {
    initialTeamsObject[i] = {
      id: i,
      TeamImage: null,
      FlagImage: null,
      TeamName: '',
      Score: 0,
    }
  }
  teams.value = initialTeamsObject
}

const updateTeam = (updatedTeam) => {
  if (teams.value[updatedTeam.id]) {
    teams.value[updatedTeam.id] = updatedTeam
  }
}

const transformTeamsForOutput = () => {
  const outputObject = {}
  let teamNumber = 1

  for (const teamId in teams.value) {
    if (Object.prototype.hasOwnProperty.call(teams.value, teamId)) {
      outputObject[`team${teamNumber}`] = teams.value[teamId]
      teamNumber++
    }
  }
  return outputObject
}

const createBracketsJson = async () => {
  const transformedData = transformTeamsForOutput()
  const jsonData = JSON.stringify(transformedData, null, 2)

  try {
    await window.electronAPI.createFile('ViewsData\\BracketsView.json', jsonData)
    console.log('BracketsView.json created successfully with "teamX" keys!')
  } catch (error) {
    console.error('Failed to create BracketsView.json:', error)
  }
}

onMounted(() => {
  initializeTeams()
})
</script>

<template>
  <div class="brackets-view">
    <h1 class="sticky">Brackets View</h1>
    <v-btn color="primary" class="mb-4 sticky" @click="createBracketsJson"
      >Create Brackets File</v-btn
    >
    <div v-if="Object.keys(teams).length">
      <v-virtual-scroll :items="Object.values(teams)" height="calc(100vh - 80px)" item-height="48">
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

.sticky {
  position: sticky;
  top: 20px; /* Distance from top when sticky; adjust as needed */
  z-index: 1000; /* Ensure they stay above other content */
}

/* Ensure button retains its original styling */
.mb-4 {
  margin-bottom: 16px; /* Vuetify’s mb-4 applies 16px; explicitly define to ensure clarity */
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
