import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import '@/init.css'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import ElementPlus from 'element-plus'
import SuperTable from '@/components/SuperTable.vue'
import { useRoutesStore } from '@/store/routes'

const app = createApp(App)
const pinia = createPinia()
app.use(ElementPlus, {
  locale: zhCn,
})
app.component('super-table', SuperTable)
pinia.use(piniaPluginPersistedstate)

// 在应用启动时恢复动态路由
app.use(pinia)
const routesStore = useRoutesStore()
if (routesStore.routes && routesStore.routes.length > 0) {
  // 恢复路由组件并添加到路由系统
  const routesWithComponents = routesStore.restoreRoutesComponents()
  if (routesWithComponents) {
    routesWithComponents.forEach((route: any) => {
      router.addRoute('main', route)
    })
  }
}

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.mount('#app')
