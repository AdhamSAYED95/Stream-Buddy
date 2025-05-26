<script setup>
import { ref } from 'vue'
import TodayPanels from './TodayPanels.vue'

const matches = ref({
  date: '',
  firstMatch: {
    time: '',
    leftTeamName: '',
    rightTeamName: '',
    leftTeamLogo: null,
    rightTeamLogo: null,
    leftTeamFlag: null,
    rightTeamFlag: null,
  },
  secondMatch: {
    time: '',
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
</script>
<template>
  <div class="matches-view">
    <h1>Today's Matches</h1>
    <div class="matches-container">
      <TodayPanels :matches="matches" @update:matches="updateMatches" />
    </div>
  </div>
</template>

<style scoped>
.matches-view {
  padding: 20px;
  background-color: #1e2a38;
  color: #ffffff;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
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
