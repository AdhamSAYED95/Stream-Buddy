import { dialog, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

export function initializeUpdateHandlers(mainWindow) {
  if (!mainWindow) {
    log.error('Cannot initialize update handlers, mainWindow is not available.')
    return
  }

  let updateTriggeredByUser = false
  let updateTriggeredByAutoCheck = false

  autoUpdater.autoDownload = false

  mainWindow.once('ready-to-show', () => {
    updateTriggeredByAutoCheck = true
    updateTriggeredByUser = false
    autoUpdater.checkForUpdates()
  })

  ipcMain.handle('check-for-updates', () => {
    log.info('User triggered an update check.')
    updateTriggeredByAutoCheck = false
    updateTriggeredByUser = true
    autoUpdater.checkForUpdates()
  })

  ipcMain.on('download-update', () => {
    log.info('User triggered an update download.')
    autoUpdater.downloadUpdate()
  })

  autoUpdater.on('checking-for-update', () => {
    if (updateTriggeredByUser) {
      mainWindow.webContents.send('update-status', 'checking')
    }
  })

  autoUpdater.on('update-available', (info) => {
    log.info(`Update available: ${info.version}`)

    if (updateTriggeredByAutoCheck) {
      const plainReleaseNotes = info.releaseNotes
        ? info.releaseNotes.replace(/<p>/g, '\n').replace(/<\/p>/g, '').trim()
        : 'No release notes provided.'
      dialog
        .showMessageBox(mainWindow, {
          type: 'info',
          title: 'Update Available',
          message: `A new version ${info.version} is available.`,
          detail: `What's New:\n\n${plainReleaseNotes}`,
          buttons: ['Update Now', 'Later'],
          defaultId: 0,
          cancelId: 1
        })
        .then((response) => {
          if (response.response === 0) {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Downloading Update',
              message: 'The update is being downloaded. Please wait...',
              detail: 'The app will close automatically when the download is complete.'
            })
            autoUpdater.downloadUpdate()
          }
        })
    } else if (updateTriggeredByUser) {
      mainWindow.webContents.send('update-status', 'available', info)
    }
  })

  autoUpdater.on('update-not-available', (info) => {
    if (updateTriggeredByUser) {
      mainWindow.webContents.send('update-status', 'not-available', info)
    }
  })

  autoUpdater.on('error', (err) => {
    log.error('Error in auto-updater:', err)
    if (updateTriggeredByUser) {
      mainWindow.webContents.send('update-status', 'error', err)
    }
  })

  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('update-status', 'downloading', progressObj)
  })

  autoUpdater.on('update-downloaded', (info) => {
    log.info(`Update v${info.version} has been downloaded.`)

    if (updateTriggeredByUser) {
      mainWindow.webContents.send('update-status', 'downloaded', info)
      dialog
        .showMessageBox(mainWindow, {
          type: 'info',
          title: 'Update Ready',
          message: 'The new version has been downloaded.',
          detail: 'Restart the application to apply the updates.',
          buttons: ['Restart Now', 'Later'],
          defaultId: 0,
          cancelId: 1
        })
        .then((response) => {
          if (response.response === 0) {
            autoUpdater.quitAndInstall()
          }
        })
    } else if (updateTriggeredByAutoCheck) {
      log.info('Auto-update downloaded. Quitting and installing...')
      autoUpdater.quitAndInstall()
    }
  })
}
