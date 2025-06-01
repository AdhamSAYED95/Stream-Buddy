<script setup>
import { ref, onUnmounted, computed } from 'vue'

const emit = defineEmits(['update:matches'])

const props = defineProps({
  matches: {
    type: Object,
    required: true
  }
})

const previews = {
  firstMatch: {
    leftLogoPreviewUrl: ref(''),
    rightLogoPreviewUrl: ref(''),
    leftFlagPreviewUrl: ref(''),
    rightFlagPreviewUrl: ref('')
  },
  secondMatch: {
    leftLogoPreviewUrl: ref(''),
    rightLogoPreviewUrl: ref(''),
    leftFlagPreviewUrl: ref(''),
    rightFlagPreviewUrl: ref('')
  }
}

const updateMatchField = (matchKey, field, value) => {
  const updatedMatches = {
    ...props.matches,
    [matchKey]: {
      ...props.matches[matchKey],
      [field]: value
    }
  }
  emit('update:matches', updatedMatches)
}

// updateImageField now primarily expects a file path (or null)
const updateImageField = (matchKey, field, filePath) => {
  const updatedMatches = {
    ...props.matches,
    [matchKey]: {
      ...props.matches[matchKey],
      [field]: filePath // Store the file path
    }
  }
  emit('update:matches', updatedMatches)
}

const selectImageViaElectron = async (matchKey, field) => {
  if (window.api && typeof window.api.openFileDialog === 'function') {
    try {
      const result = await window.api.openFileDialog('image') // 'image' is a hint for the dialog
      if (result && result.path) {
        updateImageField(matchKey, field, result.path)
      }
    } catch (error) {
      console.error('Error opening file dialog:', error)
      // Optionally: show a user-facing error message
    }
  } else {
    console.error(
      'window.api.openFileDialog is not available. Ensure it is exposed via preload script in Electron.'
    )
    // Optionally: show a user-facing error message or disable the button
  }
}

const handleClearImage = (matchKey, field) => {
  updateImageField(matchKey, field, null)
}

// Helper to create computed properties for filenames
const createFileNameComputed = (matchKey, fieldName) => {
  return computed(() => {
    const imagePath = props.matches[matchKey]?.[fieldName]
    if (typeof imagePath === 'string' && imagePath) {
      return imagePath.split(/[\\/]/).pop() || ''
    }
    return ''
  })
}

// Computed file names for firstMatch
const firstMatchLeftLogoFileName = createFileNameComputed('firstMatch', 'leftTeamLogo')
const firstMatchRightLogoFileName = createFileNameComputed('firstMatch', 'rightTeamLogo')
const firstMatchLeftFlagFileName = createFileNameComputed('firstMatch', 'leftTeamFlag')
const firstMatchRightFlagFileName = createFileNameComputed('firstMatch', 'rightTeamFlag')

// Computed file names for secondMatch
const secondMatchLeftLogoFileName = createFileNameComputed('secondMatch', 'leftTeamLogo')
const secondMatchRightLogoFileName = createFileNameComputed('secondMatch', 'rightTeamLogo')
const secondMatchLeftFlagFileName = createFileNameComputed('secondMatch', 'leftTeamFlag')
const secondMatchRightFlagFileName = createFileNameComputed('secondMatch', 'rightTeamFlag')

onUnmounted(() => {
  Object.values(previews).forEach((previewSet) => {
    Object.values(previewSet).forEach((urlRef) => {
      if (urlRef.value?.startsWith('blob:')) {
        URL.revokeObjectURL(urlRef.value)
      }
    })
  })
})
</script>

