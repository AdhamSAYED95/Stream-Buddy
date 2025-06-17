<script setup>
import { onMounted, ref } from 'vue'

import { useAppStateStore, allNavigableViews } from '../store/appState'

const store = useAppStateStore()
const createPresetDialog = ref(false)
const newPresetName = ref('')
const updatePresetDialog = ref(false)
const presetToUpdateName = ref('')
const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const confirmUpdateOrCreateDialog = ref(false)

const presetNameRules = [
  (v) => !!v || 'Preset name is required',
  (v) => (v && v.length <= 50) || 'Name must be less than 50 characters',
  (v) => !Object.keys(store.viewPresets).includes(v) || 'Preset with this name already exists'
]

const openCreatePresetDialog = () => {
  newPresetName.value = ''
  createPresetDialog.value = true
}

const saveNewPreset = () => {
  if (!newPresetName.value || newPresetName.value.trim() === '') {
    showFeedback('Preset name cannot be empty.', 'error')
    return
  }

  store.saveViewPreset(newPresetName.value.trim())
  showFeedback(`Preset '${newPresetName.value.trim()}' saved successfully!`, 'success')
  createPresetDialog.value = false
  newPresetName.value = ''
}

const applyPreset = (presetName) => {
  store.applyViewPreset(presetName)
  store.selectedPreset = presetName
  if (store.selectedPreset !== null) showFeedback(`Preset ${presetName} applied!`, 'info')
}

const openUpdatePresetDialog = (presetName) => {
  presetToUpdateName.value = presetName
  confirmUpdateOrCreateDialog.value = true
}

const updatePreset = () => {
  if (presetToUpdateName.value) {
    store.updateViewPreset(presetToUpdateName.value)
    showFeedback(`Preset '${presetToUpdateName.value}' updated!`, 'success')
    updatePresetDialog.value = false
  }
}

const handlePresetChoice = (choice) => {
  confirmUpdateOrCreateDialog.value = false

  if (choice === 'update') {
    updatePresetDialog.value = true
  } else if (choice === 'create') {
    createPresetDialog.value = true
  }
}

const deletePreset = (presetName) => {
  store.deleteViewPreset(presetName)
  if (store.selectedPreset === presetName) {
    store.selectedPreset = null
  }
  showFeedback(`Preset '${presetName}' deleted!`, 'success')
}

const showFeedback = (text, color) => {
  snackbarText.value = text
  snackbarColor.value = color
  showSnackbar.value = true
}
const checkForUpdates = () => {
  store.checkForUpdates()
}

const downloadUpdate = () => {
  store.downloadUpdate()
}

const clearAllData = () => {
  store.clearAllData()
  showFeedback(`All Inputs fields cleared`, 'info')
}

