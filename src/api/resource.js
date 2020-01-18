import request from '@/api/config';
import qs from 'qs';
//获取全部资源
export const gainResource = params => {return request({url: '/resource/gain',  method: 'get', params: params})}
//删除资源
export const deleteResource = params => {return request({url: '/resource/delete',  method: 'delete', params: params})}
//获取上传token
export const accreditUpload = params => {return request({url: '/resource/accredit/upload',  method: 'get', params: params})}
//获取下载token
export const accreditDownload = params => {return request({url: '/resource/accredit/download',  method: 'get', params: params})}