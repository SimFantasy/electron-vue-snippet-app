<script lang="ts" setup name="SnippetContextMenu">
import type { ContextMenuItem } from '@nuxt/ui'
import { Code } from '@shared/types'
import { useCategory, useSnippet } from '@/composables'

/**
 * Defines
 */
// Props
const { code } = defineProps<{
  code: Code
}>()

/**
 * Hooks
 */
const { categories } = useCategory()
const { currrentCategoryId, snippetDeleteLoading, handleSnippetDelete, handleSnippetUpdate } =
  useSnippet()

/**
 * States
 */
// 删除确认弹窗
const deleteRef = useTemplateRef('deleteFormRef')

// 右键菜单项
const items = ref<ContextMenuItem[]>([
  {
    label: '移动分类到',
    icon: 'tabler:folder-down',
    children: categories.value?.map((item) => ({
      label: item.name,
      checked: item.id === currrentCategoryId.value,
      onSelect: () => handleUpdateCategory(Number(item.id))
    }))
  },
  {
    label: '删除代码片段',
    icon: 'tabler:trash',
    onSelect: () => handleDeleteConfirm()
  }
])

/**
 * Actions
 */
// 删除确认弹窗
const handleDeleteConfirm = () => {
  if (deleteRef.value) {
    deleteRef.value.handleOpen()
  }
}

// 删除代码片段
const handleDeleteSnippet = async () => {
  if (code && code.id) {
    await handleSnippetDelete(0, code.id as number)
  }
}

// 修改代码片段分类
const handleUpdateCategory = async (id: number) => {
  if (code && code.id) {
    await handleSnippetUpdate(0, code.id, {
      category_id: Number(id)
    })
  }
}
</script>

<template>
  <UContextMenu :items="items" :ui="{ content: 'w-48' }">
    <slot />
  </UContextMenu>

  <!-- 删除确认弹窗 -->
  <AlertDialog
    ref="deleteFormRef"
    :loading="snippetDeleteLoading"
    @on-confirm="handleDeleteSnippet"
  />
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
