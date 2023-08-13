import axios from 'axios';
import { getMenuList } from '@/services/index';
import router from '@/router';
import { getToken } from "./cookie.js";
import lazyLoading from './lazyLoading.js';

let plug = {};
plug.initRouter = function (vm) {
    const constRoutes = [];
    const otherRoutes = [];
    //判断用户是否登录
    // Determine if the user is logged in
    //Determine if the user is logged in
    // 404路由需要和动态路由一起加载
    // 404 routes need to be loaded along with dynamic routes
    // 404 routes need to be loaded along with dynamic routes
    const otherRouter = [{
        path: '/*',
        name: 'error-404',
        meta: {
            title: '404-页面不存在'
        },
        component: 'error-page/404'
    }];
    if (!getToken()) {
        return
    }
    getMenuList().then(res => {
        let menuData = res.result;
        if (!menuData) {
            return
        }
        for(var i=0;i<menuData.length;i++){
            if(menuData[i].id=='278730493623537664'){
                menuData[i].children.push({
                    buttonType: "",
                    children: null,
                    component: "watch/healthOverview1",
                    icon: "md-albums",
                    id: "2787308935322336468",
                    level: 2,
                    name: "healthOverview1",
                    parentId: "278730493623537664",
                    path: "healthOverview1",
                    permTypes: [],
                    showAlways: true,
                    title: "健康概览",
                    titleEnglish: "Health Overview",
                    type: 0,
                    url: ""
                })
            }
        }
        //保存左侧菜单信息
        // Save the left menu information
        //Save the left menu information
        window.sessionStorage.setItem('menuData', JSON.stringify(menuData));
        let allMenuData = menuData
        // menuData.forEach(el => {
        //     if (el.type == -1) {
        //         el.children.forEach(item => {
        //             allMenuData.push(item);
        //         });
        //     }
        //     // allMenuData.push(el)
        // });

        //let type = JSON.parse(sessionStorage.getItem("userData")).type
        let _tenantId = sessionStorage.getItem("tenantValue");
        if (_tenantId == '') {
            allMenuData.forEach(item => {
                if (item.path == '/setting') {
                    item.children = item.children.filter(el => el.path != 'company' && el.path != 'mobileSeting')
                }
            })
            allMenuData = allMenuData.filter(item=>item.path!='/network')
        }
        allMenuData.forEach(item=>{
            if(item.path=="/network"){
                item.children = item.children.filter(el=>el.path != "gatewayLink")
            }
        })
        // allMenuData.forEach(item=>{
        //     if(item.path=="/base"){
        //         item.children = item.children.filter(el=>el.path != 'zhpath' && el.path != 'deploy')
        //     }else if(item.path == '/network'){
        //         allMenuData = allMenuData.filter(el=>el.path != '/network')
        //     }else if(item.path == '/setting'){
        //         item.children = item.children.filter(el=>el.path != 'largeScreen' && el.path != 'cloudAccount')
        //     }
        // })
        vm.$store.commit('updateMenulist', allMenuData)
        // plug.initAllMenuData(constRoutes, menuData);
        plug.initRouterNode(constRoutes, menuData);
        // plug.initRouterNode(otherRoutes, otherRouter);
        plug.updateAppRouter(constRoutes.filter(item => item.children.length > 0))
        // plug.updateAppRouter(otherRoutes)

    })
}
// //过滤路由
// Filter route
// //Filter route
// plug.initAllMenuData = function (constRoutes, data) {

//     let allMenuData = [];
//     // data.forEach(e => {
//     //     if (e.type == -1) {
//     //         e.children.forEach(item => {
//     //             allMenuData.push(item);
//     //         })
//     //     }
//     //     // allMenuData.push(e)
//     // })
//     allMenuData = data
//     plug.initRouterNode(constRoutes, allMenuData);
// }
// 生成路由节点
// Generate routing nodes
// Generate routing nodes
plug.initRouterNode = function (routers, data) {
    for (var item of data) {
        let menu = Object.assign({}, item);
        menu.component = lazyLoading(menu.component);
        // menu.component = menu.component
        if (item.children && item.children.length > 0) {
            menu.children = [];
            plug.initRouterNode(menu.children, item.children);
        }
        let meta = {};
        // 给页面添加权限、标题、第三方网页链接
        // Add permissions, titles, and links to third-party web pages
        // Add permissions, titles, and links to third-party web pages
        meta.permTypes = menu.permTypes ? menu.permTypes : null;
        meta.title = menu.title ? menu.title + " - Datacheck" : null;
        meta.url = menu.url ? menu.url : null;
        menu.meta = meta;
        routers.push(menu);
    }
};
// 动态添加全局路由
// Add global routing dynamically
// Add global routing dynamically
plug.updateAppRouter = function (routes) {
    router.addRoutes(routes);
}
//判断路由权限
// Determine routing permissions
//Determine routing permissions
plug.toJudgePage = function (routes, to, next) {
    let menuList = []
    menuList = JSON.parse(sessionStorage.getItem("menuData"))
    let routesList = menuList.concat(routes)
    // console.log(routesList)
    let pathArr = []
    routesList.forEach(item => {
        if (item.children && item.children.length === 1) {
            if (item.children[0].name == "home_index") {
                pathArr.push('/' + item.name)
            } else {
                pathArr.push('/' + item.name + '/' + item.children[0].path)
            }
        } else if (item.children && item.children.length > 1) {
            item.children.forEach(el => {
                pathArr.push('/' + item.name + '/' + el.path)
            })
        }
        else {
            pathArr.push('/' + item.name)
        }
    })
    
    // console.log(Array.from(new Set(pathArr)).includes(to.path), Array.from(new Set(pathArr)), to.path)
    // console.log(to, 'qwer')
    if (Array.from(new Set(pathArr)).includes(to.path)) {
        next()
    } else {
        next({
            path: '/404',
        })
    }
}
//防抖函数
// Image stabilization function
//Image stabilization function
plug.debounce = function (func, wait) {
    let timer;
    return function () {
        let context = this; // 注意 this 指向 //Notice that this points to
                            // Notice that this points to
        let args = arguments; // arguments中存着e //I have E in arguments
                              // E I have E in arguments

        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            func.apply(this, args)
        }, wait)
    }
}
export default plug;