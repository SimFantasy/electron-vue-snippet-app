<script lang="ts" setup name="Searchbar">
import { useIgnoreMouseEvents } from '@/composables'
import { useAppStore } from '@/stores'

/**
 * Hooks
 */
const { setIgnoreMouseEvents } = useIgnoreMouseEvents()
const appStore = useAppStore()

/**
 * States
 */
const mainRef = useTemplateRef('mainEl')

/**
 * Watchers
 */
// 侦听快捷键设置，如果设置了快捷键，则调用 api.shortcut
watch(
  () => appStore.shortcut,
  (val) => {
    if (val && val.trim() !== '') {
      window.api.shortcut(val)
    }
  }
)

/**
 * Lifecycles
 */
onMounted(() => {
  // 注册快捷键
  if (appStore.shortcut) {
    window.api.shortcut(appStore.shortcut)
  }

  // 设置数据库路径
  if (appStore.databasePath) {
    window.api.dbSetPath(appStore.databasePath)
  }

  // 鼠标穿透事件处理
  setIgnoreMouseEvents(mainRef as ShallowRef<HTMLElement>)

  // 初始化数据库表
  window.api.dbInit()
})
</script>

<template>
  <main ref="mainEl" class="group flex-y h-fit drag">
    <SearchbarMain />

    <SearchbarResult />

    <!-- <SearchbarError /> -->
  </main>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
