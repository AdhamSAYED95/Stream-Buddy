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
      Score: 0
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
    await window.api.createFile('ViewsData\\BracketsView.json', jsonData)
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
    <div class="fixed-header">
      <h1>Brackets View</h1>
      <v-btn color="primary" class="mb-4 sticky" @click="createBracketsJson"
        >Create Brackets File</v-btn
      >
    </div>

    <div class="content">
      <TeamRow
        v-for="team in Object.values(teams)"
        :key="team.id"
        :team="team"
        @update-team="updateTeam"
      />
    </div>
  </div>
</template>

<style scoped>
.brackets-view {
  padding: 20px;
  font-family: Arial, sans-serif;
  height: 100%;
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

.mb-4 {
  margin-bottom: 16px;
}

.content {
  padding-top: 116px;
  transition: margin-left 0.2s ease;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
