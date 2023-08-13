import axios from 'axios';
// import { getStore, setStore } from './storage';
import Vue from 'vue'
let v = new Vue();
import router  from '../router.js';
// import { Message } from 'iview';
import { tryHideFullScreenLoading, showFullScreenLoading } from './request'
import { getToken, removeToken , getRefreshToken ,setToken} from './cookie'
// import Cookies from 'js-cookie';
// 统一请求路径前缀
// Uniform request path prefix
// Uniform request path prefix
let base = '/vsm';
let langHint = sessionStorage.getItem("User-Language") || "en-US";
// 超时设定
// timeouts
// Uniform request path prefix timeout setting
axios.defaults.timeout = 15000;

axios.interceptors.request.use(config => {
    if (config.headers.showLoading !== false) {
        showFullScreenLoading();
    }
    return config;
}, err => {
    // Message.error('请求超时');
    // Message.error(' request timeout ');
    // Message.error('The request timeout');
    if (config.headers.showLoading !== false) {
        tryHideFullScreenLoading();
    }
    return Promise.resolve(err);
});

// http response 拦截器
// HTTP Response interceptors
// http response interceptor
axios.interceptors.response.use(response => {
    if (response.config.headers.showLoading !== false) {
        tryHideFullScreenLoading();
    }
    const data = response.data
    //sessionStorage.setItem("tokenLock", false);
    if (data.code === 10010||data.code === 10001 || data.code === 10011) {
       let isRefresf = sessionStorage.getItem("refresfError")
        if("true"===isRefresf){
            console.log("多并发返回请求----------------")
        }else{
            v.$message({
                message: 'An error occured. Please try again later. ' + data.message,
                type: 'warning'
            })
            if (data.message === "Incorrect TOKEN") {
                setTimeout(() => {
                    removeToken()
                    sessionStorage.removeItem("tenantValue")
                    window.location.href = "/login"
                }, 500)
            }
        }
        // removeToken()
        // sessionStorage.setItem("refresfError", "true");
    } else if (data.code === 403) {
        // window.location.href = "/404"
        router.push({path:"/404"})
    }
    return data;
}, async function(err){
    console.log("accessToken 过期----------------")
    // let  lock_token = sessionStorage.getItem("tokenLock");
    // 返回状态码不为200时候的错误处理
    // Does not return status code for error handling when 200
    // Does not return status code for error handling when 200
    // Message.error(err.toString());
    // if(response.config.headers.showLoading !== false){
    tryHideFullScreenLoading();
    // }
    let response = err.response;

    if(response.config.url.indexOf("/logout")>-1){
        return Promise.resolve(err);
    }
    if(response.headers.refresh != "true"||err.response.status === 401){
       /* if(lock_token){
            let  now = Date.now();
            let time = 5000;
            while (lock_token){
                lock_token = sessionStorage.getItem("tokenLock");
                if(Date.now() - now > time){
                    break;
                }
            }
        }else{

            sessionStorage.setItem("tokenLock", false);
        }*/

        const refresh_token = getRefreshToken();
        //accessToekn 过期  校验 refreshToken
        //sessionStorage.setItem("tokenLock", true);
        var res = await axios({
            method: 'post',
            url: `${base}/token/refresh`,
            params: {token:refresh_token},
            headers: {
                'accessToken': refresh_token,
                'User-Language': langHint,
                'showLoading': '',
            },
        });

        const tokens = res.result;
        setToken(tokens);
        ////////////////////////////////////////////////////////////////////////
        console.log("123123123--")
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
                    /*if(config.data.tenantId){
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
        v.$message({
            message: 'An error occured. Please try again later.' + response.data.message,
            type: 'warning'
        })
        // setTimeout(() => {
        //     window.location.href = "/login"
        //     sessionStorage.removeItem("tenantValue")
        // }, 500)
        // removeToken()
    }
    return Promise.resolve(err);
});



export const getRequest = (url, params, headers) => {
    let accessToken = getToken();
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params,
        headers: {
            'accessToken': accessToken,
            'User-Language': langHint,
            'showLoading': headers,
            'refreshType':"0",
        },
        // headers:headers
    });
};

export const postRequest = (url, params, headers) => {
    let accessToken = getToken();
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accessToken': accessToken,
            'refreshType':"0",
            'User-Language': langHint,
            'showLoading': headers

        }
    });
};

export const postRequestToDownloadZip = (url, params, headers) => {
    let accessToken = getToken();
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        responseType: "blob",
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accessToken': accessToken,
            'refreshType':"0",
            'User-Language': langHint,
            'showLoading': headers
        }
    });
};

export const putRequest = (url, params) => {
    let accessToken = getToken();
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accessToken': accessToken,
            'refreshType':"0",
            'User-Language': langHint,
        }
    });
};

export const deleteRequest = (url, params) => {
    let accessToken = getToken();
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        params: params,
        headers: {
            'accessToken': accessToken,
            'refreshType':"0",
            'User-Language': langHint,
        }
    });
};

// export const importRequest = (url, params) => {
//     let accessToken = getToken();
//     return axios({
//         method: 'post',
//         url: `${base}${url}`,
//         data: params,
//         headers: {
//             'accessToken': accessToken
//         }
//     });
// };

// export const uploadFileRequest = (url, params) => {
//     let accessToken = getToken();
//     return axios({
//         method: 'post',
//         url: `${base}${url}`,
//         params: params,
//         headers: {
//             'accessToken': accessToken,
//             'Content-Type': 'multipart/form-data'
//         }
//     });
// };

async function forToken(response){
    const refresh_token = getRefreshToken();
    //accessToekn 过期  校验 refreshToken
    lock_token = true;
   var res = await axios({
        method: 'post',
        url: `${base}/token/refresh`,
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
        console.log("accessToken 过期 发送 refreshToken 校验")
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
                        dataNew[key1]=value;
                    }
                });
                config.data = dataNew;
                if(config.data.tenantId){
                    config.data.tenantId = sessionStorage.getItem("tenantValue");
                }
            }
        }
        const access_token = getToken();
        config.headers.accessToken = access_token;
        config.headers.refreshType = "1";

        let data = await axios(config);
        return data;
}
