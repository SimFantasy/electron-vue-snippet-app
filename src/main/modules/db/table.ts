// import type { Knex } from 'knex'
import { getDB } from './connect'

/**
 * 初始化数据库表结构
 */
export async function initTables(): Promise<void> {
  const db = getDB()

  // 创建分类表
  const hasCategoriesTable = await db.schema.hasTable('categories')
  if (!hasCategoriesTable) {
    await db.schema.createTable('categories', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable().comment('分类名称')
      table.timestamp('created_at').defaultTo(db.fn.now()).comment('创建时间')
      table.timestamp('updated_at').defaultTo(db.fn.now()).comment('更新时间')
    })
    console.log('categories表创建成功')
  }

  // 创建代码片段表
  const hasCodesTable = await db.schema.hasTable('codes')
  if (!hasCodesTable) {
    await db.schema.createTable('codes', (table) => {
      table.increments('id').primary()
      table.string('title').notNullable().comment('代码标题')
      table.text('content').notNullable().comment('代码内容')
      table.json('tags').defaultTo('[]').comment('代码标签，JSON数组格式')
      table.integer('category_id').defaultTo(0).comment('分类ID，0表示未分类')
      table.string('language').defaultTo('javascript').comment('代码语言类型')
      table.timestamp('created_at').defaultTo(db.fn.now()).comment('创建时间')
      table.timestamp('updated_at').defaultTo(db.fn.now()).comment('更新时间')

      // 添加索引
      table.index('category_id', 'idx_codes_category_id')
      table.index('created_at', 'idx_codes_created_at')
    })
    console.log('codes表创建成功')
  } else {
    // Migration: 检查并添加 language 字段
    const hasLanguageColumn = await db.schema.hasColumn('codes', 'language')
    if (!hasLanguageColumn) {
      await db.schema.table('codes', (table) => {
        table.string('language').defaultTo('javascript').comment('代码语言类型')
      })
      console.log('codes表添加 language 字段成功')
    }
  }
}

/**
 * 删除所有表（用于重置数据库）
 */
export async function dropTables(): Promise<void> {
  const db = getDB()

  const hasCodesTable = await db.schema.hasTable('codes')
  if (hasCodesTable) {
    await db.schema.dropTable('codes')
    console.log('codes表已删除')
  }

  const hasCategoriesTable = await db.schema.hasTable('categories')
  if (hasCategoriesTable) {
    await db.schema.dropTable('categories')
    console.log('categories表已删除')
  }
}

/**
 * 检查表是否存在
 * @param tableName 表名
 * @returns 是否存在
 */
export async function hasTable(tableName: string): Promise<boolean> {
  const db = getDB()
  return await db.schema.hasTable(tableName)
}

/**
 * 设置分类删除触发器
 * 当分类被删除时，将该分类下的所有代码的category_id设置为0
 */
export async function setupCategoryDeleteTrigger(): Promise<void> {
  const db = getDB()

  // SQLite中需要在创建表后通过触发器实现级联更新
  // 首先检查触发器是否已存在
  const triggerName = 'trg_category_delete'
  const result = await db.raw(
    `
    SELECT name FROM sqlite_master
    WHERE type = 'trigger' AND name = ?
  `,
    [triggerName]
  )

  if (result.length === 0) {
    await db.raw(`
      CREATE TRIGGER IF NOT EXISTS ${triggerName}
      AFTER DELETE ON categories
      BEGIN
        UPDATE codes SET category_id = 0 WHERE category_id = OLD.id;
      END;
    `)
    console.log('分类删除触发器创建成功')
  }
}
