import request from '@/api/config';
import qs from 'qs';

//获取A股全部股票基础信息
export const getBase = params => {return request({url: '/stock/base',  method: 'get', params: params})}