import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useRoutesStore } from '@/store/routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layout/index.vue'),
      name: 'main',
      redirect: '/auth/admin',
      children: [
      ]
    },
    {
      path: '/login',
      name: 'login',
      meta: { id: '4', name: '登录', icon: 'User' },
      component: () => import('@/view/login/index.vue'),
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const token = useUserStore().token
  const routesStore = useRoutesStore()

  // 如果用户已登录且有路由数据但可能缺少组件，尝试恢复组件
  if (token && to.name !== 'login' && routesStore.routes && routesStore.routes.length > 0) {
    // 恢复路由组件
    const routesWithComponents = routesStore.restoreRoutesComponents()
    if (routesWithComponents) {
      // 清除现有动态路由
      const existingRoutes = router.getRoutes()
      existingRoutes.forEach(route => {
        if (route.name && route.name !== 'main' && route.name !== 'login') {
          router.removeRoute(route.name)
        }
      })

      // 重新添加带组件的路由
      routesWithComponents.forEach((route: any) => {
        router.addRoute('main', route)
      })
    }
  }

  // 如果用户已登录但动态路由未恢复，跳转到首页
  if (token && to.name !== 'login' && (!routesStore.routes || routesStore.routes.length === 0)) {
    next('/')
    return
  }

  if (to.name === 'login' && token) {
    next({ path: from.path || '/' })
    return
  }

  if (!token && to.name !== 'login') {
    next({ path: '/login' })
    return
  }

  next()
})

export default router
