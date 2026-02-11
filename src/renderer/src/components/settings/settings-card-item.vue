<script lang="ts" setup name="SettingsCardItem">
/**
 * Defines
 */
// Props
defineProps<{
  label: string
  description?: string
}>()
</script>

<template>
  <div class="flex items-stretch justify-between gap-4 p-4 border border-border rounded-lg bg-card">
    <!-- Start -->
    <div class="flex-y-1">
      <div class="text-sm text-stone-600">{{ label }}</div>
      <div v-if="description" class="text-xs text-stone-400">{{ description }}</div>
    </div>

    <div class="flex items-start justify-end">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
