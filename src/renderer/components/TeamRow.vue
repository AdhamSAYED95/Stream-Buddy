<script setup>
import { ref, watch, onUnmounted } from 'vue'

const emit = defineEmits(['update:team'])

const props = defineProps({
  team: {
    type: Object,
    required: true,
  },
})

const imagePreviewUrl = ref('')
const flagPreviewUrl = ref('')

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
const handleImageFileChange = (file) => {
  const updatedTeam = {
    ...props.team,
    imageFile: file,
  }
  emit('update-team', updatedTeam)
}

const handleFlagFileChange = (file) => {
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

onUnmounted(() => {
  ;[imagePreviewUrl, flagPreviewUrl].forEach((urlRef) => {
    if (urlRef.value?.startsWith('blob:')) {
      URL.revokeObjectURL(urlRef.value)
    }
  })
})
</script>

<template>
  <v-card class="team-row" outlined>
    <v-row align="center" no-gutters>
      <v-col cols="12" md="3" class="pa-2">
        <v-img
          :src="imagePreviewUrl"
          :alt="props.team.name + ' logo'"
          v-if="imagePreviewUrl"
          class="team-image-preview mb-2"
          aspect-ratio="16/9"
          contain
        ></v-img>
        <v-file-input
          label="Team Image"
          :model-value="props.team.imageFile"
          accept="image/*"
          prepend-icon="mdi-camera"
          dense
          outlined
          hide-details="auto"
          @update:model-value="handleImageFileChange"
          @click:clear="handleClearImage"
        ></v-file-input>
      </v-col>

      <v-col cols="12" md="3" class="pa-2">
        <v-img
          :src="flagPreviewUrl"
          :alt="props.team.name + ' flag'"
          v-if="flagPreviewUrl"
          class="team-flag-preview mb-2"
          aspect-ratio="3/2"
          contain
        ></v-img>
        <v-file-input
          label="Team Flag"
          :model-value="props.team.flagFile"
          accept="image/*"
          prepend-icon="mdi-flag"
          dense
          outlined
          hide-details="auto"
          @update:model-value="handleFlagFileChange"
          @click:clear="handleClearFlag"
        ></v-file-input>
      </v-col>

      <v-col cols="12" md="3" class="pa-2">
        <v-text-field
          label="Team Name"
          :model-value="props.team.name"
          @update:model-value="(value) => emit('update-team', { ...props.team, name: value })"
          type="text"
          dense
          outlined
          hide-details="auto"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="3" class="pa-2">
        <v-text-field
          label="Score"
          :model-value="props.team.score"
          @update:model-value="
            (value) => emit('update-team', { ...props.team, score: Number(value) })
          "
          type="number"
          min="0"
          dense
          outlined
          hide-details="auto"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.team-row {
  margin-bottom: 16px;
}

.team-image-preview,
.team-flag-preview {
  max-width: 100%;
  height: auto;
  max-height: 60px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.v-text-field,
.v-file-input {
  width: 100%;
}
</style>
