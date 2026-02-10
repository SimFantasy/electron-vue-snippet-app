<script lang="ts" setup name="CategoryForm">
import { useCategory } from '@/composables'
import { Category } from '@shared/types'
import * as z from 'zod'

/**
 * Defines
 */
// Props
const { type } = defineProps<{
  type: 'create' | 'update'
}>()

/**
 * Hooks
 */
const { categoryCreatLoading, categoryUpdateLoading, handleCreateCategory, handleUpdateCategory } =
  useCategory()

/**
 * Schemas
 */
const schema = z.object({
  name: z
    .string('分类名称不能为空')
    .min(2, '分类名称长度必须大于等于 2')
    .max(24, '分类名称长度必须小于等于 24')
})

type Schema = z.output<typeof schema>

/**
 * States
 */
// 添加分类弹窗状态
const open = ref(false)

// 分类表单默认值
const state = ref<Schema>({
  name: ''
})

// 分类Id
const categoryId = ref<number | null>(null)

// 表单实例
const formRef = useTemplateRef('formRef')

/**
 * Actions
 */
// 提交表单
const handleSubmit = async () => {
  const validate = await formRef.value?.validate({ silent: true })
  if (validate) {
    if (type === 'create') {
      // 如果类型是创建，则发起创建分类请求
      handleCreateCategory({ name: state.value.name })
    } else if (type === 'update' && categoryId.value !== null) {
      // 如果类型是更新，且有分类，则发起更新分类请求
      handleUpdateCategory(categoryId.value, { name: validate.name })
    }

    formRef.value?.clear()
    state.value.name = ''
    open.value = false
  }
}

// 打开弹窗
const handleOpen = (category?: Category) => {
  if (category) {
    state.value.name = category.name
    categoryId.value = category.id
  } else {
    state.value.name = ''
    categoryId.value = null
  }
  open.value = true
}

// 关闭弹窗
const handleClose = async () => {
  formRef.value?.clear()
  state.value.name = ''
  open.value = false
}

/**
 * Exposes
 */
defineExpose({
  handleOpen
})
</script>

<template>
  <UModal
    v-model:open="open"
    :title="type === 'create' ? '创建分类' : '更新分类'"
    description="请输入分类名称"
    :ui="{
      header: 'p-2 px-4! min-h-8',
      body: 'sm:p-4',
      footer: 'justify-end py-2.5 px-4! bg-stone-50',
      close: 'top-0.5 right-2 size-8',
      title: 'font-normal text-sm',
      description: 'hidden'
    }"
  >
    <slot />

    <template #body>
      <UForm ref="formRef" :schema="schema" :state="state" class="flex-center w-full p-4">
        <UFormField label="分类名称" name="name" class="w-full" :ui="{ label: 'font-normal w-20' }">
          <UInput v-model="state.name" placeholder="分类名称" class="w-full" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton label="取消" color="neutral" variant="outline" @click="handleClose" />
      <UButton
        :label="type === 'create' ? '创建' : '更新'"
        color="primary"
        :loading="categoryCreatLoading || categoryUpdateLoading"
        @click="handleSubmit"
      />
    </template>
  </UModal>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
