<script setup>
import { ref, watch, onUnmounted } from 'vue'

const emit = defineEmits(['update:matches'])

const props = defineProps({
  matches: {
    type: Object,
    required: true,
  },
})

const previews = {
  firstMatch: {
    leftLogoPreviewUrl: ref(''),
    rightLogoPreviewUrl: ref(''),
    leftFlagPreviewUrl: ref(''),
    rightFlagPreviewUrl: ref(''),
  },
  secondMatch: {
    leftLogoPreviewUrl: ref(''),
    rightLogoPreviewUrl: ref(''),
    leftFlagPreviewUrl: ref(''),
    rightFlagPreviewUrl: ref(''),
  },
}

// Mapping function to convert field names to preview keys
const getPreviewKey = (field) => {
  const mapping = {
    leftTeamLogo: 'leftLogoPreviewUrl',
    rightTeamLogo: 'rightLogoPreviewUrl',
    leftTeamFlag: 'leftFlagPreviewUrl',
    rightTeamFlag: 'rightFlagPreviewUrl',
  }
  return mapping[field] || ''
}

const createPreview = (file, previewUrlRef) => {
  if (previewUrlRef.value) {
    URL.revokeObjectURL(previewUrlRef.value)
  }
  if (file instanceof File) {
    previewUrlRef.value = URL.createObjectURL(file)
  } else if (typeof file === 'string' && file) {
    previewUrlRef.value = file
  } else {
    previewUrlRef.value = ''
  }
}

const updateMatchField = (matchKey, field, value) => {
  const updatedMatches = {
    ...props.matches,
    [matchKey]: {
      ...props.matches[matchKey],
      [field]: value,
    },
  }
  emit('update:matches', updatedMatches)
}

const updateImageField = (matchKey, field, file) => {
  const updatedMatches = {
    ...props.matches,
    [matchKey]: {
      ...props.matches[matchKey],
      [field]: file,
    },
  }
  emit('update:matches', updatedMatches)
  const previewKey = getPreviewKey(field)
  if (previewKey) {
    createPreview(file, previews[matchKey][previewKey])
  }
}

const handleClearImage = (matchKey, field) => {
  updateImageField(matchKey, field, null)
  const previewKey = getPreviewKey(field)
  if (previewKey) {
    previews[matchKey][previewKey].value = ''
  }
}

watch(
  () => props.matches.date,
  (newDate) => {
    emit('update:matches', { ...props.matches, date: newDate })
  },
  { immediate: true },
)

watch(
  () => props.matches.firstMatch,
  (newMatch) => {
    createPreview(newMatch.leftTeamLogo, previews.firstMatch.leftLogoPreviewUrl)
    createPreview(newMatch.rightTeamLogo, previews.firstMatch.rightLogoPreviewUrl)
    createPreview(newMatch.leftTeamFlag, previews.firstMatch.leftFlagPreviewUrl)
    createPreview(newMatch.rightTeamFlag, previews.firstMatch.rightFlagPreviewUrl)
  },
  { immediate: true },
)

