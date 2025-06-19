import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

contextBridge.exposeInMainWorld('electronLogger', {
  sendError: (error) => ipcRenderer.send('log-renderer-error', error),
  sendRejection: (rejection) => ipcRenderer.send('log-renderer-rejection', rejection)
})

const api = {
  openFileDialog: (type) => ipcRenderer.invoke('open-file-dialog', type),
  createFile: (filePath, content) => ipcRenderer.invoke('create-file', filePath, content),
  readImage: (imagePath) => ipcRenderer.invoke('read-image', imagePath),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  getDefaultPath: () => ipcRenderer.invoke('get-default-path'),
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.send('download-update'),
  onUpdateStatus: (callback) =>
    ipcRenderer.on('update-status', (_event, ...args) => callback(...args)),
  store: {
    get: (key) => ipcRenderer.invoke('store-get', key),
    set: (key, value) => ipcRenderer.invoke('store-set', key, value),
    delete: (key) => ipcRenderer.invoke('store-delete', key),
    clear: () => ipcRenderer.invoke('store-clear'),
    has: (key) => ipcRenderer.invoke('store-has', key),
    getAll: () => ipcRenderer.invoke('store-get-all')
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
