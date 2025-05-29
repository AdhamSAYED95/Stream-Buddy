<script setup>
import { ref } from 'vue'
import TodayPanels from './TodayPanels.vue'

const matches = ref({
  date: '',
  firstMatch: {
    MatchTime: '',
    leftTeamName: '',
    rightTeamName: '',
    leftTeamLogo: null,
    rightTeamLogo: null,
    leftTeamFlag: null,
    rightTeamFlag: null,
  },
  secondMatch: {
    MatchTime: '',
    leftTeamName: '',
    rightTeamName: '',
    leftTeamLogo: null,
    rightTeamLogo: null,
    leftTeamFlag: null,
    rightTeamFlag: null,
  },
})

const updateMatches = (updatedMatches) => {
  matches.value = { ...updatedMatches }
}

const createMatchsJson = async () => {
  const jsonData = JSON.stringify(matches.value, null, 2)
  await window.electronAPI.createFile('ViewsData\\todaysmatch.json', jsonData)
}
</script>
<template>
  <div class="matches-view">
    <h1>Today's Matches</h1>
    <v-btn color="primary" class="mb-4" @click="createMatchsJson">Create All Matches's file</v-btn>
    <div class="matches-container">
      <TodayPanels :matches="matches" @update:matches="updateMatches" />
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

.matches-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #b0bec5;
}
</style>
