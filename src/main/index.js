import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import * as fs from 'node:fs/promises'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8')
    console.log('File content:', data)
    return data
  } catch (err) {
    console.error('Error reading file in main process:', err)
    throw err
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
