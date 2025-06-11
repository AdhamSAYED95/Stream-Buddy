<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['update-player'])

const props = defineProps({
  player: {
    type: Object,
    required: true
  }
})

const heroFilePath = ref(props.player.heroImage || '')

const selectImageFile = async (type) => {
  const result = await window.api.openFileDialog(type)
  if (!result) return

  const { path } = result

  if (type === 'image') {
    heroFilePath.value = path
    const updatedPlayer = {
      ...props.player,
      heroImage: path
    }
    emit('update-player', updatedPlayer)
  }
}

const handleClearHeroImage = () => {
  heroFilePath.value = ''
  const updatedPlayer = {
    ...props.player,
    heroImage: ''
  }
  emit('update-player', updatedPlayer)
}

watch(
  () => props.player,
  (newPlayer) => {
    heroFilePath.value = newPlayer.heroImage || ''
  },
  { deep: true }
)
</script>

<template>
  <div class="player-stats-panel-container">
    <v-row no-gutters class="panel-row">
      <v-col cols="12" class="pa-1">
        <v-card class="player-stats-panel" flat>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              label="Player Name"
              :model-value="props.player.playerName"
              type="text"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="
                (value) => emit('update-player', { ...props.player, playerName: value })
              "
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              label="Team Name"
              :model-value="props.player.teamName"
              type="text"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="
                (value) => emit('update-player', { ...props.player, teamName: value })
              "
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              label="Favorite Weapon"
              :model-value="props.player.favouriteWeapon"
              append-inner-icon="mdi-pencil"
              type="text"
              hide-details="auto"
              class="custom-text-input"
              flat
              @update:model-value="
                (value) => emit('update-player', { ...props.player, favouriteWeapon: value })
              "
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              label="Economy Score"
              :model-value="props.player.economyScore"
              type="number"
              min="0"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="
                (value) => emit('update-player', { ...props.player, economyScore: Number(value) })
              "
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              :model-value="heroFilePath.split(/[\\/]/).pop() || ''"
              label="Hero Image"
              readonly
              hide-details="auto"
              class="custom-text-input"
              flat
              @click="selectImageFile('image')"
            >
              <template v-slot:append-inner>
                <v-btn
                  v-if="!heroFilePath"
                  small
                  text
                  class="add-button-file"
                  :ripple="false"
                  @click.stop="selectImageFile('image')"
                >
                  + ADD
                </v-btn>
                <v-btn
                  v-if="heroFilePath"
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
              :model-value="props.player.kills"
              type="number"
              min="0"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="
                (value) => emit('update-player', { ...props.player, kills: Number(value) })
              "
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              label="Deaths"
              :model-value="props.player.deaths"
              type="number"
              min="0"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="
                (value) => emit('update-player', { ...props.player, deaths: Number(value) })
              "
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-1 input-spacing">
            <v-text-field
              label="Assists"
              :model-value="props.player.assists"
              type="number"
              min="0"
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-pencil"
              flat
              @update:model-value="
                (value) => emit('update-player', { ...props.player, assists: Number(value) })
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
  color: rgb(var(--v-theme-on-surface)); /* Changed from #ffffff */
  padding: 8px;
}

.panel-row {
  background-color: transparent; /* Or inherit. Container above sets surface. Was #1e2a38 */
  margin-bottom: 16px;
}

.player-stats-panel {
  /* This was already using a variable, which is great! */
  /* Ensure --v-theme-input-border is defined in your Vuetify theme settings for both light and dark. */
  background-color: rgb(var(--v-theme-surface)); /* Added to ensure panel bg is surface */
  /* If this v-card, it might pick up surface automatically, but explicit can be good */
}

.panel-title {
  font-size: 16px;
  font-weight: bold;
  color: rgb(var(--v-theme-on-surface)); /* Changed from #ffffff */
  padding: 8px 0;
  text-transform: uppercase;
}

.input-spacing {
  margin-bottom: 12px;
}

.input-spacing:last-child {
  margin-bottom: 0;
}

/* --- Custom Input Field Styles Themed --- */

.custom-file-input,
.custom-text-input {
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}

/* Background of the input field area */
.custom-file-input .v-field__overlay,
.custom-text-input .v-field__overlay,
.custom-file-input .v-field__field, /* v-field__field is the direct container for input */
.custom-text-input .v-field__field {
  background-color: rgb(var(--v-theme-input-background)) !important; /* Changed from #2c3e50 */
}

