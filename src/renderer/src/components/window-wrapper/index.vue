<script lang="ts" setup name="WindowWrapper">
import { useWindowControl } from '@/composables'
import { useAppStore } from '@/stores'
import { cn, hexToRgba } from '@/utils'

/**
 * Defines
 */
defineProps<{
  title: string
  loading?: boolean
}>()

/**
 * Hooks
 */
const appStore = useAppStore()
const { backgroundColor, backgroundImageUrl, backgroundScale, backgroundOpacity, backgroundBlur } =
  storeToRefs(appStore)

const { isMaximized, handleWindowToggle, handleWindowMinimize, handleWindowCloseCurrent } =
  useWindowControl()

const overlayStyle = computed(() => ({
  // opacity: `${backgroundOpacity.value}`,
  // filter: `blur(${backgroundBlur.value}px)`,
  backdropFilter: `blur(${backgroundBlur.value}px)`,
  backgroundColor: hexToRgba(backgroundColor.value, backgroundOpacity.value)
}))

const backgroundImageScale = computed(() => {
  const scale = backgroundScale.value
  return `transform: scale(${scale});`
})

/**
 * Actions
 */

// 打开设置面板
const handleOpenSettings = () => window.api.openWindow('settings')
</script>

<template>
  <main
    class="relative flex-y w-full h-screen border border-border/80 rounded-lg shadow-xl shadow-stone-500/10 overflow-hidden"
  >
    <!-- Header -->
    <header class="flex-x-4 justify-between px-2 h-12">
      <div class="flex-1 flex-x-2 text-sm text-stone-800 font-semibold drag">{{ title }}</div>

      <div class="flex-end gap-2">
        <UButton
          icon="tabler:settings-2"
          variant="ghost"
          color="neutral"
          @click="handleOpenSettings"
        />

        <UButton
          icon="tabler:minus"
          variant="ghost"
          color="neutral"
          @click="handleWindowMinimize"
        />
        <UButton
          :icon="isMaximized ? 'tabler:squares' : 'tabler:crop-5-4'"
          variant="ghost"
          color="neutral"
          @click="handleWindowToggle"
        />
        <UButton
          icon="tabler:x"
          variant="ghost"
          color="neutral"
          @click="handleWindowCloseCurrent"
        />
      </div>
    </header>

    <!-- Container -->
    <slot />

    <!-- Loading -->
    <div
      v-if="loading"
      class="absolute inset-0 z-100 flex-center size-full bg-card/90 backdrop-blur-xs"
    >
      <UIcon name="tabler:loader-2" class="size-24 animate-spin" />
    </div>

    <!-- Background -->
    <div class="absolute inset-0 -z-1 size-full overflow-hidden">
      <!-- Background Overlay -->
      <div :class="cn('absolute inset-0 z-10 size-full')" :style="overlayStyle"></div>
      <!-- Background Image -->
      <img
        v-if="backgroundImageUrl"
        :src="backgroundImageUrl"
        :class="cn('size-full object-cover')"
        :style="backgroundImageScale"
      />
    </div>
  </main>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
