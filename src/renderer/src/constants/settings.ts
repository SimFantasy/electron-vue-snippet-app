import { SelectItem } from '@nuxt/ui'

// 主题模式选项
export const themeColorModeOptions = [
  { label: '跟随系统', value: 'auto' },
  { label: '深色模式', value: 'dark' },
  { label: '浅色模式', value: 'light' }
] satisfies SelectItem[]

// 背景主题类型选项
export const themeBackgroundOptions = [
  { label: '纯色', value: 'color' },
  { label: '背景图片', value: 'image' }
] satisfies SelectItem[]

// 背景色选项
export const themeColorOptions = [
  { label: '间色', value: 'neutral' },
  { label: '玄色', value: 'stone' },
  { label: '铅灰', value: 'zinc' },
  { label: '瓦黛', value: 'slate' },
  { label: '仓色', value: 'gray' },
  { label: '朱红', value: 'red' },
  { label: '橘红', value: 'orange' },
  { label: '琥珀', value: 'amber' },
  { label: '鹅黄', value: 'yellow' },
  { label: '柳黄', value: 'lime' },
  { label: '碧色', value: 'green' },
  { label: '翠色', value: 'emerald' },
  { label: '苍翠', value: 'teal' },
  { label: '缥色', value: 'cyan' },
  { label: '霁青', value: 'sky' },
  { label: '石青', value: 'blue' },
  { label: '靛蓝', value: 'indigo' },
  { label: '青莲', value: 'violet' },
  { label: '绛紫', value: 'purple' },
  { label: '洋红', value: 'fuchsia' },
  { label: '妃色', value: 'pink' },
  { label: '胭脂', value: 'rose' }
] satisfies SelectItem[]
