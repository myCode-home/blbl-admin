import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRoutesStore } from './routes'

export const useUserStore = defineStore('user', () => {
    const token = ref('')
    const setToken = (newToken: string) => {
        token.value = newToken
    }
    const removeToken = () => {
        token.value = ''
    }

    const userInfo = ref({
        avatar: '',
        name: ''
    })
    const setUserInfo = (newUserInfo: any) => {
        userInfo.value = newUserInfo
    }
    const removeUserInfo = () => {
        userInfo.value = {
            avatar: '',
            name: ''
        }
    }
    const handleLogout = () => {
        removeToken()
        removeUserInfo()
        const routesStore = useRoutesStore()
        routesStore.cleanRoutes()
    }

    return {
        token,
        userInfo,
        setToken,
        removeToken,
        setUserInfo,
        removeUserInfo,
        handleLogout
    }
}, {
    persist: true
}
)