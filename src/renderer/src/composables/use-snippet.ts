import { useAsyncState } from '@vueuse/core'
import { useSnippetStore } from '@/stores'
import { getCodeById, createCode, updateCode, deleteCode } from '@/services/api'

export function useSnippet() {
  /**
   * Hooks
   */
  const snippetStore = useSnippetStore()
  const { snippets, snippetsLoading } = storeToRefs(snippetStore)
}
