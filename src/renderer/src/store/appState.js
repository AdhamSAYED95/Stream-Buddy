import { defineStore } from 'pinia'

export const allNavigableViews = [
  { name: 'TeamsView', title: 'Brackets View', icon: 'mdi-tournament', path: '/TeamsView' },
  { name: 'PlayerStats', title: 'Players Stats', icon: 'mdi-account-star', path: '/PlayerStats' },
  {
    name: 'TodayMatches',
    title: "Today's Matches",
    icon: 'mdi-calendar-today',
    path: '/TodayMatches'
  }
]

export const useAppStateStore = defineStore('appState', {
  state: () => ({
    players: {
      playerName: '',
      teamName: '',
      favouriteWeapon: '',
      economyScore: 0,
      heroImage: '',
      kills: 0,
      deaths: 0,
      assists: 0
    },
    teams: initializeTeams(),
    matches: {
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
    },
    isDarkMode: false,
    isNavigationMini: true,
    jsonSavePath: null,
    viewVisibility: {},
    viewPresets: {},
    selectedPreset: null,
    appVersion: '',
    updateStatus: '',
    releaseInfo: null
  }),
  actions: {
    async initializeJsonSavePath() {
      if (this.jsonSavePath === null) {
        try {
          const defaultPath = await window.api.getDefaultPath()
          this.jsonSavePath = `${defaultPath}\\ViewsData`
        } catch (error) {
          console.error('Failed to get default path during initialization:', error)
        }
      }
    },
    initializeViewVisibility(views) {
      views.forEach((view) => {
        if (this.viewVisibility[view.name] === undefined) {
          this.viewVisibility[view.name] = true
        }
      })
    },
    setViewVisibility(viewName, isVisible) {
      this.viewVisibility[viewName] = isVisible
    },
    saveViewPreset(presetName) {
      if (presetName && typeof presetName === 'string') {
        this.viewPresets[presetName] = { ...this.viewVisibility }
        this.selectedPreset = presetName
      } else {
        console.error('Preset name must be a non-empty string.')
      }
    },
    applyViewPreset(presetName) {
      if (this.viewPresets[presetName]) {
        this.viewVisibility = { ...this.viewPresets[presetName] }
        this.selectedPreset = presetName
      }
    },
    updateViewPreset(presetName) {
      if (this.viewPresets[presetName]) {
        this.viewPresets[presetName] = { ...this.viewVisibility }
        this.selectedPreset = presetName
      } else {
        console.warn(`Preset '${presetName}' not found for update.`)
      }
    },
    deleteViewPreset(presetName) {
      if (this.viewPresets[presetName]) {
        delete this.viewPresets[presetName]
        allNavigableViews.forEach((view) => {
          this.viewVisibility[view.name] = true
        })
        if (this.selectedPreset === presetName) {
          this.selectedPreset = null
        }
      } else {
        console.warn(`Preset '${presetName}' not found for deletion.`)
      }
    },
    clearAllData() {
      this.players = {
        playerName: '',
        teamName: '',
        favouriteWeapon: '',
        economyScore: 0,
        heroImage: '',
        kills: 0,
        deaths: 0,
        assists: 0
      }
      this.teams = initializeTeams()
      this.matches = {
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
    },
    toggleTheme(value) {
      this.isDarkMode = value
    },
    toggleNavigationMode(value) {
      this.isNavigationMini = value
    },
    async selectJsonSavePath() {
      const selectedPath = await window.api.selectDirectory()
      if (selectedPath) {
        this.jsonSavePath = `${selectedPath}\\ViewsData`
      }
    },
    async resetSettings() {
      this.isDarkMode = false
      this.isNavigationMini = true
      allNavigableViews.forEach((view) => {
        this.viewVisibility[view.name] = true
      })
      this.selectedPreset = null
      const defaultPath = await window.api.getDefaultPath()
      this.jsonSavePath = `${defaultPath}\\ViewsData`
    },
    resetUpdateState() {
      this.updateStatus = ''
      this.releaseInfo = null
    },
    checkForUpdates() {
      this.updateStatus = ''
      this.releaseInfo = null
      window.api.checkForUpdates()
    },
    downloadUpdate() {
      window.api.downloadUpdate()
    },
    async getAppVersion() {
      this.appVersion = await window.api.getAppVersion()
    },
    setUpdateStatus(status, info) {
      this.updateStatus = status
      if (info) {
        this.releaseInfo = info
      }
    },
    setDefaultPath(path) {
      this.jsonSavePath = path
    },
    updateTeam(teamId, teamData) {
      if (this.teams[teamId]) {
        this.teams[teamId] = { ...this.teams[teamId], ...teamData }
      }
    },
    clearTeams() {
      this.teams = initializeTeams()
    }
  },
  persist: {
    key: 'app-state',
    storage: localStorage,
    paths: [
      'players',
      'teams',
      'matches',
      'isDarkMode',
      'isNavigationMini',
      'jsonSavePath',
      'viewVisibility',
      'selectedPreset'
    ]
  }
})

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
