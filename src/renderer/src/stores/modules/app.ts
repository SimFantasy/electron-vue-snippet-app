import { AppSettings, CodeEditorSettings, ColorModeType, ThemeSettings } from '@/types'
import { useColorMode } from '@vueuse/core'

export const useAppStore = defineStore(
  'app',
  () => {
    /**
     * Hooks
     */
    const { store } = useColorMode({ emitAuto: true })

    /**
     * States
     */
    // 主题设置
    const themeBackgroundType = ref<ThemeSettings['themeBackgroundType']>('color')
    const themeColor = ref<ThemeSettings['themeColor']>('emerald')
    const backgroundImageUrl = ref<ThemeSettings['backgroundImageUrl']>('')
    const backgroundScale = ref<ThemeSettings['backgroundSettings']['scale']>(1)
    const backgroundOpacity = ref<ThemeSettings['backgroundSettings']['opacity']>(1)
    const backgroundBlur = ref<ThemeSettings['backgroundSettings']['blur']>(0)

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
    const defaultLanguage = ref<CodeEditorSettings['defaultLanguage']>('javascript')

    // 应用设置
    const shortcut = ref<AppSettings['shortcut']>('Shift+Space')
    const databasePath = ref<AppSettings['databasePath']>('')

    /**
     * Getters
     */
    const colorMode = computed(() => store.value)

    /**
     * Actions
     */
    const setThemeBackgroundType = (type: ThemeSettings['themeBackgroundType']) => {
      themeBackgroundType.value = type
    }

    const setThemeColor = (color: ThemeSettings['themeColor']) => {
      themeColor.value = color
    }

    const setBackgroundImageUrl = (url: ThemeSettings['backgroundImageUrl']) => {
      backgroundImageUrl.value = url
    }

    const setBackgroundScale = (scale: ThemeSettings['backgroundSettings']['scale']) => {
      backgroundScale.value = scale
    }

    const setBackgroundOpacity = (opacity: ThemeSettings['backgroundSettings']['opacity']) => {
      backgroundOpacity.value = opacity
    }

    const setBackgroundBlur = (blur: ThemeSettings['backgroundSettings']['blur']) => {
      backgroundBlur.value = blur
    }

    const setCodeEditorTheme = (theme: CodeEditorSettings['codeEditorTheme']) => {
      codeEditorTheme.value = theme
      // 广播设置更新
      window.api.broadcastSettings({ codeEditorTheme: theme })
    }

    const setCodeEditorFontSize = (size: CodeEditorSettings['codeEditorFontSize']) => {
      codeEditorFontSize.value = size
      // 广播设置更新
      window.api.broadcastSettings({ codeEditorFontSize: size })
    }

    const setCodeEditorFontFamily = (family: CodeEditorSettings['codeEditorFontFamily']) => {
      codeEditorFontFamily.value = family
      // 广播设置更新
      window.api.broadcastSettings({ codeEditorFontFamily: family })
    }

    const setCodeLanguages = (languages: CodeEditorSettings['codeLanguages']) => {
      codeLanguages.value = languages
    }

    const setDefaultLanguage = (language: CodeEditorSettings['defaultLanguage']) => {
      defaultLanguage.value = language
    }

    const setShortcut = (s: AppSettings['shortcut']) => {
      shortcut.value = s
      window.api?.broadcastSettings({ shortcut: s })
    }

    const setDatabasePath = (path: AppSettings['databasePath']) => {
      databasePath.value = path
      window.api?.broadcastSettings({ databasePath: path })
    }

    const setColorMode = (mode: ColorModeType) => {
      store.value = mode
      if (mode === 'auto') {
        window.api.setColorMode('system')
      } else {
        window.api.setColorMode(mode)
      }
    }

    return {
      // States
      themeBackgroundType,
      themeColor,
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
      setThemeBackgroundType,
      setThemeColor,
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
  },
  {
    persist: true
  }
)
