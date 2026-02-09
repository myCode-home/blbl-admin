import axios from 'axios'
import { useUserStore } from '@/store/user'

const request = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
})
console.log(import.meta.env.VITE_API_URL)
request.interceptors.request.use(
    (config) => {
        // 比如添加token
        const token = useUserStore().token
        if (token) {
            config.headers['X-Token'] = token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 可选：响应拦截器
request.interceptors.response.use(
    (response) => {
        // 统一处理响应数据
        return response.data
    },
    (error) => {
        // 统一处理错误
        console.error('请求错误：', error)
        return Promise.reject(error)
    }
)

export default request
