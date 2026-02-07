import type { CustomWindowOptions, WindowNameType } from '@shared/types'

import { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { createWindow } from './create-window'

// 自定义窗口配置
export const options: CustomWindowOptions = {
  search: {
    id: 0,
    options: {
      initShow: true,
      openDevTools: true
      // hash: ''
    }
  },
  manage: {
    id: 0,
    options: {
      initShow: false,
      openDevTools: true,
      width: 1280,
      height: 800,
      frame: true,
      transparent: false,
      hash: '/#/manage/code-list'
    }
  },
  settings: {
    id: 0,
    options: {
      initShow: false,
      openDevTools: false,
      width: 800,
      height: 600,
      frame: true,
      transparent: false,
      hash: '/#/manage'
    }
  }
}

// 根据窗口名称获取窗口实例
export const getWindowByName = (name: WindowNameType) => {
  // 根据窗口id获取窗口实例
  let win = BrowserWindow.fromId(options[name].id)

  // 如果窗口实例不存在，则创建窗口并更新窗口id，确保不重复创建窗口，窗口唯一
  if (!win) {
    win = createWindow(options[name].options)
    options[name].id = win.id
  }

  return win
}

// 通过IPC触发事件时，获取与该事件相关的窗口实例
export const getWindowByEvent = (event: IpcMainEvent | IpcMainInvokeEvent) => {
  return BrowserWindow.fromWebContents(event.sender)
}
