<script lang="ts" setup name="SnippetItem">
import { Code } from '@shared/types'
import { formatDate } from '@/utils'

/**
 * Defines
 */

// Props
defineProps<{
  code: Code
}>()
</script>

<template>
  <RouterLink
    :to="{ name: 'CodeDetail', params: { cid: code.category_id, id: code.id } }"
    class="group flex-y-1 px-2 py-1.5 w-full rounded-md bg-transparent trans-colors hover:bg-stone-100"
  >
    <div class="flex items-start gap-2 line-clamp-2 text-stone-500 group-hover:text-stone-800">
      <UIcon name="tabler:circle-filled" class="mt-2 size-1.5 text-stone-300" />
      <span class="text-sm">{{ code.title }}</span>
    </div>
    <div class="pl-4 text-xs text-stone-300 group-hover:text-stone-400">
      {{ formatDate(code.updated_at) }}
    </div>
  </RouterLink>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
