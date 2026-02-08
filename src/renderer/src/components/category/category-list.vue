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
    <CategoryItem
      v-if="categories && categories.length"
      v-for="item in categories"
      :key="item.id"
      :category="item"
    />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
