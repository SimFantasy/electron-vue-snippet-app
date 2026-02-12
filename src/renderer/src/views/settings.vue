<script lang="ts" setup name="Settings">
import { themeOptions, fontOptions, fontSizeOptions } from '@/components/code-editor/theme-config'
import { themeBackgroundOptions, themeColorOptions, themeColorModeOptions } from '@/constants'
import { useAppStore } from '@/stores'
import { cn } from '@/utils'

/**
 * Hooks
 */
const appStore = useAppStore()

/**
 * Actions
 */
// 选择背景图片
const handleSelectedBackgroundImage = async () => {
  const oldUrl = appStore.backgroundImageUrl

  // 选择新图片
  const result = await window.api.selectBackgroundImage()
  if (!result) return
  appStore.setBackgroundImageUrl(result.url)

  // 删除旧图片
  if (oldUrl) {
    const oldPath = oldUrl.replace('app:///', '')
    await window.api.deleteBackgroundImage(oldPath)
  }
}

// 清除背景图片
const handleClearBackgroundImage = async () => {
  if (appStore.backgroundImageUrl) {
    const path = appStore.backgroundImageUrl.replace('app:///', '')
    await window.api.deleteBackgroundImage(path)
  }

  appStore.setBackgroundImageUrl('')
}

// 快捷键变更处理
const handleShortcutChange = (e: KeyboardEvent) => {
  const keys: string[] = []
  if (e.ctrlKey) keys.push('Ctrl')
  if (e.altKey) keys.push('Alt')
  if (e.shiftKey) keys.push('Shift')
  if (e.metaKey) keys.push('Command')

  // 获取主键（去除 Left/Right/Key/Digit 前缀）
  const mainKey = e.code.replace(/(Left|Right|Key|Digit)/g, '')
  if (mainKey && !['Control', 'Alt', 'Shift', 'Meta'].includes(mainKey)) {
    keys.push(mainKey)
    appStore.setShortcut(keys.join('+'))
  }
}

// 选择数据库路径
const handleSelectDatabasePath = async () => {
  const result = await window.api.dbSelectDirectory()
  if (result) {
    appStore.setDatabasePath(result)
  }
}

// 重置数据库路径
const handleResetDatabasePath = () => {
  appStore.setDatabasePath('')
}
</script>

