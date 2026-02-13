import { AppSettings, CodeEditorSettings, ColorModeType, ThemeSettings } from '@/types'
import { useColorMode } from '@vueuse/core'

export const useAppStore = defineStore('app', () => {
  /**
   * Hooks
   */
  const { store: colorModeStore } = useColorMode({ emitAuto: true })

  /**
   * States
   */
  // 主题设置
  const backgroundColor = ref<ThemeSettings['backgroundColor']>('#f5f5f4')
  const backgroundImageUrl = ref<ThemeSettings['backgroundImageUrl']>('')
  const backgroundScale = ref<ThemeSettings['backgroundScale']>(1)
  const backgroundOpacity = ref<ThemeSettings['backgroundOpacity']>(1)
  const backgroundBlur = ref<ThemeSettings['backgroundBlur']>(0)

  // 代码编辑器设置
  const codeEditorTheme = ref<CodeEditorSettings['codeEditorTheme']>('github-light')
  const codeEditorFontSize = ref<CodeEditorSettings['codeEditorFontSize']>(14)
  const codeEditorFontFamily = ref<CodeEditorSettings['codeEditorFontFamily']>('Fira Code')
  const codeLanguages = ref<CodeEditorSettings['codeLanguages']>([
    'javascript',
    'typescript',
    'json',
    'html',
    'css',
    'python',
    'go',
    'rust',
    'java',
    'bash',
    'yaml',
    'markdown'
  ])
  const defaultLanguage = ref<CodeEditorSettings['defaultLanguage']>('typescript')

  // 应用设置
  const shortcut = ref<AppSettings['shortcut']>('Shift+Space')
  const databasePath = ref<AppSettings['databasePath']>('')

  /**
   * Getters
   */
  const colorMode = computed(() => colorModeStore.value)

  /**
   * Actions
   */

  const setBackgroundColor = async (color: any) => {
    backgroundColor.value = color as ThemeSettings['backgroundColor']
    await window.api.storeSet('backgroundColor', color)
  }

  const setBackgroundImageUrl = async (url: ThemeSettings['backgroundImageUrl']) => {
    backgroundImageUrl.value = url
    await window.api.storeSet('backgroundImageUrl', url)
  }

  const setBackgroundScale = async (scale: any) => {
    const value = Array.isArray(scale) ? scale[0] : scale
    backgroundScale.value = value as ThemeSettings['backgroundScale']
    await window.api.storeSet('backgroundScale', value)
  }

  const setBackgroundOpacity = async (opacity: any) => {
    const value = Array.isArray(opacity) ? opacity[0] : opacity
    backgroundOpacity.value = value as ThemeSettings['backgroundOpacity']
    await window.api.storeSet('backgroundOpacity', value)
  }

  const setBackgroundBlur = async (blur: any) => {
    const value = Array.isArray(blur) ? blur[0] : blur
    backgroundBlur.value = value as ThemeSettings['backgroundBlur']
    await window.api.storeSet('backgroundBlur', value)
  }

  const setCodeEditorTheme = async (theme: CodeEditorSettings['codeEditorTheme']) => {
    codeEditorTheme.value = theme
    await window.api.storeSet('codeEditorTheme', theme)
  }

  const setCodeEditorFontSize = async (size: CodeEditorSettings['codeEditorFontSize']) => {
    codeEditorFontSize.value = size
    await window.api.storeSet('codeEditorFontSize', size)
  }

  const setCodeEditorFontFamily = async (family: CodeEditorSettings['codeEditorFontFamily']) => {
    codeEditorFontFamily.value = family
    await window.api.storeSet('codeEditorFontFamily', family)
  }

  const setCodeLanguages = async (languages: CodeEditorSettings['codeLanguages']) => {
    codeLanguages.value = languages
    await window.api.storeSet('codeLanguages', languages)
  }

  const setDefaultLanguage = async (language: CodeEditorSettings['defaultLanguage']) => {
    defaultLanguage.value = language
    await window.api.storeSet('defaultLanguage', language)
  }

  const setShortcut = async (s: AppSettings['shortcut']) => {
    shortcut.value = s

    await window.api.storeSet('shortcut', s)
    window.api.shortcut(s)
  }

  const setDatabasePath = async (path: AppSettings['databasePath']) => {
    databasePath.value = path
    await window.api.storeSet('databasePath', path)
  }

  const setColorMode = async (mode: any) => {
    colorModeStore.value = mode as ColorModeType
    await window.api.storeSet('colorMode', mode)

    if (mode === 'auto') {
      window.api.setColorMode('system')
    } else {
      window.api.setColorMode(mode)
    }
  }

  // 从electron-store加载所有设置
  const initFromStore = async () => {
    const settings = await window.api.storeGetAll()

    backgroundColor.value = settings.backgroundColor ?? 'stone'
    backgroundImageUrl.value = settings.backgroundImageUrl ?? ''
    backgroundScale.value = settings.backgroundScale ?? 1
    backgroundOpacity.value = settings.backgroundOpacity ?? 1
    backgroundBlur.value = settings.backgroundBlur ?? 0
    codeEditorTheme.value = settings.codeEditorTheme ?? 'github-light'
    codeEditorFontSize.value = settings.codeEditorFontSize ?? 14
    codeEditorFontFamily.value = settings.codeEditorFontFamily ?? 'Fira Code'
    codeLanguages.value = settings.codeLanguages ?? [
      'javascript',
      'typescript',
      'json',
      'html',
      'css',
      'python',
      'go',
      'rust',
      'java',
      'bash',
      'yaml',
      'markdown'
    ]
    defaultLanguage.value = settings.defaultLanguage ?? 'typescript'
    shortcut.value = settings.shortcut ?? 'Shift+Space'
    databasePath.value = settings.databasePath ?? ''

    // 同步ColorMode
    if (settings.colorMode) {
      if (settings.colorMode === 'system') {
        colorModeStore.value = 'auto'
        window.api.setColorMode('system')
      } else {
        colorModeStore.value = settings.colorMode
        window.api.setColorMode(settings.colorMode)
      }
    }
  }

  // 监听其他窗口的设置变更
  const setupStoreListeners = () => {
    window.api.onStoreUpdated((key, value) => {
      switch (key) {
        case 'backgroundColor':
          backgroundColor.value = value
          break
        case 'backgroundImageUrl':
          backgroundImageUrl.value = value
          break
        case 'backgroundScale':
          backgroundScale.value = value
          break
        case 'backgroundOpacity':
          backgroundOpacity.value = value
          break
        case 'backgroundBlur':
          backgroundBlur.value = value
          break
        case 'codeEditorTheme':
          codeEditorTheme.value = value
          break
        case 'codeEditorFontSize':
          codeEditorFontSize.value = value
          break
        case 'codeEditorFontFamily':
          codeEditorFontFamily.value = value
          break
        case 'codeLanguages':
          codeLanguages.value = value
          break
        case 'defaultLanguage':
          defaultLanguage.value = value
          break
        case 'shortcut':
          shortcut.value = value
          break
        case 'databasePath':
          databasePath.value = value
          break
        case 'colorMode':
          if (value === 'system') {
            colorModeStore.value = 'auto'
          } else {
            colorModeStore.value = value
          }
          break
      }
    })
  }

  // 执行初始化
  initFromStore()
  setupStoreListeners()

  return {
    // States
    backgroundColor,
    backgroundImageUrl,
    backgroundScale,
    backgroundOpacity,
    backgroundBlur,
    codeEditorTheme,
    codeEditorFontSize,
    codeEditorFontFamily,
    codeLanguages,
    defaultLanguage,
    shortcut,
    databasePath,

    // Getters
    colorMode,

    // Actions
    setBackgroundColor,
    setBackgroundImageUrl,
    setBackgroundScale,
    setBackgroundOpacity,
    setBackgroundBlur,
    setCodeEditorTheme,
    setCodeEditorFontSize,
    setCodeEditorFontFamily,
    setCodeLanguages,
    setDefaultLanguage,
    setShortcut,
    setDatabasePath,
    setColorMode
  }
})
