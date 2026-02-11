import type { Extension } from '@codemirror/state'

// 主题选项（用于 UI 选择器）
export const themeOptions = [
  { label: 'Dracula', value: 'dracula' },
  { label: 'GitHub Dark', value: 'github-dark' },
  { label: 'GitHub Light', value: 'github-light' },
  { label: 'One Dark', value: 'one-dark' },
  { label: 'Material Dark', value: 'material-dark' },
  { label: 'Tokyo Night', value: 'tokyo-night' }
]

// 字体选项
export const fontOptions = [
  { label: 'Fira Code', value: 'Fira Code' },
  { label: 'JetBrains Mono', value: 'JetBrains Mono' },
  { label: 'Source Code Pro', value: 'Source Code Pro' }
]

// 主题加载器映射
export const themeLoaders: Record<string, () => Promise<Extension>> = {
  'one-dark': async () => {
    const { oneDark } = await import('@codemirror/theme-one-dark')
    return oneDark
  },
  'github-dark': async () => {
    const { githubDark } = await import('@ddietr/codemirror-themes/theme/github-dark')
    return githubDark
  },
  'github-light': async () => {
    const { githubLight } = await import('@ddietr/codemirror-themes/theme/github-light')
    return githubLight
  },
  dracula: async () => {
    const { dracula } = await import('@ddietr/codemirror-themes/theme/dracula')
    return dracula
  },
  'material-dark': async () => {
    const { materialDark } = await import('@ddietr/codemirror-themes/theme/material-dark')
    return materialDark
  },
  'tokyo-night': async () => {
    const { tokyoNight } = await import('@ddietr/codemirror-themes/theme/tokyo-night')
    return tokyoNight
  },
  'material-light': async () => {
    const { materialLight } = await import('@ddietr/codemirror-themes/theme/material-light')
    return materialLight
  }
}

// 加载主题
export async function loadTheme(themeName: string): Promise<Extension | null> {
  const loader = themeLoaders[themeName]
  if (!loader) {
    console.warn(`Theme "${themeName}" not found, falling back to default`)
    return null
  }
  try {
    console.log('config theme', themeName)
    return await loader()
  } catch (error) {
    console.error(`Failed to load theme "${themeName}":`, error)
    return null
  }
}

// 默认主题
export const defaultTheme = 'one-dark'

// 默认字体
export const defaultFont = 'Fira Code'

// 默认字号
export const defaultFontSize = 14

// 获取字体 CSS
export function getFontCSS(fontFamily: string, fontSize: number): string {
  return `
    .cm-editor {
      font-family: '${fontFamily}', 'Consolas', 'Monaco', 'Courier New', monospace !important;
      font-size: ${fontSize}px !important;
    }
    .cm-content {
      font-family: '${fontFamily}', 'Consolas', 'Monaco', 'Courier New', monospace !important;
    }
  `
}
