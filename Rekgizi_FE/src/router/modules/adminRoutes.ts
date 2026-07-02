import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/user',
    name: 'admin-user',
    component: () => import('../../views/admin/user.vue'),
    meta: {
      title: 'master : user',
      requireAuth: true,
      role: 'admin',
    },
  },
]
