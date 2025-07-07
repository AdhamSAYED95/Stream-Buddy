import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
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
    customViews: [],
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
          'selectedPreset',
          'customViews'
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
        console.log(this.customViews)
        console.log(this.viewVisibility)
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
    addCustomView(view) {
      if (view && view.id && view.name) {
        const viewWithSections = { ...view, sections: [] }
        this.customViews.push(viewWithSections)
        this.persistKey('customViews', this.customViews)
      }
    },
    addSection(viewId, sectionName) {
      const view = this.customViews.find((v) => v.id === viewId)
      if (view) {
        view.sections.push({
          id: uuidv4(), // Unique ID for the section
          name: sectionName,
          fields: [] // Initialize with an empty fields array
        })
        this.persistKey('customViews', this.customViews)
      }
    },
    deleteSection(viewId, sectionId) {
      const view = this.customViews.find((v) => v.id === viewId)
      if (view) {
        const index = view.sections.findIndex((s) => s.id === sectionId)
        if (index !== -1) {
          view.sections.splice(index, 1)
          this.persistKey('customViews', this.customViews)
        }
      }
    },
    addField(viewId, sectionId, fieldData) {
      const view = this.customViews.find((v) => v.id === viewId)
      if (view) {
        const section = view.sections.find((s) => s.id === sectionId)
        if (section) {
          section.fields.push({
            id: uuidv4(), // Unique ID for the field
            ...fieldData,
            value: '' // Default value
          })
          this.persistKey('customViews', this.customViews)
        }
      }
    },

    // --- NEW: Action to delete a field from a section ---
    deleteField(viewId, sectionId, fieldId) {
      const view = this.customViews.find((v) => v.id === viewId)
      if (view) {
        const section = view.sections.find((s) => s.id === sectionId)
        if (section) {
          const index = section.fields.findIndex((f) => f.id === fieldId)
          if (index !== -1) {
            section.fields.splice(index, 1)
            this.persistKey('customViews', this.customViews)
          }
        }
      }
    },

    // --- NEW: Action to update any field's data (name or value) ---
    updateFieldData(viewId, sectionId, fieldId, newFieldValue) {
      const view = this.customViews.find((v) => v.id === viewId)
      if (view) {
        const section = view.sections.find((s) => s.id === sectionId)
        if (section) {
          const field = section.fields.find((f) => f.id === fieldId)
          if (field) {
            field.value = newFieldValue
            // This action is called frequently, so you might want to implement
            // a debounced persistence strategy later for performance.
            this.persistKey('customViews', this.customViews)
          }
        }
      }
    },

    // --- NEW: Action to update a section's name ---
    updateSectionName(viewId, sectionId, newName) {
      const view = this.customViews.find((v) => v.id === viewId)
      if (view) {
        const section = view.sections.find((s) => s.id === sectionId)
        if (section) {
          section.name = newName
          this.persistKey('customViews', this.customViews)
        }
      }
    },
    updateCustomViewContent(viewId, newContent) {
      const viewToUpdate = this.customViews.find((view) => view.id === viewId)
      if (viewToUpdate) {
        viewToUpdate.content = newContent
        // Persist the entire customViews array to save the change.
        this.persistKey('customViews', this.customViews)
      } else {
        console.warn(`Custom view with ID "${viewId}" not found. Could not update content.`)
      }
    },

    // --- NEW: Action to delete a custom view ---
    deleteCustomView(viewId) {
      const index = this.customViews.findIndex((v) => v.id === viewId)
      if (index !== -1) {
        const viewName = this.customViews[index].name // Get the name before removing it

        // Remove the view itself
        this.customViews.splice(index, 1)

        // --- THIS IS THE FIX ---
        // Also remove its entry from the visibility object
        delete this.viewVisibility[viewName]

        // Persist both changes together
        this.persistMultipleKeys({
          customViews: this.customViews,
          viewVisibility: this.viewVisibility
        })
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
        this.customViews.forEach((view) => {
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
      this.customViews.forEach((view) => {
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
