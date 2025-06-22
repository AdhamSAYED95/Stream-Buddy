<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useAppStateStore } from '../store/appState'
import { useImagePreview } from '../composables/imagePreview'

const store = useAppStateStore()

const imagePreviews = reactive({
  firstMatch: {
    leftTeamLogo: useImagePreview(),
    leftTeamFlag: useImagePreview(),
    rightTeamLogo: useImagePreview(),
    rightTeamFlag: useImagePreview()
  },
  secondMatch: {
    leftTeamLogo: useImagePreview(),
    leftTeamFlag: useImagePreview(),
    rightTeamLogo: useImagePreview(),
    rightTeamFlag: useImagePreview()
  }
})

const selectImageFile = async (matchKey, field) => {
  const result = await window.api.openFileDialog('image')
  if (result && result.path) {
    store.updateMatches({
      [matchKey]: {
        ...store.matches[matchKey],
        [field]: result.path
      }
    })
    await imagePreviews[matchKey][field].loadImagePreview(result.path)
  }
}

const updateMatchesData = (matchKey, field, value) => {
  store.updateMatches({
    [matchKey]: {
      ...store.matches[matchKey],
      [field]: value
    }
  })
}

const updateMatchDate = (field, value) => {
  store.updateMatches({ [field]: value })
}

const handleClearImage = (matchKey, field) => {
  store.updateMatches({
    [matchKey]: {
      ...store.matches[matchKey],
      [field]: ''
    }
  })
  imagePreviews[matchKey][field].clearPreview()
}

const createFileNameComputed = (matchKey, fieldName) => {
  return computed(() => {
    const imagePath = store.matches[matchKey]?.[fieldName]
    return typeof imagePath === 'string' && imagePath ? imagePath.split(/[\\/]/).pop() : ''
  })
}

const firstMatchLeftLogoFileName = createFileNameComputed('firstMatch', 'leftTeamLogo')
const firstMatchRightLogoFileName = createFileNameComputed('firstMatch', 'rightTeamLogo')
const firstMatchLeftFlagFileName = createFileNameComputed('firstMatch', 'leftTeamFlag')
const firstMatchRightFlagFileName = createFileNameComputed('firstMatch', 'rightTeamFlag')

const secondMatchLeftLogoFileName = createFileNameComputed('secondMatch', 'leftTeamLogo')
const secondMatchRightLogoFileName = createFileNameComputed('secondMatch', 'rightTeamLogo')
const secondMatchLeftFlagFileName = createFileNameComputed('secondMatch', 'leftTeamFlag')
const secondMatchRightFlagFileName = createFileNameComputed('secondMatch', 'rightTeamFlag')

onMounted(() => {
  for (const matchKey in imagePreviews) {
    for (const field in imagePreviews[matchKey]) {
      const imagePath = store.matches[matchKey]?.[field]
      if (imagePath) {
        imagePreviews[matchKey][field].loadImagePreview(imagePath)
      }
    }
  }
})
</script>

