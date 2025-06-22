import { app } from 'electron'
import { join } from 'path'
import log from 'electron-log'

export function setupLogging() {
  log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'
  const logPath = join(app.getPath('userData'), 'logs', 'main.log')
  console.log(logPath)
  log.transports.file.resolvePathFn = () => logPath

  process.on('uncaughtException', (error) => {
    log.error('Unhandled Main Process Exception:', error)
  })

  process.on('unhandledRejection', (reason) => {
    log.error('Unhandled Main Process Rejection:', reason)
  })

  log.info('Logger initialized.')
}
