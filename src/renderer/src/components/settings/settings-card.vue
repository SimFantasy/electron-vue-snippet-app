<script lang="ts" setup name="SettingsCard">
/**
 * Defines
 */

// Props
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="flex-y-4">
    <div class="text-base font-semibold text-stone-800">{{ title }}</div>
    <div class="flex-1 flex-y-2">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
