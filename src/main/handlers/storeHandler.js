import { ipcMain } from 'electron'

export function initializeStoreHandlers() {
  import('electron-store').then(({ default: Store }) => {
    const store = new Store()

    ipcMain.handle('store-get', (_, key) => store.get(key))
    ipcMain.handle('store-set', (_, key, value) => store.set(key, value))
    ipcMain.handle('store-delete', (_, key) => store.delete(key))
    ipcMain.handle('store-clear', () => store.clear())
    ipcMain.handle('store-has', (_, key) => store.has(key))
    ipcMain.handle('store-get-all', () => store.store)
  })
}
