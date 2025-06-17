<script setup>
import { onMounted } from 'vue'
import { useAppStateStore } from '../store/appState'
import { useImagePreview } from '../composables/imagePreview'

const props = defineProps({
  team: {
    type: Object,
    required: true
  }
})

const store = useAppStateStore()
const { imageDataUrl: teamImageDataUrl, loadImagePreview: loadTeamImagePreview } = useImagePreview()
const { imageDataUrl: flagImageDataUrl, loadImagePreview: loadFlagImagePreview } = useImagePreview()

const selectImageFile = async (type) => {
  const result = await window.api.openFileDialog(type)
  if (!result || !result.path) return

  const { path } = result
  if (type === 'image') {
    store.updateTeam(props.team.id, { teamImage: path })
    await loadTeamImagePreview(path)
  } else {
    store.updateTeam(props.team.id, { flagImage: path })
    await loadFlagImagePreview(path)
  }
}

const handleClearImage = () => {
  store.updateTeam(props.team.id, { teamImage: '' })
  teamImageDataUrl.value = ''
}

const handleClearFlag = () => {
  store.updateTeam(props.team.id, { flagImage: '' })
  flagImageDataUrl.value = ''
}

const handleNameChange = (value) => {
  store.updateTeam(props.team.id, { teamName: value })
}

const handleScoreChange = (value) => {
  store.updateTeam(props.team.id, { score: Number(value) || 0 })
}

onMounted(async () => {
  if (props.team.teamImage) {
    await loadTeamImagePreview(props.team.teamImage)
  }
  if (props.team.flagImage) {
    await loadFlagImagePreview(props.team.flagImage)
  }
})
</script>

<template>
  <div class="team-row-container">
    <v-row align="center" no-gutters class="team-row">
      <!-- Team Image Section -->
      <v-col cols="3" class="pa-1">
        <div v-if="props.team.teamImage && teamImageDataUrl" class="image-preview-container">
          <div class="image-preview-wrapper">
            <img :src="teamImageDataUrl" alt="Team Image Preview" class="tiny-image-preview" />
            <span class="image-preview-label">Team Image:</span>
          </div>
        </div>
        <v-text-field
          :model-value="props.team.teamImage.split(/[\\/]/).pop() || ''"
          label="Team Image"
          readonly
          hide-details="auto"
          class="custom-text-input"
          flat
          @click="selectImageFile('image')"
        >
          <template #append-inner>
            <v-btn
              v-if="!props.team.teamImage"
              small
              text
              class="add-button-file"
              :ripple="false"
              @click.stop="selectImageFile('image')"
            >
              + ADD
            </v-btn>
            <v-btn
              v-if="props.team.teamImage"
              small
              icon
              class="clear-button"
              @click.stop="handleClearImage"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
      <!-- Flag Image Section -->
      <v-col cols="3" class="pa-1">
        <div v-if="props.team.flagImage && flagImageDataUrl" class="image-preview-container">
          <div class="image-preview-wrapper">
            <img :src="flagImageDataUrl" alt="Flag Image Preview" class="tiny-image-preview" />
            <span class="image-preview-label">Flag Image:</span>
          </div>
        </div>
        <v-text-field
          :model-value="props.team.flagImage.split(/[\\/]/).pop() || ''"
          label="Flag Image"
          readonly
          hide-details="auto"
          class="custom-text-input"
          flat
          @click="selectImageFile('flag')"
        >
          <template #append-inner>
            <v-btn
              v-if="!props.team.flagImage"
              small
              text
              class="add-button-file"
              :ripple="false"
              @click.stop="selectImageFile('flag')"
            >
              + ADD
            </v-btn>
            <v-btn
              v-if="props.team.flagImage"
              small
              icon
              class="clear-button"
              @click.stop="handleClearFlag"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
      <!-- Team Name Section -->
      <v-col cols="3" class="pa-1">
        <v-text-field
          label="Team Name"
          :model-value="props.team.teamName"
          hide-details="auto"
          class="custom-text-input"
          append-inner-icon="mdi-pencil"
          flat
          @update:model-value="handleNameChange"
        />
      </v-col>
      <!-- Score Section -->
      <v-col cols="3" class="pa-1">
        <v-text-field
          label="Score"
          :model-value="props.team.score"
          type="number"
          min="0"
          hide-details="auto"
          class="custom-text-input"
          append-inner-icon="mdi-pencil"
          flat
          @update:model-value="handleScoreChange"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.team-row-container {
  background-color: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  border-bottom: 1px solid rgb(var(--v-theme-input-border));
  margin-bottom: 8px;
  border-radius: 4px;
}

.team-row {
  padding: 8px;
}

.custom-text-input {
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}

.custom-text-input .v-field__overlay,
.custom-text-input .v-field__field {
  background-color: rgb(var(--v-theme-input-background)) !important;
}

.custom-text-input .v-input__control {
  background-color: rgb(var(--v-theme-input-background)) !important;
  border: 1px solid rgb(var(--v-theme-input-border)) !important;
  box-shadow: none !important;
  border-radius: 4px !important;
  min-height: 48px !important;
  padding: 0 12px;
  width: 100%;
  max-width: 100%;
}

.custom-text-input .v-label {
  color: rgb(var(--v-theme-input-label)) !important;
  font-size: 14px !important;
  font-weight: bold;
  opacity: 1 !important;
  transform: translateY(-50%) scale(1) !important;
  top: 50% !important;
  left: 12px !important;
  pointer-events: none;
}

/* Image Preview Styles */
.image-preview-container {
  margin-bottom: 4px; /* Slight spacing between image and text field */
}

.image-preview-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: rgb(var(--v-theme-input-background));
  border: 1px solid rgb(var(--v-theme-input-border));
  border-radius: 4px;
}

.tiny-image-preview {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgb(var(--v-theme-input-border));
}

.image-preview-label {
  font-size: 12px;
  color: rgb(var(--v-theme-input-label));
  font-weight: 500;
}

.custom-text-input .v-field__input {
  color: rgb(var(--v-theme-input-text)) !important;
}

.custom-text-input .v-field__input::placeholder {
  color: rgba(var(--v-theme-input-text), 0.7) !important;
  opacity: 1 !important;
}

.add-button-file {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  padding: 0 8px;
  min-width: auto;
  height: 100%;
  border-radius: 0 4px 4px 0;
  background-color: transparent;
  position: absolute;
  right: 0;
  top: 0;
  transition: all 0.1s ease;
}

.clear-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.custom-text-input .v-input__append-inner .v-icon {
  color: rgb(var(--v-theme-input-label)) !important;
  font-size: 18px !important;
  margin-right: 8px;
  transition: all 0.1s ease;
}

.custom-text-input .v-input__append-inner {
  padding: 0;
  margin: 0;
}

.custom-text-input .v-field__input {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  height: auto !important;
  min-height: auto !important;
}

.custom-text-input .v-field__outline {
  display: none !important;
}

.custom-text-input .v-field__field {
  padding: 0 !important;
}

.custom-text-input .v-label {
  left: 12px !important;
  transform: translateY(-50%) scale(1) !important;
  top: 50% !important;
}
</style>
