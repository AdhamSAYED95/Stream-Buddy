import { ref } from 'vue'

export function useImagePreview() {
  const imageDataUrl = ref('')

  const loadImagePreview = async (imagePath) => {
    if (!imagePath) {
      imageDataUrl.value = ''

      return
    }

    try {
      const base64Data = await window.api.readImage(imagePath)
      imageDataUrl.value = base64Data
    } catch (err) {
      console.error('Failed to load image for preview:', err)
      imageDataUrl.value = ''
    }
  }

  const clearPreview = () => {
    imageDataUrl.value = ''
  }

  return {
    imageDataUrl,
    clearPreview,
    loadImagePreview
  }
}
