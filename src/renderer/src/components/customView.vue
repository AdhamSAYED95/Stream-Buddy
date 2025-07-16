<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStateStore } from '../store/appState'
import { useNotifications } from '../composables/notifiy'
import draggable from 'vuedraggable'

const route = useRoute()
const store = useAppStateStore()

const { showSuccess, showError, errorMsg, triggerSuccess, triggerError } = useNotifications()

const viewId = computed(() => route.meta.viewId)

const currentCustomView = computed(() => store.customViews.find((view) => view.id === viewId.value))

const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case 'addSection':
      return 'Add New Section'
    case 'addField':
      return 'Add New Field'
    case 'editSection':
      return 'Edit Section Name'
    case 'editField':
      return 'Edit Field Name'
    default:
      return '' // Fallback title
  }
})

const logViewData = async () => {
  if (currentCustomView.value && currentCustomView.value.sections) {
    const formattedData = currentCustomView.value.sections.reduce((acc, section) => {
      const fields = section.fields.reduce((fieldAcc, field) => {
        fieldAcc[field.name] = field.value
        return fieldAcc
      }, {})
      acc[section.name] = fields

      return acc
    }, {})

    const jsonData = JSON.stringify(formattedData, null, 2)
    try {
      const created = await window.api.createFile(
        `${store.jsonSavePath}/${viewTitle.value}.json`,
        jsonData
      )
      if (created) {
        triggerSuccess()
      } else {
        triggerError('Could not write file')
      }
    } catch (e) {
      triggerError(e.message || 'Unknown error')
      console.error('Failed to create PlayersStats.json:', e)
    }
  }
}

const clearCustomView = () => {
  store.clearCustomView(viewId.value)
}

const viewTitle = computed(() => currentCustomView.value?.title)

const editingMode = computed(() => !!store.viewEditingStates[viewId.value])

const draggableSections = computed({
  get() {
    return currentCustomView.value?.sections || []
  },
  set(newSections) {
    store.updateViewSections(viewId.value, newSections)
  }
})

const triggerSave = () => {
  store.updateViewSections(viewId.value, draggableSections.value)
}

const dialog = ref(false)
const dialogMode = ref('section')
const currentSectionId = ref(null)
const currentFieldId = ref(null)
const newItemName = ref('')
const newItemType = ref('text')
const fieldTypes = ['text', 'number', 'image']

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

const openEditSectionDialog = (sectionId) => {
  dialogMode.value = 'editSection'
  newItemName.value = ''
  newItemType.value = 'text'
  currentSectionId.value = sectionId
  dialog.value = true
}

const openEditFieldDialog = (sectionId, fieldId) => {
  dialogMode.value = 'editField'
  newItemName.value = ''
  newItemType.value = 'text'
  currentSectionId.value = sectionId
  currentFieldId.value = fieldId
  dialog.value = true
}

