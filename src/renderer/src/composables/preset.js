import { ref } from 'vue'

export function usePresets(store, showFeedback) {
  const createPresetDialog = ref(false)
  const newPresetName = ref('')
  const updatePresetDialog = ref(false)
  const presetToUpdateName = ref('')
  const confirmUpdateOrCreateDialog = ref(false)

  const presetNameRules = [
    (v) => !!v || 'Preset name is required',
    (v) => (v && v.length <= 50) || 'Name must be less than 50 characters',
    (v) => !Object.keys(store.viewPresets).includes(v) || 'Preset already exists'
  ]

  const openCreatePresetDialog = () => {
    newPresetName.value = ''
    createPresetDialog.value = true
  }

  const saveNewPreset = () => {
    if (!newPresetName.value || newPresetName.value.trim() === '') {
      showFeedback('Preset name cannot be empty.', 'error')
      return
    }

    store.saveViewPreset(newPresetName.value.trim())
    showFeedback(`Preset '${newPresetName.value.trim()}' saved successfully!`, 'success')
    createPresetDialog.value = false
    newPresetName.value = ''
  }

  const applyPreset = (presetName) => {
    store.applyViewPreset(presetName)
    store.selectedPreset = presetName
    if (store.selectedPreset !== null) showFeedback(`Preset ${presetName} applied!`, 'info')
  }

  const openUpdatePresetDialog = (presetName) => {
    presetToUpdateName.value = presetName
    confirmUpdateOrCreateDialog.value = true
  }

  const updatePreset = () => {
    if (presetToUpdateName.value) {
      store.updateViewPreset(presetToUpdateName.value)
      showFeedback(`Preset '${presetToUpdateName.value}' updated!`, 'success')
      updatePresetDialog.value = false
    }
  }

  const handlePresetChoice = (choice) => {
    confirmUpdateOrCreateDialog.value = false

    if (choice === 'update') {
      updatePresetDialog.value = true
    } else if (choice === 'create') {
      createPresetDialog.value = true
    }
  }

  const deletePreset = (presetName) => {
    store.deleteViewPreset(presetName)
    if (store.selectedPreset === presetName) {
      store.selectedPreset = null
    }
    showFeedback(`Preset '${presetName}' deleted!`, 'success')
  }

  return {
    createPresetDialog,
    newPresetName,
    updatePresetDialog,
    presetToUpdateName,
    confirmUpdateOrCreateDialog,
    presetNameRules,
    openCreatePresetDialog,
    saveNewPreset,
    applyPreset,
    openUpdatePresetDialog,
    updatePreset,
    deletePreset,
    handlePresetChoice
  }
}
