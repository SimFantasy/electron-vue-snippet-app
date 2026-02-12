<script lang="ts" setup name="SearchbarMain">
import { useSearch, useSelect } from '@/composables'
import { cn } from '@/utils'

/**
 * Hooks
 */
const { searchKeyword } = useSearch()
const { searchResults } = useSelect()

/**
 * Actions
 */
const handleOpenManageWindow = () => {
  window.api.openWindow('manage')
}
</script>

<template>
  <div
    :class="
      cn(
        'flex-center gap-2 p-2 pl-1 w-full h-fit border border-border/80 bg-card/90 backdrop-blur-xs rounded-lg shadow-xl shadow-stone-500/10',
        {
          'rounded-b-none border-b-0': searchResults && searchResults.length !== 0
        }
      )
    "
  >
    <span class="flex-start w-fit h-full">
      <UIcon name="tabler:grip-vertical" class="text-stone-300" />
    </span>
    <UInput
      v-model="searchKeyword"
      name="searchKeyword"
      leading-icon="tabler:search"
      size="xl"
      class="w-full"
      autofocus
      :ui="{
        base: 'ring-stone-300 focus-visible:ring-1! focus-visible:ring-stone-400 focus-visible:bg-stone-100'
      }"
    />

    <span class="nodrag">
      <UButton
        icon="tabler:settings-2"
        variant="link"
        size="xl"
        :ui="{
          leadingIcon:
            'text-stone-400 trans-all cursor-pointer hover:text-stone-500 rotate-0 hover:rotate-90'
        }"
        @click="handleOpenManageWindow"
      />
    </span>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
