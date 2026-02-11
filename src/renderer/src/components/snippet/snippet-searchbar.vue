<script lang="ts" setup name="SnippetSearchbar">
import { useSnippet } from '@/composables'
/**
 * Defines
 */

// Models
const keyword = defineModel<string>('keyword')

/**
 * Hooks
 */
const { handleSnippetCreate } = useSnippet()
</script>

<template>
  <div
    class="flex-x-2 px-2 py-1.5 w-full h-12 rounded-t-lg border-b border-stone-500/20 bg-card/40"
  >
    <UInput
      type="text"
      v-model="keyword"
      autoFocus
      variant="none"
      placeholder="搜索标题或TAG关键字..."
      class="flex-1 w-full"
    />

    <UButton icon="tabler:plus" variant="outline" color="neutral" @click="handleSnippetCreate(0)" />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
