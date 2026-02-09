import type { TagProps } from 'element-plus'

export interface TagsItem {
    name: string
    type?: TagProps['type']
    icon?: string
    path: string
    isActive?: boolean
}
