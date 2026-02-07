import { Code } from '@shared/types'

export const useSearchStore = defineStore('search', () => {
  /**
   * States
   */
  const searchResults = ref<Code[] | undefined>(undefined)
  const searchResultId = ref<number>(0)
  const searchKeyword = ref<string>('')

  /**
   * Actions
   */
  const setSearchResults = (codes: Code[]) => {
    searchResults.value = [...codes]
  }

  const setSearchResultId = (id: number) => {
    searchResultId.value = id
  }

  const setSearchKeyword = (keyword: string) => {
    searchKeyword.value = keyword
  }

  return {
    // States
    searchResults,
    searchResultId,
    searchKeyword,

    // Actions
    setSearchResults,
    setSearchResultId,
    setSearchKeyword
  }
})
