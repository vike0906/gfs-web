import request from '@/api/config';
import qs from 'qs';
//获取全部用户
export const gainUsers = params => {return request({url: '/user/gain',  method: 'get', params: params})}
//新增/修改用户信息
export const saveUser = params => {return request({url: '/manager/user/save-user',  method: 'post', data: qs.stringify(params)})}
//禁用/删除用户
export const deleteUser = params => {return request({url: '/manager/user/delete-user',  method: 'delete', data: qs.stringify(params)})}