import { app, ipcMain } from 'electron'
import path from 'path'
import log from 'electron-log'

export function initializeAppHandlers() {
  ipcMain.handle('app-version', () => app.getVersion())

  ipcMain.handle('get-default-path', () => {
    return path.join(app.getPath('userData'))
  })

  ipcMain.on('log-renderer-error', (_, error) => {
    log.error('Renderer Error:', error)
  })

  ipcMain.on('log-renderer-rejection', (_, rejection) => {
    log.error('Renderer Promise Rejection:', rejection)
  })
}
