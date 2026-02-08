<script lang="ts" setup name="Searchbar">
import { useIgnoreMouseEvents } from '@/composables'
import { useAppStore } from '@/stores'

/**
 * Hooks
 */
const { setIgnoreMouseEvents } = useIgnoreMouseEvents()
const { appSettings } = useAppStore()

/**
 * States
 */
const mainRef = useTemplateRef('mainEl')

/**
 * Watchers
 */
// 侦听快捷键设置，如果设置了快捷键，则调用 api.shortcut
watch(
  () => appSettings.shortcut,
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
  // 鼠标穿透事件处理
  setIgnoreMouseEvents(mainRef as ShallowRef<HTMLElement>)

  // 设置数据库路径
  window.api.dbSetPath(appSettings.databasePath)

  // 初始化数据库表
  window.api.dbInit()
})
</script>

<template>
  <main ref="mainEl" class="group flex-y h-full drag">
    <SearchbarMain />

    <SearchbarResult />

    <!-- <SearchbarError /> -->
  </main>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
