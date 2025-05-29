import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'path'
import * as fs from 'node:fs/promises'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let win = null

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  })

  const isDev = !app.isPackaged

  if (isDev) {
    console.log('Development mode, loading Vite dev server')
    win.loadURL('http://localhost:5173').catch((err) => {
      console.error('Failed to load Vite dev server:', err)
    })
    win.webContents.openDevTools({ mode: 'bottom', activate: true })
  } else {
    console.log('Production mode, loading built app')
    win.loadFile(path.join(__dirname, '../../dist/index.html')).catch((err) => {
      console.error('Failed to load production build:', err)
    })
  }
}

ipcMain.handle('open-file-dialog', async (event, type) => {
  const filters = [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }]
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters,
  })
  if (canceled) {
    return null
  }
  return {
    path: filePaths[0],
    type,
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
    return false
  }
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
