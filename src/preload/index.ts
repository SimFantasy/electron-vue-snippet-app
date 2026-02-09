import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type {
  WindowNameType,
  CreateCategoryInput,
  CreateCodeInput,
  UpdateCategoryInput,
  UpdateCodeInput,
  QueryOptions,
  ColorModeType
} from '@shared/types'
import { IPC_KEYS } from '@shared/constants'

// 自定义渲染进程的API
const api = {
  // ========== 窗口相关 ==========
  /** 打开窗口 */
  openWindow: (name: WindowNameType) => ipcRenderer.send(IPC_KEYS.OPEN_WINDOW, name),
  /** 关闭窗口 */
  closeWindow: (name: WindowNameType) => ipcRenderer.send(IPC_KEYS.CLOSE_WINDOW, name),
  /** 鼠标穿透 */
  setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) =>
    ipcRenderer.send(IPC_KEYS.IGNORE_MOUSE_EVENT, ignore, options),
  /** 快捷键 */
  shortcut: (shortcut: string) => ipcRenderer.invoke(IPC_KEYS.SHORTCUT, shortcut),
  /** 设置更新全局广播 */
  onSettingsUpdated: (callback: (settings: any) => void) =>
    ipcRenderer.on(IPC_KEYS.SETTINGS_UPDATED, (_event, settings) => callback(settings)),
  /* 设置颜色模式 */
  setColorMode: (colorMode: ColorModeType) => ipcRenderer.invoke(IPC_KEYS.COLOR_MODE, colorMode),

  // ========== 窗口控制 ==========
  /** 最小化当前窗口 */
  windowMinimize: () => ipcRenderer.send(IPC_KEYS.WINDOW_MINIMIZE),
  /** 最大化当前窗口 */
  windowMaximize: () => ipcRenderer.send(IPC_KEYS.WINDOW_MAXIMIZE),
  /** 恢复当前窗口 */
  windowRestore: () => ipcRenderer.send(IPC_KEYS.WINDOW_RESTORE),
  /** 关闭当前窗口 */
  windowClose: () => ipcRenderer.send(IPC_KEYS.WINDOW_CLOSE),
  /** 检查窗口是否最大化 */
  windowIsMaximized: () => ipcRenderer.invoke(IPC_KEYS.WINDOW_IS_MAXIMIZED),
  /** 设置窗口置顶状态 */
  windowSetAlwaysOnTop: (flag: boolean) =>
    ipcRenderer.send(IPC_KEYS.WINDOW_SET_ALWAYS_ON_TOP, flag),

  // ========== 数据库相关 ==========
  /** 获取当前数据库路径 */
  dbGetPath: () => ipcRenderer.invoke(IPC_KEYS.DB_GET_PATH),
  /** 选择数据库文件保存目录 */
  dbSelectDirectory: () => ipcRenderer.invoke(IPC_KEYS.DB_SELECT_DIRECTORY),
  /** 设置新的数据库路径并重新连接 */
  dbSetPath: (dbPath: string) => ipcRenderer.invoke(IPC_KEYS.DB_SET_PATH, dbPath),
  /** 初始化数据库 */
  dbInit: () => ipcRenderer.invoke(IPC_KEYS.DB_INIT),
  /** 获取数据库统计信息 */
  dbGetStatistics: () => ipcRenderer.invoke(IPC_KEYS.DB_GET_STATISTICS),

  // ========== 分类相关 ==========
  /** 获取所有分类 */
  categoryGetAll: () => ipcRenderer.invoke(IPC_KEYS.CATEGORY_GET_ALL),
  /** 创建分类 */
  categoryCreate: (data: CreateCategoryInput) => ipcRenderer.invoke(IPC_KEYS.CATEGORY_CREATE, data),
  /** 更新分类 */
  categoryUpdate: (id: number, data: UpdateCategoryInput) =>
    ipcRenderer.invoke(IPC_KEYS.CATEGORY_UPDATE, id, data),
  /** 删除分类 */
  categoryDelete: (id: number) => ipcRenderer.invoke(IPC_KEYS.CATEGORY_DELETE, id),

  // ========== 代码片段相关 ==========
  /** 获取所有代码片段 */
  codeGetAll: (options?: QueryOptions) => ipcRenderer.invoke(IPC_KEYS.CODE_GET_ALL, options),
  /** 根据ID获取代码片段 */
  codeGetById: (id: number) => ipcRenderer.invoke(IPC_KEYS.CODE_GET_BY_ID, id),
  /** 创建代码片段 */
  codeCreate: (data: CreateCodeInput) => ipcRenderer.invoke(IPC_KEYS.CODE_CREATE, data),
  /** 更新代码片段 */
  codeUpdate: (id: number, data: UpdateCodeInput) =>
    ipcRenderer.invoke(IPC_KEYS.CODE_UPDATE, id, data),
  /** 删除代码片段 */
  codeDelete: (id: number) => ipcRenderer.invoke(IPC_KEYS.CODE_DELETE, id),
  /** 批量删除代码片段 */
  codeBatchDelete: (ids: number[]) => ipcRenderer.invoke(IPC_KEYS.CODE_BATCH_DELETE, ids),
  /** 搜索代码片段 */
  codeSearch: (keyword: string, categoryId?: number) =>
    ipcRenderer.invoke(IPC_KEYS.CODE_SEARCH, keyword, categoryId),
  /** 获取代码片段数量 */
  codeGetCount: (categoryId?: number) => ipcRenderer.invoke(IPC_KEYS.CODE_GET_COUNT, categoryId)
}

// 使用 `contextBridge` API 将 Electron API 暴露给
// 仅当启用上下文隔离时才暴露给渲染器，否则
// 只需添加到 DOM 全局变量中。
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
