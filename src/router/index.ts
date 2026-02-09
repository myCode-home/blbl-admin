import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'main',
    redirect: { name: 'dashboard' },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        meta: {
          id: '1',
          name: '控制台',
          icon: 'Platform',
          path: '/dashboard',
          describe: '用于展示当前系统中的统计数据、统计报表及重要实时数据',
        },
        component: () => import('@/view/dashboard/index.vue'),
      },
      {
        path: 'auth',
        meta: { id: '2', name: '权限管理', icon: 'Grid', redirect: '/auth/admin' },
        children: [
          {
            path: '',
            alias: ['admin'],
            name: 'admin',
            meta: {
              id: '1',
              name: '账号管理',
              icon: 'Avatar',
              path: '/auth/admin',
              describe: '管理员可以进行编辑，权限修改后需要登出才会生效',
            },
            component: () => import('@/view/admin/index.vue'),
          },
          {
            path: 'group',
            name: 'group',
            meta: {
              id: '2',
              name: '菜单管理',
              icon: 'Menu',
              path: '/auth/group',
              describe: '菜单规则通常对应一个控制器的方法,同时菜单栏数据也从规则中获取',
            },
            component: () => import('@/view/group/index.vue'),
          },
        ],
      },
      {
        path: 'vppz',
        meta: { id: '3', name: 'DIDI陪诊', icon: 'BellFilled', redirect: '/vppz/staff' },
        children: [
          {
            path: '',
            alias: ['staff'],
            name: 'staff',
            meta: {
              id: '1',
              name: '陪护管理',
              icon: 'Checked',
              path: '/vppz/staff',
              describe: '陪护师可以进行创建和修改，设置对应生效状态控制C端选择',
            },
            component: () => import('@/view/staff/index.vue'),
          },
          {
            path: 'order',
            name: 'order',
            meta: {
              id: '2',
              name: '订单管理',
              icon: 'List',
              path: '/vppz/order',
              describe: 'C端下单后可以查看所有订单状态，已支付的订单可以完成陪护状态修改',
            },
            component: () => import('@/view/order/index.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: { id: '4', name: '登录', icon: 'User' },
    component: () => import('@/view/login/index.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
