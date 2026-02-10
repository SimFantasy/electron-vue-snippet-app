<script lang="ts" setup name="Manage">
import { useCategory } from '@/composables'

/**
 * Hooks
 */
const { categoriesLoading } = useCategory()
</script>

<template>
  <WindowWrapper title="代码片段管理" :loading="categoriesLoading">
    <div class="flex-1 grid grid-cols-5 gap-2 p-2 w-full">
      <div
        class="col-span-1 flex-y w-full h-[calc(100vh-var(--spacing)*16)] border border-stone-300 bg-card rounded-md"
      >
        <!-- 快捷操作 -->
        <CategoryQuickNavs />

        <!-- 分类列表 -->
        <div class="flex-1">
          <div class="flex-x-2 justify-between px-2">
            <span class="text-xs text-stone-300">分类列表</span>

            <!-- 创建分类 -->
            <CategoryForm type="create">
              <UButton icon="tabler:folder-plus" size="sm" variant="link" class="cursor-pointer" />
            </CategoryForm>
          </div>
          <CategoryList />
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
