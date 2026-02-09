import { getDB } from './connect'
import type {
  Category,
  Code,
  CreateCategoryInput,
  CreateCodeInput,
  UpdateCategoryInput,
  UpdateCodeInput,
  QueryOptions
} from './types'

// ==================== 分类相关操作 ====================

/**
 * 获取所有分类
 */
export async function getAllCategories(): Promise<Category[]> {
  const db = getDB()
  return await db('categories').select('*').orderBy('created_at', 'desc')
}

/**
 * 创建分类
 * @param data 分类数据
 */
export async function createCategory(data: CreateCategoryInput): Promise<number> {
  const db = getDB()
  const [id] = await db('categories').insert({
    ...data,
    created_at: new Date(),
    updated_at: new Date()
  })
  return id
}

/**
 * 更新分类
 * @param id 分类ID
 * @param data 更新数据
 */
export async function updateCategory(id: number, data: UpdateCategoryInput): Promise<number> {
  const db = getDB()
  return await db('categories')
    .where('id', id)
    .update({
      ...data,
      updated_at: new Date()
    })
}

/**
 * 删除分类
 * @param id 分类ID
 */
export async function deleteCategory(id: number): Promise<number> {
  const db = getDB()
  return await db('categories').where('id', id).del()
}

// ==================== 代码片段相关操作 ====================

/**
 * 获取所有代码片段
 * @param options 查询选项
 */
export async function getAllCodes(options: QueryOptions = {}): Promise<Code[]> {
  const db = getDB()
  let query = db('codes').select('*')

  if (options.categoryId !== undefined) {
    query = query.where('category_id', options.categoryId)
  }

  if (options.search) {
    query = query.where((builder) => {
      builder
        .where('title', 'like', `%${options.search}%`)
        .orWhere('tags', 'like', `%${options.search}%`)
    })
  }

  const orderBy = options.orderBy || 'created_at'
  const order = options.order || 'desc'
  query = query.orderBy(orderBy, order)

  if (options.limit) {
    query = query.limit(options.limit)
    if (options.offset) {
      query = query.offset(options.offset)
    }
  }

  return await query
}

/**
 * 根据ID获取代码片段
 * @param id 代码片段ID
 */
export async function getCodeById(id: number): Promise<Code | undefined> {
  const db = getDB()
  return await db('codes').where('id', id).first()
}

/**
 * 创建代码片段
 * @param data 代码片段数据
 */
export async function createCode(data: CreateCodeInput): Promise<number> {
  const db = getDB()
  const tags = Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags || '[]'

  const [id] = await db('codes').insert({
    title: data.title,
    content: data.content,
    tags,
    category_id: data.category_id || 0,
    language: data.language || 'javascript',
    created_at: new Date(),
    updated_at: new Date()
  })
  return id
}

/**
 * 更新代码片段
 * @param id 代码片段ID
 * @param data 更新数据
 */
export async function updateCode(id: number, data: UpdateCodeInput): Promise<number> {
  const db = getDB()
  const updateData: Record<string, unknown> = {
    updated_at: new Date()
  }

  if (data.title !== undefined) updateData.title = data.title
  if (data.content !== undefined) updateData.content = data.content
  if (data.category_id !== undefined) updateData.category_id = data.category_id
  if (data.language !== undefined) updateData.language = data.language
  if (data.tags !== undefined) {
    updateData.tags = Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags
  }

  return await db('codes').where('id', id).update(updateData)
}

/**
 * 删除代码片段
 * @param id 代码片段ID
 */
export async function deleteCode(id: number): Promise<number> {
  const db = getDB()
  return await db('codes').where('id', id).del()
}

/**
 * 批量删除代码片段
 * @param ids 代码片段ID数组
 */
export async function batchDeleteCodes(ids: number[]): Promise<number> {
  const db = getDB()
  return await db('codes').whereIn('id', ids).del()
}

/**
 * 搜索代码片段
 * @param keyword 关键词
 * @param categoryId 分类ID（可选）
 */
export async function searchCodes(keyword: string, categoryId?: number): Promise<Code[]> {
  const db = getDB()
  let query = db('codes').where((builder) => {
    builder.where('title', 'like', `%${keyword}%`).orWhere('tags', 'like', `%${keyword}%`)
  })

  if (categoryId !== undefined) {
    query = query.andWhere('category_id', categoryId)
  }

  return await query.orderBy('created_at', 'desc')
}

/**
 * 获取代码片段总数
 * @param categoryId 分类ID（可选）
 */
export async function getCodesCount(categoryId?: number): Promise<number> {
  const db = getDB()
  let query = db('codes').count('* as count')

  if (categoryId !== undefined) {
    query = query.where('category_id', categoryId)
  }

  const result = await query.first<{ 'count(*)': string }>()
  return parseInt(result?.['count(*)'] || '0', 8)
}

// ==================== 统计相关操作 ====================

/**
 * 获取统计数据
 */
export async function getStatistics(): Promise<{
  totalCategories: number
  totalCodes: number
  uncategorizedCodes: number
}> {
  const db = getDB()
  const categoriesResult = await db('categories')
    .count('* as count')
    .first<{ 'count(*)': string }>()
  const codesResult = await db('codes').count('* as count').first<{ 'count(*)': string }>()
  const uncategorizedResult = await db('codes')
    .where('category_id', 0)
    .count('* as count')
    .first<{ 'count(*)': string }>()

  return {
    totalCategories: parseInt(categoriesResult?.['count(*)'] || '0', 10),
    totalCodes: parseInt(codesResult?.['count(*)'] || '0', 10),
    uncategorizedCodes: parseInt(uncategorizedResult?.['count(*)'] || '0', 10)
  }
}
