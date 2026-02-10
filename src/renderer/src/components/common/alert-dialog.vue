<script lang="ts" setup name="AlertDialog">
/**
 * Defines
 */

// Props
const { title = '请确认', text = '请确认是否要执行删除操作？删除操作不可恢复。' } = defineProps<{
  title?: string
  text?: string
  loading?: boolean
}>()

// Emits
const emit = defineEmits<{
  onConfirm: []
}>()

/**
 * States
 */
const open = ref(false)

/**
 * Actions
 */

// 打开弹窗
const handleOpen = () => {
  open.value = true
}

// 关闭弹窗
const handleClose = () => {
  open.value = false
}

// 确认事件
const handleConfirm = () => {
  emit('onConfirm')
  handleClose()
}

/**
 * Exposes
 */
defineExpose({
  handleOpen,
  handleClose
})
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title"
    description="删除确认"
    :ui="{
      header: 'p-2 px-4! min-h-8',
      body: 'sm:p-4',
      footer: 'justify-end py-2.5 px-4! bg-stone-50',
      close: 'top-0.5 right-2 size-8',
      title: 'font-normal text-sm',
      description: 'hidden'
    }"
  >
    <template #body>
      <div class="text-sm text-stone-600">{{ text }}</div>
    </template>

    <template #footer>
      <UButton label="取消" variant="outline" color="neutral" @click="handleClose" />

      <UButton label="确定" color="primary" :loading="loading" @click="handleConfirm" />
    </template>
  </UModal>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
