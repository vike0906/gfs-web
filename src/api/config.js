import Axios from 'axios';
import {message} from 'ant-design-vue';
import {Modal} from 'ant-design-vue';

let baseURL = process.env.API_ROOT;
const service = Axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    responseType: 'json',
    responseEncoding: 'utf8',
});

// request interceptor
service.interceptors.request.use(
    config => {
      // do something before request is sent
      let user = JSON.parse(sessionStorage.getItem('user'));
      if (user != null && typeof user != 'undefined') {
        // let each request carry token
        config.headers['AuthToken'] = user.Token;
      }
      return config
    },
    error => {
      // do something with request error
      console.log(error); // for debug
      message.error('请求出错', 2);
      return Promise.reject(error);
    }
  )
  
  // response interceptor
  service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
    */
  
    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
      
      const res = response.data;
  
      // if the custom code is not 0, it is judged as an error.
      if(response.config.url.endsWith('captcha')){
        return res;
      }else{
        if (res.code !== 0) {
          // 100: Illegal token;
          if (res.code === 100) {
              // message.error('当前登陆已失效，请重新登陆',2);
              Modal.error({
                title: '重新登陆',
                content: '当前登陆已失效，请重新登陆',
                okText: '确定',
                onOk(){
                  sessionStorage.removeItem('user');
                  location.reload();
                }
              });
              // sessionStorage.removeItem('user');
              // setTimeout(function(){
              //     location.reload();
              // },2000);
          }else{
            message.error(res.message);
          }
          return Promise.reject(new Error(res.message || 'Error'))
        } else {
          return res
        }
      }
    },
    error => {
      console.log('response err' + error) // for debug
      if(error.message.includes('timeout')){   // 判断请求异常信息中是否含有超时timeout字符串
        message.error('网络超时',2);        // reject这个错误信息
      }else{
        message.error('网络请求错误',2);
      }
      return Promise.reject(error);
    }
      
  )
  
  export default service
