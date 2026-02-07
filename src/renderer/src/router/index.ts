import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'
import { App } from 'vue'
import { setupRouterGuard } from './guard'

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({
    el: '#app',
    top: 0,
    behavior: 'smooth'
  })
})

export async function setupRouter(app: App) {
  setupRouterGuard(router)
  app.use(router)
}
