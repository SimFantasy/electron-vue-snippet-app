export function useWindowControl() {
  /**
   * states
   */
  // 窗口是否最大化
  const isMaximized = ref(false)

  /**
   * Actions
   */

  // 最小化
  const handleWindowMinimize = () => window.api.windowMinimize()

  // 最大化
  const handleWindowMaximize = () => window.api.windowMaximize()

  // 恢复窗口
  const handleWindowRestore = () => window.api.windowRestore()

  // 切换窗口大小
  const handleWindowToggle = () => {
    if (isMaximized.value) {
      handleWindowRestore()
      isMaximized.value = false
    } else {
      handleWindowMaximize()
      isMaximized.value = true
    }
  }

  // 关闭当前窗口
  const handleWindowCloseCurrent = () => window.api.windowClose()

  // 设置窗口置顶
  const handleWindowSetAlwaysOnTop = (flag: boolean) => window.api.windowSetAlwaysOnTop(flag)

  return {
    // States
    isMaximized,
    // Actions
    handleWindowMinimize,
    handleWindowMaximize,
    handleWindowRestore,
    handleWindowToggle,
    handleWindowCloseCurrent,
    handleWindowSetAlwaysOnTop
  }
}
