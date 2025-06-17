<script setup>
import { computed } from 'vue'
import TeamRow from './TeamRow.vue'
import { useAppStateStore } from '../store/appState'
import { useNotifications } from '../composables/notifiy'

const { showSuccess, showError, errorMsg, triggerSuccess, triggerError } = useNotifications()
const store = useAppStateStore()
const teams = computed(() => store.teams)

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

const clearTeamsData = () => {
  store.clearTeams()
  console.log('Cleared teams data')
}
const createBracketsJson = async () => {
  const transformedData = transformTeamsForOutput()
  const jsonData = JSON.stringify(transformedData, null, 2)
  try {
    const created = await window.api.createFile(`${store.jsonSavePath}/BracketsView.json`, jsonData)
    if (created) {
      triggerSuccess()
    } else {
      triggerError('Could not write file')
    }
  } catch (e) {
    triggerError(e.message || 'Unknown error')
    console.error('Failed to create BracketsView.json:', e)
  }
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
      <TeamRow v-for="team in Object.values(teams)" :key="team.id" :team="team" />
      <v-snackbar v-model="showSuccess" :timeout="4000" top color="success">
        Brackets File created successfully!
      </v-snackbar>
      <v-snackbar v-model="showError" :timeout="5000" top color="error">
        {{ errorMsg }}
        <template #action="{ attrs }">
          <v-btn text v-bind="attrs" @click="showError = false"> Close </v-btn>
        </template>
      </v-snackbar>
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
