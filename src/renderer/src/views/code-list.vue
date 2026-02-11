<script lang="ts" setup name="CodeListView">
import { useSnippet } from '@/composables'

/**
 * Hooks
 */
const route = useRoute()

const { snippets, snippetsLoading, snippetKeyword, fetchSnippets } = useSnippet()

/**
 * Watchers
 */

let isFirstLoad = true

watch(
  () => [route.params.cid, snippetKeyword.value],
  () => {
    // 避免初始的 undefined -> 0 触发请求
    if (isFirstLoad) {
      isFirstLoad = false
      return
    }
    fetchSnippets()
  },
  { immediate: true }
)
</script>

<template>
  <div class="w-full h-full max-h-[calc(100vh-var(--spacing)*16)] grid grid-cols-4 gap-2">
    <div class="col-span-1 border border-stone-300 bg-card rounded-md">
      <SnippetSearchbar v-model:keyword="snippetKeyword" />

      <SnippetList :codes="snippets" :loading="snippetsLoading" />
    </div>

    <div class="col-span-3">
      <CodeBlank v-if="!route.params.id" />
      <RouterView v-else />
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
