import { ElectronAPI } from '@electron-toolkit/preload'
import type {
  WindowNameType,
  Category,
  Code,
  CreateCategoryInput,
  CreateCodeInput,
  UpdateCategoryInput,
  UpdateCodeInput,
  QueryOptions,
  ColorModeType,
  BackgroundImageInfo
} from '@shared/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      // ========== 窗口相关 ==========
      openWindow: (name: WindowNameType) => void
      closeWindow: (name: WindowNameType) => void
      shortcut: (shortcut: string) => Promise<void>
      setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => void
      setColorMode: (colorMode: ColorModeType) => void

      // ========== 窗口控制 ==========
      /**
       * 最小化当前窗口
       */
      windowMinimize: () => void

      /**
       * 最大化当前窗口
       */
      windowMaximize: () => void

      /**
       * 恢复当前窗口
       */
      windowRestore: () => void

      /**
       * 关闭当前窗口
       */
      windowClose: () => void

      /**
       * 设置窗口置顶状态
       * @param flag 是否置顶
       */
      windowSetAlwaysOnTop: (flag: boolean) => void

      /**
       * 检查窗口是否最大化
       * @returns 是否最大化
       */
      windowIsMaximized: () => Promise<boolean>

      // ========== 数据库相关 ==========
      /**
       * 获取当前数据库路径
       * @returns 数据库文件路径
       */
      dbGetPath: () => Promise<string>

      /**
       * 选择数据库文件保存目录
       * @returns 选择的目录路径，取消则返回null
       */
      dbSelectDirectory: () => Promise<string | null>

      /**
       * 设置新的数据库路径并重新连接
       * @param dbPath 新的数据库路径
       * @returns 操作结果
       */
      dbSetPath: (dbPath: string) => Promise<{ success: boolean; path?: string; error?: string }>

      /**
       * 初始化数据库（创建表和种子数据）
       * @returns 操作结果
       */
      dbInit: () => Promise<{ success: boolean; error?: string }>

      /**
       * 获取数据库统计信息
       * @returns 统计数据
       */
      dbGetStatistics: () => Promise<{
        totalCategories: number
        totalCodes: number
        uncategorizedCodes: number
      }>

      // ========== 分类相关 ==========
      /**
       * 获取所有分类
       * @returns 分类列表
       */
      categoryGetAll: () => Promise<Category[]>

      /**
       * 创建分类
       * @param data 分类数据
       * @returns 新分类的ID
       */
      categoryCreate: (data: CreateCategoryInput) => Promise<number>

      /**
       * 更新分类
       * @param id 分类ID
       * @param data 更新数据
       * @returns 受影响的行数
       */
      categoryUpdate: (id: number, data: UpdateCategoryInput) => Promise<number>

      /**
       * 删除分类
       * @param id 分类ID
       * @returns 受影响的行数
       */
      categoryDelete: (id: number) => Promise<number>

      // ========== 代码片段相关 ==========
      /**
       * 获取所有代码片段
       * @param options 查询选项
       * @returns 代码片段列表
       */
      codeGetAll: (options?: QueryOptions) => Promise<Code[]>

      /**
       * 根据ID获取代码片段
       * @param id 代码片段ID
       * @returns 代码片段详情
       */
      codeGetById: (id: number) => Promise<Code | undefined>

      /**
       * 创建代码片段
       * @param data 代码片段数据
       * @returns 新代码片段的ID
       */
      codeCreate: (data: CreateCodeInput) => Promise<number>

      /**
       * 更新代码片段
       * @param id 代码片段ID
       * @param data 更新数据
       * @returns 受影响的行数
       */
      codeUpdate: (id: number, data: UpdateCodeInput) => Promise<number>

      /**
       * 删除代码片段
       * @param id 代码片段ID
       * @returns 受影响的行数
       */
      codeDelete: (id: number) => Promise<number>

      /**
       * 批量删除代码片段
       * @param ids 代码片段ID数组
       * @returns 受影响的行数
       */
      codeBatchDelete: (ids: number[]) => Promise<number>

      /**
       * 搜索代码片段
       * @param keyword 关键词
       * @param categoryId 分类ID（可选）
       * @returns 代码片段列表
       */
      codeSearch: (keyword: string, categoryId?: number) => Promise<Code[]>

      /**
       * 获取代码片段数量
       * @param categoryId 分类ID（可选）
       * @returns 代码片段数量
       */
      codeGetCount: (categoryId?: number) => Promise<number>

      // ========== 背景图片相关 ==========
      selectBackgroundImage: () => Promise<BackgroundImageInfo | null>
      deleteBackgroundImage: (path: string) => Promise<{ success: boolean; error?: string }>
      getBackgroundImages: () => Promise<BackgroundImageInfo[]>

      // ========== Store 设置相关 ==========
      storeGet: (key: string) => Promise<any>
      storeGetAll: () => Promise<Record<string, any>>
      storeSet: (key: string, value: any) => Promise<boolean>
      storeSetMany: (settings: Record<string, any>) => Promise<boolean>
      onStoreUpdated: (callback: (key: string, value: any) => void) => void
    }
  }
}
