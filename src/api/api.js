import request from '@/api/config';
import qs from 'qs';

//登录
export const login = params => { return request({url: '/login',  method: 'post', data: qs.stringify(params) }); }

//登出
export const logout = () => { return request({url: '/logout',  method: 'post' }); }

//修改密码
export const changePassword = params => { return request({url: '/change-psd',  method: 'post' , data: qs.stringify(params)}); }

//获取图片验证码
export const captcha = params => {return request({url: '/captcha',  method: 'get', params: params})}

//验证图片验证码
export const validation = params => { return request({url: '/validation',  method: 'post', data: qs.stringify(params) }); }