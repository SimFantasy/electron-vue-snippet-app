<script lang="ts" setup name="CategoryContextMenu">
import { useCategory } from '@/composables'
import type { ContextMenuItem } from '@nuxt/ui'
import type { Category } from '@shared/types'

/**
 * Defines
 */
const { category } = defineProps<{
  category: Category
}>()

/**
 * Hooks
 */
const { categoryDeleteLoading, handleDeleteCategory } = useCategory()

/**
 * States
 */
// 重命名表单
const updateRef = useTemplateRef('updateFormRef')

// 删除确认弹窗
const deleteRef = useTemplateRef('deleteFormRef')

// 右键菜单项
const items = ref<ContextMenuItem[]>([
  {
    label: '重命名分类',
    icon: 'tabler:forms',
    onSelect: () => {
      updateRef.value!.handleOpen(category)
    }
  },
  {
    label: '删除分类',
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

// 删除分类方法
const handleDeleteCategoryAction = async () => {
  if (category && category.id) {
    await handleDeleteCategory(category.id)
  }
}
</script>

<template>
  <UContextMenu :items="items" :ui="{ content: 'w-40' }">
    <slot />
  </UContextMenu>

  <CategoryForm ref="updateFormRef" type="update" :category="category" />

  <AlertDialog
    ref="deleteFormRef"
    :loading="categoryDeleteLoading"
    @on-confirm="handleDeleteCategoryAction"
  />
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
