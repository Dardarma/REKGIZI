import type { RouteRecordRaw } from 'vue-router'

export const ahligiziRoutes: RouteRecordRaw[] = [
  {
    path: '/ahligizi',
    name: 'ahligizi-dashboard',
    component: () => import('../../views/ahligizipage/dasboard.vue'),
    meta: {
      title: 'Dashboard Gizi',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/diagnosa/create',
    name: 'ahligizi-asuhan-create',
    component: () => import('../../views/ahligizipage/diagnose/SearchPage.vue'),
    meta: {
      title: 'Asuhan : Rekam Baru',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/diagnosa/assessment/:id',
    name: 'ahligizi-assessment',
    component: () => import('../../views/ahligizipage/diagnose/Assement.vue'),
    meta: {
      title: 'Asuhan : Assesment',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/diagnosa/diagnosa/create/:id',
    name: 'ahligizi-diagnosa-create',
    component: () => import('../../views/ahligizipage/diagnose/Diagnosa.vue'),
    meta: {
      title: 'Asuhan: Diagnosa Baru',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/diagnosa/intervention/create/:id',
    name: 'ahligizi-intervention-create',
    component: () => import('../../views/ahligizipage/diagnose/Intervensi.vue'),
    meta: {
      title: 'Asuhan : Intervensi Baru',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/diagnosa/summary/create/:id',
    name: 'ahligizi-summary-create',
    component: () => import('../../views/ahligizipage/diagnose/Summary.vue'),
    meta: {
      title: 'Asuhan : kesimpulan',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/diagnosa/edit',
    name: 'ahligizi-asuhan-edit',
    component: () => import('../../views/ahligizipage/diagnose/SearchPage.vue'),
    meta: {
      title: 'Asuhan Edit: Rekam ',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/diagnosa/edit/:id',
    name: 'ahligizi-asuhan-edit-user',
    component: () => import('../../views/ahligizipage/diagnose/listRekamPasien.vue'),
    meta: {
      title: 'Asuhan Edit: Rekam User ',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/diagnosa/diagnosa/edit/:id',
    name: 'ahligizi-diagnosa-edit',
    component: () => import('../../views/ahligizipage/diagnose/Diagnosa.vue'),
    meta: {
      title: 'Asuhan Edit: Diagnosa ',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/diagnosa/intervention/edit/:id',
    name: 'ahligizi-intervention-edit',
    component: () => import('../../views/ahligizipage/diagnose/Intervensi.vue'),
    meta: {
      title: 'Asuhan Edit: Intervensi ',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/diagnosa/summary/edit/:id',
    name: 'ahligizi-summary-edit',
    component: () => import('../../views/ahligizipage/diagnose/Summary.vue'),
    meta: {
      title: 'Asuhan Edit: kesimpulan',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/master/parameter',
    name: 'ahligizi-parameter',
    component: () => import('../../views/ahligizipage/master/parameter.vue'),
    meta: {
      title: 'Master : parameter',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/master/parameter/:id',
    name: 'ahligizi-parameter-opsi',
    component: () => import('../../views/ahligizipage/master/opsiParameter.vue'),
    meta: {
      title: 'Master : parameter, Opsi',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/master/intervensi',
    name: 'ahligizi-master-intervensi',
    component: () => import('../../views/ahligizipage/master/Intervensi.vue'),
    meta: {
      title: 'Master : Intervensi',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/master/diagnosa',
    name: 'ahligizi-master-diagnosa',
    component: () => import('../../views/ahligizipage/master/diagnosa.vue'),
    meta: {
      title: 'Master : diagnosa',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/artikel',
    name: 'ahligizi-article',
    component: () => import('../../views/ahligizipage/article/articleList.vue'),
    meta: {
      title: 'Article',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/artikel/create',
    name: 'ahligizi-article-create',
    component: () => import('../../views/ahligizipage/article/articleContent.vue'),
    meta: {
      title: 'Create Article',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/artikel/:id',
    name: 'ahligizi-article-detail',
    component: () => import('../../views/ahligizipage/article/articleContent.vue'),
    meta: {
      title: 'Edit Article',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/janji-temu/jadwal',
    name: 'ahligizi-janji-jadwal',
    component: () => import('../../views/ahligizipage/janji_temu/jadwal.vue'),
    meta: {
      title: 'Jadwal',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
  {
    path: '/ahligizi/janji-temu/janji_temu',
    name: 'ahligizi-janji-temu',
    component: () => import('../../views/ahligizipage/janji_temu/Janji_temu.vue'),
    meta: {
      title: 'Janji Temu',
      requireAuth: true,
      role: 'ahli_gizi',
    },
  },
]
