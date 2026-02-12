import type { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import type { ColorModeType, WindowNameType } from '@shared/types'

import { BrowserWindow, ipcMain, nativeTheme, app, dialog } from 'electron'
import path from 'path'
import fs from 'fs'

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

// ========== 背景图片 ==========
const BACKGROUNDS_DIR = path.join(app.getPath('userData'), 'images')

// 确保图片目录存在
if (!fs.existsSync(BACKGROUNDS_DIR)) {
  fs.mkdirSync(BACKGROUNDS_DIR, { recursive: true })
}

// 选择并保存图片
ipcMain.handle(IPC_KEYS.BACKGROUND_SELECT_IMAGE, async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg', 'webp'] }]
  })

  if (result.canceled || result.filePaths.length === 0) return null

  const sourcePath = result.filePaths[0]
  const ext = path.extname(sourcePath)
  const fileName = `bg_${Date.now()}${ext}`
  const destPath = path.join(BACKGROUNDS_DIR, fileName)

  try {
    // 复制图片到userData
    fs.copyFileSync(sourcePath, destPath)
    // 返回 file:// 协议路径
    const fileUrl = `app:///${destPath.replace(/\\/g, '/')}`

    return {
      url: fileUrl,
      name: fileName,
      path: destPath
    }
  } catch (error) {
    console.log('Failed to copy image', error)
    return null
  }
})

// 删除图片
ipcMain.handle(IPC_KEYS.BACKGROUND_DELETE_IMAGE, async (_event, imagePath: string) => {
  try {
    // 安全校验，确保文件在images目录下
    const resolovedPath = path.resolve(imagePath)
    const resolvedBgDir = path.resolve(BACKGROUNDS_DIR)
    if (!resolovedPath.startsWith(resolvedBgDir)) {
      return { success: false, error: 'Invalid image path' }
    }

    if (fs.existsSync(resolovedPath)) {
      fs.unlinkSync(resolovedPath)
    }

    return { success: true }
  } catch (error) {
    console.log('Failed to delete image', error)
    return { success: false, error: String(error) }
  }
})

// 获取所有背景图片列表
ipcMain.handle(IPC_KEYS.BACKGROUND_GET_IMAGES, async () => {
  try {
    if (!fs.existsSync(BACKGROUNDS_DIR)) return []

    const files = fs.readdirSync(BACKGROUNDS_DIR)

    return files
      .filter((file) => /\.(jpg|png|gif|jpeg|webp)$/i.test(file))
      .map((file) => {
        const filePath = path.join(BACKGROUNDS_DIR, file)
        return {
          url: `app:///${filePath.replace(/\\/g, '/')}`,
          name: file,
          path: filePath
        }
      })
  } catch (error) {
    console.log('Failed to get images', error)
    return []
  }
})
