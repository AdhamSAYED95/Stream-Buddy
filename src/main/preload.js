const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => 'pong',
  ddt: () => 'dasdasd',
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
})
