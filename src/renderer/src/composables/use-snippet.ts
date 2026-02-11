import type { CreateCodeInput } from '@shared/types'

import { useAsyncState } from '@vueuse/core'
import { useSnippetStore } from '@/stores'
import { createCode, updateCode, deleteCode } from '@/services/api'

export function useSnippet() {
  /**
   * Hooks
   */
  const route = useRoute()
  const router = useRouter()
  const toast = useToast()

  const snippetStore = useSnippetStore()
  const { snippets, snippetsLoading } = storeToRefs(snippetStore)
  const { handleFetchSnippets, handleRefreshSnippets, getSnippetCodeById } = snippetStore

  /**
   * States
   */
  // 代码片段搜索关键字
  const snippetKeyword = ref('')

  // 导航锁（防止切换时重复保存）
  const isNavigating = ref(false)
  const lastCategoryChangedId = ref<number | null>(null)
  const isSyncing = ref(false)

  // 代码片段表单
  const snippetForm = ref<Partial<CreateCodeInput>>({
    title: '',
    category_id: 0,
    tags: [] as string[],
    content: '',
    language: 'typescript'
  })

  /**
   * Getters
   */
  // 获取当前分类的 ID
  const currrentCategoryId = computed(() =>
    route.params.cid ? Number(route.params.cid) : undefined
  )

  // 获取当前代码片段
  const currentSnippet = computed(() => {
    const id = Number(route.params.id)
    return id ? getSnippetCodeById(id) : null
  })

  /**
   * Actions
   */

  // 查询代码片段
  const fetchSnippets = async () =>
    handleFetchSnippets(0, {
      categoryId: currrentCategoryId.value,
      search: snippetKeyword.value || undefined
    })

  // 创建代码片段
  const { isLoading: snippetCreateLoading, execute: handleSnippetCreate } = useAsyncState(
    () =>
      createCode({
        title: '未命名代码片段',
        content: '',
        category_id: currrentCategoryId.value,
        tags: [],
        language: 'typescript'
      }),
    null,
    {
      immediate: false,
      onSuccess: (newId) => {
        if (!newId) return

        // 刷新列表
        handleRefreshSnippets({
          categoryId: currrentCategoryId.value,
          search: snippetKeyword.value || undefined
        })

        // 跳转到新创建的代码片段
        router.push({
          name: 'CodeDetail',
          params: {
            cid: currrentCategoryId.value,
            id: newId
          }
        })
        // 提示
        toast.add({
          title: '代码片段创建成功',
          icon: 'tabler:circle-check',
          color: 'success'
        })
      },
      onError: (error) => {
        toast.add({
          title: '代码片段创建失败',
          description: JSON.stringify(error),
          icon: 'tabler:circle-x',
          color: 'error'
        })
      }
    }
  )

  // 更新代码片段
  const { isLoading: snippetUpdateLoading, execute: handleSnippetUpdate } = useAsyncState(
    updateCode,
    null,
    {
      immediate: false,
      onSuccess: () => {
        // 刷新列表
        handleRefreshSnippets({
          categoryId: currrentCategoryId.value,
          search: snippetKeyword.value || undefined
        })
      }
    }
  )

  // 更新代码片段标题
  const updateSnippetTitle = () => {
    if (isSyncing.value || !currentSnippet.value) return

    handleSnippetUpdate(300, currentSnippet.value.id, {
      title: snippetForm.value.title || '未命名代码片段'
    })
  }

  // 更新代码片段语言
  const updateSnippetLanguage = () => {
    if (isSyncing.value || !currentSnippet.value) return

    handleSnippetUpdate(300, currentSnippet.value.id, {
      language: snippetForm.value.language || 'typescript'
    })
  }

  // 更新代码片段标签
  const updateSnippetTags = () => {
    if (isSyncing.value || !currentSnippet.value) return

    handleSnippetUpdate(300, currentSnippet.value.id, {
      tags: JSON.stringify(snippetForm.value.tags)
    })
  }

  // 更新代码片段内容
  const updateSnippetContent = () => {
    if (isSyncing.value || !currentSnippet.value) return

    handleSnippetUpdate(300, currentSnippet.value.id, {
      content: snippetForm.value.content
    })
  }

  // 切换代码片段分类（自动保存）
  const updateSnippetCategory = async () => {
    if (isSyncing.value || isNavigating.value || !currentSnippet.value) return

    // 当前代码片段id
    const currrentSnippetId = currentSnippet.value?.id

    // 如果刚处理过这个代码片段则跳过（防止重复保存）
    if (lastCategoryChangedId.value === currrentSnippetId) {
      lastCategoryChangedId.value = null
      return
    }

    // 标记正在处理的代码片段ID，加锁
    lastCategoryChangedId.value = currrentSnippetId as number
    isNavigating.value = true

    try {
      // 更新分类
      await handleSnippetUpdate(0, currrentSnippetId!, {
        category_id: snippetForm.value.category_id
      })

      // 刷新列表
      await handleRefreshSnippets({ categoryId: currrentCategoryId.value })

      // 跳转分类
      router.push({
        name: 'CodeList',
        params: { cid: currrentCategoryId.value }
      })
    } catch (error) {
      console.log('保存分类失败', error)
    } finally {
      // 延迟清理，确保所有异步操作完成
      setTimeout(() => {
        isNavigating.value = false
        lastCategoryChangedId.value = null
      }, 300)
    }
  }

  // 删除代码片段
  const { isLoading: snippetDeleteLoading, execute: handleSnippetDelete } = useAsyncState(
    deleteCode,
    null,
    {
      immediate: false,
      onSuccess: () => {
        // 刷新列表
        handleRefreshSnippets({
          categoryId: currrentCategoryId.value,
          search: snippetKeyword.value || undefined
        })

        // 如果是删除当前的代码片段，则跳转到blank
        if (Number(route.params.id)) {
          router.replace({
            name: 'CodeList',
            params: { cid: route.params.cid }
          })
        }
        // 提示
        toast.add({
          title: '代码片段删除成功',
          icon: 'tabler:circle-check',
          color: 'error'
        })
      }
    }
  )

  // 表单同步
  const syncSnippetForm = () => {
    const snippet = currentSnippet.value
    if (!snippet) return

    // 加锁，防止触发 watch
    isSyncing.value = true

    try {
      snippetForm.value = {
        title: snippet.title,
        category_id: snippet.category_id,
        tags: JSON.parse(snippet.tags as string) || [],
        content: snippet.content,
        language: snippet.language || 'typescript'
      }
    } finally {
      // 使用 nextTick 确保 Vue 完成更新后再解锁
      nextTick(() => {
        isSyncing.value = false
      })
    }
  }

  /**
   * Watters
   */
  // 监听当前代码片段的变化，同步表单数据
  watch(() => currentSnippet.value, syncSnippetForm, { immediate: true })

  // 监听代码片段标题变化，自动保存
  watch(() => snippetForm.value.title, updateSnippetTitle)

  // 监听代码片段分类变化，自动保存
  watch(() => snippetForm.value.category_id, updateSnippetCategory)

  // 监听代码片段标签变化，自动保存
  watch(() => snippetForm.value.tags, updateSnippetTags)

  // 监听代码片段内容变化，自动保存
  watch(() => snippetForm.value.content, updateSnippetContent)

  // 监听代码片段语言变化，自动保存
  watch(() => snippetForm.value.language, updateSnippetLanguage)

  return {
    // States
    snippets,
    snippetsLoading,
    snippetKeyword,
    snippetForm,
    currentSnippet,

    snippetCreateLoading,
    snippetUpdateLoading,
    snippetDeleteLoading,

    // Getters
    currrentCategoryId,

    // Actions
    fetchSnippets,
    handleFetchSnippets,
    handleRefreshSnippets,
    handleSnippetCreate,
    handleSnippetUpdate,
    handleSnippetDelete
  }
}
