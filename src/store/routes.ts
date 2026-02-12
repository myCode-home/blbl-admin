import { defineStore } from "pinia";
import { ref } from 'vue'

export const useRoutesStore = defineStore('routes', () => {
    const routes = ref()
    const cleanRoutes = () => {
        routes.value = []
    }
    // 拿到目录下的所有vue文件
    const routesData = import.meta.glob('../view/**/**/*.vue')

    // 为路由添加组件引用
    const addComponentsToRoutes = (routesArr: any) => {
        routesArr.forEach((item: any) => {
            if (!item.children) {
                const url = `../view${item.meta.path}/index.vue`
                item.component = routesData[url]
            } else {
                addComponentsToRoutes(item.children)
            }
        })
        return routesArr
    }

    // 后端返回的菜单数据处理的地方
    const handelRoutes = (routesArr: any) => {
        const routesWithComponents = addComponentsToRoutes(routesArr)
        routes.value = routesWithComponents
    }

    // 恢复路由组件（用于页面刷新时）
    const restoreRoutesComponents = () => {
        if (routes.value) {
            return addComponentsToRoutes(routes.value)
        }
        return null
    }

    return {
        routes,
        cleanRoutes,
        handelRoutes,
        restoreRoutesComponents,
    }
}, {
    persist: {
        key: 'routes-store',
        storage: localStorage,
    }
})