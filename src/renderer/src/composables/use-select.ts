import { useSearchStore } from '@/stores'
import { useClipboard } from '@vueuse/core'

export function useSelect() {
  /**
   * Hooks
   */
  const searchStore = useSearchStore()
  const { searchResults, searchResultId } = storeToRefs(searchStore)
  const { copy, copied } = useClipboard()
  const toast = useToast()

  /**
   * Actions
   */

  // 通过ID获取代码内容并复制到剪贴板（提供给鼠标点击或键盘上下移动enter键选中时使用）
  const handleSelectedItem = async (id: number) => {
    const item = searchResults.value?.find((item) => item.id === id)?.content
    if (item) {
      // 将内容复制到剪贴板
      copy(item)
      // 清空筛选项
      searchStore.setSearchResults([])
      // 清空关键字
      searchStore.setSearchKeyword('')
      // 隐藏窗口
      window.api.closeWindow('search')
    }
  }

  // 处理键盘事件
  const handleKeyDownEvent = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowUp': {
        if (!searchResults.value || (searchResults.value && searchResults.value.length === 0))
          return

        // 当前选中项索引
        const index = searchResults.value.findIndex((item) => item.id === searchResultId.value)
        searchStore.setSearchResultId(
          searchResults.value[index - 1]?.id ||
            searchResults.value[searchResults.value.length - 1].id
        )

        break
      }
      case 'ArrowDown': {
        if (!searchResults.value || (searchResults.value && searchResults.value.length === 0))
          return

        // 当前选中项索引
        const index = searchResults.value.findIndex((item) => item.id === searchResultId.value)
        searchStore.setSearchResultId(
          searchResults.value[index + 1]?.id || searchResults.value[0].id
        )

        break
      }
      case 'Enter': {
        // 选中当前项并复制到剪贴板
        handleSelectedItem(searchResultId.value)
        // 隐藏窗口
        window.api.closeWindow('search')

        // 显示toast提示
        if (copied.value) {
          toast.add({
            title: '复制成功',
            color: 'success'
          })
        }

        break
      }
      case 'Escape': {
        window.api.closeWindow('search')
        break
      }
    }
  }

  /**
   * Watchers
   */

  //  重置当前索引
  watch(
    () => searchResults.value,
    (val) => {
      if (val && val.length) {
        searchStore.setSearchResultId(val?.[0]?.id || 0)
      }
    }
  )

  /**
   * Lifecycles
   */
  // 添加键盘事件监听器
  onMounted(() => {
    document.addEventListener('keydown', handleKeyDownEvent)
  })

  // 移除键盘事件监听器
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDownEvent)
  })

  return {
    //States
    searchResults,
    searchResultId,

    //Actions
    handleSelectedItem
  }
}
