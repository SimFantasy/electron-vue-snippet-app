import type { Router } from 'vue-router'
import { loadingStart, loadingDone } from '@/utils'
import { APP_CONFIG } from '@/constants/app'

export function setupRouterGuard(router: Router) {
  try {
    // 全局 beforEach 守卫
    router.beforeEach((_to, _from, next) => {
      // 开始加载Loading
      loadingStart()

      next()
    })

    // 全局 afterEach 守卫
    router.afterEach((to) => {
      // 修改标题
      document.title = `${to.meta.title} - ${APP_CONFIG.NAME}`

      // 结束加载Loading
      loadingDone()
    })
  } catch (error: any) {
    console.log('[RouterGuard] 路由守卫错误', error)
    throw new Error(error)
  }
}
