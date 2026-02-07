import { app, dialog, globalShortcut } from 'electron'
import { getWindowByName } from './window'

// 搜索窗口注册快捷键
export const registerSearchWindowShortcut = (shortcut: string) => {
  // 注销全局快捷键
  globalShortcut.unregisterAll()

  // 如果快捷键为空，直接放回
  if (!shortcut || shortcut.trim() === '') return true

  // 如果快捷键已被注册，提示错误并返回 false
  if (shortcut && globalShortcut.isRegistered(shortcut)) {
    dialog.showErrorBox('错误', '快捷键已被注册')
    return false
  }

  const win = getWindowByName('search')
  return globalShortcut.register(shortcut, () => {
    win.isVisible() ? win.hide() : win.show()
  })
}

// 应用完全退出时注销全局快捷键
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