/* Overall control styling, including border */
.custom-file-input .v-input__control,
.custom-text-input .v-input__control {
  background-color: rgb(var(--v-theme-input-background)) !important;
  border: 1px solid rgb(var(--v-theme-input-border)) !important;
  box-shadow: none !important;
  border-radius: 4px !important;
  min-height: 48px !important;
  padding: 0 12px; /* This padding is for the control, not the text input itself */
  width: 100%;
  max-width: 100%;
}

/* Input Label */
.custom-file-input .v-label,
.custom-text-input .v-label {
  color: rgb(var(--v-theme-input-label)) !important; /* Changed from #ffffff */
  font-size: 14px !important;
  font-weight: bold;
  opacity: 1 !important; /* Or adjust for standard/focused states if needed */
  transform: translateY(-50%) scale(1) !important;
  top: 50% !important;
  left: 12px !important;
  pointer-events: none;
}

/* Input Text Color */
.custom-file-input .v-field__input, /* Actual <input> or text display element */
.custom-text-input .v-field__input {
  color: rgb(var(--v-theme-input-text)) !important; /* Changed from #ffffff */
}

/* Input Placeholder Text Color */
.custom-file-input .v-field__input::placeholder,
.custom-text-input .v-field__input::placeholder {
  color: rgba(
    var(--v-theme-input-text),
    0.7
  ) !important; /* Slightly muted version of input-text. Was #ffffff */
  opacity: 1 !important; /* opacity is part of rgba now */
}

/* Text for v-file-input when a file is selected */
.custom-file-input .v-file-input__text {
  color: rgb(var(--v-theme-input-text)); /* Changed from #ffffff */
  padding-right: 50px; /* Keep structural */
}

/* Fallback for direct input elements if any, though .v-field__input is preferred target */
.custom-text-input input {
  color: rgb(var(--v-theme-input-text)); /* Changed from #ffffff */
  padding-right: 40px; /* Keep structural */
}

.add-button-file {
  color: rgb(var(--v-theme-primary)) !important; /* Changed from #00c853 */
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  padding: 0 8px;
  min-width: auto;
  height: 100%;
  border-radius: 0 4px 4px 0;
  /* Background: consider making it transparent or a subtle shade of input-background */
  background-color: transparent; /* Was #2c3e50. Let the icon color carry the primary action feel */
  /* Or if you want a bg: background-color: rgba(var(--v-theme-primary), 0.1); */
  position: absolute;
  right: 0;
  top: 0;
  transition: all 0.1s ease;
}

/* Icons inside inputs (e.g., pencil, clear) */
.custom-text-input .v-input__append-inner .v-icon,
.custom-file-input .v-input__append-inner .v-icon {
  /* Target clear button icon if it's in append-inner */
  color: rgb(
    var(--v-theme-input-label)
  ) !important; /* Or input-text, depending on desired prominence. Was #ffffff */
  font-size: 18px !important; /* Keep structural */
  margin-right: 8px; /* Keep structural */
  transition: all 0.1s ease; /* Keep structural */
}

/* Ensure no extra padding from Vuetify's default slots */
.custom-file-input .v-input__prepend-inner,
.custom-file-input .v-input__append-inner,
.custom-text-input .v-input__prepend-inner,
.custom-text-input .v-input__append-inner {
  padding: 0;
  margin: 0;
}

/* Ensure input text area itself has no extra padding reducing visible area */
.custom-text-input .v-field__input,
.custom-file-input .v-field__input {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  height: auto !important;
  min-height: auto !important;
}

/* Hide default Vuetify outline if you're managing borders fully */
.custom-file-input .v-field__outline,
.custom-text-input .v-field__outline {
  display: none !important;
}

/* The v-field__field itself should not have padding if custom control manages it */
.custom-file-input .v-field__field,
.custom-text-input .v-field__field {
  padding: 0 !important;
}

/* Label positioning (structural, keep as is) */
.custom-file-input:not(.v-input--is-dirty) .v-label,
.custom-text-input .v-label {
  /* This rule seems to duplicate the one above, but for non-dirty state */
  left: 12px !important;
  transform: translateY(-50%) scale(1) !important;
  top: 50% !important;
}
</style>
