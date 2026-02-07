import { BrowserWindowConstructorOptions } from 'electron'

// 窗口选项
export interface WindowsOptions extends Partial<BrowserWindowConstructorOptions> {
  openDevTools?: boolean // 是否打开开发者工具
  hash?: string // 窗口的hash值
  initShow?: boolean // 是否初始化显示
}
// 自定义窗口选项
export type CustomWindowOptions = Record<WindowNameType, { id: number; options: WindowsOptions }>

// 窗口名称类型
export type WindowNameType = 'search' | 'manage' | 'settings'

// ColorMode类型
export type ColorModeType = 'light' | 'dark' | 'system'
// ==================== 数据库相关类型 ====================

// 分类表结构
export interface Category {
  id: number
  name: string
  created_at: Date | string
  updated_at: Date | string
}

// 代码片段表结构
export interface Code {
  id: number
  title: string
  content: string
  tags: string // JSON字符串格式
  category_id: number
  created_at: Date | string
  updated_at: Date | string
}

// 创建分类输入
export interface CreateCategoryInput {
  name: string
}

// 更新分类输入
export interface UpdateCategoryInput {
  name?: string
}

// 创建代码片段输入
export interface CreateCodeInput {
  title: string
  content: string
  tags?: string | string[]
  category_id?: number
}

// 更新代码片段输入
export interface UpdateCodeInput {
  title?: string
  content?: string
  tags?: string | string[]
  category_id?: number
}

// 查询选项
export interface QueryOptions {
  categoryId?: number
  search?: string
  orderBy?: string
  order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}
