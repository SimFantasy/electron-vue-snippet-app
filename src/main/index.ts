import { app, BrowserWindow, ipcMain } from 'electron'

import { electronApp, optimizer } from '@electron-toolkit/utils'

import { getWindowByName } from './modules/window'
import './modules/ipc'
import { initDatabaseIPC } from './modules/db/ipc'
import { initTables, setupCategoryDeleteTrigger } from './modules/db/table'
import { seedData } from './modules/db/seed'
import { initProtocol } from './modules/protocol'

// 初始化数据库IPC
initDatabaseIPC()

// 当 Electron 完成初始化并且准备创建浏览器窗口时，这个事件会被触发。
app.whenReady().then(async () => {
  // 初始化数据库
  try {
    await initTables()
    await setupCategoryDeleteTrigger()
    await seedData()
    console.log('数据库初始化成功')
  } catch (error) {
    console.error('数据库初始化失败:', error)
  }

  // 先注册协议（在创建窗口之前）
  initProtocol()

  // 创建search窗口
  getWindowByName('search')

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // 开发环境中默认使用 F12 打开或关闭开发者工具
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  app.on('activate', function () {
    // 在 macOS 系统中，当点击 Dock 图标且没有其他窗口打开时，通常会在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) getWindowByName('search')
  })
})

// 当所有窗口都关闭时退出，但 macOS 除外。在 macOS 上，通常
// 应用程序及其菜单栏会保持活动状态，直到用户
// 使用 Cmd + Q 显式退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