<template>
  <div class="matches-container">
    <v-row no-gutters class="panel-row">
      <v-col cols="12" class="pa-0">
        <v-card class="info-panel" flat>
          <v-card-title class="panel-title">INFO</v-card-title>
          <v-text-field
            :model-value="store.matches.date"
            label="Date"
            type="text"
            hide-details="auto"
            class="custom-text-input"
            flat
            @update:model-value="(value) => updateMatchDate('date', value)"
          ></v-text-field>
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters class="panel-row">
      <v-col cols="12" class="pa-0">
        <v-card class="match-panel" flat>
          <v-card-title class="panel-title">FIRST MATCH</v-card-title>
          <v-text-field
            :model-value="store.matches.firstMatch.matchTime"
            label="Match Time"
            type="text"
            hide-details="auto"
            class="custom-text-input"
            flat
            @update:model-value="(value) => updateMatchesData('firstMatch', 'matchTime', value)"
          ></v-text-field>
          <v-row no-gutters>
            <v-col cols="6" class="team-section">
              <v-text-field
                :model-value="store.matches.firstMatch.leftTeamName"
                label="Left Team Name"
                type="text"
                hide-details="auto"
                class="custom-text-input"
                flat
                @update:model-value="
                  (value) => updateMatchesData('firstMatch', 'leftTeamName', value)
                "
              ></v-text-field>

              <div v-if="store.matches.firstMatch.leftTeamLogo" class="image-preview-container">
                <div class="image-preview-wrapper">
                  <img
                    :src="imagePreviews.firstMatch.leftTeamLogo.imageDataUrl"
                    alt="Logo Preview"
                    class="tiny-image-preview"
                  />
                  <span class="image-preview-label">Selected Logo:</span>
                </div>
              </div>
              <v-text-field
                :model-value="firstMatchLeftLogoFileName"
                label="Left Team Logo"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageFile('firstMatch', 'leftTeamLogo')"
              >
                <template #append-inner>
                  <v-btn
                    v-if="!firstMatchLeftLogoFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageFile('firstMatch', 'leftTeamLogo')"
                    >+ ADD</v-btn
                  >
                  <v-btn
                    v-if="firstMatchLeftLogoFileName"
                    small
                    icon
                    class="clear-button"
                    @click.stop="handleClearImage('firstMatch', 'leftTeamLogo')"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </template>
              </v-text-field>

              <div v-if="store.matches.firstMatch.leftTeamFlag" class="image-preview-container">
                <div class="image-preview-wrapper">
                  <img
                    :src="imagePreviews.firstMatch.leftTeamFlag.imageDataUrl"
                    alt="Flag Preview"
                    class="tiny-image-preview"
                  />
                  <span class="image-preview-label">Selected Flag:</span>
                </div>
              </div>
              <v-text-field
                :model-value="firstMatchLeftFlagFileName"
                label="Left Team Flag"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageFile('firstMatch', 'leftTeamFlag')"
              >
                <template #append-inner>
                  <v-btn
                    v-if="!firstMatchLeftFlagFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageFile('firstMatch', 'leftTeamFlag')"
                    >+ ADD</v-btn
                  >
                  <v-btn
                    v-if="firstMatchLeftFlagFileName"
                    small
                    icon
                    class="clear-button"
                    @click.stop="handleClearImage('firstMatch', 'leftTeamFlag')"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="6" class="team-section">
              <v-text-field
                :model-value="store.matches.firstMatch.rightTeamName"
                label="Right Team Name"
                type="text"
                hide-details="auto"
                class="custom-text-input"
                flat
                @update:model-value="
                  (value) => updateMatchesData('firstMatch', 'rightTeamName', value)
                "
              ></v-text-field>

              <div v-if="store.matches.firstMatch.rightTeamLogo" class="image-preview-container">
                <div class="image-preview-wrapper">
                  <img
                    :src="imagePreviews.firstMatch.rightTeamLogo.imageDataUrl"
                    alt="Logo Preview"
                    class="tiny-image-preview"
                  />
                  <span class="image-preview-label">Selected Flag:</span>
                </div>
              </div>
              <v-text-field
                :model-value="firstMatchRightLogoFileName"
                label="Right Team Logo"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageFile('firstMatch', 'rightTeamLogo')"
              >
                <template #append-inner>
                  <v-btn
                    v-if="!firstMatchRightLogoFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageFile('firstMatch', 'rightTeamLogo')"
                    >+ ADD</v-btn
                  >
                  <v-btn
                    v-if="firstMatchRightLogoFileName"
                    small
                    icon
                    class="clear-button"
                    @click.stop="handleClearImage('firstMatch', 'rightTeamLogo')"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </template>
              </v-text-field>

              <div v-if="store.matches.firstMatch.rightTeamFlag" class="image-preview-container">
                <div class="image-preview-wrapper">
                  <img
                    :src="imagePreviews.firstMatch.rightTeamFlag.imageDataUrl"
                    alt="Flag Preview"
                    class="tiny-image-preview"
                  />
                  <span class="image-preview-label">Selected Flag:</span>
                </div>
              </div>

              <v-text-field
                :model-value="firstMatchRightFlagFileName"
                label="Right Team Flag"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageFile('firstMatch', 'rightTeamFlag')"
              >
                <template #append-inner>
                  <v-btn
                    v-if="!firstMatchRightFlagFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageFile('firstMatch', 'rightTeamFlag')"
                    >+ ADD</v-btn
                  >
                  <v-btn
                    v-if="firstMatchRightFlagFileName"
                    small
                    icon
                    class="clear-button"
                    @click.stop="handleClearImage('firstMatch', 'rightTeamFlag')"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters class="panel-row">
      <v-col cols="12" class="pa-0">
        <v-card class="match-panel" flat>
          <v-card-title class="panel-title">SECOND MATCH</v-card-title>
          <v-text-field
            :model-value="store.matches.secondMatch.matchTime"
            label="Match Time"
            type="text"
            hide-details="auto"
            class="custom-text-input"
            flat
            @update:model-value="(value) => updateMatchesData('secondMatch', 'matchTime', value)"
          ></v-text-field>
          <v-row no-gutters>
            <v-col cols="6" class="team-section">
              <v-text-field
                :model-value="store.matches.secondMatch.leftTeamName"
                label="Left Team Name"
                type="text"
                hide-details="auto"
                class="custom-text-input"
                flat
                @update:model-value="
                  (value) => updateMatchesData('secondMatch', 'leftTeamName', value)
                "
              ></v-text-field>

              <div v-if="store.matches.secondMatch.leftTeamLogo" class="image-preview-container">
                <div class="image-preview-wrapper">
                  <img
                    :src="imagePreviews.secondMatch.leftTeamLogo.imageDataUrl"
                    alt="Logo Preview"
                    class="tiny-image-preview"
                  />
                  <span class="image-preview-label">Selected Logo:</span>
                </div>
              </div>

              <v-text-field
                :model-value="secondMatchLeftLogoFileName"
                label="Left Team Logo"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageFile('secondMatch', 'leftTeamLogo')"
              >
                <template #append-inner>
                  <v-btn
                    v-if="!secondMatchLeftLogoFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageFile('secondMatch', 'leftTeamLogo')"
                    >+ ADD</v-btn
                  >
                  <v-btn
                    v-if="secondMatchLeftLogoFileName"
                    small
                    icon
                    class="clear-button"
                    @click.stop="handleClearImage('secondMatch', 'leftTeamLogo')"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </template>
              </v-text-field>

              <div v-if="store.matches.secondMatch.leftTeamFlag" class="image-preview-container">
                <div class="image-preview-wrapper">
                  <img
                    :src="imagePreviews.secondMatch.leftTeamFlag.imageDataUrl"
                    alt="Flag Preview"
                    class="tiny-image-preview"
                  />
                  <span class="image-preview-label">Selected Flag:</span>
                </div>
              </div>

              <v-text-field
                :model-value="secondMatchLeftFlagFileName"
                label="Left Team Flag"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageFile('secondMatch', 'leftTeamFlag')"
              >
                <template #append-inner>
                  <v-btn
                    v-if="!secondMatchLeftFlagFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageFile('secondMatch', 'leftTeamFlag')"
                    >+ ADD</v-btn
                  >
                  <v-btn
                    v-if="secondMatchLeftFlagFileName"
                    small
                    icon
                    class="clear-button"
                    @click.stop="handleClearImage('secondMatch', 'leftTeamFlag')"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="6" class="team-section">
              <v-text-field
                :model-value="store.matches.secondMatch.rightTeamName"
                label="Right Team Name"
                type="text"
                hide-details="auto"
                class="custom-text-input"
                flat
                @update:model-value="
                  (value) => updateMatchesData('secondMatch', 'rightTeamName', value)
                "
              ></v-text-field>

              <div v-if="store.matches.secondMatch.rightTeamLogo" class="image-preview-container">
                <div class="image-preview-wrapper">
                  <img
                    :src="imagePreviews.secondMatch.rightTeamLogo.imageDataUrl"
                    alt="Logo Preview"
                    class="tiny-image-preview"
                  />
                  <span class="image-preview-label">Selected Flag:</span>
                </div>
              </div>

              <v-text-field
                :model-value="secondMatchRightLogoFileName"
                label="Right Team Logo"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageFile('secondMatch', 'rightTeamLogo')"
              >
                <template #append-inner>
                  <v-btn
                    v-if="!secondMatchRightLogoFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageFile('secondMatch', 'rightTeamLogo')"
                    >+ ADD</v-btn
                  >
                  <v-btn
                    v-if="secondMatchRightLogoFileName"
                    small
                    icon
                    class="clear-button"
                    @click.stop="handleClearImage('secondMatch', 'rightTeamLogo')"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </template>
              </v-text-field>

              <div v-if="store.matches.secondMatch.rightTeamFlag" class="image-preview-container">
                <div class="image-preview-wrapper">
                  <img
                    :src="imagePreviews.secondMatch.rightTeamFlag.imageDataUrl"
                    alt="Flag Preview"
                    class="tiny-image-preview"
                  />
                  <span class="image-preview-label">Selected Flag:</span>
                </div>
              </div>
              <v-text-field
                :model-value="secondMatchRightFlagFileName"
                label="Right Team Flag"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageFile('secondMatch', 'rightTeamFlag')"
              >
                <template #append-inner>
                  <v-btn
                    v-if="!secondMatchRightFlagFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageFile('secondMatch', 'rightTeamFlag')"
                    >+ ADD</v-btn
                  >
                  <v-btn
                    v-if="secondMatchRightFlagFileName"
                    small
                    icon
                    class="clear-button"
                    @click.stop="handleClearImage('secondMatch', 'rightTeamFlag')"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
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

