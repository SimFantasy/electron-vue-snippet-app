import { useCodesStore } from '@/stores'
import { updateCode } from '@/services/api'
import { storeToRefs } from 'pinia'

export function useCodeUpdate() {
  /**
   * Hooks
   */
  const route = useRoute()
  const router = useRouter()
  const codesStore = useCodesStore()
  const { getCodeById, saveCode } = codesStore
  const { codes } = storeToRefs(codesStore)

  /**
   * States
   */
  const title = ref('')
  const category = ref(0)
  const tags = ref<string[]>([])
  const content = ref('')
  const language = ref('javascript')
  const isNavigating = ref(false)
  // 记录最后修改过分类的代码片段ID，防止重复触发
  const lastCategoryChangedId = ref<number | null>(null)

  /**
   * Getters
   */
  const currentCode = computed(() => {
    const id = Number(route.params.id)
    return getCodeById(id)
  })

  const isTitleEmpty = computed(() => !title.value || title.value.trim() === '')

  /**
   * Actions
   */
  // 同步代码到表单
  const syncToForm = () => {
    const code = currentCode.value
    if (code) {
      // 如果 category 已经是要设置的值，不要重复设置（防止循环）
      if (category.value !== code.category_id) {
        category.value = code.category_id
      }
      title.value = code.title
      tags.value = JSON.parse(code.tags as string) || []
      content.value = code.content
      language.value = code.language || 'javascript'
    }
  }

  // 保存语言
  const saveLanguage = () => {
    if (currentCode.value) {
      saveCode(currentCode.value.id, { language: language.value })
    }
  }

  // 保存标题（处理空标题）
  const saveTitle = () => {
    if (currentCode.value) {
      saveCode(currentCode.value.id, { title: title.value || '未命名' })
    }
  }

  // 保存分类
  const saveCategory = async () => {
    // 如果在导航过程中，不执行保存
    if (isNavigating.value || !currentCode.value) {
      if (isNavigating.value) {
        console.log('[saveCategory] 跳过 - 正在导航中')
      }
      return
    }

    // 如果这个代码片段刚刚被修改过分类，跳过（防止重复触发）
    if (lastCategoryChangedId.value === currentCode.value.id) {
      console.log('[saveCategory] 跳过 - 该片段已处理过:', currentCode.value.id)
      // 清除记录，允许下次修改
      lastCategoryChangedId.value = null
      return
    }

    const currentId = currentCode.value.id
    const currentCategoryId = currentCode.value.category_id
    console.log('[saveCategory] 开始 - currentId:', currentId, '目标分类:', category.value)

    // 记录这个代码片段即将被修改
    lastCategoryChangedId.value = currentId

    // 获取当前代码片段在列表中的索引
    const currentIndex = codes.value?.findIndex((c) => c.id === currentId) ?? -1

    // 确定下一个要选中的代码片段（优先上一个，如果是第一个则选下一个）
    let targetId: number | null = null
    if (codes.value && codes.value.length > 1) {
      if (currentIndex > 0) {
        targetId = codes.value[currentIndex - 1].id
        console.log('[saveCategory] 将跳转到上一个 snippet:', targetId)
      } else {
        targetId = codes.value[1]?.id ?? null
        console.log('[saveCategory] 将跳转到下一个 snippet:', targetId)
      }
    }

    // 设置导航标志，防止重复触发
    isNavigating.value = true
    console.log('[saveCategory] isNavigating = true')

    try {
      // 直接调用 API 保存分类（不使用防抖，确保立即保存）
      console.log('[saveCategory] 保存到数据库...')
      await updateCode(currentId, { category_id: category.value })
      console.log('[saveCategory] 保存成功')

      // 立即跳转到目标代码片段
      if (targetId) {
        console.log('[saveCategory] 开始跳转到:', targetId)
        await router.replace({
          name: 'CodeDetail',
          params: {
            cid: currentCategoryId,
            id: targetId
          }
        })
        console.log('[saveCategory] 跳转完成')
      }

      // 从本地列表中移除当前代码片段
      if (codes.value) {
        const index = codes.value.findIndex((c) => c.id === currentId)
        if (index !== -1) {
          codes.value.splice(index, 1)
          console.log('[saveCategory] 从本地列表移除, 剩余:', codes.value.length)
        }
      }
    } catch (error) {
      console.error('[saveCategory] 错误:', error)
    } finally {
      // 延迟清除标志和记录
      setTimeout(() => {
        isNavigating.value = false
        lastCategoryChangedId.value = null
        console.log('[saveCategory] 清理完成')
      }, 300)
    }
  }

  // 保存标签
  const saveTags = () => {
    if (currentCode.value) {
      saveCode(currentCode.value.id, { tags: JSON.stringify(tags.value) })
    }
  }

  // 保存内容
  const saveContent = () => {
    if (currentCode.value) {
      saveCode(currentCode.value.id, { content: content.value })
    }
  }

  // 处理离开时的逻辑（清空标题检查、更新时间戳）
  const handleLeave = (oldId: string | number) => {
    // 离开时检测标题是否为空
    if (isTitleEmpty.value && currentCode.value) {
      saveCode(currentCode.value.id, { title: '未命名' })
    }

    // 更新时间戳
    const code = codes.value?.find((c) => c.id === Number(oldId))
    if (code) {
      code.updated_at = new Date().toISOString()
    }
  }

  /**
   * Watchers
   */
  // 监听当前代码变化，同步到表单
  watch(() => currentCode.value, syncToForm, { immediate: true })

  // 监听表单变化，自动保存（只在非导航状态下保存）
  watch(() => title.value, saveTitle)
  watch(() => category.value, saveCategory)
  watch(() => tags.value, saveTags, { deep: true })
  watch(() => content.value, saveContent)
  watch(() => language.value, saveLanguage)

  // 监听路由变化，处理切换时的逻辑
  watch(
    () => route.params.id,
    (newId, oldId) => {
      console.log('[use-code-editor] 🔄 route.params.id:', oldId, '->', newId)
      if (oldId && typeof oldId === 'string') {
        handleLeave(oldId)
      }
    }
  )

  return {
    // States
    title,
    category,
    tags,
    content,
    language,
    // Getters
    currentCode,
    isTitleEmpty,
    // Actions
    syncToForm,
    handleLeave
  }
}
