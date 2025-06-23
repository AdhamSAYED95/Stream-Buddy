import { defineStore } from 'pinia'
import {
  createInitialMatchState,
  createInitialPlayerState,
  initializeTeams,
  allNavigableViews
} from '../constants/constants'

export const useAppStateStore = defineStore('appState', {
  state: () => ({
    players: createInitialPlayerState(),
    teams: initializeTeams(),
    matches: createInitialMatchState(),
    isDarkMode: false,
    isNavigationMini: true,
    jsonSavePath: null,
    lastRoute: '/',
    viewVisibility: {},
    viewPresets: {},
    selectedPreset: null,
    appVersion: '',
    updateStatus: '',
    releaseInfo: null,
    _isInitialized: false
  }),
  actions: {
    async initializeStore() {
      if (this._isInitialized) return

      try {
        const storedData = await window.api.store.getAll()

        const keysToHydrate = [
          'players',
          'teams',
          'matches',
          'isDarkMode',
          'isNavigationMini',
          'jsonSavePath',
          'lastRoute',
          'viewVisibility',
          'viewPresets',
          'selectedPreset'
        ]

        const dataToPatch = {}
        for (const key of keysToHydrate) {
          if (storedData[key] !== undefined) {
            dataToPatch[key] = storedData[key]
          }
        }

        this.$patch(dataToPatch)

        this._isInitialized = true
        console.log('App state initialized from storage.')
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
          this.jsonSavePath = defaultPath
          await this.persistKey('jsonSavePath', this.jsonSavePath)
        } catch (error) {
          console.error('Failed to get default path during initialization:', error)
        }
      }
    },
    setLastRoute(routePath) {
      this.lastRoute = routePath
      this.persistKey('lastRoute', routePath)
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
      this.clearData('teams')
      this.clearData('players')
      this.clearData('matches')
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
        this.jsonSavePath = selectedPath
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
      this.jsonSavePath = defaultPath

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
    clearData(key) {
      let initialData
      if (key === 'teams') initialData = initializeTeams()
      else if (key === 'players') initialData = createInitialPlayerState()
      else if (key === 'matches') initialData = createInitialMatchState()
      else return

      this[key] = initialData
      this.persistKey(key, this[key])
    }
  }
})
