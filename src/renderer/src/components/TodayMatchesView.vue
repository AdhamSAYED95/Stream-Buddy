<script setup>
import { ref, watch, onUnmounted, onMounted } from 'vue'
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

const clearMatchesData = () => {
  matches.value = {
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
  }
}

const updateMatches = (updatedMatches) => {
  matches.value = { ...updatedMatches }
}

const createMatchsJson = async () => {
  const jsonData = JSON.stringify(matches.value, null, 2)
  const defaultPath = await window.api.getDefaultPath()
  const savePath = localStorage.getItem('json-save-path') || defaultPath
  await window.api.createFile(`${savePath}/ViewData/todaysmatches.json`, jsonData)
}

watch(
  matches,
  (val) => {
    const jsonData = JSON.stringify(val)
    localStorage.setItem('matches', jsonData)
    console.log('localStorage size for matches:', jsonData.length, 'bytes')
  },
  { deep: true }
)

onMounted(() => {
  const saved = localStorage.getItem('matches')
  if (saved) matches.value = JSON.parse(saved)
  window.addEventListener('clear-all-input-data', clearMatchesData)
})

onUnmounted(() => {
  window.removeEventListener('clear-all-input-data', clearMatchesData)
})
</script>
<template>
  <div class="matches-view">
    <div class="fixed-header">
      <h1>Today's Matches</h1>
      <v-btn color="primary" class="mb-4 mr-16" @click="createMatchsJson"
        >Create All Matches's file</v-btn
      >
      <v-btn color="red" class="mb-4" @click="clearMatchesData">Clear Matches Data</v-btn>
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
