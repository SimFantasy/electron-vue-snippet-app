export const IPC_KEYS = {
  SETTINGS_UPDATED: 'settings-updated', // 设置更新
  OPEN_WINDOW: 'open-window', // 打开窗口
  CLOSE_WINDOW: 'close-window', // 关闭窗口
  IGNORE_MOUSE_EVENT: 'ignore-mouse-event', // 鼠标穿透
  SHORTCUT: 'shortcut', // 快捷键
  COLOR_MODE: 'color-mode', // 颜色模式

  // 窗口控制
  WINDOW_MINIMIZE: 'window-minimize', // 最小化窗口
  WINDOW_MAXIMIZE: 'window-maximize', // 最大化窗口
  WINDOW_RESTORE: 'window-restore', // 恢复窗口
  WINDOW_CLOSE: 'window-close', // 关闭当前窗口
  WINDOW_IS_MAXIMIZED: 'window-is-maximized', // 检查窗口是否最大化
  WINDOW_SET_ALWAYS_ON_TOP: 'window-set-always-on-top', // 设置窗口置顶

  // 数据库相关
  DB_GET_PATH: 'db-get-path',
  DB_SELECT_DIRECTORY: 'db-select-directory',
  DB_SET_PATH: 'db-set-path',
  DB_INIT: 'db-init',
  DB_GET_STATISTICS: 'db-get-statistics',

  // 分类相关
  CATEGORY_GET_ALL: 'category-get-all',
  CATEGORY_CREATE: 'category-create',
  CATEGORY_UPDATE: 'category-update',
  CATEGORY_DELETE: 'category-delete',

  // 代码片段相关
  CODE_GET_ALL: 'code-get-all',
  CODE_GET_BY_ID: 'code-get-by-id',
  CODE_CREATE: 'code-create',
  CODE_UPDATE: 'code-update',
  CODE_DELETE: 'code-delete',
  CODE_BATCH_DELETE: 'code-batch-delete',
  CODE_SEARCH: 'code-search',
  CODE_GET_COUNT: 'code-get-count',

  // 背景图片相关
  BACKGROUND_SELECT_IMAGE: 'background-select-image',
  BACKGROUND_DELETE_IMAGE: 'background-delete-image',
  BACKGROUND_GET_IMAGES: 'background-get-images'
} as const
