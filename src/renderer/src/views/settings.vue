<script lang="ts" setup name="Settings">
import { themeOptions, fontOptions, fontSizeOptions } from '@/components/code-editor/theme-config'
import { themeColorModeOptions } from '@/constants'
import { useAppStore } from '@/stores'
import { useScroll } from '@vueuse/core'

/**
 * Hooks
 */
const appStore = useAppStore()
const containerRef = useTemplateRef('containerEl')
const { y } = useScroll(containerRef)

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
    <div class="p-2 pt-0 w-full h-full overflow-hidden">
      <main
        ref="containerEl"
        class="w-full h-[calc(100vh-var(--spacing)*14)] rounded-lg border border-stone-300 bg-card overflow-y-auto"
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

            <!-- 背景颜色 -->
            <SettingsCardItem label="背景颜色" description="选择应用背景颜色">
              <SettingsColorPicker :scrolled="y" />
            </SettingsCardItem>

            <!-- 背景图片 -->
            <SettingsCardItem label="背景图片" description="选择自定义背景图片">
              <div class="flex-y-2">
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
