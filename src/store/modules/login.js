

//数据
// data
//data

const state = {
    userData:{},
    menuList:[]
};

//同步操作
// Synchronous operation
//synchronous operation
const mutations = {
    getUserData(state,payload){
        // console.log(payload,"。。。。。。。。。。。。。。。。。。")
        state.userData=payload
    },
    updateMenulist(state, routes) {
        state.menuList = routes;
    },
};

//异步操作
// Asynchronous operations
//asynchronous working
const actions = {
  




};

export default {
    state,
    mutations,
    actions
};
