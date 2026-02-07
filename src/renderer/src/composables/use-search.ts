import { useSearchStore } from '@/stores'
import { watch, ref } from 'vue'

export function useSearch() {
  /**
   * Hooks
   */
  const searchStore = useSearchStore()

  /**
   * States
   */
  const searchKeyword = ref('')

  /**
   * Actions
   */
  const handleSearch = async (value: string) => {
    searchStore.setSearchKeyword(value)

    console.log('value', value)

    // 关键词为空时，清空结果
    if (!value || value.trim() === '') {
      searchStore.setSearchResults([])
      return
    }

    // 调用后端接口获取结果
    const result = await window.api.codeSearch(value)

    // 设置结果
    searchStore.setSearchResults(result)
  }

  /**
   * Watchers
   */

  // 监听关键词变化，自动搜索
  watch(
    () => searchKeyword.value,
    (newValue) => {
      handleSearch(newValue)
    }
  )

  return {
    searchKeyword,
    handleSearch
  }
}
