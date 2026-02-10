import { useAsyncState } from '@vueuse/core'
import { useCategoryStore } from '@/stores'
import { createCategory, updateCategory, deleteCategory } from '@/services/api'

export function useCategory() {
  /**
   * Hooks
   */
  const toast = useToast()
  const router = useRouter()

  const manageStore = useCategoryStore()
  const { categories, categoriesLoading, categoryId } = storeToRefs(manageStore)
  const { handleFetchCategories, handleRefreshCategories, setCategoryId } = manageStore

  /**
   * Actions
   */
  // 创建分类
  const { executeImmediate: handleCreateCategory, isLoading: categoryCreatLoading } = useAsyncState(
    createCategory,
    null,
    {
      immediate: false,
      onSuccess: (res) => {
        if (res) {
          toast.add({
            title: '创建成功',
            icon: 'tabler:circle-check',
            color: 'success',
            progress: false
          })
          // 刷新分类列表
          handleRefreshCategories()

          // 跳转到分类
          router.push({ name: 'CodeList', params: { cid: res } })
        }
      }
    }
  )

  // 更新分类
  const { executeImmediate: handleUpdateCategory, isLoading: categoryUpdateLoading } =
    useAsyncState(updateCategory, null, {
      immediate: false,
      onSuccess: (res) => {
        if (res) {
          toast.add({
            title: '更新成功',
            icon: 'tabler:circle-check',
            color: 'success',
            progress: false
          })
          // 刷新分类列表
          handleRefreshCategories()
        }
      }
    })

  // 删除分类
  const { executeImmediate: handleDeleteCategory, isLoading: categoryDeleteLoading } =
    useAsyncState(deleteCategory, null, {
      immediate: false,
      onSuccess: (res) => {
        if (res) {
          toast.add({
            title: '删除成功',
            icon: 'tabler:circle-check',
            color: 'success',
            progress: false
          })
          // 刷新分类列表
          handleRefreshCategories()
        }
      }
    })

  return {
    // States
    categoryId,
    categories,
    categoriesLoading,
    categoryCreatLoading,
    categoryUpdateLoading,
    categoryDeleteLoading,

    // Actions
    handleFetchCategories,
    handleRefreshCategories,
    setCategoryId,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory
  }
}
