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
  <div
    class="flex-1 flex-y-1 p-2 w-full h-full max-h-[calc(100vh-var(--spacing)*29)] overflow-y-auto"
  >
    <template v-for="item in codes" :key="item.id">
      <SnippetContextMenu :code="item">
        <SnippetItem :code="item" />
      </SnippetContextMenu>
    </template>

    <!-- 空状态提示 -->
    <div
      v-if="!loading && codes?.length === 0"
      class="flex flex-col items-center justify-center h-full text-stone-400"
    >
      <UIcon name="tabler:code-plus" class="size-12 mb-2" />
      <span class="text-sm">请添加代码片段</span>
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
