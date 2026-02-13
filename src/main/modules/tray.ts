import { Tray, nativeImage, app, Menu } from 'electron'

import { getWindowByName } from './window'
import icon from '../../../resources/icon.png?asset'

let tray: Tray | null = null

export function createTray() {
  // 创建图标
  const iconImage = nativeImage.createFromPath(icon)
  const trayIcon = iconImage.resize({ width: 16, height: 16 })

  tray = new Tray(trayIcon)

  // 设置工具提示
  tray.setToolTip('Snippet App')

  // 创建右键菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '搜索',
      click: () => {
        const win = getWindowByName('search')
        win.show()
        win.focus()
      }
    },
    {
      label: '代码片段管理',
      click: () => {
        const win = getWindowByName('manage')
        win.show()
        win.focus()
      }
    },
    {
      label: '应用设置',
      click: () => {
        const win = getWindowByName('settings')
        win.show()
        win.focus()
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)

  // 左键点击显示搜索窗口
  tray.on('click', () => {
    const win = getWindowByName('search')
    win.show()
    win.focus()
  })

  return tray
}

// 销毁托盘图标
export function destroyTray() {
  if (tray) {
    tray.destroy()
    tray = null
  }
}

// 获取托盘
export function getTray() {
  return tray
}
