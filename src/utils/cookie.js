import Cookie from 'js-cookie';
import {postRequest} from "@/utils/index";
import storage from "@/utils/storage";
const key = 'accessToken'
const keyTow = 'refreshToken'
const timing = 20 * 1000 * 60;
// 设置cookie, 过期时间为2个小时
// Set the cookie to expire in 2 hours
// Set the cookie to expire in 2 hours
export function setToken(val) {
  // let date = new Date();
  // let expires = date.getTime() + 2*60*60*1000;
  // date.setTime(expires);
  // Cookie.set(key, val, {expires: date})
//  Cookie.set(key, val[0]);
//  Cookie.set(keyTow, val[1]);

  storage.session.set(key,val[0],timing);
  storage.session.set(keyTow,val[1],timing);
  sessionStorage.setItem("tokenLock", false);
  //sessionStorage.setItem(key, val[0]);
  //sessionStorage.setItem(keyTow, val[1]);

}


// 读取cookie
// Read the cookie
// get cookie
export function getToken() {
 // return Cookie.get(key)
   let accesstoken = storage.session.get(key);
  storage.session.set(key,accesstoken,timing);
  let refreshToken = storage.session.get(keyTow);
  return accesstoken;
  // return sessionStorage.getItem(key);
}

// 读取cookie
// Read the cookie
// get cookie
export function getRefreshToken() {
  //return Cookie.get(keyTow)
  let refreshToken = storage.session.get(keyTow);
  storage.session.set(keyTow,refreshToken,timing);
  let accesstoken = storage.session.get(key);
  return refreshToken;
 // return sessionStorage.getItem(keyTow);
}

//删除cookie
// Delete the cookie
// delete cookie
export function removeToken() {
  // Cookie.remove(key)
  // Cookie.remove(keyTow)
  storage.session.remove(key)
  storage.session.remove(keyTow)

  //sessionStorage.removeItem(key)
  //sessionStorage.removeItem(keyTow)
}

//注销登录
export function logout() {
  return postRequest("/token/logout", {accessToken:getToken(),refreshToken:getRefreshToken()})
}

