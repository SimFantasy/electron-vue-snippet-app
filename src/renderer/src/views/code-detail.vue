<script lang="ts" setup name="CodeDetail">
import type { Category } from '@shared/types'
import { injectLocal } from '@vueuse/core'
import { useCodeEditor } from '@/composables'
import CodeEditor from '@/components/code-editor/CodeEditor.vue'
import { languageOptions } from '@/components/code-editor/language-config'

/**
 * Injects
 */
const categories = injectLocal<Ref<Category[]>>('categories')

/**
 * Hooks
 */
const { title, category, tags, content, language } = useCodeEditor()

/**
 * Getters
 */
const categoryItems = computed(() => {
  const categoryList = categories?.value?.map((category) => ({
    label: category.name,
    value: category.id
  }))
  return [{ label: '未命名', value: 0 }, ...(categoryList || [])]
})
</script>

<template>
  <UForm class="col-span-3 flex-y w-full border border-stone-300 bg-white rounded-md">
    <!-- Titlebar -->
    <div class="flex-x-2 px-2 w-full h-12 border-b border-border">
      <UInput v-model="title" variant="none" class="flex-1 w-full" />

      <USeparator orientation="vertical" />

      <USelect
        v-model="category"
        :items="categoryItems"
        variant="none"
        :ui="{ content: 'min-w-fit' }"
        class="w-24"
      />
    </div>
    <!-- Tags -->
    <div class="flex-start px-2 h-12 border-b border-border">
      <UInputTags v-model="tags" variant="none" size="xl" class="w-full" />
    </div>
    <!-- Code Editor -->
    <div class="flex-1 relative w-full overflow-hidden">
      <!-- Language Selector -->
      <div class="absolute top-4 right-4 z-10">
        <USelect
          v-model="language"
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
      <div class="p-2 size-full">
        <div class="size-full rounded-lg overflow-hidden">
          <CodeEditor v-model="content" :language="language" class="h-full" />
        </div>
      </div>
    </div>
  </UForm>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
