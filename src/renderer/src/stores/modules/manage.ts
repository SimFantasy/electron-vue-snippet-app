export const useManageStore = defineStore('manage', () => {
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

  return {
    // states
    categoryId,

    // actions
    setCategoryId
  }
})
