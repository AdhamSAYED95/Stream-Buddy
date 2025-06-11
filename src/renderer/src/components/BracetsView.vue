<script setup>
import { computed } from 'vue'
import TeamRow from './TeamRow.vue'
import { useAppStateStore } from '../store/appState'

const store = useAppStateStore()
const teams = computed({
  get: () => store.teams,
  set: (value) => (store.teams = value)
})

const updateTeam = (updatedTeam) => {
  if (store.teams[updatedTeam.id]) {
    store.teams[updatedTeam.id] = updatedTeam
  }
}

const transformTeamsForOutput = () => {
  const outputObject = {}
  let teamNumber = 1
  for (const teamId in store.teams) {
    if (Object.prototype.hasOwnProperty.call(store.teams, teamId)) {
      outputObject[`team${teamNumber}`] = store.teams[teamId]
      teamNumber++
    }
  }
  return outputObject
}

const createBracketsJson = async () => {
  const transformedData = transformTeamsForOutput()
  const jsonData = JSON.stringify(transformedData, null, 2)
  const defaultPath = await window.api.getDefaultPath()
  const savePath = localStorage.getItem('json-save-path') || defaultPath
  try {
    await window.api.createFile(`${savePath}/ViewData/BracketsView.json`, jsonData)
  } catch (error) {
    console.error('Failed to create BracketsView.json:', error)
  }
}

const clearTeamsData = () => {
  store.teams = initializeTeams()
  console.log('Cleared teams data')
}

function initializeTeams() {
  const initialTeamsObject = {}
  for (let i = 1; i < 33; i++) {
    initialTeamsObject[i] = {
      id: i,
      teamImage: '',
      flagImage: '',
      teamName: '',
      score: 0
    }
  }
  return initialTeamsObject
}
</script>

<template>
  <div class="brackets-view">
    <div class="fixed-header">
      <h1>Brackets View</h1>
      <v-btn color="primary" class="mb-4 mr-16" @click="createBracketsJson"
        >Create Brackets File</v-btn
      >
      <v-btn color="red" class="mb-4" @click="clearTeamsData">Clear Teams Data</v-btn>
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
  box-sizing: border-box;
}

.fixed-header {
  position: fixed;
  left: 56px;
  right: 0;
  z-index: 999;
  top: 0;
  padding: 16px;
  transition: left 0.2s ease;
}

.brackets-view .fixed-header h1 {
  color: rgb(var(--v-theme-on-surface));
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

.brackets-view :deep(.v-text-field) {
  contain: layout style paint;
}

.brackets-view :deep(.v-input) {
  contain: layout style paint;
}
</style>
