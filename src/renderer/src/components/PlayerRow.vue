<script setup>
import { onMounted } from 'vue'
import { useAppStateStore } from '../store/appState'
import { useImagePreview } from '../composables/imagePreview'

const store = useAppStateStore()
const { imageDataUrl, loadImagePreview } = useImagePreview()

const updatePlayerField = (field, value) => {
  store.updatePlayers({ [field]: value })
}

const selectImageFile = async () => {
  const result = await window.api.openFileDialog('image')
  if (result && result.path) {
    updatePlayerField('heroImage', result.path)
    await loadImagePreview(result.path)
  }
}

const handleClearHeroImage = () => {
  updatePlayerField('heroImage', '')
  imageDataUrl.value = ''
}

onMounted(async () => {
  if (store.players.heroImage) {
    await loadImagePreview(store.players.heroImage)
  }
})
</script>

<template>
  <div class="player-stats-panel-container">
    <v-row no-gutters class="panel-row">
      <v-col cols="12" class="pa-1">
        <v-card class="player-stats-panel" flat>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              :model-value="store.players.playerName"
              label="Player Name"
              type="text"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="(value) => updatePlayerField('playerName', value)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              :model-value="store.players.teamName"
              label="Team Name"
              type="text"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="(value) => updatePlayerField('teamName', value)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              :model-value="store.players.favouriteWeapon"
              label="Favorite Weapon"
              append-inner-icon="mdi-pencil"
              type="text"
              hide-details="auto"
              class="custom-text-input"
              flat
              @update:model-value="(value) => updatePlayerField('favouriteWeapon', value)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              :model-value="store.players.economyScore"
              label="Economy Score"
              type="number"
              min="0"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="(value) => updatePlayerField('economyScore', Number(value))"
            ></v-text-field>
          </v-col>

          <!-- Image Preview Section -->
          <v-col
            v-if="store.players.heroImage && imageDataUrl"
            cols="12"
            class="pa-1 image-preview-container"
          >
            <div class="image-preview-wrapper">
              <img
                :src="imageDataUrl"
                alt="Hero Image Preview"
                class="tiny-image-preview"
                @error="handleImageError"
              />
              <span class="image-preview-label">Selected Image:</span>
            </div>
          </v-col>

          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              :model-value="store.players.heroImage.split(/[\\/]/).pop() || ''"
              label="Hero Image"
              readonly
              hide-details="auto"
              class="custom-text-input"
              flat
              @click="selectImageFile"
            >
              <template #append-inner>
                <v-btn
                  v-if="!store.players.heroImage"
                  small
                  text
                  class="add-button-file"
                  :ripple="false"
                  @click.stop="selectImageFile"
                >
                  + ADD
                </v-btn>
                <v-btn
                  v-if="store.players.heroImage"
                  small
                  icon
                  class="clear-button"
                  @click.stop="handleClearHeroImage"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              :model-value="store.players.kills"
              label="Kills"
              type="number"
              min="0"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="(value) => updatePlayerField('kills', Number(value))"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              :model-value="store.players.deaths"
              label="Deaths"
              type="number"
              min="0"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="(value) => updatePlayerField('deaths', Number(value))"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              :model-value="store.players.assists"
              label="Assists"
              type="number"
              min="0"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="(value) => updatePlayerField('assists', Number(value))"
            ></v-text-field>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.player-stats-panel-container {
  color: rgb(var(--v-theme-on-surface));
  padding: 8px;
}

.panel-row {
  background-color: transparent;
  margin-bottom: 16px;
}

.player-stats-panel {
  background-color: rgb(var(--v-theme-surface));
}

.panel-title {
  font-size: 16px;
  font-weight: bold;
  color: rgb(var(--v-theme-on-surface));
  padding: 8px 0;
  text-transform: uppercase;
}

.input-spacing {
  margin-bottom: 12px;
}

.input-spacing:last-child {
  margin-bottom: 0;
}

/* Image Preview Styles */
.image-preview-container {
  margin-bottom: 8px;
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

/* Custom Input Field Styles Themed */
.custom-file-input,
.custom-text-input {
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}

.custom-file-input .v-field__overlay,
.custom-text-input .v-field__overlay,
.custom-file-input .v-field__field,
.custom-text-input .v-field__field {
  background-color: rgb(var(--v-theme-input-background)) !important;
}

.custom-file-input .v-input__control,
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

.custom-file-input .v-label,
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

.custom-file-input .v-field__input,
.custom-text-input .v-field__input {
  color: rgb(var(--v-theme-input-text)) !important;
}

.custom-file-input .v-field__input::placeholder,
.custom-text-input .v-field__input::placeholder {
  color: rgba(var(--v-theme-input-text), 0.7) !important;
  opacity: 1 !important;
}

.custom-file-input .v-file-input__text {
  color: rgb(var(--v-theme-input-text));
  padding-right: 50px;
}

.custom-text-input input {
  color: rgb(var(--v-theme-input-text));
  padding-right: 40px;
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

.custom-text-input .v-input__append-inner .v-icon,
.custom-file-input .v-input__append-inner .v-icon {
  color: rgb(var(--v-theme-input-label)) !important;
  font-size: 18px !important;
  margin-right: 8px;
  transition: all 0.1s ease;
}

.custom-file-input .v-input__prepend-inner,
.custom-file-input .v-input__append-inner,
.custom-text-input .v-input__prepend-inner,
.custom-text-input .v-input__append-inner {
  padding: 0;
  margin: 0;
}

.custom-text-input .v-field__input,
.custom-file-input .v-field__input {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  height: auto !important;
  min-height: auto !important;
}

.custom-file-input .v-field__outline,
.custom-text-input .v-field__outline {
  display: none !important;
}

.custom-file-input .v-field__field,
.custom-text-input .v-field__field {
  padding: 0 !important;
}

.custom-file-input:not(.v-input--is-dirty) .v-label,
.custom-text-input .v-label {
  left: 12px !important;
  transform: translateY(-50%) scale(1) !important;
  top: 50% !important;
}
</style>