.matches-container {
  color: rgb(var(--v-theme-on-surface));
  padding: 8px;
}

.panel-row {
  background-color: transparent;
  margin-bottom: 16px;
}

.info-panel,
.match-panel {
  background-color: rgb(var(--v-theme-surface));

  border-radius: 4px;
  padding: 0 8px 8px 8px;
}

.panel-title {
  font-size: 16px;
  font-weight: bold;
  color: rgb(var(--v-theme-on-surface));
  padding: 8px 0;
  text-transform: uppercase;
}

.team-section {
  padding: 0 8px;
}

.custom-file-input,
.custom-text-input {
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
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
  min-height: 40px !important;
  padding: 0 12px;
  width: 100%;
  max-width: 100%;
}

.custom-file-input .v-label,
.custom-text-input .v-label {
  color: rgb(var(--v-theme-input-label)) !important;
  font-size: 12px !important;
  font-weight: bold;
  opacity: 1 !important;
  transform: translateY(-50%) scale(1) !important;
  top: 50% !important;
  left: 12px !important;
  pointer-events: none;
  text-transform: uppercase;
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
  padding-right: 40px;
}

.custom-text-input input {
  color: rgb(var(--v-theme-input-text));
  padding-right: 40px;
}
.add-button-file {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 10px;
  padding: 0 6px;
  min-width: auto;
  height: 80%;
  border-radius: 0 4px 4px 0;
  background-color: transparent;
  position: absolute;
  right: 0;
  top: 10%;
}

.custom-text-input .v-input__append-inner .v-icon,
.custom-file-input .v-input__append-inner .v-icon {
  color: rgb(var(--v-theme-input-label)) !important;
  font-size: 18px !important;
  margin-right: 8px;
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

.custom-file-input .v-field__field,
.custom-text-input .v-field__field {
  padding: 0 !important;
}

.custom-file-input .v-field__outline,
.custom-text-input .v-field__outline {
  display: none !important;
}

.custom-file-input:not(.v-input--is-dirty) .v-label,
.custom-text-input .v-label {
  left: 12px !important;
  transform: translateY(-50%) scale(1) !important;
  top: 50% !important;
}
</style>
