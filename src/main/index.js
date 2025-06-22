import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import log from 'electron-log'
import { createMainWindow } from './windowCreation'
import { setupLogging } from './utils/logger'
import { initializeStoreHandlers } from './handlers/storeHandler'
import { initializeFileHandlers } from './handlers/fileHandler'
import { initializeAppHandlers } from './handlers/appHandlers'
import { initializeUpdateHandlers } from './handlers/updateHandler'

app.whenReady().then(() => {
  setupLogging()
  electronApp.setAppUserModelId('com.electron')

  let mainWindow = createMainWindow()

  initializeStoreHandlers()
  initializeFileHandlers(mainWindow)
  initializeAppHandlers()
  initializeUpdateHandlers(mainWindow)

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      log.info('App activated and no windows open, creating new window.')
      mainWindow = createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
