<script setup>
import { ref, onUnmounted, computed } from 'vue'

const emit = defineEmits(['update-team'])

const props = defineProps({
  team: {
    type: Object,
    required: true
  }
})

const imagePreviewUrl = ref('')
const flagPreviewUrl = ref('')
const imageFilePath = ref('')
const flagFilePath = ref('')

// Open Electron file dialog to select an image
const selectImageFile = async (type) => {
  const result = await window.api.openFileDialog(type)
  if (!result) return // User canceled the dialog

  const { path } = result

  if (type === 'image') {
    imageFilePath.value = path // Store full path
    const updatedTeam = {
      ...props.team,
      TeamImage: path // Store the full path
    }
    emit('update-team', updatedTeam)
  } else if (type === 'flag') {
    flagFilePath.value = path // Store full path
    const updatedTeam = {
      ...props.team,
      FlagImage: path // Store the full path
    }
    emit('update-team', updatedTeam)
  }
}

const handleClearImage = () => {
  imageFilePath.value = ''
  const updatedTeam = {
    ...props.team,
    TeamImage: null
  }
  emit('update-team', updatedTeam)
}

const handleClearFlag = () => {
  flagFilePath.value = ''
  const updatedTeam = {
    ...props.team,
    FlagImage: null
  }
  emit('update-team', updatedTeam)
}

const handleNameChange = (value) => {
  const updatedTeam = {
    ...props.team,
    TeamName: value
  }
  emit('update-team', updatedTeam)
}

const handleScoreChange = (value) => {
  const updatedTeam = {
    ...props.team,
    Score: Number(value)
  }
  emit('update-team', updatedTeam)
}

onUnmounted(() => {
  ;[imagePreviewUrl, flagPreviewUrl].forEach((urlRef) => {
    if (urlRef.value?.startsWith('blob:')) {
      URL.revokeObjectURL(urlRef.value)
    }
  })
})

// Computed properties to display only the file name
const imageFileName = computed(() => imageFilePath.value.split(/[\\/]/).pop() || '')
const flagFileName = computed(() => flagFilePath.value.split(/[\\/]/).pop() || '')
</script>

<template>
  <div class="team-row-container">
    <v-row align="center" no-gutters class="team-row">
      <v-col cols="3" class="pa-1">
        <v-text-field
          :model-value="imageFileName"
          label="Team Image"
          readonly
          hide-details="auto"
          class="custom-text-input"
          flat
          @click="selectImageFile('image')"
        >
          <template v-slot:append-inner>
            <v-btn
              v-if="!imageFileName"
              small
              text
              class="add-button-file"
              :ripple="false"
              @click.stop="selectImageFile('image')"
            >
              + ADD
            </v-btn>
            <v-btn
              v-if="imageFileName"
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
      <v-col cols="3" class="pa-1">
        <v-text-field
          :model-value="flagFileName"
          label="Flag Image"
          readonly
          hide-details="auto"
          class="custom-text-input"
          flat
          @click="selectImageFile('flag')"
        >
          <template v-slot:append-inner>
            <v-btn
              v-if="!flagFileName"
              small
              text
              class="add-button-file"
              :ripple="false"
              @click.stop="selectImageFile('flag')"
            >
              + ADD
            </v-btn>
            <v-btn
              v-if="flagFileName"
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
      <v-col cols="3" class="pa-1">
        <v-text-field
          label="Team Name"
          :model-value="props.team.TeamName"
          hide-details="auto"
          class="custom-text-input"
          append-inner-icon="mdi-pencil"
          flat
          @update:model-value="handleNameChange"
        />
      </v-col>
      <v-col cols="3" class="pa-1">
        <v-text-field
          label="Score"
          :model-value="props.team.Score"
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
  background-color: #1e2a38;
  color: #ffffff;
  border-bottom: 1px solid #2c3e50;
  margin-bottom: 8px;
  border-radius: 4px;
}

.team-row {
  padding: 8px;
}

.custom-file-input,
.custom-text-input {
  border-radius: 4px;
  overflow: hidden;
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
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: none !important;
  border-radius: 4px !important;
  min-height: 48px !important;
  padding: 0 12px;
}

.custom-file-input .v-label,
.custom-text-input .v-label {
  color: #ffffff !important;
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
  color: #ffffff !important;
}

.custom-file-input .v-field__input::placeholder,
.custom-text-input .v-field__input::placeholder {
  color: #ffffff !important;
  opacity: 1 !important;
}

.custom-file-input .v-file-input__text {
  color: #ffffff;
  padding-right: 50px;
}

.custom-text-input input {
  color: #ffffff;
  padding-right: 40px;
}

.add-button-file {
  color: #00c853 !important;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  padding: 0 8px;
  min-width: auto;
  height: 100%;
  border-radius: 0 4px 4px 0;
  background-color: #2c3e50;
  position: absolute;
  right: 0;
  top: 0;
}

.clear-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.custom-text-input .v-input__append-inner .v-icon {
  color: #ffffff !important;
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