watch(
  () => props.matches.secondMatch,
  (newMatch) => {
    createPreview(newMatch.leftTeamLogo, previews.secondMatch.leftLogoPreviewUrl)
    createPreview(newMatch.rightTeamLogo, previews.secondMatch.rightLogoPreviewUrl)
    createPreview(newMatch.leftTeamFlag, previews.secondMatch.leftFlagPreviewUrl)
    createPreview(newMatch.rightTeamFlag, previews.secondMatch.rightFlagPreviewUrl)
  },
  { immediate: true },
)

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
    <!-- Info Panel -->
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

    <!-- First Match Panel -->
    <v-row no-gutters class="panel-row">
      <v-col cols="12" class="pa-0">
        <v-card class="match-panel" flat>
          <v-card-title class="panel-title">FIRST MATCH</v-card-title>
          <v-text-field
            label="Match Time"
            :model-value="props.matches.firstMatch.time"
            type="time"
            hide-details="auto"
            class="custom-text-input"
            flat
            @update:model-value="updateMatchField('firstMatch', 'time', $event)"
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
              <v-file-input
                label="Left Team Logo"
                :model-value="props.matches.firstMatch.leftTeamLogo"
                accept="image/*"
                hide-details="auto"
                prepend-icon=""
                class="custom-file-input"
                flat
                @update:model-value="updateImageField('firstMatch', 'leftTeamLogo', $event)"
                @click:clear="handleClearImage('firstMatch', 'leftTeamLogo')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!props.matches.firstMatch.leftTeamLogo"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                  >
                    + ADD
                  </v-btn>
                </template>
              </v-file-input>
              <v-file-input
                label="Left Team Flag"
                :model-value="props.matches.firstMatch.leftTeamFlag"
                accept="image/*"
                hide-details="auto"
                prepend-icon=""
                class="custom-file-input"
                flat
                @update:model-value="updateImageField('firstMatch', 'leftTeamFlag', $event)"
                @click:clear="handleClearImage('firstMatch', 'leftTeamFlag')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!props.matches.firstMatch.leftTeamFlag"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                  >
                    + ADD
                  </v-btn>
                </template>
              </v-file-input>
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
              <v-file-input
                label="Right Team Logo"
                :model-value="props.matches.firstMatch.rightTeamLogo"
                accept="image/*"
                hide-details="auto"
                prepend-icon=""
                class="custom-file-input"
                flat
                @update:model-value="updateImageField('firstMatch', 'rightTeamLogo', $event)"
                @click:clear="handleClearImage('firstMatch', 'rightTeamLogo')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!props.matches.firstMatch.rightTeamLogo"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                  >
                    + ADD
                  </v-btn>
                </template>
              </v-file-input>
              <v-file-input
                label="Right Team Flag"
                :model-value="props.matches.firstMatch.rightTeamFlag"
                accept="image/*"
                hide-details="auto"
                prepend-icon=""
                class="custom-file-input"
                flat
                @update:model-value="updateImageField('firstMatch', 'rightTeamFlag', $event)"
                @click:clear="handleClearImage('firstMatch', 'rightTeamFlag')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!props.matches.firstMatch.rightTeamFlag"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                  >
                    + ADD
                  </v-btn>
                </template>
              </v-file-input>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Second Match Panel -->
    <v-row no-gutters class="panel-row">
      <v-col cols="12" class="pa-0">
        <v-card class="match-panel" flat>
          <v-card-title class="panel-title">SECOND MATCH</v-card-title>
          <v-text-field
            label="Match Time"
            :model-value="props.matches.secondMatch.time"
            type="time"
            hide-details="auto"
            class="custom-text-input"
            flat
            @update:model-value="updateMatchField('secondMatch', 'time', $event)"
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
              <v-file-input
                label="Left Team Logo"
                :model-value="props.matches.secondMatch.leftTeamLogo"
                accept="image/*"
                hide-details="auto"
                prepend-icon=""
                class="custom-file-input"
                flat
                @update:model-value="updateImageField('secondMatch', 'leftTeamLogo', $event)"
                @click:clear="handleClearImage('secondMatch', 'leftTeamLogo')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!props.matches.secondMatch.leftTeamLogo"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                  >
                    + ADD
                  </v-btn>
                </template>
              </v-file-input>
              <v-file-input
                label="Left Team Flag"
                :model-value="props.matches.secondMatch.leftTeamFlag"
                accept="image/*"
                hide-details="auto"
                prepend-icon=""
                class="custom-file-input"
                flat
                @update:model-value="updateImageField('secondMatch', 'leftTeamFlag', $event)"
                @click:clear="handleClearImage('secondMatch', 'leftTeamFlag')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!props.matches.secondMatch.leftTeamFlag"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                  >
                    + ADD
                  </v-btn>
                </template>
              </v-file-input>
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
              <v-file-input
                label="Right Team Logo"
                :model-value="props.matches.secondMatch.rightTeamLogo"
                accept="image/*"
                hide-details="auto"
                prepend-icon=""
                class="custom-file-input"
                flat
                @update:model-value="updateImageField('secondMatch', 'rightTeamLogo', $event)"
                @click:clear="handleClearImage('secondMatch', 'rightTeamLogo')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!props.matches.secondMatch.rightTeamLogo"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                  >
                    + ADD
                  </v-btn>
                </template>
              </v-file-input>
              <v-file-input
                label="Right Team Flag"
                :model-value="props.matches.secondMatch.rightTeamFlag"
                accept="image/*"
                hide-details="auto"
                prepend-icon=""
                class="custom-file-input"
                flat
                @update:model-value="updateImageField('secondMatch', 'rightTeamFlag', $event)"
                @click:clear="handleClearImage('secondMatch', 'rightTeamFlag')"
              >
                <template v-slot:append-inner>
                  <v-btn
                    v-if="!props.matches.secondMatch.rightTeamFlag"
                    small
                    text
                    class="add-button-file"
                    :ripple="false"
                  >
                    + ADD
                  </v-btn>
                </template>
              </v-file-input>
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
