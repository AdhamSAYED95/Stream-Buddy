<script setup>
import { ref, watch, onMounted } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const emit = defineEmits(['update:navigationMode', 'clearInput', 'clear-Input'])

const isDarkMode = ref(theme.global.name.value === 'dark')
const isNavigationMini = ref(false)
const jsonSavePath = ref('')

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

watch(
  () => theme.global.name.value,
  (newName) => {
    const newIsDark = newName === 'dark'
    if (isDarkMode.value !== newIsDark) {
      isDarkMode.value = newIsDark
    }
  }
)

const clearAllInputData = () => {
  window.dispatchEvent(new Event('clear-all-input-data'))
}

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
</style>
