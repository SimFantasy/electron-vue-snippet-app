<script lang="ts" setup name="WindowWrapper">
import { useWindowControl } from '@/composables'
import { useAppStore } from '@/stores'
import { cn } from '@/utils'

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
const {
  themeBackgroundType,
  themeColor,
  backgroundImageUrl,
  backgroundScale,
  backgroundOpacity,
  backgroundBlur
} = storeToRefs(appStore)

const { isMaximized, handleWindowToggle, handleWindowMinimize, handleWindowCloseCurrent } =
  useWindowControl()

/**
 * Getters
 */
const overlayColor = computed(() => {
  // if (themeBackgroundType.value !== 'color') return
  switch (themeColor.value) {
    case 'neutral':
      return 'bg-neutral-200'
    case 'stone':
      return 'bg-stone-200'
    case 'zinc':
      return 'bg-zinc-200'
    case 'slate':
      return 'bg-slate-200'
    case 'gray':
      return 'bg-gray-200'
    case 'red':
      return 'bg-red-200'
    case 'orange':
      return 'bg-orange-200'
    case 'amber':
      return 'bg-amber-200'
    case 'yellow':
      return 'bg-yellow-200'
    case 'lime':
      return 'bg-lime-200'
    case 'green':
      return 'bg-green-200'
    case 'emerald':
      return 'bg-emerald-200'
    case 'teal':
      return 'bg-teal-200'
    case 'cyan':
      return 'bg-cyan-200'
    case 'sky':
      return 'bg-sky-200'
    case 'blue':
      return 'bg-blue-200'
    case 'indigo':
      return 'bg-indigo-200'
    case 'violet':
      return 'bg-violet-200'
    case 'purple':
      return 'bg-purple-200'
    case 'fuchsia':
      return 'bg-fuchsia-200'
    case 'pink':
      return 'bg-pink-200'
    case 'rose':
      return 'bg-rose-200'
  }
})

const overlayStyle = computed(() => {
  const opacity = backgroundOpacity.value
  const blur = backgroundBlur.value
  return {
    opacity: `${opacity * 0.85}`,
    filter: `blur(${blur}px)`
  }
})

const backgroundImageScale = computed(() => {
  const scale = backgroundScale.value
  return `transform: scale(${scale});`
})

/**
 * Actions
 */

// 打开设置面板
const handleOpenSettings = () => window.api.openWindow('settings')

/**
 * Lifecycles
 */
onMounted(() => {
  window.api.onSettingsUpdated((settings: any) => {
    if (settings.themeColor && settings.themeColor !== themeColor.value) {
      themeColor.value = settings.themeColor
    }
    if (
      settings.themeBackgroundType &&
      settings.themeBackgroundType !== themeBackgroundType.value
    ) {
      themeBackgroundType.value = settings.themeBackgroundType
    }
    if (
      settings.backgroundImageUrl !== undefined &&
      settings.backgroundImageUrl !== backgroundImageUrl.value
    ) {
      backgroundImageUrl.value = settings.backgroundImageUrl
    }
    if (settings.backgroundScale && settings.backgroundScale !== backgroundScale.value) {
      backgroundScale.value = settings.backgroundScale
    }
    if (settings.backgroundOpacity && settings.backgroundOpacity !== backgroundOpacity.value) {
      backgroundOpacity.value = settings.backgroundOpacity
    }
    if (settings.backgroundBlur && settings.backgroundBlur !== backgroundBlur.value) {
      backgroundBlur.value = settings.backgroundBlur
    }
  })
})
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
    <!-- <section class="flex-1 p-2 pt-0 w-full h-full rounded-lg overflow-hidden">
      <slot />
    </section> -->

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
      <div :class="cn('absolute inset-0 z-10 size-full', overlayColor)" :style="overlayStyle"></div>
      <!-- Background Image -->
      <img
        v-if="themeBackgroundType === 'image' && backgroundImageUrl"
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
