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
    const themeSettings = ref<ThemeSettings>({
      themeBackgroundType: 'color',
      themeColor: 'emerald',
      backgroundImageUrl: '',
      backgroundSettings: {
        scale: 1,
        opacity: 1,
        blur: 0
      }
    })

    // 代码编辑器设置
    const codeEditorSettings = ref<CodeEditorSettings>({
      codeEditorTheme: 'one-dark',
      codeEditorFontSize: 16,
      codeEditorFontFamily: 'Fira Code'
    })

    // 应用设置
    const appSettings = ref<AppSettings>({
      shortcut: 'Shift+Space',
      databasePath: ''
    })

    /**
     * Getters
     */
    const colorMode = computed(() => store.value)

    /**
     * Actions
     */
    const setThemeSettings = (settings: Partial<ThemeSettings>) => {
      themeSettings.value = {
        ...themeSettings.value,
        ...settings
      }
    }

    const setCodeEditorSettings = (settings: Partial<CodeEditorSettings>) => {
      codeEditorSettings.value = {
        ...codeEditorSettings.value,
        ...settings
      }
    }

    const setAppSettings = (settings: Partial<AppSettings>) => {
      appSettings.value = {
        ...appSettings.value,
        ...settings
      }
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
      themeSettings,
      codeEditorSettings,
      appSettings,

      // Getters
      colorMode,

      // Actions
      setThemeSettings,
      setCodeEditorSettings,
      setAppSettings,
      setColorMode
    }
  },
  {
    persist: true
  }
)
