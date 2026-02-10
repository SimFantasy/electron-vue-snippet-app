import { useCodesStore } from '@/stores'

export const useCodeQuery = () => {
  /**
   * Hooks
   */
  const route = useRoute()
  const { fetchCodes, loading } = useCodesStore()

  /**
   * States
   */
  const snippetKeyword = ref('')

  /**
   * Actions
   */
  const handleSnippetKeywordQuetry = async () => {
    const categoryId = Number(route.params.categoryId) || 0

    await fetchCodes({ categoryId, search: snippetKeyword.value })
  }

  return {
    snippetKeyword,
    handleSnippetKeywordQuetry,
    loading
  }
}
