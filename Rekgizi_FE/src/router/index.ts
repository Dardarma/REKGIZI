import { createRouter, createWebHistory } from 'vue-router'
import { globalRoutes } from './modules/globalRoutes'
import { userRoutes } from './modules/userRoutes'
import { ahligiziRoutes } from './modules/ahligiziRoutes'
import { adminRoutes } from './modules/adminRoutes'
import Cookies from 'js-cookie'
import { redirectPage } from '@/utils/redirectPage'
import Swal from 'sweetalert2'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [...globalRoutes, ...userRoutes, ...ahligiziRoutes, ...adminRoutes],
})

export default router

router.beforeEach((to, from, next) => {
  const pageTitle = typeof to.meta.title === 'string' ? to.meta.title : ''
  document.title = pageTitle ? `${pageTitle} | Rekgizi` : 'Rekgizi'

  const token = Cookies.get('token')
  const role = localStorage.getItem('role')

  if (to.meta.requireAuth && !token) {
    next(false)

    Swal.fire({
      title: 'Harap Untuk Login',
      icon: 'warning',
      confirmButtonText: 'Login',
    }).then(() => {
      router.push('/login')
    })

    return
  }

  if (role && to.meta.role && role !== to.meta.role) {
    next(false)

    Swal.fire({
      title: 'Halaman Terlarang',
      icon: 'warning',
      confirmButtonText: 'ok',
    }).then(() => {
      redirectPage(router, role)
    })

    return
  }

  if (to.path === '/login' && token && role) {
    next(false)

    Swal.fire({
      title: 'Halaman Terlarang',
      icon: 'warning',
      confirmButtonText: 'ok',
    }).then(() => {
      redirectPage(router, role)
    })

    return
  }

  next()
})
