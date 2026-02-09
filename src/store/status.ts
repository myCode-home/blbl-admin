import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TagsItem } from '@/type/public'

export const useStatusStore = defineStore('status', () => {

    // 折叠状态
    const isFold = ref(false)
    const toggleFold = () => {
        isFold.value = !isFold.value
    }

    // tag标签列表
    const tags = ref<TagsItem[]>([])
    const addTag = (tag: TagsItem) => {
        tags.value.forEach((item) => {
            item.isActive = false
        })
        const existingTag = tags.value.find((item) => item.path === tag.path)
        if (existingTag) {
            existingTag.isActive = true
            return
        }
        tags.value.push({ ...tag, isActive: true })
    }
    const removeTag = (tag: TagsItem) => {
        const index = tags.value.findIndex((item) => item.path === tag.path)
        tags.value.splice(index, 1)
    }
    return {
        isFold,
        tags,
        toggleFold,
        addTag,
        removeTag
    }
})
