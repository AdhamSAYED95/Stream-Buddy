<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['update-team'])

const props = defineProps({
  team: {
    type: Object,
    required: true
  }
})

const imageFilePath = ref(props.team.teamImage || '')
const flagFilePath = ref(props.team.flagImage || '')

const selectImageFile = async (type) => {
  const result = await window.api.openFileDialog(type)
  if (!result) return

  const { path } = result

  if (type === 'image') {
    imageFilePath.value = path
    const updatedTeam = {
      ...props.team,
      teamImage: path
    }
    emit('update-team', updatedTeam)
  } else if (type === 'flag') {
    flagFilePath.value = path
    const updatedTeam = {
      ...props.team,
      flagImage: path
    }
    emit('update-team', updatedTeam)
  }
}

const handleClearImage = () => {
  imageFilePath.value = ''
  const updatedTeam = {
    ...props.team,
    TeamImage: ''
  }
  emit('update-team', updatedTeam)
}

const handleClearFlag = () => {
  flagFilePath.value = ''
  const updatedTeam = {
    ...props.team,
    FlagImage: ''
  }
  emit('update-team', updatedTeam)
}

const handleNameChange = (value) => {
  const updatedTeam = {
    ...props.team,
    teamName: value
  }
  emit('update-team', updatedTeam)
}

const handleScoreChange = (value) => {
  const updatedTeam = {
    ...props.team,
    score: Number(value)
  }
  emit('update-team', updatedTeam)
}

watch(
  () => props.team,
  (newTeam) => {
    imageFilePath.value = newTeam.teamImage || ''
    flagFilePath.value = newTeam.flagImage || ''
  },
  { deep: true }
)
</script>

<template>
  <div class="team-row-container">
    <v-row align="center" no-gutters class="team-row">
      <v-col cols="3" class="pa-1">
        <v-text-field
          :model-value="imageFilePath.split(/[\\/]/).pop() || ''"
          label="Team Image"
          readonly
          hide-details="auto"
          class="custom-text-input"
          flat
          @click="selectImageFile('image')"
        >
          <template v-slot:append-inner>
            <v-btn
              v-if="!imageFilePath"
              small
              text
              class="add-button-file"
              :ripple="false"
              @click.stop="selectImageFile('image')"
            >
              + ADD
            </v-btn>
            <v-btn
              v-if="imageFilePath"
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
          :model-value="flagFilePath.split(/[\\/]/).pop() || ''"
          label="Flag Image"
          readonly
          hide-details="auto"
          class="custom-text-input"
          flat
          @click="selectImageFile('flag')"
        >
          <template v-slot:append-inner>
            <v-btn
              v-if="!flagFilePath"
              small
              text
              class="add-button-file"
              :ripple="false"
              @click.stop="selectImageFile('flag')"
            >
              + ADD
            </v-btn>
            <v-btn
              v-if="flagFilePath"
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
          :model-value="props.team.teamName"
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

.clear-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
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
