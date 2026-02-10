import { useCodesStore } from '@/stores'
import { createCode } from '@/services/api'

export function useCodeCreate() {
  /**
   * Hooks
   */
  const route = useRoute()
  const router = useRouter()
  const codesStore = useCodesStore()

  /**
   * Actions
   */
  const handleCreateSnippet = async () => {
    const categoryId = Number(route.params.cid) || 0

    try {
      // 创建代码片段
      const newId = await createCode({
        title: '未命名代码片段',
        content: '',
        category_id: categoryId,
        tags: [],
        language: 'typescript'
      })

      // 刷新当前分类列表
      await codesStore.fetchCodes(categoryId ? { categoryId } : undefined)

      // 跳转到新创建的代码片段
      await router.push({
        name: 'CodeDetail',
        params: {
          cid: categoryId,
          id: newId
        }
      })
    } catch (error) {
      console.log('添加代码片段失败', error)
    }
  }

  return {
    handleCreateSnippet
  }
}
