import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron'
import { join } from 'path'
import path from 'path'
import * as fs from 'node:fs/promises'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'

const logPath = join(app.getPath('userData'), 'logs', 'main.log')
log.transports.file.resolvePathFn = () => logPath

process.on('uncaughtException', (error) => {
  log.error('Unhandled Main Process Exception:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled Main Process Rejection:', reason)
})

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    autoUpdater.checkForUpdates()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    log.error(
      `Failed to load URL: ${validatedURL} - Error Code: ${errorCode} - ${errorDescription}`
    )
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    if (mainWindow && mainWindow.webContents) {
      // Check if mainWindow and webContents exist
      mainWindow.webContents.openDevTools({ mode: 'bottom', activate: true })
    }
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.handle('app-version', () => {
  return app.getVersion()
})
ipcMain.handle('check-for-updates', () => {
  autoUpdater.checkForUpdates()
})

ipcMain.handle('get-default-path', async () => {
  const defaultJsonFilePath = await path.join(app.getPath('userData'))
  return defaultJsonFilePath
})

ipcMain.handle('open-file-dialog', async (event, type) => {
  if (!mainWindow) {
    log.error('Cannot show open-file-dialog, mainWindow is not available.')
    return null
  }
  const filters = [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }]
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters
  })
  if (canceled) {
    return null
  }

  return {
    path: filePaths[0],
    type
  }
})

ipcMain.handle('create-file', async (event, filePath, content) => {
  try {
    const directory = path.dirname(filePath)
    await fs.mkdir(directory, { recursive: true })
    await fs.writeFile(filePath, content)
    return true
  } catch (err) {
    console.error('Failed to write file:', err)
    log.error('Failed to write file:', err)
    return false
  }
})

ipcMain.handle('select-directory', async () => {
  if (!mainWindow) {
    log.error('Cannot show select-directory-dialog, mainWindow is not available.')
    return null
  }
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  if (canceled) {
    return null
  }
  return filePaths[0]
})

ipcMain.on('log-renderer-error', (_, error) => {
  log.error('Renderer Error:', error)
})

ipcMain.on('log-renderer-rejection', (_, rejection) => {
  log.error('Renderer Promise Rejection:', rejection)
})

ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall()
})

autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('update-status', 'checking')
})

autoUpdater.on('update-available', (info) => {
  // Instead of just sending to renderer, show a dialog first
  mainWindow.webContents.send('update-status', 'available', info) // Still send to update the UI
  log.info(`Update available: ${info.version}`)

  dialog
    .showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: `A new version ${info.version} is available.`,
      detail: info.releaseNotes
        ? `What's New:\n\n${info.releaseNotes}`
        : 'No release notes provided.',
      buttons: ['Update Now', 'Later'],
      defaultId: 0,
      cancelId: 1
    })
    .then((response) => {
      if (response.response === 0) {
        log.info('User chose to update now, starting download...')
        autoUpdater.downloadUpdate()
        autoUpdater.quitAndInstall()
      }
    })
    .catch((err) => {
      log.error('Error showing update dialog:', err)
    })
})

autoUpdater.on('update-not-available', (info) => {
  mainWindow.webContents.send('update-status', 'not-available', info)
})

autoUpdater.on('error', (err) => {
  mainWindow.webContents.send('update-status', 'error', err)
})

autoUpdater.on('download-progress', (progressObj) => {
  mainWindow.webContents.send('update-status', 'downloading', progressObj)
})

autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('update-status', 'downloaded', info)
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      log.info('App activated and no windows open, creating new window.')
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
