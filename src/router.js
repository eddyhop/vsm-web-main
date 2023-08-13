import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/main.vue'
import { getToken } from '@/utils/cookie'
import plug from "@/utils/plug";
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
Vue.use(Router);
// let childrenRouter = [
//   {
//     path: '/home',
//     name: "home",
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/home/home.vue")
//     }
//   },
//   {
//     path: '/device',
//     name: "设备",
// Name: "Equipment ",
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/basic/device/device.vue")
//     }
//   },
//   {
//     path: '/zhpath',
//     name: "租户路由域",
// Name: "Tenant routing Domain ",
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/basic/zhpath/zhpath.vue")
//     }
//   },
//   {
//     path: '/app',
//     name: "应用",
// Name: "Apply ",
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/basic/app/app.vue")
//     }
//   },
//   {
//     path: '/deploy',
//     name: '配置',
// Name: 'Configure ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/basic/deploy/deployIndex.vue")
//     }
//   },
//   {
//     path: '/devLayout',
//     name: '设备配置',
// Name: 'Device configuration ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/equipment/devLayout")
//     },
//   },
//   {
//     path: '/vsr',
//     name: 'vsr',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/equipment/pages/vsr.vue")
//     },
//   },
//   {
//     path: '/vsr_lite',
//     name: 'vsrLite',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/equipment/pages/vsrLite")
//     },
//   },
//   {
//     path: '/devWatch',
//     name: '设备监控',
// Name: 'Device Monitoring ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/watch/deviceWatch")
//     }
//   },
//   {
//     path: '/alarm',
//     name: '告警管理',
// Name: 'Alarm Management ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/watch/alarm.vue")
//     }
//   },
//   {
//     path: '/note',
//     name: '日志',
// Name: 'Log ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/watch/note.vue")
//     }
//   },
//   {
//     path: '/cloudAccount',
//     name: '云账号管理',
// Name: 'Cloud Account Management ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/cloud/cloudAccount/cloudAccount")
//     }
//   },
//   {
//     path: '/cloudNet',
//     name: '云网络管理',
// Name: 'Cloud Network Management ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/cloud/cloudNet/cloudNet")
//     }
//   },
//   {
//     path: '/cloudVpc',
//     name: 'VPC管理',
// Name: 'VPC Management ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/cloud/cloudNet/cloudVpc/cloudVPC")
//     }
//   },
//   {
//     path: '/cloudDev',
//     name: '云设备',
// Name: 'Cloud Device ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/cloud/cloudDev/cloudDev")
//     }
//   },
//   {
//     path: '/user',
//     name: '用户管理',
// Name: 'User management ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/setting/user/user.vue")
//     }
//   },
//   {
//     path: '/zhgl',
//     name: '租户管理',
// Name: 'Tenant Management ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/setting/zhcontrol/zhcontrol")
//     }
//   },
//   {
//     path: '/timeSet',
//     name: '时间设置',
// Name: 'Time Settings ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/setting/timeset.vue")
//     }
//   },
//   {
//     path: '/update',
//     name: '本机升级',
// Name: 'Native upgrade ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/setting/update")
//     }
//   },
//   {
//     path: '/vsc',
//     name: 'vsc管理',
// Name: 'VSC Management ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/setting/vsc/vsc.vue")
//     }
//   },
//   {
//     path: '/identity',
//     name: '身份认证',
// Name: 'Identity Authentication ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/setting/iden/identity")
//     }
//   },
//   {
//     path: '/mobileSeting',
//     name: '移动用户设置',
// Name: 'Mobile User Settings ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/setting/mobileSetting/mobileSetting")
//     }
//   },
//   {
//     path: '/largeScreen',
//     name: '大屏页面设置',
// Name: 'Large screen Page Settings ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/setting/largeScreen/largeScreen")
//     }
//   },
//   {
//     path: '/company',
//     name: '移动端地址池分配',
// Name: 'Mobile address pool allocation ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/setting/company/company")
//     }
//   },
//   {
//     path: '/rolePrivileges',
//     name: '角色权限',
// Name: 'Role permissions ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/setting/rolePrivileges/rolePrivileges")
//     }
//   },
//   {
//     path: '/upgrade',
//     name: '设备升级',
// Name: 'Device Upgrade ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/basic/upgrade/upgrade")
//     }
//   },
//   {
//     path: '/topu',
//     name: '拓扑管理',
// Name: 'Topology management ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/topu/topu")
//     }
//   },
//   // {
//   //   path: '/topu',
//   //   name: '拓扑管理',
// Name: 'Topology management ',
//   //   meta: { isLogin: true },
//   //   components: {
//   //     "main": () => import("@/views/setting/Tp2")
//   //   }
//   // },
//   // {
//   //   path: '/tpSet',
//   //   name: '网络拓扑设置',
// Name: 'Network Topology Settings ',
//   //   meta: { isLogin: true },
//   //   components: {
//   //     "main": () => import("@/views/topu/tpApprove")
//   //   }
//   // },
//   // {
//   //   path: '/tenTpSearch',
//   //   name: '租户拓扑查询',
// Name: 'Tenant topology Query ',
//   //   meta: { isLogin: true },
//   //   components: {
//   //     "main": () => import("@/views/topu/tpApprove")
//   //   }
//   // },
//   {
//     path: '/netWorkTopo',
//     name: '租户平面网络拓扑设置',
// Name: 'Tenant flat Network Topology Settings ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/tenantTopo/netWorkTopo/netWorkTopo")
//     }
//   },
//   {
//     path: '/netWorkIssue',
//     name: '租户拓扑网络发布',
// Name: 'Tenant topology network Publishing ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/tenantTopo/netWorkTopo/networkIssue/networkIssue")
//     },
//   },
//   {
//     path: '/tpDevSearch',
//     name: '骨干平面资源管理',
// Name: 'Backbone Plane Resource Management ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/tenantTopo/TpSesource/TpSesource")
//     }
//   },
//   {
//     path: '/tpApprove',
//     name: '租户平面资源审批',
// Name: 'Tenant flat Resource approval ',
//     meta: { isLogin: true },
//     components: {
//       "main": () => import("@/views/backboneTopu/tpApprove/tpApprove")
//     }
//   },
// ];
let routes = [
  {
    path: '/',
    name: 'home',
    redirect: "/home",
    component: Main,
    children: [
      {
        path: 'home',
        name: "home_index",
        component: () => import("@/views/home/home.vue")
      },
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/login.vue"),
    children: []
  },
  {
    path: "/devSet",
    name: "devSet",
    component: Main,
    children: [
      {
        path: 'allocation',
        name: "allocation",
        component: () => import("@/views/equipment/devTypes/devSet.vue")
      },
    ]
  },
  {
    path: "/mobileSet",
    name: "mobileSet",
    component: Main,
    children: [
      {
        path: 'cilentConfig',
        name: "cilentConfig",
        component: () => import("@/views/setting/mobileSetting/clientConfiguration.vue")
      },
      {
        path: 'groupConfig',
        name: "groupConfig",
        component: () => import("@/views/setting/mobileSetting/groupConfiguration.vue")
      },
      {
        path: 'connConfig',
        name: "connConfig",
        component: () => import("@/views/setting/mobileSetting/connectionConfiguration.vue")
      }
    ]
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error-page/404.vue"),
    children: []
  },
  {
    path: "/netWorkDevSet",
    name: "netWorkDevSet",
    component: () => import("@/views/network/devSetPage/netWorkVsrMain.vue"),
    children: []
  },
  {
    path: "/healthOverview",
    name: "healthOverview",
    component: () => import("@/views/watch/healthOverview.vue"),
    children: []
  },
  {
    path: "/healthOverview1",
    name: "healthOverview1",
    component: () => import("@/views/watch/healthOverview1.vue"),
    children: []
  },
  {
    path: "/backboneplane",
    name: "backboneplane",
    component: () => import("@/views/watch/backboneplane.vue"),
    children: []
  }
]
let router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  isAddDynamicMenuRoutes: false,
  routes: routes
})
router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !getToken()) {
    // 判断是否已经登录且前往的页面不是登录页
    // Determine if you are logged in and heading to a page that is not a login page
    next({
      name: 'login'
    });
  } else if (to.name === 'login' && getToken()) {
    // 判断是否已经登录且前往的是登录页
    // Determines whether you are logged in and headed to the login page
    next({
      name: 'home_index'
    });
  } else {
    next()
    if (getToken()) {
      plug.toJudgePage(routes, to, next)
    }
  }
})
export default router
