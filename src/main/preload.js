const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => 'pong',
  ddt: () => 'dasdasd',
  openFileDialog: (type) => ipcRenderer.invoke('open-file-dialog', type),
  createFile: (filePath, content) => ipcRenderer.invoke('create-file', filePath, content),
})
