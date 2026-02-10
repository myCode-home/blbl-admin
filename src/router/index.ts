import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routex'
import { useUserStore } from '@/store/user'


const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
router.beforeEach((to, from, next) => {
  const token = useUserStore().token
  if (to.name === 'login' && token) {
    next({ path: from.path || '/dashboard' })
    return
  }
  if (!token && to.name !== 'login') {
    next({ path: '/login' })
    return
  }
  next()
})

export default router
