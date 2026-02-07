import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStatusStore = defineStore('status', () => {
    const isFold = ref(false)

    const toggleFold = () => {
        isFold.value = !isFold.value
    }
    return {
        isFold,
        toggleFold
    }
})
