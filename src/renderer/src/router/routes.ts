import type { RouteRecordRaw } from 'vue-router'

export const routes = [
  {
    path: '/',
    name: 'Searchbar',
    component: () => import('@/views/index.vue'),
    meta: { title: '搜索' }
  },
  {
    path: '/manage',
    name: 'Manage',
    component: () => import('@/views/manage.vue'),
    meta: { title: '代码管理' },
    redirect: { name: 'CodeList', params: {} },
    children: [
      {
        path: 'code-list/:cid?',
        name: 'CodeList',
        component: () => import('@/views/code-list.vue'),
        meta: { title: '代码列表' },
        children: [
          {
            path: '',
            name: 'CodeBlank',
            component: () => import('@/views/code-blank.vue')
          },
          {
            path: 'code-detail/:id',
            name: 'CodeDetail',
            component: () => import('@/views/code-detail.vue'),
            meta: { title: '代码详情' }
          }
        ]
      }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings.vue'),
    meta: { title: '设置' }
  }
] satisfies RouteRecordRaw[]
