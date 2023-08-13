import axios from 'axios'
import Vue from 'vue'
let v = new Vue();
import router from '../router.js';
import {getRefreshToken, getToken, removeToken, setToken} from './cookie'
// import {router} from "@/router"
// create an axios instance
let langHint = sessionStorage.getItem("User-Language") || "en-US";
const service = axios.create({
  baseURL: '/vsm',
  // withCredentials: true, // 跨域请求时发送 cookies
  // WithCredentials: true, sending cookies on cross-domain requests
  timeout: 15000 // request timeout
})

import { Loading } from 'element-ui';
let loading        //定义loading变量
let loadingText = sessionStorage.getItem("lang") || "en";

let lock_token = false;
// Define the loading variable
// let loadingText = sessionStorage.getItem("lang") || "cn";
loadingText === "cn" ? loadingText = '加载中……' : loadingText = "Loading……";
function startLoading() {    //使用Element loading-start 方法
                             // Use the Element Reloading - Start method
  loading = Loading.service({
    lock: true,
    text: loadingText,
    background: 'rgba(0, 0, 0, 0.7)',
  })
}
function endLoading() {    //使用Element loading-close 方法
                           // Use the Element Report-close method
  loading.close()
}
//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
// So what you want to do in showFullScreenLoading() tryHideFullScreenLoading() is merge the requests at the same time.
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
// Declare a variable needloadRequestCount and call the showFullScreenLoading method needloadRequestCount + 1 each time.
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
// Call the tryHideFullScreenLoading() method, needloadingRequestcount-1. Ending loading when needloadRequestCount is 0.
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    toHideLoading()
  }
}
function toHideLoading() {
  let timer;
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    loading.close();
  }, 300);
}

// request interceptor
service.interceptors.request.use(
  config => {
    // 判断是否有登陆态
    // Determine if there is a landing state
    if (getToken()) {
      // 让每个请求携带token
      // Have each request carry tokens
      config.headers['accessToken'] = getToken();
      config.headers['refreshToken'] = getRefreshToken();
      config.headers['User-Language'] = langHint;
    }
    if (config.headers.showLoading !== false) {
      showFullScreenLoading();
    }
    return config
  },
  error => {
    if (config.headers.showLoading !== false) {
      tryHideFullScreenLoading();
    }
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.config.headers.showLoading !== false) {
      tryHideFullScreenLoading();
    }
    const data = response.data
    // sessionStorage.setItem("tokenLock", false);
    if (data.code === 10010||data.code === 10011) {
      lock_token = false;
      v.$message({
        message: 'An error occured. Please try again later.' + data.message,
        type: 'warning'
      })
      // setTimeout(() => {
      //   window.location.href = "/login"
      //   sessionStorage.removeItem("tenantValue")
      // }, 500)
      // removeToken()
    } else if (data.code === 403) {
      router.push({path:"/404"})
      // window.location.href = "/404"
    }
    return data
  },
    async function(err){
      console.log("accessToken 过期----------------")

      // 返回状态码不为200时候的错误处理
      // Does not return status code for error handling when 200
      // Does not return status code for error handling when 200
      // Message.error(err.toString());
      // if(response.config.headers.showLoading !== false){
      tryHideFullScreenLoading();
      // }
      let response = err.response;

      if(response.headers.refresh != "true"||err.response.status === 401){
        /*if(lock_token == true){
          let  now = Date.now();
          let time = 1000;
          while (lock_token){
            if(Date.now() - now > time){
              break;
            }
          }
        }else{

        }*/

        const refresh_token = getRefreshToken();
        //accessToekn 过期  校验 refreshToken
        lock_token = true;
        var res = await axios({
          method: 'post',
          url: `/vsm/token/refresh`,
          params: {token:refresh_token},
          headers: {
            'accessToken': refresh_token,
            'User-Language': langHint,
            'showLoading': '',
          },
          // headers:headers
        });

        const tokens = res.result;
        setToken(tokens);
        lock_token = false;

        ////////////////////////////////////////////////////////////////////////
        const config = response.config ;
        if("post"==config.method || "POST"==config.method){
          let datas = config.data;
          if(datas.indexOf("&")>-1){

            let dataNew = {};
            let args =  datas.split("&");
            args.forEach(item =>{
              if(item!=""){
                let vals = item.split("=");
                let key1 = vals[0];
                let value = vals[1];
                if(value!=""){
                  //value = value.replaceAll("%2C",",")
                  value= value.replace(/(%2C)/g,",");

                  value= value.replace(/(%3D)/g,"=");

                  value= value.replace(/(%2B)/g,"+");

                  value= value.replace(/(%2F)/g,"/");
                }
                dataNew[key1]=value;
              }
            });
            config.data = dataNew;
           /* if(config.data.tenantId){
              config.data.tenantId = sessionStorage.getItem("tenantValue");
            }*/
          }
        }
        const access_token = getToken();
        if(access_token===null||access_token===''){
          return Promise.resolve(err);
        }
        config.headers.accessToken = access_token;
        config.headers.refreshType = "1";

        let data2 = await axios(config);
        return data2;
      }else{
        lock_token = false;
        v.$message({
          message: 'An error occured. ' + response.data.message,
          type: 'warning'
        })
        // setTimeout(() => {
        //   window.location.href = "/login"
        //   sessionStorage.removeItem("tenantValue")
        // }, 500)
        // removeToken()

      }
      return Promise.resolve(err);
    }
)

export default service



