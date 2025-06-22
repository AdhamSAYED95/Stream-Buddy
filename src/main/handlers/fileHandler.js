// src/main/handlers/fileHandlers.js

import { ipcMain, dialog } from 'electron'
import path from 'path'
import * as fs from 'node:fs/promises'
import log from 'electron-log'

export function initializeFileHandlers(mainWindow) {
  if (!mainWindow) {
    log.error('Cannot initialize file handlers, mainWindow is not available.')
    return
  }

  ipcMain.handle('open-file-dialog', async (event, type) => {
    const filters = [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }]
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters
    })

    if (canceled || filePaths.length === 0) return null
    return { path: filePaths[0], type }
  })

  ipcMain.handle('select-directory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })

    if (canceled || filePaths.length === 0) return null
    return filePaths[0]
  })

  ipcMain.handle('create-file', async (event, filePath, content) => {
    try {
      const directory = path.dirname(filePath)
      await fs.mkdir(directory, { recursive: true })
      await fs.writeFile(filePath, content)
      return true
    } catch (err) {
      log.error('Failed to write file:', err)
      return false
    }
  })

  ipcMain.handle('read-image', async (event, imagePath) => {
    try {
      const imageBuffer = await fs.readFile(imagePath)
      const ext = path.extname(imagePath).toLowerCase()
      const mimeType =
        {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp'
        }[ext] || 'application/octet-stream'

      return `data:${mimeType};base64,${imageBuffer.toString('base64')}`
    } catch (error) {
      log.error('Failed to read image file:', error)
      throw error
    }
  })
}
