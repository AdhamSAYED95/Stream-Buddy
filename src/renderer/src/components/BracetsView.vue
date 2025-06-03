<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
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
  return initialTeamsObject
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
  const defaultPath = await window.api.getDefaultPath()
  console.log(defaultPath)
  const savePath = localStorage.getItem('json-save-path') || defaultPath
  try {
    await window.api.createFile(`${savePath}/ViewData/BracketsView.json`, jsonData)
  } catch (error) {
    console.error('Failed to create BracketsView.json:', error)
  }
}

const clearTeamsData = () => {
  teams.value = initializeTeams()
  console.log('Cleared teams data and removed from localStorage')
}

watch(
  teams,
  (val) => {
    const jsonData = JSON.stringify(val)
    localStorage.setItem('teams', jsonData)
    console.log('localStorage size for teams:', jsonData.length, 'bytes')
  },
  { deep: true }
)

onMounted(() => {
  const saved = localStorage.getItem('teams')
  if (saved) {
    teams.value = JSON.parse(saved)
  } else {
    teams.value = initializeTeams()
  }
  window.addEventListener('clear-all-input-data', clearTeamsData)
})

onUnmounted(() => {
  window.removeEventListener('clear-all-input-data', clearTeamsData)
})
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
</style>
