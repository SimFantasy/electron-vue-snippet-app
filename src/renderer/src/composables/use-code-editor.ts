import { useCodesStore } from '@/stores'
import { storeToRefs } from 'pinia'

export function useCodeEditor() {
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
      // 如果在导航过程中，不更新 category，防止触发 saveCategory
      if (!isNavigating.value) {
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
  const saveCategory = () => {
    // 如果在导航过程中，不执行保存
    if (isNavigating.value || !currentCode.value) return

    const currentId = currentCode.value.id
    // 获取当前代码片段在列表中的索引
    const currentIndex = codes.value?.findIndex((c) => c.id === currentId) ?? -1
    // 确定下一个要选中的代码片段（优先上一个，如果是第一个则选下一个）
    let targetId: number | null = null
    if (codes.value && codes.value.length > 1) {
      if (currentIndex > 0) {
        // 有上一个，选中上一个
        targetId = codes.value[currentIndex - 1].id
      } else {
        // 是第一个，选中下一个（索引1，因为当前是0）
        targetId = codes.value[1]?.id ?? null
      }
    }

    saveCode(currentId, { category_id: category.value })

    // 设置导航标志，防止重复触发
    isNavigating.value = true

    // 延迟刷新，等待防抖执行完成
    setTimeout(async () => {
      // 先清除当前选中的 id，防止 code-list 的自动选择逻辑触发
      await router.replace({
        name: 'CodeDetail',
        params: {
          cid: route.params.cid
          // 不传递 id，让 code-list 知道当前没有选中项
        }
      })

      // 修改分类后刷新分类列表
      await codesStore.fetchCodes(
        route.params.cid ? { categoryId: Number(route.params.cid) } : undefined
      )

      // 如果有目标代码片段，自动跳转
      if (targetId) {
        await router.replace({
          name: 'CodeDetail',
          params: {
            cid: route.params.cid,
            id: targetId
          }
        })
      }

      // 导航完成，清除标志
      isNavigating.value = false
    }, 500)
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

  // 监听表单变化，自动保存
  watch(() => title.value, saveTitle)
  watch(() => category.value, saveCategory)
  watch(() => tags.value, saveTags, { deep: true })
  watch(() => content.value, saveContent)
  watch(() => language.value, saveLanguage)

  // 监听路由变化，处理切换时的逻辑
  watch(
    () => route.params.id,
    (_newId, oldId) => {
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
