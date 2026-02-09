<script lang="ts" setup name="WindowWrapper">
import { useWindowControl } from '@/composables'

// import bgImage from '@/assets/images/bg.jpg'

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
const { isMaximized, handleWindowToggle, handleWindowMinimize, handleWindowCloseCurrent } =
  useWindowControl()
</script>

<template>
  <main
    class="relative flex-y w-full h-screen border border-border/80 rounded-lg shadow-xl shadow-stone-500/10 overflow-hidden"
  >
    <!-- Header -->
    <header class="flex-x-4 justify-between px-2 h-12">
      <div class="flex-1 flex-x-2 text-sm text-stone-800 font-semibold drag">{{ title }}</div>

      <div class="flex-end gap-2">
        <UButton icon="tabler:settings-2" variant="ghost" color="neutral" />

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
    <div class="absolute inset-0 -z-1 size-full">
      <!-- Background Overlay -->
      <div class="absolute inset-0 z-10 size-full bg-stone-50"></div>
      <!-- Background Image -->
      <!-- <img :src="bgImage" class="size-full object-cover" /> -->
    </div>
  </main>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
