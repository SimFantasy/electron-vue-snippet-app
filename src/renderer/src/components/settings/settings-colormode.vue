<script lang="ts" setup name="SettingsColorMode">
import { useAppStore } from '@/stores'

/**
 * Hooks
 */
const appStore = useAppStore()
const URadioGroup = resolveComponent('URadioGroup')

/**
 * States
 */
const items = ref([
  {
    label: '跟随系统',
    value: 'auto'
  },
  {
    label: '深色模式',
    value: 'dark'
  },
  {
    label: '浅色模式',
    value: 'light'
  }
])
const selected = ref(appStore.colorMode)

/**
 * Watchers
 */
// 根据当前颜色模式设置选项
watch(
  () => selected.value,
  (val) => {
    appStore.setColorMode(val)
  }
)
</script>

<template>
  <URadioGroup
    v-model="selected"
    :items="items"
    orientation="horizontal"
    indicator="hidden"
    variant="table"
    size="xs"
  />
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
