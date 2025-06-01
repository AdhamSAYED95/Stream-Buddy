<script setup>
import { ref, onUnmounted, computed } from 'vue'

const emit = defineEmits(['update-player'])

const props = defineProps({
  player: {
    type: Object,
    required: true
  }
})

const heroImagePreviewUrl = ref('')
const heroFilePath = ref('')

const selectImageFile = async (type) => {
  const result = await window.api.openFileDialog(type)
  if (!result) return

  const { path } = result

  if (type === 'image') {
    heroFilePath.value = path // Store full path
    const updatedPlayer = {
      ...props.player,
      HeroImage: path // Store the full path
    }
    emit('update-player', updatedPlayer)
  }
}

const handleClearHeroImage = () => {
  heroFilePath.value = ''
  const updatedPlayer = {
    ...props.player,
    HeroImage: null
  }
  emit('update-player', updatedPlayer)
}

onUnmounted(() => {
  if (heroImagePreviewUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(heroImagePreviewUrl.value)
  }
})

const heroFileName = computed(() => heroFilePath.value.split(/[\\/]/).pop() || '')
</script>

<template>
  <div class="player-stats-panel-container">
    <v-row no-gutters class="panel-row">
      <v-col cols="12" class="pa-1">
        <v-card class="player-stats-panel" flat>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              label="Player Name"
              :model-value="props.player.PlayerName"
              type="text"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="
                (value) => emit('update-player', { ...props.player, PlayerName: value })
              "
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              label="Team Name"
              :model-value="props.player.TeamName"
              type="text"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="
                (value) => emit('update-player', { ...props.player, TeamName: value })
              "
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              label="Favorite Weapon"
              :model-value="props.player.FavouriteWeapon"
              append-inner-icon="mdi-pencil"
              type="text"
              hide-details="auto"
              class="custom-text-input"
              flat
              @update:model-value="
                (value) => emit('update-player', { ...props.player, FavouriteWeapon: value })
              "
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              label="Economy Score"
              :model-value="props.player.EconomyScore"
              type="number"
              min="0"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="
                (value) => emit('update-player', { ...props.player, EconomyScore: Number(value) })
              "
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              :model-value="heroFileName"
              label="Hero Image"
              readonly
              hide-details="auto"
              class="custom-text-input"
              flat
              @click="selectImageFile('image')"
            >
              <template v-slot:append-inner>
                <v-btn
                  v-if="!heroFileName"
                  small
                  text
                  class="add-button-file"
                  :ripple="false"
                  @click.stop="selectImageFile('image')"
                >
                  + ADD
                </v-btn>
                <v-btn
                  v-if="heroFileName"
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
              label="Kills"
              :model-value="props.player.Kills"
              type="number"
              min="0"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="
                (value) => emit('update-player', { ...props.player, Kills: Number(value) })
              "
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              label="Deaths"
              :model-value="props.player.Deaths"
              type="number"
              min="0"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="
                (value) => emit('update-player', { ...props.player, Deaths: Number(value) })
              "
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              label="Assists"
              :model-value="props.player.Assists"
              type="number"
              min="0"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="
                (value) => emit('update-player', { ...props.player, Assists: Number(value) })
              "
            ></v-text-field>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.player-stats-panel-container {
  background-color: #1e2a38;
  color: #ffffff;
  padding: 8px;
}

.panel-row {
  background-color: #1e2a38;
  margin-bottom: 16px;
}

.player-stats-panel {
  background-color: #1e2a38 !important;
  border: 1px solid #2c3e50;
  border-radius: 4px;
  padding: 0 8px 8px 8px;
  box-sizing: border-box;
  width: 100%;
}

.panel-title {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  padding: 8px 0;
  text-transform: uppercase;
}

.input-spacing {
  margin-bottom: 12px;
}

/* Remove margin-bottom from the last input field */
.input-spacing:last-child {
  margin-bottom: 0;
}

/* --- Existing Input Field Styles (mostly kept as is) --- */

.custom-file-input,
.custom-text-input {
  border-radius: 4px;
  overflow: hidden;
  width: 100%; /* Ensure inputs take full width of their v-col */
  max-width: 100%;
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
  min-height: 48px !important; /* Kept previous height for consistency */
  padding: 0 12px;
  width: 100%;
  max-width: 100%;
}

.custom-file-input .v-label,
.custom-text-input .v-label {
  color: #ffffff !important;
  font-size: 14px !important; /* Kept previous font-size */
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
  font-size: 12px; /* Kept previous font-size */
  padding: 0 8px;
  min-width: auto;
  height: 100%; /* Adjusted height to match input height */
  border-radius: 0 4px 4px 0;
  background-color: #2c3e50;
  position: absolute;
  right: 0;
  top: 0; /* Align to top of input */
  transition: all 0.1s ease;
}

.custom-text-input .v-input__append-inner .v-icon {
  color: #ffffff !important;
  font-size: 18px !important;
  margin-right: 8px;
  transition: all 0.1s ease;
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
