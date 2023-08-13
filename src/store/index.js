import Vue from 'vue';
import Vuex from 'vuex';


// 引入store子模块
// Introduce the store submodule
// Introduce the store submodule

import Login from './modules/login'
import Routing from "./modules/routing"
Vue.use(Vuex);


export default new Vuex.Store({
    modules: {
        Login,
        Routing,
    },
})