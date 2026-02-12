import { ipcMain, dialog } from 'electron'
import { IPC_KEYS } from '@shared/constants'
import { createConnection, getCurrentDbPath, closeConnection } from './connect'
import { initTables, setupCategoryDeleteTrigger } from './table'
import { seedData } from './seed'
import * as query from './query'
import type {
  Category,
  Code,
  CreateCategoryInput,
  CreateCodeInput,
  UpdateCategoryInput,
  UpdateCodeInput,
  QueryOptions
} from './types'
import { join } from 'path'

/**
 * 初始化数据库IPC处理器
 */
export function initDatabaseIPC(): void {
  // 获取当前数据库路径
  ipcMain.handle(IPC_KEYS.DB_GET_PATH, () => {
    return getCurrentDbPath()
  })

  // 选择数据库文件保存目录
  ipcMain.handle(IPC_KEYS.DB_SELECT_DIRECTORY, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: '选择数据库文件保存目录'
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    return result.filePaths[0]
  })

  // 设置新的数据库路径并重新连接
  ipcMain.handle(IPC_KEYS.DB_SET_PATH, async (_event, dbPath: string) => {
    try {
      // 如果传入的是目录路径，则自动拼接数据库文件名
      let finalDbPath = dbPath
      const ext = '.db'
      if (!dbPath.endsWith(ext)) {
        finalDbPath = join(dbPath, 'data.db')
      }

      // 关闭现有连接
      await closeConnection()

      // 创建新连接
      await createConnection(finalDbPath)

      // 初始化表结构
      await initTables()

      // 设置触发器
      await setupCategoryDeleteTrigger()

      // 填充种子数据
      await seedData()

      return { success: true, path: dbPath }
    } catch (error) {
      console.error('设置数据库路径失败:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // 初始化数据库（创建表和种子数据）
  ipcMain.handle(IPC_KEYS.DB_INIT, async () => {
    try {
      await initTables()
      await setupCategoryDeleteTrigger()
      await seedData()
      return { success: true }
    } catch (error) {
      console.error('初始化数据库失败:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // ==================== 分类相关IPC ====================

  // 获取所有分类
  ipcMain.handle(IPC_KEYS.CATEGORY_GET_ALL, async (): Promise<Category[]> => {
    return await query.getAllCategories()
  })

  // 创建分类
  ipcMain.handle(
    IPC_KEYS.CATEGORY_CREATE,
    async (_event, data: CreateCategoryInput): Promise<number> => {
      return await query.createCategory(data)
    }
  )

  // 更新分类
  ipcMain.handle(
    IPC_KEYS.CATEGORY_UPDATE,
    async (_event, { id, data }: { id: number; data: UpdateCategoryInput }): Promise<number> => {
      return await query.updateCategory(id, data)
    }
  )

  // 删除分类
  ipcMain.handle(IPC_KEYS.CATEGORY_DELETE, async (_event, id: number): Promise<number> => {
    return await query.deleteCategory(id)
  })

  // ==================== 代码片段相关IPC ====================

  // 获取所有代码片段
  ipcMain.handle(IPC_KEYS.CODE_GET_ALL, async (_event, options?: QueryOptions): Promise<Code[]> => {
    return await query.getAllCodes(options)
  })

  // 根据ID获取代码片段
  ipcMain.handle(IPC_KEYS.CODE_GET_BY_ID, async (_event, id: number): Promise<Code | undefined> => {
    return await query.getCodeById(id)
  })

  // 创建代码片段
  ipcMain.handle(IPC_KEYS.CODE_CREATE, async (_event, data: CreateCodeInput): Promise<number> => {
    return await query.createCode(data)
  })

  // 更新代码片段
  ipcMain.handle(
    IPC_KEYS.CODE_UPDATE,
    async (_event, { id, data }: { id: number; data: UpdateCodeInput }): Promise<number> => {
      return await query.updateCode(id, data)
    }
  )

  // 删除代码片段
  ipcMain.handle(IPC_KEYS.CODE_DELETE, async (_event, id: number): Promise<number> => {
    return await query.deleteCode(id)
  })

  // 批量删除代码片段
  ipcMain.handle(IPC_KEYS.CODE_BATCH_DELETE, async (_event, ids: number[]): Promise<number> => {
    return await query.batchDeleteCodes(ids)
  })

  // 搜索代码片段
  ipcMain.handle(
    IPC_KEYS.CODE_SEARCH,
    async (
      _event,
      { keyword, categoryId }: { keyword: string; categoryId?: number }
    ): Promise<Code[]> => {
      return await query.searchCodes(keyword, categoryId)
    }
  )

  // 获取代码片段数量
  ipcMain.handle(IPC_KEYS.CODE_GET_COUNT, async (_event, categoryId?: number): Promise<number> => {
    return await query.getCodesCount(categoryId)
  })

  // ==================== 统计相关IPC ====================

  // 获取统计数据
  ipcMain.handle(IPC_KEYS.DB_GET_STATISTICS, async () => {
    return await query.getStatistics()
  })
}
