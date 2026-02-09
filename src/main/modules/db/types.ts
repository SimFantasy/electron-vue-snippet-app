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
  language: string // 代码语言类型
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
  language?: string
}

// 更新代码片段输入
export interface UpdateCodeInput {
  title?: string
  content?: string
  tags?: string | string[]
  category_id?: number
  language?: string
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
