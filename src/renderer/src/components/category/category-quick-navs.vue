<script lang="ts" setup name="CategoryQuickNavs">
import { Category } from '@shared/types'

const quickNavs = ref<(Category & { icon: string })[]>([
  {
    id: null,
    name: '所有代码片段',
    created_at: '',
    updated_at: '',
    icon: 'tabler:folder-code'
  },
  {
    id: 0,
    name: '未分类',
    created_at: '',
    updated_at: '',
    icon: 'tabler:source-code'
  }
])
</script>

<template>
  <div class="flex-y-1 p-2 border-b border-stone-500/20">
    <div class="text-xs text-stone-300">快捷操作</div>
    <div class="flex-y-1">
      <CategoryItem
        v-for="(nav, index) in quickNavs"
        :key="index"
        :category="nav"
        :icon="nav.icon"
      />
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
