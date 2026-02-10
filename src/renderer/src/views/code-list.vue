<script lang="ts" setup name="CodeListView">
import { useCodesStore } from '@/stores'
import { Code } from '@shared/types'
import { storeToRefs } from 'pinia'

/**
 * Hooks
 */
const route = useRoute()
const router = useRouter()
const codesStore = useCodesStore()
const { codes, loading: isLoading } = storeToRefs(codesStore)

/**
 * States
 */
const snippetSearchKeyword = ref('')
// 标记是否已经自动选择过，避免重复跳转
const hasAutoSelected = ref(false)

/**
 * Watchers
 */
// 当获取到路由中的cid参数时，执行则传入cid到getCodes方法，否则执行默认的getCodes方法
// 无cid则默认获取全部分类代码， 有cid则获取指定分类的代码
watch(
  () => [route.params.cid, snippetSearchKeyword.value],
  async ([cid, keyword]) => {
    if (cid && keyword) {
      // 当有cid和keyword时
      await codesStore.fetchCodes({ categoryId: Number(cid), search: keyword as string })
    } else if (cid) {
      // 当只有cid时
      await codesStore.fetchCodes({ categoryId: Number(cid) })
    } else if (keyword) {
      // 当只有keyword时
      await codesStore.fetchCodes({ search: keyword as string })
    } else {
      // 当没有参数时
      await codesStore.fetchCodes()
    }
  },
  { immediate: true }
)

// 当分类改变时，自动选择第一个代码片段
watch(
  () => route.params.cid,
  () => {
    hasAutoSelected.value = false
  }
)

// 数据加载完成后，自动选择第一个代码片段（仅在切换分类时执行一次）
watch(
  () => [codes.value, isLoading.value],
  ([codesList, loading]) => {
    if (!loading && codesList && (codesList as Code[]).length > 0 && !hasAutoSelected.value) {
      hasAutoSelected.value = true
      nextTick(() => {
        // 只有在当前没有选中任何代码片段时才自动跳转
        if (!route.params.id) {
          router.replace({
            name: 'CodeDetail',
            params: {
              cid: route.params.cid,
              id: (codesList as Code[])[0].id
            }
          })
        }
      })
    }
  }
)
</script>

<template>
  <div class="w-full h-full max-h-[calc(100vh-var(--spacing)*16)] grid grid-cols-4 gap-2">
    <div class="col-span-1 border border-stone-300 bg-card rounded-md">
      <SnippetSearchbar v-model:keyword="snippetSearchKeyword" />

      <SnippetList :codes="codes" :loading="isLoading" />
    </div>

    <div class="col-span-3">
      <CodeBlank v-if="!route.params.id" />
      <RouterView v-else />
    </div>
    <!-- <div class="col-span-3">
      <RouterView />
    </div> -->
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
