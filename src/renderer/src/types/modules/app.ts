// 应用设置选项

export interface ThemeSettings {
  backgroundColor: string
  backgroundImageUrl: string
  backgroundScale: number
  backgroundOpacity: number
  backgroundBlur: number
}

export interface AppSettings {
  shortcut: string
  databasePath: string
}

export interface CodeEditorSettings {
  codeEditorTheme: string
  codeEditorFontSize: number
  codeEditorFontFamily: string
  codeLanguages: string[] // 启用的语言列表
  defaultLanguage: string // 默认语言
}

export type ColorModeType = 'light' | 'dark' | 'auto'
