import { CreateCategoryInput, CreateCodeInput, QueryOptions, UpdateCodeInput } from '@shared/types'
/**
 * 分类 API
 */

// 获取所有分类
export const getCategories = async () => {
  return await window.api.categoryGetAll()
}

// 创建分类
export const createCategory = async (data: CreateCategoryInput) => {
  return await window.api.categoryCreate(data)
}

// 更新分类
export const updateCategory = async (id: number, data: CreateCategoryInput) => {
  return await window.api.categoryUpdate(id, data)
}

// 删除分类
export const deleteCategory = async (id: number) => {
  return await window.api.categoryDelete(id)
}

/**
 * 代码片段 API
 */

// 获取所有代码片段
export const getCodes = async (options?: QueryOptions) => {
  return await window.api.codeGetAll(options)
}

// 搜索代码片段
export const searchCodes = async (keyword: string, categoryId?: number) => {
  return await window.api.codeSearch(keyword, categoryId)
}

// 获取代码片段详情
export const getCodeById = async (id: number) => {
  return await window.api.codeGetById(id)
}

// 创建代码片段
export const createCode = async (data: CreateCodeInput) => {
  return await window.api.codeCreate(data)
}

// 更新代码片段
export const updateCode = async (id: number, data: UpdateCodeInput) => {
  return await window.api.codeUpdate(id, data)
}

// 删除代码片段
export const deleteCode = async (id: number) => {
  return await window.api.codeDelete(id)
}

// 批量删除代码片段
export const batchDeleteCodes = async (ids: number[]) => {
  return await window.api.codeBatchDelete(ids)
}

// 获取代码片段数量
export const getCodeCount = async (categoryId?: number) => {
  return await window.api.codeGetCount(categoryId)
}

/**
 * 数据库 API
 */
// 获取数据库路径
export const getDbPath = async () => {
  return await window.api.dbGetPath()
}

// 选择数据库路径
export const selectDbPath = async () => {
  return await window.api.dbSelectDirectory()
}

// 设置数据库路径
export const setDbPath = async (dbPath: string) => {
  return await window.api.dbSetPath(dbPath)
}
