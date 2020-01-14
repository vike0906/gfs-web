import request from '@/api/config';
import qs from 'qs';

//获取菜单
export const getMenu = () =>{return request({url: '/system/menu', method: 'get'})}
//获取访问统计信息
export const getStatistics=()=>{return request({url: '/system/statistics',  method: 'get'})}

//获取全部用户
export const getUsers = params => {return request({url: '/system/users',  method: 'get', params: params})}
//新增/修改用户信息
export const saveUser = params => {return request({url: '/system/save-user',  method: 'post', data: qs.stringify(params)})}
//禁用/删除用户
export const deleteUser = params => {return request({url: '/system/delete-user',  method: 'delete', data: qs.stringify(params)})}
//获取可选角色
export const getActiveRole = () => {return request({url: '/system/active-role',  method: 'get'})}

//获取全部角色
export const getRoles = params => {return request({url: '/system/roles',  method: 'get', params: params})}
//新增/修改角色信息
export const saveRole = params => {return request({url: '/system/save-role',  method: 'post', data: qs.stringify(params, { arrayFormat: 'brackets' })})}
//禁用/删除角色
export const deleteRole = params => {return request({url: '/system/delete-role',  method: 'delete', data: qs.stringify(params)})}
//获取可选权限
export const getActiveAction = params => {return request({url: '/system/active-action',  method: 'get', params: params})}

//获取全部权限
export const getActions = params => {return request({url: '/system/actions',  method: 'get', params: params})}
//新增/修改权限信息
export const saveAction = params => {return request({url: '/system/save-action',  method: 'post', data: qs.stringify(params)})}
//禁用/删除权限
export const deleteAction = params => {return request({url: '/system/delete-action',  method: 'delete', data: qs.stringify(params)})}
//获取可选一级权限
export const getActiveParentAction=()=>{return request({url: '/system/active-parent-action',  method: 'get'})}

