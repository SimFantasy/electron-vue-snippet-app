<script lang="ts" setup name="CategoryList">
import { Category } from '@shared/types'

/**
 * Defines
 */

// Props
defineProps<{
  categories: Category[] | null
  loading: boolean
}>()
</script>

<template>
  <div class="flex-y-1">
    <div class="flex-x-2 justify-between">
      <span class="text-xs text-stone-300">分类列表</span>

      <UTooltip text="添加分类">
        <UButton icon="tabler:folder-plus" size="sm" variant="link" />
      </UTooltip>
    </div>

    <CategoryItem
      v-if="categories && categories.length"
      v-for="(item, index) in categories"
      :key="index"
      :category="item"
    />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
