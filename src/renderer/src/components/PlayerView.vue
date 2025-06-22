<script setup>
import PlayerRow from './PlayerRow.vue'
import { useAppStateStore } from '../store/appState'
import { useNotifications } from '../composables/notifiy'

const { showSuccess, showError, errorMsg, triggerSuccess, triggerError } = useNotifications()
const store = useAppStateStore()

const clearPlayerData = () => {
  store.clearData('players')
}

const createPlayerJson = async () => {
  const jsonData = JSON.stringify(store.players, null, 2)

  try {
    const created = await window.api.createFile(`${store.jsonSavePath}/PlayersStats.json`, jsonData)
    if (created) {
      triggerSuccess()
    } else {
      triggerError('Could not write file')
    }
  } catch (e) {
    triggerError(e.message || 'Unknown error')
    console.error('Failed to create PlayersStats.json:', e)
  }
}
</script>

<template>
  <div class="players-view">
    <div class="fixed-header">
      <h1>Players Stats</h1>
      <v-btn color="primary" class="mb-4 mr-16" @click="createPlayerJson"
        >Create Player's Stats file</v-btn
      >
      <v-btn color="red" class="mb-4" @click="clearPlayerData">Clear Player Data</v-btn>
    </div>
    <div class="content">
      <PlayerRow />
      <v-snackbar v-model="showSuccess" :timeout="4000" top color="success">
        Player's Stats File created successfully!
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
.players-view {
  padding: 20px;
  font-family: Arial, sans-serif;
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

.players-view .fixed-header h1 {
  color: rgb(var(--v-theme-on-surface));
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #ffffff;
}

.mb-4 {
  margin-bottom: 16px;
}

.content {
  padding-top: 116px;
  transition: margin-left 0.2s ease;
}
</style>
