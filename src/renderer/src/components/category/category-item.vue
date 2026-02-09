<script lang="ts" setup name="CategoryItem">
import { cn } from '@/utils'
import { Category } from '@shared/types'

const route = useRoute()

/**
 * Defines
 */

// Props
defineProps<{
  category: Category
  icon?: string
}>()

/**
 * Getters
 */
</script>

<template>
  <RouterLink
    :to="{ name: 'CodeList', params: { cid: category.id } }"
    replace
    :class="
      cn('category-item group', {
        active:
          category.id ===
          (route.params.cid === undefined || route.params.cid === ''
            ? null
            : Number(route.params.cid))
      })
    "
  >
    <UIcon :name="icon ?? 'tabler:folder'" class="category-item-icon" />
    <div>{{ category.name }}</div>
  </RouterLink>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.category-item {
  @apply flex-x-2 px-2 py-1.5 rounded-sm bg-transparent text-sm text-stone-500 trans-colors hover:bg-stone-100 hover:text-stone-800;

  .category-item-icon {
    @apply size-4 text-stone-400 group-hover:text-stone-500;
  }

  &.active {
    @apply bg-emerald-400 text-white;

    .category-item-icon {
      @apply text-white;
    }
  }
}
</style>
