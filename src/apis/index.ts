import type { MenuData } from '@/type/request'
import request from '@/utils/request'

// 菜单权限下拉列表 get /menu/selectlist
export const getMenuSelectListService = (): Promise<any> => {
    return request.get('/menu/selectlist')
}

// 菜单权限的数据 /user/getmenu
export const getMenuService = (): Promise<MenuData> => {
    return request.get('/user/getmenu')
}

// 权限修改/新增 post /user/setmenu
export const setMenuService = (data: any): Promise<any> => {
    return request.post('/user/setmenu', data)
}

// 菜单权限列表 get /menu/list
export const getMenuListService = (params: any): Promise<any> => {
    return request({
        url: '/menu/list',
        method: 'get',
        params,
    })
}

// 账号管理列表 get /auth/admin
export const getUserListService = (params: any): Promise<any> => {
    return request({
        url: '/auth/admin',
        method: 'get',
        params,
    })
}

// 账号管理修改 post /update/user
export const setUserService = (data: any): Promise<any> => {
    return request.post('/update/user', data)
}

// 菜单权限数据 get /user/getmenu
export const getMenuDataService = (): Promise<any> => {
    return request.get('/user/getmenu')
}
