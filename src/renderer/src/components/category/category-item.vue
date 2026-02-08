<script lang="ts" setup name="CategoryItem">
import { Category } from '@shared/types'

/**
 * Defines
 */

// Props
defineProps<{
  category: Category
  icon?: string
}>()
</script>

<template>
  <RouterLink
    :to="{ name: 'CodeList', params: { cid: category.id } }"
    class="flex-x-2 px-2 py-1.5 rounded-sm bg-transparent text-sm text-stone-500 trans-colors hover:bg-stone-200 hover:text-stone-800"
  >
    <UIcon :name="icon ?? 'tabler:folder'" class="size-4 text-stone-400" />
    <div>{{ category.name }}</div>
  </RouterLink>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
