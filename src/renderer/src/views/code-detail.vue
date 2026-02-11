<script lang="ts" setup name="CodeDetail">
import { useSnippet, useCategory } from '@/composables'
import { languageOptions } from '@/components/code-editor/language-config'

/**
 * Hooks
 */
const { categories } = useCategory()
const { snippetForm } = useSnippet()

/**
 * Getters
 */
// 分类选项列表
const categoryItems = computed(() => {
  const categoryList = categories.value?.map((category) => ({
    label: category.name,
    value: category.id
  }))

  return [{ label: '未命名', value: 0 }, ...(categoryList || [])]
})
</script>

<template>
  <UForm class="flex-y w-full border border-stone-300 bg-white rounded-md">
    <!-- Titlebar -->
    <div class="flex-x-2 px-2 w-full h-12 border-b border-border">
      <UInput
        v-model="snippetForm.title"
        variant="none"
        class="flex-1 w-full"
        :ui="{ base: 'text-lg' }"
      />

      <USeparator orientation="vertical" />

      <USelect
        v-model="snippetForm.category_id"
        :items="categoryItems"
        variant="none"
        :ui="{ content: 'min-w-fit' }"
        class="w-24"
      />
    </div>
    <!-- Tags -->
    <div class="flex-start px-2 h-12 border-b border-border">
      <UInputTags
        v-model="snippetForm.tags as string[]"
        variant="none"
        icon="tabler:tags"
        size="xl"
        placeholder="输入标签后回车以进行添加"
        class="w-full"
        :ui="{ item: 'font-normal' }"
      />
    </div>
    <!-- Code Editor -->
    <div class="flex-1 relative w-full overflow-hidden">
      <!-- Language Selector -->
      <div class="absolute top-4 right-4 z-10">
        <USelect
          v-model="snippetForm.language"
          :items="languageOptions"
          variant="none"
          size="sm"
          :ui="{
            content: 'min-w-fit',
            base: 'bg-stone-100/80 backdrop-blur-sm hover:bg-stone-200/80 transition-colors'
          }"
          class="min-w-25"
        />
      </div>
      <!-- Code Editor -->
      <div class="p-2 w-full h-[calc(100vh-var(--spacing)*40)] overflow-y-auto">
        <div class="h-full rounded-lg overflow-hidden">
          <CodeEditor
            v-model="snippetForm.content as string"
            :language="snippetForm.language"
            class="h-fit"
          />
        </div>
      </div>
    </div>
  </UForm>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
