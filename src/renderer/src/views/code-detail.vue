<script lang="ts" setup name="CodeDetail">
import { useAsyncState, injectLocal } from '@vueuse/core'
import { getCodeById } from '@/services/api'
import { Category } from '@shared/types'

/**
 * Injects
 */
const categories = injectLocal<Ref<Category[]>>('categories')

/**
 * Hooks
 */
const route = useRoute()

/**
 * Getters
 */
const categoryItems = computed(() =>
  categories?.value?.map((category) => ({ label: category.name, value: category.id }))
)

/**
 * Actions
 */
const { state, isLoading, execute } = useAsyncState(getCodeById, null, { immediate: false })

/**
 * States
 */
const title = ref<string>('')
const category = ref<number>(0)
const tags = ref<string[] | undefined>([])
const content = ref<string>('')

/**
 * Watchers
 */

watch(
  () => route.params.id,
  async (id) => {
    if (id) {
      execute(0, Number(id))
    }
  }
)

watch(
  () => state.value,
  (val) => {
    if (val) {
      title.value = val.title
      category.value = val.category_id
      tags.value = JSON.parse(val.tags as string) || []
      content.value = val.content
    }
  },
  {
    once: true
  }
)

watchEffect(() => {
  console.log('detail', state.value)
  console.log('title', title.value)
  console.log('category', category.value)
  console.log('tags', tags.value)
  console.log('content', content.value)
})
</script>

<template>
  <div class="flex-y size-full border border-stone-300 bg-white rounded-md">
    <!-- Titlebar -->
    <div class="flex-x-2 px-2 w-full h-12 border-b border-border">
      <UInput v-model="title" variant="outline" class="flex-1 w-full" />

      <USelect v-model="category" :items="categoryItems" class="w-24" />
    </div>
    <!-- Tags -->
    <div class="px-2 h-12 border-b border-border">
      <UInputTags v-model="tags" />
    </div>
    <UTextarea v-model="content" />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
