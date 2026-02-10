import { useAsyncState } from '@vueuse/core'
import { getCodes } from '@/services/api'

export const useSnippetStore = defineStore('snippet', () => {
  /**
   * Hooks
   */
  const route = useRoute()

  /**
   * Getters
   */
  const categoryId = computed(() => (route.params.cid ? Number(route.params.cid) : undefined))

  /**
   * Actions
   */
  const { state, isLoading, execute, executeImmediate } = useAsyncState(
    () => getCodes({ categoryId: categoryId.value }),
    null
  )

  return {
    // States
    snippetCategoryId: categoryId,
    snippets: state,
    snippetsLoading: isLoading,
    handleFetchSnippets: execute,
    handleRefreshSnippets: executeImmediate
  }
})
