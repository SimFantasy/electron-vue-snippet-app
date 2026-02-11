<script lang="ts" setup name="Settings">
import { themeOptions, fontOptions } from '@/components/code-editor/theme-config'
import { useAppStore } from '@/stores'
/**
 * Hooks
 */
const appStore = useAppStore()

watch(
  () => appStore.codeEditorTheme,
  (val) => {
    if (val) {
      console.log('codeEditorTheme', val)
    }
  }
)
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
              <SettingsColormode />
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

            <!-- 代码编辑器主题 -->
            <SettingsCardItem label="代码编辑器字体" description="设置代码编辑器的代码字体">
              <USelect
                v-model="appStore.codeEditorFontFamily"
                :items="fontOptions"
                @update:model-value="appStore.setCodeEditorFontFamily"
                :ui="{ content: 'min-w-fit' }"
              />
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
