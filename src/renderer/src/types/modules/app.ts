// 应用设置选项
export interface ThemeSettings {
  themeBackgroundType: 'color' | 'image'
  themeColor:
    | 'neutral'
    | 'stone'
    | 'zinc'
    | 'slate'
    | 'gray'
    | 'red'
    | 'orange'
    | 'amber'
    | 'yellow'
    | 'lime'
    | 'green'
    | 'emerald'
    | 'teal'
    | 'cyan'
    | 'sky'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'purple'
    | 'fuchsia'
    | 'pink'
    | 'rose'
  backgroundImageUrl: string
  backgroundSettings: {
    scale: number
    opacity: number
    blur: number
  }
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
