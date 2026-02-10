import type { LoginResponse, CheckCodeResponse, AuthenticationResponse } from '@/type/request';
import request from '@/utils/request'

// 获取验证码 post /get/code
export const getCheckCodeService = (data: { tel: string }): Promise<CheckCodeResponse> => {
    return request.post('/get/code', data)
}
// 验证验证码 post /user/authentication
export const useAuthenticationService = (data: { userName: string; passWord: string; validCode: string }): Promise<AuthenticationResponse> => {
    return request.post('/user/authentication', data)
}
// 登录 https://v3pz.itndedu.com/v3pz/login
export const useLoginService = (data: { userName: string; passWord: string }): Promise<LoginResponse> => {
    return request.post('/login', data)
}