import request from '@/api/config';
import qs from 'qs';
//获取全部用户
export const gainUsers = params => {return request({url: '/user/gain',  method: 'get', params: params})}
//新增/修改用户信息
export const saveUser = params => {return request({url: '/user/save',  method: 'post', data: qs.stringify(params)})}
//禁用/删除用户
export const deleteUser = params => {return request({url: '/user/delete',  method: 'delete', params: params})}