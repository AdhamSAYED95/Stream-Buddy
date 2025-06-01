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
    rightTeamFlag: null
  },
  secondMatch: {
    MatchTime: '',
    leftTeamName: '',
    rightTeamName: '',
    leftTeamLogo: null,
    rightTeamLogo: null,
    leftTeamFlag: null,
    rightTeamFlag: null
  }
})

const updateMatches = (updatedMatches) => {
  matches.value = { ...updatedMatches }
}

const createMatchsJson = async () => {
  const jsonData = JSON.stringify(matches.value, null, 2)
  await window.api.createFile('ViewsData\\todaysmatches.json', jsonData)
}
</script>
<template>
  <div class="matches-view">
    <div class="fixed-header">
      <h1>Today's Matches</h1>
      <v-btn color="primary" class="mb-4" @click="createMatchsJson"
        >Create All Matches's file</v-btn
      >
    </div>
    <div class="content">
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
</style>
