<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStateStore } from '../store/appState'

const route = useRoute()
const store = useAppStateStore()

const viewId = computed(() => route.meta.viewId)

const currentCustomView = computed(() => store.customViews.find((view) => view.id === viewId.value))

const viewTitle = computed(() => currentCustomView.value?.title)

const dialog = ref(false)
const dialogMode = ref('section')
const currentSectionId = ref(null)
const newItemName = ref('')
const newItemType = ref('text')
const fieldTypes = ['text', 'integer', 'image']

const openAddSectionDialog = () => {
  dialogMode.value = 'section'
  newItemName.value = ''
  dialog.value = true
}

const openAddFieldDialog = (sectionId) => {
  dialogMode.value = 'field'
  newItemName.value = ''
  newItemType.value = 'text'
  currentSectionId.value = sectionId
  dialog.value = true
}

const handleDialogSave = () => {
  if (!newItemName.value) return

  if (dialogMode.value === 'section') {
    store.addSection(viewId.value, newItemName.value)
  } else if (dialogMode.value === 'field' && currentSectionId.value) {
    store.addField(viewId.value, currentSectionId.value, {
      name: newItemName.value,
      type: newItemType.value
    })
  }

  dialog.value = false
}

const selectImageFile = async (sectionId, fieldId) => {
  const result = await window.api.openFileDialog('image')
  if (result && result.path) {
    store.updateFieldData(viewId.value, sectionId, fieldId, result.path)
  }
}

const getFileName = (path) => {
  if (!path || typeof path !== 'string') return ''
  return path.split(/[\\/]/).pop()
}
</script>

<template>
  <div class="custom-view-builder">
    <div class="fixed-header">
      <h1>{{ viewTitle }}</h1>
      <v-btn color="primary" class="mb-4 mr-4" @click="openAddSectionDialog">
        <v-icon left>mdi-plus</v-icon>
        Add Section
      </v-btn>
    </div>

    <div class="sections-container">
      <v-alert v-if="!currentCustomView?.sections?.length" type="info" variant="tonal" class="ma-4">
        No sections have been added yet. Click "Add Section" to begin.
      </v-alert>

      <v-card
        v-for="section in currentCustomView?.sections"
        :key="section.id"
        class="section-card"
        flat
      >
        <v-card-title class="panel-title d-flex align-center justify-space-between">
          <v-text-field
            :model-value="section.name"
            variant="plain"
            hide-details
            density="compact"
            class="title-input"
            @update:model-value="(newName) => store.updateSectionName(viewId, section.id, newName)"
          ></v-text-field>
          <div>
            <v-btn
              variant="text"
              color="blue"
              size="small"
              icon="mdi-plus-box-outline"
              @click="openAddFieldDialog(section.id)"
            ></v-btn>
            <v-btn
              icon="mdi-delete-outline"
              variant="text"
              color="red"
              size="small"
              @click="store.deleteSection(viewId, section.id)"
            ></v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-alert v-if="!section.fields.length" density="compact" class="mb-2">
            No fields in this section.
          </v-alert>
          <div v-for="field in section.fields" :key="field.id" class="field-wrapper">
            <v-text-field
              v-if="field.type === 'text'"
              :label="field.name"
              :model-value="field.value"
              hide-details="auto"
              class="custom-text-input"
              flat
              @update:model-value="
                (value) => store.updateFieldData(viewId, section.id, field.id, value)
              "
            ></v-text-field>
            <v-text-field
              v-if="field.type === 'integer'"
              :label="field.name"
              :model-value="field.value"
              type="number"
              hide-details="auto"
              class="custom-text-input"
              flat
              @update:model-value="
                (value) => store.updateFieldData(viewId, section.id, field.id, value)
              "
            ></v-text-field>
            <v-text-field
              v-if="field.type === 'image'"
              :label="field.name"
              :model-value="getFileName(field.value)"
              readonly
              hide-details="auto"
              class="custom-text-input"
              append-inner-icon="mdi-file-image"
              flat
              clearable
              @click="selectImageFile(section.id, field.id)"
            ></v-text-field>
            <v-btn
              variant="text"
              size="x-small"
              icon="mdi-close"
              class="delete-field-btn"
              @click="store.deleteField(viewId, section.id, field.id)"
            ></v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{
            dialogMode === 'section' ? 'Add New Section' : 'Add New Field'
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newItemName"
            label="Name"
            autofocus
            @keyup.enter="handleDialogSave"
          ></v-text-field>
          <v-radio-group
            v-if="dialogMode === 'field'"
            v-model="newItemType"
            inline
            label="Field Type"
          >
            <v-radio
              v-for="type in fieldTypes"
              :key="type"
              :label="type.charAt(0).toUpperCase() + type.slice(1)"
              :value="type"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="handleDialogSave">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.custom-view-builder {
  padding: 20px;
  padding-top: 100px; /* Add padding to push content below the fixed header */
  font-family: Arial, sans-serif;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 56px;
  right: 0;
  z-index: 999;
  background-color: rgb(var(--v-theme-surface));
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: left 0.2s ease;
  display: flex;
  align-items: center;
}

.fixed-header h1 {
  color: rgb(var(--v-theme-on-surface));
  margin: 0;
  margin-right: auto;
  font-size: 1.5rem;
}

.sections-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

.section-card {
  margin-bottom: 24px;
}

.panel-title {
  color: rgb(var(--v-theme-on-surface));
  font-size: 16px;
  font-weight: bold;
  padding: 8px 16px;
}

.title-input {
  font-weight: bold;
}

.field-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.custom-text-input {
  flex-grow: 1;
}

.delete-field-btn {
  margin-left: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mr-4 {
  margin-right: 16px;
}
</style>
