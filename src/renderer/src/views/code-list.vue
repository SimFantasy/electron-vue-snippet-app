<script lang="ts" setup name="CodeListView">
import { useAsyncState } from '@vueuse/core'
import { getCodes } from '@/services/api'

/**
 * Hooks
 */
const route = useRoute()

/**
 * States
 */
const snippetSearchKeyword = ref('')

/**
 * Actions
 */
// 获取代码片段列表的请求
const { state, isLoading, execute } = useAsyncState(getCodes, null, { immediate: false })

/**
 * Watchers
 */
// 当获取到路由中的cid参数时，执行则传入cid到getCodes方法，否则执行默认的getCodes方法
// 无cid则默认获取全部分类代码， 有cid则获取指定分类的代码
watch(
  () => [route.params.cid, snippetSearchKeyword.value],
  async ([cid, keyword]) => {
    if (cid) {
      // 当只有cid时，传入categoryId参数
      execute(0, { categoryId: Number(cid) })
    } else if (cid && keyword) {
      // 当有cid和keyword时，传入categoryId和search参数
      execute(300, { categoryId: Number(cid), search: keyword as string })
    } else if (!cid && keyword) {
      // 当只有keyword时，传入search参数
      execute(300, { search: keyword as string })
    } else {
      // 当没有参数时，执行默认的getCodes方法
      execute(0)
    }
  }
)
</script>

<template>
  <div class="w-full h-full grid grid-cols-4 gap-2">
    <div class="col-span-1 border border-stone-300 bg-stone-50 rounded-md">
      <SnippetSearchbar v-model:keyword="snippetSearchKeyword" />

      <SnippetList :codes="state" :loading="isLoading" />
    </div>

    <div class="col-span-3">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
