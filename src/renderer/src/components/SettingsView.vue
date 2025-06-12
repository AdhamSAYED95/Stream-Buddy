<script setup>
import { ref, watch, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useAppStateStore } from '../store/appState'

const theme = useTheme()
const store = useAppStateStore()
const emit = defineEmits(['update:navigationMode'])

const isDarkMode = ref(theme.global.name.value === 'dark')
const isNavigationMini = ref(true)
const jsonSavePath = ref('')
const appVersion = ref('')
const updateStatus = ref('')
const releaseInfo = ref(null)

function toggleTheme(value) {
  const newThemeName = value ? 'dark' : 'light'
  theme.global.name.value = newThemeName
  localStorage.setItem('user-theme', newThemeName)
  isDarkMode.value = value
}

function toggleNavigationMode(value) {
  isNavigationMini.value = value
  const mode = value ? 'mini' : 'full'
  localStorage.setItem('navigation-mode', mode)
  emit('update:navigationMode', mode)
}

const selectJsonSavePath = async () => {
  const selectedPath = await window.api.selectDirectory()
  if (selectedPath) {
    jsonSavePath.value = `${selectedPath}\\ViewData`
    localStorage.setItem('json-save-path', selectedPath)
  }
}

const resetSettings = async () => {
  theme.global.name.value = 'light'
  localStorage.removeItem('user-theme')
  isDarkMode.value = false

  isNavigationMini.value = true
  const defaultMode = 'mini'
  localStorage.removeItem('navigation-mode')
  emit('update:navigationMode', defaultMode)

  const defaultPath = await window.api.getDefaultPath()
  jsonSavePath.value = `${defaultPath}\\ViewData`
  localStorage.removeItem('json-save-path')
}

const clearAllInputData = () => {
  store.clearAllData()
}

const checkForUpdates = () => {
  updateStatus.value = ''
  releaseInfo.value = null
  window.api.checkForUpdates()
}

watch(
  () => theme.global.name.value,
  (newName) => {
    const newIsDark = newName === 'dark'
    if (isDarkMode.value !== newIsDark) {
      isDarkMode.value = newIsDark
    }
  }
)

onMounted(async () => {
  // Load theme
  isDarkMode.value = theme.global.name.value === 'dark'

  const savedJsonPath = localStorage.getItem('json-save-path')
  if (savedJsonPath) {
    jsonSavePath.value = `${savedJsonPath}\\ViewData`
  } else {
    const defaultPath = await window.api.getDefaultPath()
    jsonSavePath.value = `${defaultPath}\\ViewData`
  }

  const savedNavMode = localStorage.getItem('navigation-mode')
  if (savedNavMode) {
    isNavigationMini.value = savedNavMode === 'mini'
  }

  const version = await window.api.getAppVersion()
  appVersion.value = version

  window.api.onUpdateStatus((status, info) => {
    updateStatus.value = status
    if (info) {
      releaseInfo.value = info
    }
  })
})
</script>

