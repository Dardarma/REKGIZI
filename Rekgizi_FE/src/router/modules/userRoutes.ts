import type { RouteRecordRaw } from 'vue-router'

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/user',
    name: 'user-home',
    component: () => import('../../views/user/home.vue'),
    meta: {
      title: 'User Home',
      requireAuth: true,
      role: 'pasien',
    },
  },
  {
    path: '/user/rekam-medis',
    name: 'user-rekam-medis',
    component: () => import('../../views/user/rekam_medis/rekam_medis.vue'),
    meta: {
      title: 'User Rekam Medis',
      requireAuth: true,
      role: 'pasien',
    },
  },
  {
    path: '/user/rekam-medis/:id',
    name: 'user-rekam-medis-detail',
    component: () => import('../../views/user/rekam_medis/rekam_medi_detail.vue'),
    meta: {
      title: 'User Rekam Medis Detail',
      requireAuth: true,
      role: 'pasien',
    },
  },
  {
    path: '/user/janji-temu',
    name: 'user-janji-temu',
    component: () => import('../../views/user/janji_temu/janji_temu.vue'),
    meta: {
      title: 'User Janji Temu',
      requireAuth: true,
      role: 'pasien',
    },
  },
  {
    path: '/user/janji-temu/riwayat',
    name: 'user-janji-temu-riwayat',
    component: () => import('../../views/user/janji_temu/janji_temu_riwayat.vue'),
    meta: {
      title: 'User Janji Temu',
      requireAuth: true,
      role: 'pasien',
    },
  },
  {
    path: '/user/article',
    name: 'user-article',
    component: () => import('../../views/user/article/article_list.vue'),
    meta: {
      title: 'User Article',
      requireAuth: true,
      role: 'pasien',
    },
  },
  {
    path: '/user/article/:id',
    name: 'user-article-detail',
    component: () => import('../../views/user/article/article.vue'),
    meta: {
      title: 'User Article Detail',
      requireAuth: true,
      role: 'pasien',
    },
  },
]
