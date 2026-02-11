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

const app = createApp(App)
const pinia = createPinia()
app.use(ElementPlus, {
  locale: zhCn,
})
app.component('super-table', SuperTable)
pinia.use(piniaPluginPersistedstate)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.use(pinia)
app.mount('#app')
