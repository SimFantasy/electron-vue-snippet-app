<script lang="ts" setup name="CategoryList">
import { useCategory } from '@/composables'

/**
 * Hooks
 */
const { categories } = useCategory()
</script>

<template>
  <div class="h-[calc(100vh-var(--spacing)*52)] overflow-y-auto">
    <div class="flex-y-1 p-2">
      <template
        v-if="categories && categories.length"
        v-for="(item, index) in categories"
        :key="index"
      >
        <CategoryContextMenu :category="item">
          <CategoryItem :category="item" />
        </CategoryContextMenu>
      </template>
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