<template>
  <div class="matches-container">
    <v-row no-gutters class="panel-row">
      <v-col cols="12" class="pa-0">
        <v-card class="info-panel" flat>
          <v-card-title class="panel-title">INFO</v-card-title>
          <v-text-field
            label="Date"
            :model-value="props.matches.date"
            type="date"
            hide-details="auto"
            class="custom-text-input"
            flat
            @update:model-value="emit('update:matches', { ...props.matches, date: $event })"
          ></v-text-field>
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters class="panel-row">
      <v-col cols="12" class="pa-0">
        <v-card class="match-panel" flat>
          <v-card-title class="panel-title">FIRST MATCH</v-card-title>
          <v-text-field
            label="Match Time"
            :model-value="props.matches.firstMatch.MatchTime"
            type="time"
            hide-details="auto"
            class="custom-text-input"
            flat
            @update:model-value="updateMatchField('firstMatch', 'MatchTime', $event)"
          ></v-text-field>
          <v-row no-gutters>
            <v-col cols="6" class="team-section">
              <v-text-field
                label="Left Team Name"
                :model-value="props.matches.firstMatch.leftTeamName"
                type="text"
                hide-details="auto"
                class="custom-text-input"
                flat
                @update:model-value="updateMatchField('firstMatch', 'leftTeamName', $event)"
              ></v-text-field>

              <v-text-field
                label="Left Team Logo"
                :model-value="firstMatchLeftLogoFileName"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageViaElectron('firstMatch', 'leftTeamLogo')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!firstMatchLeftLogoFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageViaElectron('firstMatch', 'leftTeamLogo')"
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

              <v-text-field
                label="Left Team Flag"
                :model-value="firstMatchLeftFlagFileName"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageViaElectron('firstMatch', 'leftTeamFlag')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!firstMatchLeftFlagFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageViaElectron('firstMatch', 'leftTeamFlag')"
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
                label="Right Team Name"
                :model-value="props.matches.firstMatch.rightTeamName"
                type="text"
                hide-details="auto"
                class="custom-text-input"
                flat
                @update:model-value="updateMatchField('firstMatch', 'rightTeamName', $event)"
              ></v-text-field>

              <v-text-field
                label="Right Team Logo"
                :model-value="firstMatchRightLogoFileName"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageViaElectron('firstMatch', 'rightTeamLogo')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!firstMatchRightLogoFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageViaElectron('firstMatch', 'rightTeamLogo')"
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

              <v-text-field
                label="Right Team Flag"
                :model-value="firstMatchRightFlagFileName"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageViaElectron('firstMatch', 'rightTeamFlag')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!firstMatchRightFlagFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageViaElectron('firstMatch', 'rightTeamFlag')"
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
            label="Match Time"
            :model-value="props.matches.secondMatch.MatchTime"
            type="time"
            hide-details="auto"
            class="custom-text-input"
            flat
            @update:model-value="updateMatchField('secondMatch', 'MatchTime', $event)"
          ></v-text-field>
          <v-row no-gutters>
            <v-col cols="6" class="team-section">
              <v-text-field
                label="Left Team Name"
                :model-value="props.matches.secondMatch.leftTeamName"
                type="text"
                hide-details="auto"
                class="custom-text-input"
                flat
                @update:model-value="updateMatchField('secondMatch', 'leftTeamName', $event)"
              ></v-text-field>

              <v-text-field
                label="Left Team Logo"
                :model-value="secondMatchLeftLogoFileName"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageViaElectron('secondMatch', 'leftTeamLogo')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!secondMatchLeftLogoFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageViaElectron('secondMatch', 'leftTeamLogo')"
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

              <v-text-field
                label="Left Team Flag"
                :model-value="secondMatchLeftFlagFileName"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageViaElectron('secondMatch', 'leftTeamFlag')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!secondMatchLeftFlagFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageViaElectron('secondMatch', 'leftTeamFlag')"
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
                label="Right Team Name"
                :model-value="props.matches.secondMatch.rightTeamName"
                type="text"
                hide-details="auto"
                class="custom-text-input"
                flat
                @update:model-value="updateMatchField('secondMatch', 'rightTeamName', $event)"
              ></v-text-field>

              <v-text-field
                label="Right Team Logo"
                :model-value="secondMatchRightLogoFileName"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageViaElectron('secondMatch', 'rightTeamLogo')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!secondMatchRightLogoFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageViaElectron('secondMatch', 'rightTeamLogo')"
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

              <v-text-field
                label="Right Team Flag"
                :model-value="secondMatchRightFlagFileName"
                readonly
                hide-details="auto"
                class="custom-text-input"
                flat
                @click="selectImageViaElectron('secondMatch', 'rightTeamFlag')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!secondMatchRightFlagFileName"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                    @click.stop="selectImageViaElectron('secondMatch', 'rightTeamFlag')"
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
.matches-container {
  background-color: #1e2a38;
  color: #ffffff;
  padding: 8px;
}

.panel-row {
  background-color: #1e2a38;
  margin-bottom: 16px;
}

.info-panel,
.match-panel {
  background-color: #1e2a38;
  border: 1px solid #2c3e50;
  border-radius: 4px;
  padding: 0 8px 8px 8px;
}

.panel-title {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
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
}

.custom-file-input .v-field__overlay,
.custom-text-input .v-field__overlay,
.custom-file-input .v-field__field,
.custom-text-input .v-field__field {
  background-color: #2c3e50 !important;
}

.custom-file-input .v-input__control,
.custom-text-input .v-input__control,
.custom-file-input .v-input__slot,
.custom-text-input .v-input__slot {
  background-color: #2c3e50 !important;
  border: 1px solid #2c3e50 !important;
  box-shadow: none !important;
  border-radius: 4px !important;
  min-height: 40px !important;
  padding: 0 12px;
}

.custom-file-input .v-label,
.custom-text-input .v-label {
  color: #ffffff !important;
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
  color: #ffffff !important;
}

.custom-file-input .v-field__input::placeholder,
.custom-text-input .v-field__input::placeholder {
  color: #ffffff !important;
  opacity: 1 !important;
}

.custom-file-input .v-file-input__text {
  color: #ffffff;
  padding-right: 40px;
}

.custom-text-input input {
  color: #ffffff;
  padding-right: 40px;
}

.add-button-file {
  color: #00c853 !important;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 10px;
  padding: 0 6px;
  min-width: auto;
  height: 80%;
  border-radius: 0 4px 4px 0;
  background-color: #2c3e50;
  position: absolute;
  right: 0;
  top: 10%;
}

.custom-text-input .v-input__append-inner .v-icon {
  color: #ffffff !important;
  font-size: 18px !important;
  margin-right: 8px;
}

.custom-file-input .v-input__append-inner .v-icon {
  color: #ffffff !important;
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
