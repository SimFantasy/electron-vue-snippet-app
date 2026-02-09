<script lang="ts" setup name="SnippetItem">
import { Code } from '@shared/types'
import { cn, formatDate } from '@/utils'

/**
 * Defines
 */

// Props
defineProps<{
  code: Code
}>()

/**
 * Hooks
 */
const route = useRoute()
</script>

<template>
  <RouterLink
    :to="{ name: 'CodeDetail', params: { cid: code.category_id, id: code.id } }"
    :class="
      cn('group snippet-item', {
        active: route.name === 'CodeDetail' && Number(route.params.id) === code.id
      })
    "
  >
    <div class="snippet-item-titlebar">
      <UIcon name="tabler:circle-filled" class="snippet-item-icon" />
      <span class="snippet-item-title">{{ code.title }}</span>
    </div>
    <div class="snippet-item-date">
      {{ formatDate(code.updated_at) }}
    </div>
  </RouterLink>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.snippet-item {
  @apply flex-y-1 px-2 py-1.5 w-full rounded-md bg-transparent trans-colors hover:bg-stone-100;

  .snippet-item-titlebar {
    @apply flex items-start gap-2 line-clamp-2;

    .snippet-item-icon {
      @apply mt-2 size-1.5 text-stone-300;
    }

    .snippet-item-title {
      @apply text-sm text-stone-500 group-hover:text-stone-800;
    }
  }

  .snippet-item-date {
    @apply pl-4 text-xs text-stone-300 group-hover:text-stone-400;
  }

  &.active {
    @apply bg-emerald-500/20 hover:bg-emerald-500/40;

    .snippet-item-titlebar {
      .snippet-item-icon {
        @apply text-emerald-500;
      }

      .snippet-item-title {
        @apply text-emerald-700 group-hover:text-emerald-700;
      }
    }

    .snippet-item-date {
      @apply text-emerald-400 group-hover:text-emerald-400;
    }
  }
}
</style>
