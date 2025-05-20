const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => 'pong',
  ddt: () => 'dasdasd',
})
