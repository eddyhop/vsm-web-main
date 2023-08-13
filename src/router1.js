import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/main.vue'
import Home from './views/home/home.vue'
import SheBei from './views/basic/device/device.vue'
import zhPath from './views/basic/zhpath/zhpath.vue'
import yinYon from './views/basic/app/app.vue'
import peiZhi from './views/basic/deploy/deployIndex.vue'
import User from './views/setting/user/user.vue'
// import Facility from './views/equipment/facility.vue'
// import SbWatch from './views/watch/sbwatch.vue'
import Alarm from './views/watch/alarm.vue'
import Note from './views/watch/note.vue'
import healthOverview from './views/watch/healthOverview.vue'
import zhControl from './views/setting/zhcontrol/zhcontrol'
import timeSet from './views/setting/timeset.vue'
import upDate from './views/setting/update'
import Login from './views/login/login.vue'
import Vsr from './views/equipment/pages/vsr.vue'
import VsrLite from './views/equipment/pages/vsrLite'
import devLayout from './views/equipment/devLayout'
import devWatch from './views/watch/deviceWatch'
import mobileSetting from './views/setting/mobileSetting/mobileSetting'
import rolePrivileges from './views/setting/rolePrivileges/rolePrivileges'
// import vpnIpAllot from './views/setting/vpnIpAllot/vpnIpAllot'
import cloudAccount from './views/cloud/cloudAccount/cloudAccount'
import cloudNet from './views/cloud/cloudNet/cloudNet'
import cloudDev from './views/cloud/cloudDev/cloudDev'
import cloudVpc from "@/views/cloud/cloudNet/cloudVpc/cloudVPC"
import notFound from "@/views/404.vue"
import { getToken, filterUrl } from '@/utils/cookie'

Vue.use(Router);
let router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      redirect: "/home",
      component: Main,
      meta: { isLogin: true, isMenu: true },
      children: [
        {
          path: '/home',
          name: "home",
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": Home
          }
        },
        {
          path: '/device',
          name: "设备",
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": SheBei
          }
        },
        {
          path: '/zhpath',
          name: "租户路由域",
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": zhPath
          }
        },
        {
          path: '/app',
          name: "应用",
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": yinYon
          }
        },
        {
          path: '/deploy',
          name: '配置',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": peiZhi
          }
        },
        // {
        //   path: '/facility',
        //   name: '设备',
        // Name: 'Device ',
        //   meta: { isLogin: true },
        //   components: {
        //     "main": Facility
        //   },
        // },
        {
          path: '/devLayout',
          name: '设备配置',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": devLayout
          },
        },
        {
          path: '/vsr',
          name: 'vsr',
          meta: { isLogin: true, isMenu: false },
          components: {
            "main": Vsr
          },
        },
        {
          path: '/vsr_lite',
          name: 'vsrLite',
          meta: { isLogin: true, isMenu: false },
          components: {
            "main": VsrLite
          },
        },
        // {
        //   path: '/sbWatch',
        //   name: '设备监控',
        // Name: 'Device Monitoring ',
        //   meta: { isLogin: true },
        //   components: {
        //     "main": SbWatch
        //   }
        // },
        {
          path: '/devWatch',
          name: '设备监控',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": devWatch
          }
        },
        {
          path: '/alarm',
          name: '告警管理',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": Alarm
          }
        },
        {
          path: '/note',
          name: '日志',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": Note
          }
        },
        {
          path: '/cloudAccount',
          name: '云账号管理',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": cloudAccount
          }
        },
        {
          path: '/cloudNet',
          name: '云网络管理',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": cloudNet
          }
        },
        {
          path: '/cloudVpc',
          name: 'VPC管理',
          meta: { isLogin: true },
          components: {
            "main": cloudVpc
          }
        },
        {
          path: '/cloudDev',
          name: '云设备',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": cloudDev
          }
        },
        {
          path: '/user',
          name: '用户管理',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": User
          }
        },
        {
          path: '/zhgl',
          name: '租户管理',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": zhControl
          }
        },
        {
          path: '/timeSet',
          name: '时间设置',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": timeSet
          }
        },
        {
          path: '/update',
          name: '本机升级',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": upDate
          }
        },
        {
          path: '/vsc',
          name: 'vsc管理',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": () => import("@/views/setting/vsc/vsc.vue")
          }
        },
        {
          path: '/identity',
          name: '身份认证',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": () => import("@/views/setting/iden/identity")
          }
        },
        {
          path: '/mobileSeting',
          name: '移动用户设置',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": mobileSetting
          }
        },
        {
          path: '/company',
          name: '移动端地址池分配',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": () => import("@/views/setting/company/company")
          }
        },
        {
          path: '/rolePrivileges',
          name: '角色权限',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": rolePrivileges
          }
        },
        {
          path: '/upgrade',
          name: '设备升级',
          meta: { isLogin: true, isMenu: true },
          components: {
            "main": () => import("@/views/basic/upgrade/upgrade")
          }
        },
        {
          path: '/topu',
          name: '拓扑管理',
          meta: { isLogin: true },
          components: {
            "main": () => import("@/views/topu/topu")
          }
        },
        // {
        //   path: '/topu',
        //   name: '拓扑管理',
        // Name: 'Topology management ',
        //   meta: { isLogin: true },
        //   components: {
        //     "main": () => import("@/views/setting/Tp")
        //   }
        // },
        {
          path: '/tpSet',
          name: '网络拓扑设置',
          meta: { isLogin: true },
          components: {
            "main": () => import("@/views/topu/tpApprove")
          }
        },
        {
          path: '/tenTpSearch',
          name: '租户拓扑查询',
          meta: { isLogin: true },
          components: {
            "main": () => import("@/views/topu/tpApprove")
          }
        },
        {
          path: '/netWorkTopo',
          name: '租户平面网络拓扑设置',
          meta: { isLogin: true },
          components: {
            "main": () => import("@/views/tenantTopo/netWorkTopo/netWorkTopo")
          }
        },
        {
          path: '/tpDevSearch',
          name: '设备搜索',
          meta: { isLogin: true },
          components: {
            "main": () => import("@/views/topu/TpSesource")
          }
        },
        {
          path: '/tpApprove',
          name: '资源审批',
          meta: { isLogin: true },
          components: {
            "main": () => import("@/views/topu/tpApprove")
          }
        },
      ]
    },
    {
      path: "/login",
      name: "登录",
      component: Login
    },
    {
      path: "/404",
      name: "404",
      meta: { isLogin: true },
      component: notFound
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.isLogin) {  // 判断该路由是否需要登录权限
                          // Determine if the routing requires login permission
    if (getToken()) { // 判断是否已经登录
                      // Determine if you are logged in
      next()
    }
    else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
                                          // Takes the route path of the jump as a parameter, and jumps to it after successful login
      })
    }
  }
  else {
    next()
  }
})

export default router
