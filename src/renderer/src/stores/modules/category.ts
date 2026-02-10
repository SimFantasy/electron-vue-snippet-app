import { useAsyncState } from '@vueuse/core'
import { getCategories } from '@/services/api'

export const useCategoryStore = defineStore('category', () => {
  /**
   * States
   */
  const categoryId = ref(0)

  /**
   * Actions
   */
  const setCategoryId = (id: number) => {
    categoryId.value = id
  }

  // 获取所有分类
  const { state, isLoading, execute, executeImmediate } = useAsyncState(getCategories, null)

  return {
    // states
    categoryId,
    categories: state,
    categoriesLoading: isLoading,

    // actions
    setCategoryId,
    handleFetchCategories: execute,
    handleRefreshCategories: executeImmediate
  }
})
