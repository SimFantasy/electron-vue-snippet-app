<script lang="ts" setup name="SettingsColorPicker">
import { useAppStore } from '@/stores'

/**
 * Defines
 */
// Props
const props = defineProps<{
  scrolled?: number
}>()

/**
 * Hooks
 */
const appStore = useAppStore()

/**
 * States
 */
const open = ref(false)

const preloadedColor = ref<{ name: string; value: string }[]>([
  { name: 'meutral', value: '#f5f5f5' },
  { name: 'stone', value: '#f5f5f4' },
  { name: 'zinc', value: '#f4f4f5' },
  { name: 'slate', value: '#f1f5f9' },
  { name: 'gray', value: '#f3f4f6' },
  { name: 'red', value: '#fef2f2' },
  { name: 'orange', value: '#fff7ed' },
  { name: 'amber', value: '#fffbeb' },
  { name: 'yellow', value: '#fffbeb' },
  { name: 'lime', value: '#f7fee7' },
  { name: 'green', value: '#f0fdf4' },
  { name: 'emerald', value: '#ecfdf5' },
  { name: 'teal', value: '#f0fdfa' },
  { name: 'cyan', value: '#ecfeff' },
  { name: 'sky', value: '#f0f9ff' },
  { name: 'blue', value: '#eff6ff' },
  { name: 'indigo', value: '#eef2ff' },
  { name: 'violet', value: '#f5f3ff' },
  { name: 'purple', value: '#faf5ff' },
  { name: 'fuchsia', value: '#fdf4ff' },
  { name: 'pink', value: '#fdf2f8' },
  { name: 'rose', value: '#fff1f2' }
])

/**
 * Watches
 */
// 当容器滚动时，关闭弹窗，否则会溢出容器
watch(
  () => props.scrolled,
  (val) => {
    if (val && val > 100) {
      open.value = false
    }
  }
)
</script>

<template>
  <UPopover
    v-model:open="open"
    :content="{
      align: 'end',
      side: 'bottom'
    }"
  >
    <UButton label="选择颜色" color="neutral" variant="outline" @click="open = true">
      <template #leading>
        <span :style="{ backgroundColor: appStore.backgroundColor }" class="size-5 rounded-sm" />
      </template>
    </UButton>

    <template #content>
      <div class="relative flex-y-2 p-1 bg-card/90 rounded-md">
        <UColorPicker
          v-model="appStore.backgroundColor"
          class="p-2"
          @update:model-value="appStore.setBackgroundColor"
        />
        <div class="grid grid-cols-6 gap-2 px-2 pb-2">
          <template v-for="item in preloadedColor" :key="item.name">
            <UTooltip :text="item.name">
              <div
                class="w-full h-6 rounded-sm cursor-pointer"
                :style="{ backgroundColor: item.value }"
                @click="appStore.setBackgroundColor(item.value)"
              ></div>
            </UTooltip>
          </template>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
