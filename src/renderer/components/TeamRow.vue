<script setup>
import { ref, watch, onUnmounted } from 'vue'

const emit = defineEmits(['update-team'])

const props = defineProps({
  team: {
    type: Object,
    required: true,
  },
})

const imagePreviewUrl = ref('')
const flagPreviewUrl = ref('')

// Lazy-load previews only when a file is selected
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

watch(
  () => props.team.imageFile,
  (newFile) => {
    createPreview(newFile, imagePreviewUrl)
  },
  { immediate: true },
)

watch(
  () => props.team.flagFile,
  (newFile) => {
    createPreview(newFile, flagPreviewUrl)
  },
  { immediate: true },
)

const handleImageFileChange = (fileInput) => {
  const file = Array.isArray(fileInput) ? fileInput[0] || null : fileInput
  const updatedTeam = {
    ...props.team,
    imageFile: file,
  }
  emit('update-team', updatedTeam)
}

const handleFlagFileChange = (fileInput) => {
  const file = Array.isArray(fileInput) ? fileInput[0] || null : fileInput
  const updatedTeam = {
    ...props.team,
    flagFile: file,
  }
  emit('update-team', updatedTeam)
}

const handleClearImage = () => {
  handleImageFileChange(null)
}

const handleClearFlag = () => {
  handleFlagFileChange(null)
}

const handleNameChange = (value) => {
  const updatedTeam = {
    ...props.team,
    name: value,
  }
  emit('update-team', updatedTeam)
}

const handleScoreChange = (value) => {
  const updatedTeam = {
    ...props.team,
    score: Number(value),
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
</script>

<template>
  <div class="team-row-container">
    <v-row align="center" no-gutters class="team-row">
      <v-col cols="3" class="pa-1">
        <v-file-input
          :label="imagePreviewUrl ? '' : 'Team Image'"
          :model-value="props.team.imageFile"
          accept="image/*"
          hide-details="auto"
          prepend-icon=""
          class="custom-file-input"
          @update:model-value="handleImageFileChange"
          @click:clear="handleClearImage"
          flat
        >
          <template v-slot:append-inner>
            <v-btn v-if="!props.team.imageFile" small text class="add-button-file" :ripple="false">
              + ADD
            </v-btn>
          </template>
        </v-file-input>
      </v-col>

      <v-col cols="3" class="pa-1">
        <v-file-input
          :label="flagPreviewUrl ? '' : 'Team Flag'"
          :model-value="props.team.flagFile"
          accept="image/*"
          prepend-icon=""
          hide-details="auto"
          class="custom-file-input"
          @update:model-value="handleFlagFileChange"
          @click:clear="handleClearFlag"
          flat
        >
          <template v-slot:append-inner>
            <v-btn v-if="!props.team.flagFile" small text class="add-button-file" :ripple="false">
              + ADD
            </v-btn>
          </template>
        </v-file-input>
      </v-col>

      <v-col cols="3" class="pa-1">
        <v-text-field
          label="Team Name"
          :model-value="props.team.name"
          @update:model-value="handleNameChange"
          type="text"
          hide-details="auto"
          class="custom-text-input"
          append-inner-icon="mdi-pencil"
          flat
        ></v-text-field>
      </v-col>

      <v-col cols="3" class="pa-1">
        <v-text-field
          label="Team Score"
          :model-value="props.team.score"
          @update:model-value="handleScoreChange"
          type="number"
          min="0"
          hide-details="auto"
          class="custom-text-input"
          append-inner-icon="mdi-pencil"
          flat
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.team-row-container {
  background-color: #1e2a38;
  color: #ffffff;
  border-bottom: 1px solid #2c3e50;
  transition: all 0.1s ease; /* Smooth transitions for layout changes */
}

.team-row {
  background-color: #1e2a38;
  will-change: transform; /* Optimize for GPU acceleration */
}

.custom-file-input,
.custom-text-input {
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.1s ease; /* Smooth transitions for input changes */
}

.custom-file-input .v-field__overlay,
.custom-text-input .v-field__overlay,
.custom-file-input .v-field__field,
.custom-text-input .v-field__field {
  background-color: #2c3e50 !important;
  transition: background-color 0.1s ease; /* Smooth background changes */
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
  will-change: transform; /* Optimize for GPU acceleration */
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
  transition: all 0.1s ease; /* Smooth label transitions */
}

.custom-file-input .v-field__input,
.custom-text-input .v-field__input {
  color: #ffffff !important;
  will-change: transform; /* Optimize for GPU acceleration */
}

.custom-file-input .v-field__input::placeholder,
.custom-text-input .v-field__input::placeholder {
  color: #ffffff !important;
  opacity: 1 !important;
}

.custom-file-input .v-file-input__text {
  color: #ffffff;
  padding-right: 50px;
  transition: all 0.1s ease; /* Smooth text changes */
}

.custom-text-input input {
  color: #ffffff;
  padding-right: 40px;
  transition: all 0.1s ease; /* Smooth text changes */
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
  transition: all 0.1s ease; /* Smooth button transitions */
}

.custom-text-input .v-input__append-inner .v-icon {
  color: #ffffff !important;
  font-size: 18px !important;
  margin-right: 8px;
  transition: all 0.1s ease; /* Smooth icon transitions */
}

.custom-file-input .v-input__prepend-inner,
.custom-file-input .v-input__append-inner,
.custom-text-input .v-input__prepend-inner,
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
