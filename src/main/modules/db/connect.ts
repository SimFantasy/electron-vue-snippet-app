import { app } from 'electron'
import { knex, type Knex } from 'knex'
import { join, dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'

// 默认数据库路径
const defaultDbPath = join(app.getPath('documents'), 'snippet', 'data.db')

// 当前数据库实例
let dbInstance: Knex | null = null

// 当前数据库路径
let currentDbPath: string = defaultDbPath

/**
 * 创建数据库连接
 * @param dbPath 数据库文件路径，如果不传则使用默认路径
 * @returns Knex实例
 */
export function createConnection(dbPath: string = defaultDbPath): Knex {
  // 确保目录存在
  const dbDir = dirname(dbPath)
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
  }

  currentDbPath = dbPath

  dbInstance = knex({
    client: 'better-sqlite3',
    connection: {
      filename: dbPath
    },
    useNullAsDefault: true
  })

  return dbInstance
}

/**
 * 获取当前数据库实例
 * @returns Knex实例
 */
export function getDB(): Knex {
  if (!dbInstance) {
    return createConnection()
  }
  return dbInstance
}

/**
 * 获取当前数据库路径
 * @returns 当前数据库文件路径
 */
export function getCurrentDbPath(): string {
  return currentDbPath
}

/**
 * 关闭数据库连接
 */
export async function closeConnection(): Promise<void> {
  if (dbInstance) {
    await dbInstance.destroy()
    dbInstance = null
  }
}

/**
 * 重新连接数据库（用于切换数据库路径）
 * @param newDbPath 新的数据库路径
 * @returns 新的Knex实例
 */
export async function reconnect(newDbPath: string): Promise<Knex> {
  await closeConnection()
  return createConnection(newDbPath)
}

// 注意：不要在模块级别调用 getDB()，因为 app.getPath() 需要在 app ready 后才能使用
// 请在函数内部动态获取 db 实例
