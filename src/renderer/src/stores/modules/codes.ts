import { defineStore } from 'pinia'
import type { Code } from '@shared/types'
import { getCodes, updateCode } from '@/services/api'
import { useDebounceFn } from '@vueuse/core'
import { useToast } from '@nuxt/ui/composables/useToast'

export const useCodesStore = defineStore('codes', () => {
  /**
   * Hooks
   */
  const toast = useToast()

  /**
   * States
   */
  const codes = ref<Code[] | null>(null)
  const loading = ref(false)

  /**
   * Getters
   */
  const getCodeById = (id: number) => codes.value?.find((c) => c.id === id)

  /**
   * Actions
   */
  // 获取代码列表
  const fetchCodes = async (params?: { categoryId?: number; search?: string }) => {
    loading.value = true
    try {
      codes.value = await getCodes(params)
    } finally {
      loading.value = false
    }
  }

  // 保存并更新本地数据
  const saveCode = useDebounceFn(async (id: number, data: Partial<Code>) => {
    try {
      await updateCode(id, data)
      // 直接替换数组元素，触发响应式更新
      const index = codes.value?.findIndex((c) => c.id === id)
      if (codes.value && index !== undefined && index !== -1) {
        codes.value[index] = { ...codes.value[index], ...data }
      }
    } catch (error: any) {
      toast.add({
        title: '保存失败',
        description: error.message,
        color: 'error'
      })
    }
  }, 500)

  return {
    // States
    codes,
    loading,
    // Getters
    getCodeById,
    // Actions
    fetchCodes,
    saveCode
  }
})
