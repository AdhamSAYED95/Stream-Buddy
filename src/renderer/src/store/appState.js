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
    players: createInitialPlayerState(),
    teams: initializeTeams(),
    matches: createInitialMatchState(),
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
    async initializeStore() {
      if (this._isInitialized) return

      try {
        const storedData = await window.api.store.getAll()

        if (storedData.players) this.players = { ...this.players, ...storedData.players }
        if (storedData.teams) this.teams = { ...this.teams, ...storedData.teams }
        if (storedData.matches) this.matches = { ...this.matches, ...storedData.matches }
        if (typeof storedData.isDarkMode === 'boolean') this.isDarkMode = storedData.isDarkMode
        if (typeof storedData.isNavigationMini === 'boolean')
          this.isNavigationMini = storedData.isNavigationMini
        if (storedData.jsonSavePath) this.jsonSavePath = storedData.jsonSavePath
        if (storedData.viewVisibility) this.viewVisibility = { ...storedData.viewVisibility }
        if (storedData.viewPresets) this.viewPresets = { ...storedData.viewPresets }
        if (storedData.selectedPreset) this.selectedPreset = storedData.selectedPreset

        this._isInitialized = true
      } catch (error) {
        console.error('Failed to initialize store from electron-store:', error)
      }
    },

    async persistKey(key, value) {
      try {
        const cloned = JSON.parse(JSON.stringify(value))
        await window.api.store.set(key, cloned)
      } catch (error) {
        console.error(`Failed to persist ${key}:`, error)
      }
    },

    async persistMultipleKeys(data) {
      try {
        for (const [key, value] of Object.entries(data)) {
          const cloned = JSON.parse(JSON.stringify(value))
          await window.api.store.set(key, cloned)
        }
      } catch (error) {
        console.error('Failed to persist multiple keys:', error)
      }
    },

    async initializeJsonSavePath() {
      if (this.jsonSavePath === null) {
        try {
          const defaultPath = await window.api.getDefaultPath()
          this.jsonSavePath = `${defaultPath}\\ViewsData`
          await this.persistKey('jsonSavePath', this.jsonSavePath)
        } catch (error) {
          console.error('Failed to get default path during initialization:', error)
        }
      }
    },

    initializeViewVisibility(views) {
      let needsPersist = false
      views.forEach((view) => {
        if (this.viewVisibility[view.name] === undefined) {
          this.viewVisibility[view.name] = true
          needsPersist = true
        }
      })
      if (needsPersist) {
        this.persistKey('viewVisibility', this.viewVisibility)
      }
    },

    setViewVisibility(viewName, isVisible) {
      this.viewVisibility[viewName] = isVisible
      this.persistKey('viewVisibility', this.viewVisibility)
    },

    saveViewPreset(presetName) {
      if (presetName && typeof presetName === 'string') {
        this.viewPresets[presetName] = { ...this.viewVisibility }
        this.selectedPreset = presetName
        this.persistMultipleKeys({
          viewPresets: this.viewPresets,
          selectedPreset: this.selectedPreset
        })
      } else {
        console.error('Preset name must be a non-empty string.')
      }
    },

    applyViewPreset(presetName) {
      if (this.viewPresets[presetName]) {
        this.viewVisibility = { ...this.viewPresets[presetName] }
        this.selectedPreset = presetName
        this.persistMultipleKeys({
          viewVisibility: this.viewVisibility,
          selectedPreset: this.selectedPreset
        })
      }
    },

    updateViewPreset(presetName) {
      if (this.viewPresets[presetName]) {
        this.viewPresets[presetName] = { ...this.viewVisibility }
        this.selectedPreset = presetName
        this.persistMultipleKeys({
          viewPresets: this.viewPresets,
          selectedPreset: this.selectedPreset
        })
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
        this.persistMultipleKeys({
          viewPresets: this.viewPresets,
          viewVisibility: this.viewVisibility,
          selectedPreset: this.selectedPreset
        })
      } else {
        console.warn(`Preset '${presetName}' not found for deletion.`)
      }
    },

    clearAllData() {
      const resetData = {
        players: createInitialPlayerState(),
        teams: initializeTeams(),
        matches: createInitialMatchState()
      }

      Object.assign(this, resetData)
      this.persistMultipleKeys(resetData)
    },

    toggleTheme(value) {
      this.isDarkMode = value
      this.persistKey('isDarkMode', value)
    },

    toggleNavigationMode(value) {
      this.isNavigationMini = value
      this.persistKey('isNavigationMini', value)
    },

    async selectJsonSavePath() {
      const selectedPath = await window.api.selectDirectory()
      if (selectedPath) {
        this.jsonSavePath = `${selectedPath}\\ViewsData`
        await this.persistKey('jsonSavePath', this.jsonSavePath)
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

      await this.persistMultipleKeys({
        isDarkMode: this.isDarkMode,
        isNavigationMini: this.isNavigationMini,
        viewVisibility: this.viewVisibility,
        selectedPreset: this.selectedPreset,
        jsonSavePath: this.jsonSavePath
      })
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
      this.persistKey('jsonSavePath', path)
    },

    updateTeam(teamId, teamData) {
      if (this.teams[teamId]) {
        this.teams[teamId] = { ...this.teams[teamId], ...teamData }
        this.persistKey('teams', this.teams)
      }
    },
    updatePlayers(playersData) {
      this.players = { ...this.players, ...playersData }
      this.persistKey('players', this.players)
    },

    updateMatches(matchesData) {
      this.matches = { ...this.matches, ...matchesData }
      this.persistKey('matches', this.matches)
    },
    clearTeams() {
      this.teams = initializeTeams()
      this.persistKey('teams', this.teams)
    },

    clearPlayers() {
      this.players = createInitialPlayerState()
      this.persistKey('players', this.players)
    },
    clearMatches() {
      this.matches = createInitialMatchState()
      this.persistKey('matches', this.matches)
    }
  }
})

const initializeTeams = () => {
  const teams = {}
  for (let i = 1; i <= 32; i++) {
    teams[i] = {
      id: i,
      teamImage: '',
      flagImage: '',
      teamName: '',
      score: 0
    }
  }
  return teams
}

const createInitialPlayerState = () => ({
  playerName: '',
  teamName: '',
  favouriteWeapon: '',
  economyScore: 0,
  heroImage: '',
  kills: 0,
  deaths: 0,
  assists: 0
})

const createMatchDetails = () => ({
  matchTime: '',
  leftTeamName: '',
  rightTeamName: '',
  leftTeamLogo: '',
  rightTeamLogo: '',
  leftTeamFlag: '',
  rightTeamFlag: ''
})

const createInitialMatchState = () => ({
  date: '',
  firstMatch: createMatchDetails(),
  secondMatch: createMatchDetails()
})
