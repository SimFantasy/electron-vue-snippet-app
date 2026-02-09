<script lang="ts" setup name="Manage">
import { useAsyncState, provideLocal } from '@vueuse/core'
import { getCategories } from '@/services/api'

/**
 * Actions
 */
const { state, isLoading } = useAsyncState(getCategories, null)

/**
 * Provides
 */
provideLocal('categories', state)
</script>

<template>
  <WindowWrapper title="代码片段管理" :loading="isLoading">
    <div class="flex-1 grid grid-cols-5 gap-2 p-2 w-full h-[calc(100vh-var(--spacing)*16)]">
      <div class="col-span-1 flex-y w-full h-full border border-stone-300 bg-card rounded-md">
        <CategoryQuickNavs />

        <div class="flex-1 p-2 h-full overflow-y-auto">
          <CategoryList :categories="state" :loading="isLoading" />
        </div>
      </div>

      <div class="col-span-4">
        <RouterView />
      </div>
    </div>
  </WindowWrapper>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
