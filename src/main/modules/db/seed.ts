import Mock from 'mockjs'
import { getDB } from './connect'

const { Random } = Mock

interface CategoryData {
  name: string
  created_at: Date
  updated_at: Date
}

interface CodeData {
  title: string
  content: string
  tags: string
  category_id: number
  created_at: Date
  updated_at: Date
}

/**
 * 生成分类数据
 * @param count 生成的数量，默认30个用于测试滚动
 * @returns 分类数据数组
 */
function generateCategories(count: number = 30): CategoryData[] {
  const categories: CategoryData[] = []
  const categoryNames = [
    'JavaScript',
    'TypeScript',
    'Vue',
    'React',
    'Node.js',
    'Python',
    'CSS',
    'HTML',
    'SQL',
    '工具',
    '算法',
    '数据结构',
    '设计模式',
    '正则表达式',
    'Git',
    'Docker',
    'Linux',
    'Nginx',
    'Webpack',
    'Vite',
    'Electron',
    '小程序',
    'Flutter',
    'Go',
    'Rust',
    'Java',
    'C++',
    'PHP',
    'Ruby',
    'Swift'
  ]

  for (let i = 0; i < count; i++) {
    categories.push({
      name: categoryNames[i] || `${Random.ctitle(2, 4)}分类${i + 1}`,
      created_at: new Date(Date.now() - Random.integer(0, 30) * 24 * 60 * 60 * 1000),
      updated_at: new Date()
    })
  }

  return categories
}

interface CodeTemplate {
  title: string
  content: string
  tags: string[]
}

/**
 * 生成代码片段数据
 * @param count 生成的数量
 * @param categoryIds 可用的分类ID数组
 * @returns 代码片段数据数组
 */
function generateCodes(count: number = 20, categoryIds: number[] = []): CodeData[] {
  const codes: CodeData[] = []
  const codeTemplates: CodeTemplate[] = [
    {
      title: '数组去重',
      content: `const uniqueArray = (arr) => [...new Set(arr)];

// 使用示例
const numbers = [1, 2, 2, 3, 4, 4, 5];
console.log(uniqueArray(numbers)); // [1, 2, 3, 4, 5]`,
      tags: ['JavaScript', '数组', 'ES6']
    },
    {
      title: '防抖函数',
      content: `function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
      tags: ['JavaScript', '性能优化', '函数']
    },
    {
      title: '节流函数',
      content: `function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}`,
      tags: ['JavaScript', '性能优化', '函数']
    },
    {
      title: '深拷贝',
      content: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const copy = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }
}`,
      tags: ['JavaScript', '对象', '工具函数']
    },
    {
      title: 'Vue3 Composition API 基础',
      content: `<script setup>
import { ref, computed, watch } from 'vue'

// 响应式数据
const count = ref(0)

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法
const increment = () => {
  count.value++
}

// 监听器
watch(count, (newVal, oldVal) => {
  console.log('count变化:', oldVal, '->', newVal)
})
</script>`,
      tags: ['Vue', 'Vue3', 'Composition API']
    }
  ]

  for (let i = 0; i < count; i++) {
    const template = codeTemplates[i % codeTemplates.length]
    const hasCategory = categoryIds.length > 0 && Math.random() < 0.8 // 80%的概率有分类

    codes.push({
      title: template.title + (i > 4 ? ` ${i - 4}` : ''),
      content: template.content,
      tags: JSON.stringify(template.tags),
      category_id: hasCategory ? categoryIds[Math.floor(Math.random() * categoryIds.length)] : 0,
      created_at: new Date(Date.now() - Random.integer(0, 60) * 24 * 60 * 60 * 1000),
      updated_at: new Date()
    })
  }

  return codes
}

interface CountResult {
  'count(*)': string
}

/**
 * 填充种子数据
 * @param categoryCount 分类数量
 * @param codeCount 代码片段数量
 */
export async function seedData(categoryCount: number = 5, codeCount: number = 20): Promise<void> {
  const db = getDB()

  try {
    // 检查是否已有数据
    const existingCategories = await db<CountResult>('categories').count('*').first()
    const existingCodes = await db<CountResult>('codes').count('*').first()

    if (existingCategories) {
      const count = parseInt(existingCategories['count(*)'], 10)
      if (count > 0) {
        console.log('分类数据已存在，跳过填充')
      } else {
        // 插入分类数据
        const categories = generateCategories(categoryCount)
        await db('categories').insert(categories)
        console.log(`成功插入 ${categories.length} 条分类数据`)
      }
    }

    if (existingCodes) {
      const count = parseInt(existingCodes['count(*)'], 10)
      if (count > 0) {
        console.log('代码片段数据已存在，跳过填充')
      } else {
        // 只获取前几个分类的ID（用于测试列表滚动，部分分类有数据，部分没有）
        const allCategoryIds = await db<number[]>('categories').pluck('id').orderBy('id', 'asc')

        // 只为前5个分类填充数据，其余分类为空（测试滚动效果）
        const categoryIdsWithCodes = allCategoryIds.slice(0, 5)

        // 插入代码片段数据，只关联到前几个分类
        const codes = generateCodes(codeCount, categoryIdsWithCodes)
        await db('codes').insert(codes)
        console.log(`成功插入 ${codes.length} 条代码片段数据（仅前5个分类）`)
      }
    }

    console.log('种子数据填充完成')
  } catch (error) {
    console.error('填充种子数据失败:', error)
    throw error
  }
}

/**
 * 清除所有数据
 */
export async function clearData(): Promise<void> {
  const db = getDB()

  try {
    await db('codes').del()
    await db('categories').del()
    console.log('所有数据已清除')
  } catch (error) {
    console.error('清除数据失败:', error)
    throw error
  }
}
