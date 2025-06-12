<script setup>
import { computed, ref } from 'vue'
import TodayPanels from './TodayPanels.vue'
import { useAppStateStore } from '../store/appState'

const showSuccess = ref(false)
const showError = ref(false)
const errorMsg = ref('')

const store = useAppStateStore()
const matches = computed({
  get: () => store.matches,
  set: (value) => (store.matches = value)
})

const clearMatchesData = () => {
  store.matches = {
    date: '',
    firstMatch: {
      matchTime: '',
      leftTeamName: '',
      rightTeamName: '',
      leftTeamLogo: '',
      rightTeamLogo: '',
      leftTeamFlag: '',
      rightTeamFlag: ''
    },
    secondMatch: {
      matchTime: '',
      leftTeamName: '',
      rightTeamName: '',
      leftTeamLogo: '',
      rightTeamLogo: '',
      leftTeamFlag: '',
      rightTeamFlag: ''
    }
  }
}

const updateMatches = (updatedMatches) => {
  store.matches = { ...updatedMatches }
}

const createMatchsJson = async () => {
  const jsonData = JSON.stringify(store.matches, null, 2)
  const defaultPath = await window.api.getDefaultPath()
  const savePath = localStorage.getItem('json-save-path') || defaultPath
  try {
    const created = await window.api.createFile(`${savePath}/ViewData/todaysmatches.json`, jsonData)

    if (created) {
      showSuccess.value = true
    } else {
      errorMsg.value = 'Could not write file'
      showError.value = true
    }
  } catch (e) {
    errorMsg.value = e.message || 'Unknown error'
    showError.value = true
    console.error('Failed to create BracketsView.json:', e)
  }
}
</script>

<template>
  <div class="matches-view">
    <div class="fixed-header">
      <h1>Today's Matches</h1>
      <v-btn color="primary" class="mb-4 mr-16" @click="createMatchsJson"
        >Create Today's Matches's file</v-btn
      >
      <v-btn color="red" class="mb-4" @click="clearMatchesData">Clear Matches Data</v-btn>
    </div>
    <div class="content">
      <TodayPanels :matches="matches" @update:matches="updateMatches" />
      <v-snackbar v-model="showSuccess" :timeout="4000" top color="success">
        Today's Matches's File created successfully!
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
.matches-view {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #ffffff;
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

.matches-view .fixed-header h1 {
  color: rgb(var(--v-theme-on-surface));
}
.mb-4 {
  margin-bottom: 16px;
}

.content {
  padding-top: 116px;
  transition: margin-left 0.2s ease;
}
</style>
