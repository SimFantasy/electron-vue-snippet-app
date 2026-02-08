import type { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import type { ColorModeType, WindowNameType } from '@shared/types'

import { BrowserWindow, ipcMain, nativeTheme } from 'electron'

import { IPC_KEYS } from '@shared/constants'

import { getWindowByEvent, getWindowByName } from './window'
import { registerSearchWindowShortcut } from './shortcut'

// 打开指定窗口
ipcMain.on(IPC_KEYS.OPEN_WINDOW, (_evetn: IpcMainEvent, name: WindowNameType) => {
  getWindowByName(name).show()
})

// 关闭指定窗口
ipcMain.on(IPC_KEYS.CLOSE_WINDOW, (_event: IpcMainEvent, name: WindowNameType) => {
  getWindowByName(name).hide()
})

// 鼠标穿透
ipcMain.on(
  IPC_KEYS.IGNORE_MOUSE_EVENT,
  (event: IpcMainEvent, ignore: boolean, options?: { forward: boolean }) => {
    getWindowByEvent(event)?.setIgnoreMouseEvents(ignore, options)
  }
)

// 注册快捷键
ipcMain.handle(IPC_KEYS.SHORTCUT, (_evetn: IpcMainInvokeEvent, shortcut: string) => {
  return registerSearchWindowShortcut(shortcut)
})

// 广播设置更新
ipcMain.on(IPC_KEYS.SETTINGS_UPDATED, (event, settings) => {
  // 广播给所有窗口
  BrowserWindow.getAllWindows().forEach((win) => {
    if (win.webContents !== event.sender) {
      win.webContents.send(IPC_KEYS.SETTINGS_UPDATED, settings)
    }
  })
})

// 设置颜色模式
ipcMain.handle(IPC_KEYS.COLOR_MODE, (_event: IpcMainInvokeEvent, colorMode: ColorModeType) => {
  nativeTheme.themeSource = colorMode
})

// ========== 窗口控制 ==========

// 最小化窗口
ipcMain.on(IPC_KEYS.WINDOW_MINIMIZE, (event: IpcMainEvent) => {
  const win = getWindowByEvent(event)
  if (win) win.minimize()
})

// 最大化窗口
ipcMain.on(IPC_KEYS.WINDOW_MAXIMIZE, (event: IpcMainEvent) => {
  const win = getWindowByEvent(event)
  if (win) win.maximize()
})

// 恢复窗口
ipcMain.on(IPC_KEYS.WINDOW_RESTORE, (event: IpcMainEvent) => {
  const win = getWindowByEvent(event)
  if (win) win.restore()
})

// 关闭当前窗口
ipcMain.on(IPC_KEYS.WINDOW_CLOSE, (event: IpcMainEvent) => {
  const win = getWindowByEvent(event)
  if (win) win.hide()
})

// 设置窗口置顶
ipcMain.on(IPC_KEYS.WINDOW_SET_ALWAYS_ON_TOP, (event: IpcMainEvent, flag: boolean) => {
  const win = getWindowByEvent(event)
  if (win) win.setAlwaysOnTop(flag)
})

// 检查窗口是否最大化
ipcMain.handle(IPC_KEYS.WINDOW_IS_MAXIMIZED, (event: IpcMainInvokeEvent) => {
  const win = getWindowByEvent(event)
  return win ? win.isMaximized() : false
})
