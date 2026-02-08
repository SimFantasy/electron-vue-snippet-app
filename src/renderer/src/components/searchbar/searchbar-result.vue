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
      cn(
        'flex-1 px-2.5 pb-2.5 h-full bg-card/90 backdrop-blur-xs rounded-b-lg overflow-hidden nodrag',
        {
          hidden: !searchResults || searchResults.length === 0
        }
      )
    "
  >
    <div class="px-2 py-1.5 w-full h-full bg-card rounded-lg overflow-y-auto">
      <div class="flex-y-1 h-fit">
        <template v-for="item in searchResults" :key="item.id">
          <div
            :class="
              cn(
                'flex-x-1 px-2 py-1.5 rounded-sm text-stone-600 truncate trans-colors hover:bg-stone-200 cursor-pointer',
                {
                  'bg-emerald-100': item.id === searchResultId
                }
              )
            "
            @click="handleSelectedItem(item.id)"
          >
            {{ item.title }}
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
