import type { Code } from '@shared/types'
import { useAsyncState } from '@vueuse/core'
import { getCodes } from '@/services/api'

export const useSnippetStore = defineStore('snippet', () => {
  /**
   * Actions
   */
  // 获取代码片段列表请求
  // stores/modules/snippet.ts
  const {
    state: snippets,
    isLoading: snippetsLoading,
    execute: handleFetchSnippets,
    executeImmediate: handleRefreshSnippets
  } = useAsyncState(getCodes, [] as Code[])

  // 根据id获取代码片段详情
  const getSnippetCodeById = (id: number) => snippets.value?.find((item) => item.id === id)

  return {
    // States
    snippets,
    snippetsLoading,
    // Actions
    handleFetchSnippets,
    handleRefreshSnippets,
    getSnippetCodeById
  }
})
