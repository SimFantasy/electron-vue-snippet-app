<script lang="ts" setup name="SnippetList">
import { Code } from '@shared/types'

/**
 * Defines
 */

// Props
defineProps<{
  codes: Code[] | null
  loading: boolean
}>()
</script>

<template>
  <div class="flex-1 flex-y-1 p-2 w-full h-[calc(100vh-var(--spacing)*26)] overflow-y-auto">
    <SnippetItem v-for="item in codes" :key="item.id" :code="item" />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
