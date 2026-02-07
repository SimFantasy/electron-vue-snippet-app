<script lang="ts" setup name="SearchbarResult">
import { useSelect } from '@/composables'
import { cn } from '@/utils'

/**
 * Hooks
 */
const { searchResults, searchResultId, handleSelectedItem } = useSelect()
</script>

<template>
  <section
    :class="
      cn('flex-1 px-2.5 pb-2.5 h-fit overflow-hidden', {
        hidden: !searchResults || searchResults.length === 0
      })
    "
  >
    <div class="px-2 py-1.5 bg-card rounded-lg overflow-y-auto">
      <template v-for="item in searchResults" :key="item.id">
        <div
          :class="
            cn('flex-x-1 px-2 py-1.5 rounded-sm text-stone-600 truncate hover:bg-stone-100', {
              'bg-emerald-100': item.id === searchResultId
            })
          "
          @click="handleSelectedItem(item.id)"
        >
          {{ item.title }}
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
