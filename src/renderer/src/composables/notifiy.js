import { ref } from 'vue'

export function useNotifications() {
  const showSuccess = ref(false)
  const showError = ref(false)
  const errorMsg = ref('')

  const triggerSuccess = () => {
    showSuccess.value = true
  }

  const triggerError = (message) => {
    errorMsg.value = message
    showError.value = true
  }

  return {
    showSuccess,
    showError,
    errorMsg,
    triggerSuccess,
    triggerError
  }
}

export function useSettingsNotifications() {
  const showSnackbar = ref(false)
  const snackbarText = ref('')
  const snackbarColor = ref('success')

  const showFeedback = (text, color) => {
    snackbarText.value = text
    snackbarColor.value = color
    showSnackbar.value = true
  }

  return {
    showSnackbar,
    snackbarText,
    snackbarColor,
    showFeedback
  }
}