<template>
  <WindowWrapper title="设置">
    <div class="p-2 pt-0 w-full h-screen">
      <main
        class="w-full h-[calc(100vh-var(--spacing)*14)] border border-stone-300 rounded-lg bg-card overflow-y-auto"
      >
        <!-- Container -->
        <section class="flex-y-6 p-4">
          <!-- Theme -->
          <SettingsCard title="主题设置">
            <SettingsCardItem label="主题模式" description="设置应用的主题">
              <URadioGroup
                v-model="appStore.colorMode"
                :items="themeColorModeOptions"
                orientation="horizontal"
                @update:model-value="appStore.setColorMode"
              />
            </SettingsCardItem>

            <USeparator />

            <!-- 背景类型 -->
            <SettingsCardItem label="背景类型" description="背景样式的类型">
              <URadioGroup
                v-model="appStore.themeBackgroundType"
                :items="themeBackgroundOptions"
                orientation="horizontal"
              />
            </SettingsCardItem>

            <!-- 背景颜色 -->
            <SettingsCardItem
              v-if="appStore.themeBackgroundType === 'color'"
              label="背景颜色"
              description="选择应用背景颜色"
            >
              <USelect
                v-model="appStore.themeColor"
                :items="themeColorOptions"
                @update:model-value="appStore.setThemeColor"
                :ui="{ content: 'min-w-fit' }"
              >
                <template #leading="{ modelValue }">
                  <span
                    v-if="modelValue"
                    :class="
                      cn('size-3 rounded-full', {
                        'bg-neutral-200': modelValue === 'neutral',
                        'bg-stone-200': modelValue === 'stone',
                        'bg-zinc-200': modelValue === 'zinc',
                        'bg-slate-200': modelValue === 'slate',
                        'bg-gray-200': modelValue === 'gray',
                        'bg-red-200': modelValue === 'red',
                        'bg-orange-200': modelValue === 'orange',
                        'bg-amber-200': modelValue === 'amber',
                        'bg-yellow-200': modelValue === 'yellow',
                        'bg-lime-200': modelValue === 'lime',
                        'bg-green-200': modelValue === 'green',
                        'bg-emerald-200': modelValue === 'emerald',
                        'bg-teal-200': modelValue === 'teal',
                        'bg-cyan-200': modelValue === 'cyan',
                        'bg-sky-200': modelValue === 'sky',
                        'bg-blue-200': modelValue === 'blue',
                        'bg-indigo-200': modelValue === 'indigo',
                        'bg-violet-200': modelValue === 'violet',
                        'bg-purple-200': modelValue === 'purple',
                        'bg-fuchsia-200': modelValue === 'fuchsia',
                        'bg-pink-200': modelValue === 'pink',
                        'bg-rose-200': modelValue === 'rose'
                      })
                    "
                  ></span>
                </template>

                <template #item="{ item }">
                  <div class="flex-x-2 h-4">
                    <span
                      :class="
                        cn('size-3 rounded-full', {
                          'bg-neutral-200': item.value === 'neutral',
                          'bg-stone-200': item.value === 'stone',
                          'bg-zinc-200': item.value === 'zinc',
                          'bg-slate-200': item.value === 'slate',
                          'bg-gray-200': item.value === 'gray',
                          'bg-red-200': item.value === 'red',
                          'bg-orange-200': item.value === 'orange',
                          'bg-amber-200': item.value === 'amber',
                          'bg-yellow-200': item.value === 'yellow',
                          'bg-lime-200': item.value === 'lime',
                          'bg-green-200': item.value === 'green',
                          'bg-emerald-200': item.value === 'emerald',
                          'bg-teal-200': item.value === 'teal',
                          'bg-cyan-200': item.value === 'cyan',
                          'bg-sky-200': item.value === 'sky',
                          'bg-blue-200': item.value === 'blue',
                          'bg-indigo-200': item.value === 'indigo',
                          'bg-violet-200': item.value === 'violet',
                          'bg-purple-200': item.value === 'purple',
                          'bg-fuchsia-200': item.value === 'fuchsia',
                          'bg-pink-200': item.value === 'pink',
                          'bg-rose-200': item.value === 'rose'
                        })
                      "
                    ></span>
                    <span>{{ item.label }}</span>
                  </div>
                </template>
              </USelect>
            </SettingsCardItem>

            <template v-if="appStore.themeBackgroundType === 'image'">
              <!-- 背景图片 -->
              <SettingsCardItem label="背景图片" description="选择自定义背景图片">
                <div class="flex-y-2">
                  <!-- <div
                    v-if="appStore.backgroundImageUrl"
                    class="w-full h-12 rounded-lg overflow-hidden"
                  >
                    <img :src="appStore.backgroundImageUrl" class="size-full object-cover" />
                  </div> -->
                  <div class="flex-x-2">
                    <UButton
                      :label="appStore.backgroundImageUrl ? '更换图片' : '选择图片'"
                      variant="outline"
                      color="neutral"
                      icon="tabler:photo"
                      @click="handleSelectedBackgroundImage"
                    />

                    <UButton
                      v-if="appStore.backgroundImageUrl"
                      label="清除图片"
                      icon="tabler:photo-off"
                      variant="subtle"
                      color="error"
                      @click="handleClearBackgroundImage"
                    />
                  </div>
                </div>
              </SettingsCardItem>

              <!-- 图片预览 -->
              <SettingsCardItem v-if="appStore.backgroundImageUrl" label="预览">
                <img
                  :src="appStore.backgroundImageUrl"
                  class="w-48 h-32 object-cover rounded-lg border"
                  alt="背景预览"
                />
              </SettingsCardItem>

              <!-- 图片效果设置 -->
              <SettingsCardItem label="透明度" description="调整背景图片透明度">
                <div class="flex-x-2">
                  <span class="text-sm text-gray-500">
                    {{ Math.round(appStore.backgroundOpacity * 100) }}%
                  </span>
                  <USlider
                    v-model="appStore.backgroundOpacity"
                    :min="0.1"
                    :max="1"
                    :step="0.1"
                    @update:model-value="appStore.setBackgroundOpacity"
                    class="w-20"
                  />
                </div>
              </SettingsCardItem>

              <SettingsCardItem label="模糊度" description="调整背景图片模糊效果">
                <div class="flex-x-2">
                  <span class="text-sm text-gray-500">{{ appStore.backgroundBlur }}px</span>
                  <USlider
                    v-model="appStore.backgroundBlur"
                    :min="0"
                    :max="20"
                    :step="1"
                    @update:model-value="appStore.setBackgroundBlur"
                    class="w-20"
                  />
                </div>
              </SettingsCardItem>

              <SettingsCardItem label="缩放" description="调整背景图片缩放比例">
                <div class="flex-x-2">
                  <span class="text-sm text-gray-500">
                    {{ Math.round(appStore.backgroundScale * 100) }}%
                  </span>
                  <USlider
                    v-model="appStore.backgroundScale"
                    :min="1"
                    :max="2"
                    :step="0.1"
                    @update:model-value="appStore.setBackgroundScale"
                    class="w-20"
                  />
                </div>
              </SettingsCardItem>
            </template>
          </SettingsCard>

          <!-- Code Editor -->
          <SettingsCard title="代码编辑器">
            <!-- 代码编辑器主题 -->
            <SettingsCardItem label="代码编辑器主题" description="设置代码编辑器的着色主题">
              <USelect
                v-model="appStore.codeEditorTheme"
                :items="themeOptions"
                @update:model-value="appStore.setCodeEditorTheme"
                :ui="{ content: 'min-w-fit' }"
              />
            </SettingsCardItem>

            <!-- 代码编辑器字体 -->
            <SettingsCardItem label="代码编辑器字体" description="设置代码编辑器的代码字体">
              <USelect
                v-model="appStore.codeEditorFontFamily"
                :items="fontOptions"
                @update:model-value="appStore.setCodeEditorFontFamily"
                :ui="{ content: 'min-w-fit' }"
              />
            </SettingsCardItem>

            <!-- 代码编辑器字体 -->
            <SettingsCardItem label="代码编辑器字号" description="设置代码编辑器的代码字体">
              <USelect
                v-model="appStore.codeEditorFontSize"
                :items="fontSizeOptions"
                @update:model-value="appStore.setCodeEditorFontSize"
                :ui="{ content: 'min-w-fit' }"
              />
            </SettingsCardItem>
          </SettingsCard>

          <!-- 系统设置 -->
          <SettingsCard title="应用设置">
            <!-- 快捷键设置 -->
            <SettingsCardItem label="快捷键" description="设置全局快捷键来快速唤起搜索窗口">
              <UInput
                v-model="appStore.shortcut"
                :ui="{ base: 'w-48' }"
                name="shortcut"
                readonly
                @keydown.prevent="handleShortcutChange"
              >
              </UInput>
              <template #description>
                常用的快捷键格式: Ctrl+Shift+X, Alt+Space, Command+Shift+S
              </template>
            </SettingsCardItem>

            <USeparator />

            <!-- 数据库路径 -->
            <SettingsCardItem label="数据库路径" description="设置数据库存储位置">
              <div class="flex-x-2">
                <UInput
                  v-model="appStore.databasePath"
                  readonly
                  placeholder="默认路径"
                  class="flex-1"
                />
                <UButton
                  label="选择路径"
                  icon="tabler:folder"
                  variant="outline"
                  color="neutral"
                  @click="handleSelectDatabasePath"
                />
                <UButton
                  v-if="appStore.databasePath"
                  label="重置"
                  icon="tabler:refresh"
                  variant="subtle"
                  color="error"
                  @click="handleResetDatabasePath"
                />
              </div>
            </SettingsCardItem>
          </SettingsCard>
        </section>
      </main>
    </div>
  </WindowWrapper>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
