import type { RouteRecordRaw } from 'vue-router'

export const globalRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../../views/dashboard/dashborad.vue'),
    meta: {
      title: 'Dashboard',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../../views/dashboard/login.vue'),
    meta: {
      title: 'Login',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../../views/dashboard/register.vue'),
    meta: {
      title: 'Register',
    },
  },
  {
    path: '/article/:id',
    name: 'article-dashboard',
    component: () => import('../../views/dashboard/article.vue'),
    meta:{
      title: 'Article'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../../views/profile.vue'),
    meta: {
      title: 'Edit Profile',
      requireAuth: true,
    },
  }
]