<template>
  <div class="settings-view">
    <div class="fixed-header">
      <h1>Settings</h1>
    </div>
    <div class="content">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card class="setting-card">
              <v-card-title>Display Mode</v-card-title>
              <v-card-subtitle>Choose your preferred application theme.</v-card-subtitle>
              <v-divider class="my-2"></v-divider>
              <v-card-text>
                <v-switch
                  v-model="isDarkMode"
                  prepend-icon="mdi-theme-light-dark"
                  :label="isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'"
                  color="primary"
                  inset
                  hide-details
                  @update:model-value="toggleTheme"
                ></v-switch>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card class="setting-card">
              <v-card-title>Navigation Mode</v-card-title>
              <v-card-subtitle>Choose your preferred navigation drawer size.</v-card-subtitle>
              <v-divider class="my-2"></v-divider>
              <v-card-text>
                <v-switch
                  v-model="isNavigationMini"
                  prepend-icon="mdi-dock-left"
                  :label="isNavigationMini ? 'Mini Drawer Active' : 'Full Drawer Active'"
                  color="primary"
                  inset
                  hide-details
                  @update:modelValue="toggleNavigationMode"
                ></v-switch>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card class="setting-card">
              <v-card-title>Clear Input</v-card-title>
              <v-card-subtitle>Clear all input data from all views.</v-card-subtitle>
              <v-divider class="my-2"></v-divider>
              <v-card-text>
                <v-btn color="red" @click="clearAllInputData">Clear All Input Data</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card class="setting-card">
              <v-card-title>JSON Save Location</v-card-title>
              <v-card-subtitle>Configure where JSON files will be saved on disk.</v-card-subtitle>
              <v-divider class="my-2"></v-divider>
              <v-card-text>
                <p>Current save path: {{ jsonSavePath }}</p>
                <v-btn color="primary" @click="selectJsonSavePath">Select Save Directory</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card class="setting-card">
              <v-card-title>Reset Settings</v-card-title>
              <v-card-subtitle>Reset all settings to their default values.</v-card-subtitle>
              <v-divider class="my-2"></v-divider>
              <v-card-text>
                <v-btn color="warning" @click="resetSettings">Reset All Settings</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card class="setting-card">
              <v-card-title>About The App</v-card-title>
              <v-divider class="my-2"></v-divider>
              <v-card-text>
                <p class="mb-3">Current Version: {{ appVersion }}</p>
                <v-btn color="info" @click="checkForUpdates">Check for Updates</v-btn>
                <div v-if="updateStatus" class="mt-4">
                  <v-alert v-if="updateStatus === 'checking'" type="info" dense>
                    Checking for updates...
                  </v-alert>
                  <v-alert v-if="updateStatus === 'available'" type="success" dense>
                    A new version is available: {{ releaseInfo.version }}
                    <div v-if="releaseInfo.releaseNotes" class="release-notes-content mt-2">
                      <p><strong>Release Notes:</strong></p>
                      <div v-html="releaseInfo.releaseNotes"></div>
                    </div>
                  </v-alert>
                  <v-alert v-if="updateStatus === 'not-available'" type="info" dense>
                    You are on the latest version.
                  </v-alert>
                  <v-alert v-if="updateStatus === 'downloading'" type="info" dense>
                    Downloading update... {{ releaseInfo.percent.toFixed(2) }}%
                    <v-progress-linear
                      :model-value="releaseInfo.percent"
                      class="mt-2"
                    ></v-progress-linear>
                  </v-alert>
                  <v-alert v-if="updateStatus === 'downloaded'" type="success" dense>
                    Update downloaded. It will be installed on restart.
                  </v-alert>
                  <v-alert v-if="updateStatus === 'error'" type="error" dense>
                    An error occurred while checking for updates.
                  </v-alert>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  padding: 16px;
  font-family: Arial, sans-serif;
  height: 100%;
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

.settings-view .fixed-header h1 {
  color: rgb(var(--v-theme-on-surface));
}

.settings-view h1 {
  text-align: center;
  margin-bottom: 0;
  font-size: 1.75rem;
}

.content {
  padding-top: 80px;
}

.setting-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.setting-card .v-card-title {
  font-weight: 500;
}

.release-notes-content {
  max-height: 200px; /* Limit height for scrollability */
  overflow-y: auto; /* Add scrollbar if content exceeds height */
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 12px;
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
  border-radius: 4px;
}

/* Basic styling for markdown rendering (if releaseNotes is markdown) */
.release-notes-content h1,
.release-notes-content h2,
.release-notes-content h3,
.release-notes-content h4,
.release-notes-content h5,
.release-notes-content h6 {
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.release-notes-content p {
  margin-bottom: 0.5em;
}

.release-notes-content ul {
  list-style-type: disc;
  margin-left: 20px;
}

.release-notes-content ol {
  list-style-type: decimal;
  margin-left: 20px;
}
</style>
