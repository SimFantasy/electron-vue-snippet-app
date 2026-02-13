import type { AppStoreSchemaType } from '@shared/types'
import Store from 'electron-store'
import { BrowserWindow, ipcMain } from 'electron'
import { IPC_KEYS } from '@shared/constants'

// Schema
const schema = {
  backgroundColor: {
    type: 'string',
    default: '#f5f5f4'
  },
  backgroundImageUrl: {
    type: 'string',
    default: ''
  },
  backgroundOpacity: {
    type: 'number',
    default: 1
  },
  backgroundBlur: {
    type: 'number',
    default: 0
  },
  backgroundScale: {
    type: 'number',
    default: 1
  },
  codeEditorTheme: {
    type: 'string',
    default: 'github-light'
  },
  codeEditorFontSize: {
    type: 'number',
    default: 14
  },
  codeEditorFontFamily: {
    type: 'string',
    default: 'Fira Code'
  },
  codeLanguage: {
    type: 'array',
    default: [
      'javascript',
      'typescript',
      'json',
      'html',
      'css',
      'python',
      'go',
      'rust',
      'java',
      'bash',
      'yaml',
      'markdown'
    ]
  },
  defaultLanguage: {
    type: 'string',
    default: 'typescript'
  },
  shortcut: {
    type: 'string',
    default: 'Shift+Space'
  },
  databasePath: {
    type: 'string',
    default: ''
  },
  colorMode: {
    type: 'string',
    default: 'system'
  }
} as const

// 创建Store实例
// 延迟声明 store 变量，不在模块级别实例化
let store: Store<AppStoreSchemaType>

// 初始化Ipc
export function initStoreIpc() {
  store = new Store<AppStoreSchemaType>({
    schema,
    name: 'app-settings'
  })

  // 获取单个设置
  ipcMain.handle(IPC_KEYS.STORE_GET, (_event, key: keyof AppStoreSchemaType) => {
    return store.get(key)
  })

  // 获取全部设置
  ipcMain.handle(IPC_KEYS.STORE_GET_ALL, () => {
    return store.store
  })

  // 设置单个设置
  ipcMain.handle(IPC_KEYS.STORE_SET, (_event, key: keyof AppStoreSchemaType, value: any) => {
    store.set(key, value)
    return true
  })

  // 设置多个值（批量设置）
  ipcMain.handle(IPC_KEYS.STORE_SET_MANY, (_event, settings: Partial<AppStoreSchemaType>) => {
    Object.entries(settings).forEach(([key, value]) => {
      store.set(key, value)
    })
    return true
  })

  // 监听store 变更并广播给所以窗口
  store.onDidAnyChange((newValue, oldValue) => {
    if (!newValue) return
    // 比较新旧值，找出变化的 key
    const changedKeys = Object.keys(newValue).filter(
      (key) =>
        newValue[key as keyof AppStoreSchemaType] !== oldValue?.[key as keyof AppStoreSchemaType]
    )

    changedKeys.forEach((key) => {
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send(IPC_KEYS.STORE_UPDATED, key, newValue[key as keyof AppStoreSchemaType])
      })
    })
  })
}

export { store }
