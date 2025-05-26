<script setup>
import { ref, watch, onUnmounted } from 'vue'

const emit = defineEmits(['update-player'])

const props = defineProps({
  player: {
    type: Object,
    required: true,
  },
})

const heroImagePreviewUrl = ref('')

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
  () => props.player.HeroImage,
  (newFile) => {
    createPreview(newFile, heroImagePreviewUrl)
  },
  { immediate: true },
)

const handleHeroImageChange = (file) => {
  const updatedPlayer = {
    ...props.player,
    HeroImage: file,
  }
  emit('update-player', updatedPlayer)
}

const handleClearHeroImage = () => {
  handleHeroImageChange(null)
}

onUnmounted(() => {
  if (heroImagePreviewUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(heroImagePreviewUrl.value)
  }
})
</script>

<template>
  <div class="player-stats-row-container">
    <v-row no-gutters class="player-stats-row input-spacing">
      <v-col cols="12" class="pa-1 input-spacing">
        <v-text-field
          label="Player Name"
          :model-value="props.player.PlayerName"
          @update:model-value="
            (value) => emit('update-player', { ...props.player, PlayerName: value })
          "
          type="text"
          hide-details="auto"
          class="custom-text-input"
          append-inner-icon="mdi-pencil"
          flat
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="pa-1 input-spacing">
        <v-text-field
          label="Team Name"
          :model-value="props.player.TeamName"
          @update:model-value="
            (value) => emit('update-player', { ...props.player, TeamName: value })
          "
          type="text"
          hide-details="auto"
          class="custom-text-input"
          append-inner-icon="mdi-pencil"
          flat
        ></v-text-field>
      </v-col>

      <v-col cols="12" class="pa-1 input-spacing">
        <v-text-field
          label="Favorite Weapon"
          :model-value="props.player.FavouriteWeapon"
          @update:model-value="
            (value) => emit('update-player', { ...props.player, FavouriteWeapon: value })
          "
          type="text"
          hide-details="auto"
          class="custom-text-input"
          append-inner-icon="mdi-pencil"
          flat
        ></v-text-field>
      </v-col>

      <v-col cols="12" class="pa-1 input-spacing">
        <v-text-field
          label="Economy Score"
          :model-value="props.player.EconomyScore"
          @update:model-value="
            (value) => emit('update-player', { ...props.player, EconomyScore: Number(value) })
          "
          type="number"
          min="0"
          hide-details="auto"
          class="custom-text-input"
          append-inner-icon="mdi-pencil"
          flat
        ></v-text-field>
      </v-col>

      <v-col cols="12" class="pa-1 input-spacing">
        <v-file-input
          :label="heroImagePreviewUrl ? '' : 'Hero Image'"
          :model-value="props.player.HeroImage"
          accept="image/*"
          hide-details="auto"
          class="custom-file-input"
          prepend-icon=""
          @update:model-value="handleHeroImageChange"
          @click:clear="handleClearHeroImage"
          flat
        >
          <template v-slot:append-inner>
            <v-btn
              v-if="!props.player.HeroImage"
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

      <v-col cols="12" class="pa-1 input-spacing">
        <v-text-field
          label="Kills"
          :model-value="props.player.Kills"
          @update:model-value="
            (value) => emit('update-player', { ...props.player, Kills: Number(value) })
          "
          type="number"
          min="0"
          hide-details="auto"
          class="custom-text-input"
          append-inner-icon="mdi-pencil"
          flat
        ></v-text-field>
      </v-col>

      <v-col cols="12" class="pa-1 input-spacing">
        <v-text-field
          label="Deaths"
          :model-value="props.player.Deaths"
          @update:model-value="
            (value) => emit('update-player', { ...props.player, Deaths: Number(value) })
          "
          type="number"
          min="0"
          hide-details="auto"
          class="custom-text-input"
          append-inner-icon="mdi-pencil"
          flat
        ></v-text-field>
      </v-col>

      <v-col cols="12" class="pa-1 input-spacing">
        <v-text-field
          label="Assists"
          :model-value="props.player.Assists"
          @update:model-value="
            (value) => emit('update-player', { ...props.player, Assists: Number(value) })
          "
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
.player-stats-row-container {
  background-color: #1e2a38;
  color: #ffffff;
  border-bottom: 1px solid #2c3e50;
  margin-bottom: 8px;
  border-radius: 4px;
}

.input-spacing {
  margin-bottom: 15px;
}

.player-stats-row {
  background-color: #1e2a38;
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

/* Label styling */
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
  top: 30;
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
