// 通用API响应结构
export interface ApiResponse<T = any> {
    code: number
    msg: string
    data: T
    message?: {
        msg: string
    }
}

// 登录响应数据
export interface LoginData {
    code: number | string
    message?: {
        msg?: string
    }
    data: {
        token: string
        userInfo: {
            avatar: string
            name: string
            // userName: string
        }
    }
}

// 验证码响应数据
export interface CheckCodeData {
    data: string
    msg: string
    message?: {
        msg?: string
    }
    code: number | string
}
// 兼容旧版本的类型别名
export type RequestData = ApiResponse

// 具体的API响应类型
// export type LoginResponse = ApiResponse<LoginData>
export type LoginResponse = LoginData
export type CheckCodeResponse = ApiResponse<CheckCodeData>
export type AuthenticationResponse = ApiResponse<{ success: boolean }>