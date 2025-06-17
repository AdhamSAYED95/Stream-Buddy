import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron'
import { join } from 'path'
import path from 'path'
import * as fs from 'node:fs/promises'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
const Store = require('electron-store').default

log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'

const logPath = join(app.getPath('userData'), 'logs', 'main.log')
log.transports.file.resolvePathFn = () => logPath

process.on('uncaughtException', (error) => {
  log.error('Unhandled Main Process Exception:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled Main Process Rejection:', reason)
})

const store = new Store()
console.log(`Electron-store path: ${store.path}`)

autoUpdater.autoDownload = false

let updateTriggeredByAutoCheck = false
let updateTriggeredByUser = false

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
    updateTriggeredByAutoCheck = true
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
      mainWindow.webContents.openDevTools({ mode: 'bottom', activate: true })
    }
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.handle('electron-store-get', async (event, key) => {
  return store.get(key)
})
ipcMain.handle('electron-store-set', async (event, key, val) => {
  store.set(key, val)
})
ipcMain.handle('electron-store-delete', async (event, key) => {
  store.delete(key)
})

ipcMain.handle('app-version', () => {
  return app.getVersion()
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

ipcMain.handle('read-image', async (event, imagePath) => {
  try {
    const imageBuffer = await fs.readFile(imagePath)
    const ext = path.extname(imagePath).toLowerCase()

    let mimeType = 'image/png'
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        mimeType = 'image/jpeg'
        break
      case '.png':
        mimeType = 'image/png'
        break
      case '.gif':
        mimeType = 'image/gif'
        break
      case '.webp':
        mimeType = 'image/webp'
        break
    }

    const base64String = imageBuffer.toString('base64')
    return `data:${mimeType};base64,${base64String}`
  } catch (error) {
    log.error('Failed to read image file:', error)
    throw error
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

ipcMain.handle('check-for-updates', () => {
  updateTriggeredByAutoCheck = false
  updateTriggeredByUser = true
  autoUpdater.checkForUpdates()
})

ipcMain.on('download-update', () => {
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
          log.info('User chose to update now, starting download...')
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
  if (updateTriggeredByUser) {
    mainWindow.webContents.send('update-status', 'error', err)
  }
})

autoUpdater.on('download-progress', (progressObj) => {
  if (updateTriggeredByUser) {
    mainWindow.webContents.send('update-status', 'downloading', progressObj)
  }
})

autoUpdater.on('update-downloaded', (info) => {
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
