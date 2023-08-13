import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import echarts from 'echarts'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale';
import VueI18n from 'vue-i18n';
import messages from './assets/lang/index';
import plug from "@/utils/plug"
import IdleVue from "idle-vue";

// import "./utils/rem"
import 'default-passive-events'
const eventsHub = new Vue();
Vue.prototype.$bus = new Vue()
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
Vue.use(VueI18n)
Vue.use(IdleVue, {
    eventEmitter: eventsHub,
    store,
    idleTime: 10 * 60 * 1000, // minutes * seconds * milliseconds
    startAtIdle: false
});
Vue.config.productionTip = false


// import DonMessage from './utils/message'
// Vue.prototype.$message = DonMessage
import {
  message
} from './utils/message'
Vue.prototype.$message = message;

if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/mockworker')
  worker.start()
}
//全局自定义指令
// Global custom instructions
//防抖
// Image stabilization
Vue.directive('debounce', {//防抖函数指令
                           // Buffeting function instruction
  inserted: function(el, binding) {
    let timer;
    el.addEventListener("click", () => {
      if (timer) {
        clearTimeout(timer);
      }
       timer = setTimeout(() => {
      //关键点:vue 的自定义指令传递的参数binding 如果是一个函数,则通过      binding.value()来执行,通过上述示例,还可以传递比如事件, 绑定对象之类的
      // Binding.value () if the vUE is a function, the parameter binding is passed by binding.value(). In the example above, events, binding objects, etc
        binding.value('form');
      }, 500);
    });
  }
})
Vue.directive('control', {//页面按钮权限
                          // Page button permissions
    inserted: function (el, binding) {
      let permission = '';//JSON.parse(sessionStorage.getItem('userData')).permissionName
      if(permission=='读写'){
         el.disabled=false
      }else if(permission=='只读'){
         el.disabled=true
         el.style.background='#EFEFEF'
         el.style.color='#979797'
         el.style.border='none'
      }
    }
})

const i18n = new VueI18n({
  locale: sessionStorage.getItem("lang") ||'en', // 语言标识

  // locale: sessionStorage.getItem("lang") ||'cn', // 语言标识
  // Language identification
  messages,
})
locale.i18n((key, value) => i18n.t(key, value))

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
  mounted() {
    plug.initRouter(this)
  },
}).$mount('#app')