const handleDialogSave = () => {
  if (!newItemName.value) return

  switch (dialogMode.value) {
    case 'Add New Section':
      store.addSection(viewId.value, newItemName.value)
      break
    case 'field':
      if (currentSectionId.value) {
        store.addField(viewId.value, currentSectionId.value, {
          name: newItemName.value,
          type: newItemType.value
        })
      }
      break
    case 'editSection':
      if (currentSectionId.value) {
        store.updateSectionName(viewId.value, currentSectionId.value, newItemName.value)
      }
      break
    case 'editField':
      if (currentSectionId.value && currentFieldId.value) {
        store.updateFieldName(
          viewId.value,
          currentSectionId.value,
          currentFieldId.value,
          newItemName.value
        )
      }
      break
    default:
      break
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

const toggleSectionLayout = (sectionId) => {
  store.toggleSectionLayout(viewId.value, sectionId)
}
</script>

<template>
  <div class="custom-view-builder">
    <div class="fixed-header">
      <h1>{{ viewTitle }}</h1>
      <v-btn color="primary" class="mb-4 mr-16" @click="logViewData">
        Create {{ viewTitle }} file
      </v-btn>
      <v-btn color="red" class="mb-4" @click="clearCustomView">Clear {{ viewTitle }} Data</v-btn>
      <v-snackbar v-model="showSuccess" :timeout="4000" top color="success">
        {{ viewTitle }} File created successfully!
      </v-snackbar>
      <v-snackbar v-model="showError" :timeout="5000" top color="error">
        {{ errorMsg }}
        <template #action="{ attrs }">
          <v-btn text v-bind="attrs" @click="showError = false"> Close </v-btn>
        </template>
      </v-snackbar>

      <div class="d-flex align-center ga-2">
        <!-- EDIT MODE BUTTON -->
        <v-tooltip :text="editingMode ? 'Save Changes' : 'Edit Mode'" location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              :icon="editingMode ? 'mdi-content-save-check' : 'mdi-pencil'"
              :color="editingMode ? 'primary' : undefined"
              variant="text"
              @click="store.toggleViewEditingState(viewId)"
            ></v-btn>
          </template>
        </v-tooltip>

        <!-- ADD SECTION BUTTON -->
        <v-tooltip text="Add Section" location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-if="editingMode"
              v-bind="props"
              icon="mdi-plus-box-outline"
              variant="text"
              @click="openAddSectionDialog"
            ></v-btn>
          </template>
        </v-tooltip>
      </div>
    </div>

    <div class="sections-container">
      <v-alert v-if="!draggableSections.length" type="info" variant="tonal" class="ma-4">
        No sections have been added yet. Click "Add Section" to begin Or Enter Edit Mode to add
        sections.
      </v-alert>

      <draggable
        v-model="draggableSections"
        item-key="id"
        handle=".section-drag-handle"
        :animation="200"
      >
        <template #item="{ element: section }">
          <v-card class="section-card" flat>
            <v-card-title class="panel-title d-flex align-center justify-space-between">
              <v-icon v-if="editingMode" class="section-drag-handle">mdi-drag-horizontal</v-icon>
              <v-text-field
                :model-value="section.name"
                variant="plain"
                hide-details
                density="compact"
                class="title-input"
                @update:model-value="
                  (newName) => store.updateSectionName(viewId, section.id, newName)
                "
              ></v-text-field>
              <div class="section-controls">
                <v-btn
                  v-if="editingMode"
                  variant="text"
                  color="grey"
                  size="small"
                  icon="mdi-form-select"
                  title="Edit Section Name"
                  @click="openEditSectionDialog(section.id)"
                ></v-btn>
                <v-btn
                  v-if="editingMode && section.fields.length > 0"
                  variant="text"
                  size="small"
                  :icon="
                    section.layout === 'vertical' ? 'mdi-view-sequential' : 'mdi-view-parallel'
                  "
                  :title="
                    section.layout === 'vertical'
                      ? 'Switch to horizontal layout'
                      : 'Switch to vertical layout'
                  "
                  @click="toggleSectionLayout(section.id)"
                ></v-btn>
                <v-btn
                  v-if="editingMode"
                  variant="text"
                  color="blue"
                  size="small"
                  icon="mdi-plus-box-outline"
                  @click="openAddFieldDialog(section.id)"
                ></v-btn>
                <v-btn
                  v-if="editingMode"
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

              <draggable
                v-model="section.fields"
                item-key="id"
                handle=".field-drag-handle"
                :animation="200"
                :class="[
                  'fields-container',
                  section.layout === 'vertical' ? 'fields-vertical' : 'fields-horizontal'
                ]"
                @end="triggerSave"
              >
                <template #item="{ element: field }">
                  <div class="field-wrapper">
                    <v-icon v-if="editingMode" class="field-drag-handle">mdi-drag</v-icon>
                    <v-btn
                      v-if="editingMode"
                      variant="text"
                      color="grey"
                      size="small"
                      icon="mdi-form-select"
                      title="Edit Field Name"
                      @click="openEditFieldDialog(section.id, field.id)"
                    ></v-btn>
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
                      v-if="field.type === 'number'"
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
                      v-if="editingMode"
                      variant="text"
                      size="x-small"
                      icon="mdi-close"
                      class="delete-field-btn"
                      @click="store.deleteField(viewId, section.id, field.id)"
                    ></v-btn>
                  </div>
                </template>
              </draggable>
            </v-card-text>
          </v-card>
        </template>
      </draggable>
    </div>

    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ dialogTitle }}</span>
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
  font-family: Arial, sans-serif;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 56px;
  right: 0;
  z-index: 999;
  padding: 16px;
  transition: left 0.2s ease;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: rgb(var(--v-theme-on-surface));
}

.sections-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding-top: 190px;
  transition: margin-left 0.2s ease;
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

.section-controls {
  display: flex;
  gap: 4px;
  align-items: center;
}

/* Base styles for fields container */
.fields-container {
  align-items: flex-start;
}

/* Horizontal layout (default) */
.fields-horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

/* Vertical layout */
.fields-vertical {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Field wrapper styles for horizontal layout */
.fields-horizontal .field-wrapper {
  flex: 1 1 auto;
  min-width: 200px;
}

/* Field wrapper styles for vertical layout */
.fields-vertical .field-wrapper {
  width: 100%;
  flex: none;
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
.mr-400 {
  margin-right: 400px;
}

.section-drag-handle,
.field-drag-handle {
  cursor: grab;
  color: rgba(var(--v-theme-on-surface), 0.4);
  margin-right: 12px;
}
.section-drag-handle:hover,
.field-drag-handle:hover {
  color: rgba(var(--v-theme-on-surface), 0.8);
}
</style>