onMounted(async () => {
  store.resetUpdateState()

  await store.initializeJsonSavePath()

  await store.getAppVersion()

  window.api.onUpdateStatus((status, info) => {
    store.setUpdateStatus(status, info)
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
                  v-model="store.isDarkMode"
                  prepend-icon="mdi-theme-light-dark"
                  :label="store.isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'"
                  color="primary"
                  inset
                  hide-details
                  @update:model-value="store.toggleTheme"
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
                  v-model="store.isNavigationMini"
                  prepend-icon="mdi-dock-left"
                  :label="store.isNavigationMini ? 'Mini Drawer Active' : 'Full Drawer Active'"
                  color="primary"
                  inset
                  hide-details
                  @update:model-value="store.toggleNavigationMode"
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
                <v-btn color="red" @click="clearAllData">Clear All Input Data</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card class="setting-card">
              <v-card-title>Manage Views</v-card-title>
              <v-card-subtitle>Control which navigation links are visible.</v-card-subtitle>
              <v-divider class="my-2"></v-divider>
              <v-card-text>
                <div v-for="view in allNavigableViews" :key="view.name" class="mb-2">
                  <v-switch
                    v-model="store.viewVisibility[view.name]"
                    :prepend-icon="view.icon"
                    :label="`${view.title} (${store.viewVisibility[view.name] ? 'Visible' : 'Hidden'})`"
                    color="primary"
                    inset
                    hide-details
                    @update:model-value="(newValue) => store.setViewVisibility(view.name, newValue)"
                  ></v-switch>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card class="setting-card">
              <v-card-title>View Presets</v-card-title>
              <v-card-subtitle>Save and load combinations of visible views.</v-card-subtitle>
              <v-divider class="my-2"></v-divider>
              <v-card-text>
                <v-btn color="primary" class="mb-4" @click="openCreatePresetDialog">
                  Create New Preset
                </v-btn>

                <!-- Presets Dropdown -->
                <v-select
                  v-model="store.selectedPreset"
                  :items="Object.keys(store.viewPresets)"
                  label="Select Preset to Apply"
                  clearable
                  class="mb-4"
                  @update:model-value="applyPreset"
                ></v-select>

                <h3 v-if="Object.keys(store.viewPresets).length > 0" class="mb-2">
                  Saved Presets:
                </h3>
                <v-list v-if="Object.keys(store.viewPresets).length > 0" dense class="mb-4">
                  <v-list-item
                    v-for="(preset, name) in store.viewPresets"
                    :key="name"
                    class="preset-list-item"
                  >
                    <v-list-item-title>{{ name }}</v-list-item-title>
                    <v-list-item-action>
                      <v-btn
                        small
                        icon
                        title="Apply Preset"
                        class="mr-2"
                        @click="applyPreset(name)"
                      >
                        <v-icon>mdi-content-save-check</v-icon>
                      </v-btn>
                      <v-btn
                        small
                        icon
                        title="Update Preset"
                        class="mr-2"
                        @click="openUpdatePresetDialog(name)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        small
                        icon
                        color="error"
                        title="Delete Preset"
                        @click="deletePreset(name)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
                <p v-else>No presets saved yet.</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Create Preset Dialog -->
        <v-dialog v-model="createPresetDialog" max-width="500px">
          <v-card>
            <v-card-title class="headline">Create New View Preset</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="newPresetName"
                label="Preset Name"
                :rules="presetNameRules"
                required
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="createPresetDialog = false">Cancel</v-btn>
              <v-btn color="primary" @click="saveNewPreset">Save Preset</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Update Preset Dialog -->
        <v-dialog v-model="updatePresetDialog" max-width="500px">
          <v-card>
            <v-card-title class="headline">Update View Preset</v-card-title>
            <v-card-text>
              <p>
                Are you sure you want to update the preset
                <strong>{{ presetToUpdateName }}</strong> with the current view visibility settings?
              </p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="updatePresetDialog = false">Cancel</v-btn>
              <v-btn color="warning" @click="updatePreset">Update Preset</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="confirmUpdateOrCreateDialog" max-width="550px">
          <v-card>
            <v-card-title class="headline">Preset Action for {{ presetToUpdateName }}</v-card-title>
            <v-card-text>
              <p>Do you want to:</p>
              <ul>
                <li>Update this existing preset with the current view settings?</li>
                <li>Create a new preset based on the current view settings?</li>
              </ul>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="handlePresetChoice('cancel')">Cancel</v-btn>
              <v-btn color="primary" @click="handlePresetChoice('create')">Create New</v-btn>
              <v-btn color="warning" @click="handlePresetChoice('update')">Update This One</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Snackbar for feedback -->
        <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="3000" bottom right>
          {{ snackbarText }}
          <template #action="{ attrs }">
            <v-btn color="white" text v-bind="attrs" @click="showSnackbar = false"> Close </v-btn>
          </template>
        </v-snackbar>
        <v-row>
          <v-col cols="12">
            <v-card class="setting-card">
              <v-card-title>JSON Save Location</v-card-title>
              <v-card-subtitle>Configure where JSON files will be saved on disk.</v-card-subtitle>
              <v-divider class="my-2"></v-divider>
              <v-card-text>
                <p>Current save path: {{ store.jsonSavePath }}</p>
                <v-btn color="primary" @click="store.selectJsonSavePath"
                  >Select Save Directory</v-btn
                >
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
                <v-btn color="warning" @click="store.resetSettings">Reset All Settings</v-btn>
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
                <p class="mb-3">Current Version: {{ store.appVersion }}</p>
                <v-btn
                  v-if="store.updateStatus === 'available'"
                  color="primary"
                  @click="downloadUpdate"
                >
                  Update Now
                </v-btn>

                <v-btn
                  v-else
                  color="info"
                  :loading="store.updateStatus === 'checking'"
                  @click="checkForUpdates"
                >
                  Check for Updates
                </v-btn>
                <div v-if="store.updateStatus" class="mt-4">
                  <v-alert v-if="store.updateStatus === 'checking'" type="info" dense>
                    Checking for updates...
                  </v-alert>
                  <v-alert v-if="store.updateStatus === 'available'" type="success" dense>
                    A new version is available: {{ store.releaseInfo?.version }}
                    <div v-if="store.releaseInfo?.releaseNotes" class="release-notes-content mt-2">
                      <p><strong>Release Notes:</strong></p>
                      <div v-html="store.releaseInfo.releaseNotes"></div>
                    </div>
                  </v-alert>
                  <v-alert v-if="store.updateStatus === 'not-available'" type="info" dense>
                    You are on the latest version.
                  </v-alert>
                  <v-alert v-if="store.updateStatus === 'downloading'" type="info" dense>
                    Downloading update... {{ store.releaseInfo?.percent.toFixed(2) }}%
                    <v-progress-linear
                      :model-value="store.releaseInfo?.percent"
                      class="mt-2"
                    ></v-progress-linear>
                  </v-alert>
                  <v-alert v-if="store.updateStatus === 'downloaded'" type="success" dense>
                    Update downloaded. It will be installed on restart.
                  </v-alert>
                  <v-alert v-if="store.updateStatus === 'error'" type="error" dense>
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
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 12px;
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
  border-radius: 4px;
}

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
