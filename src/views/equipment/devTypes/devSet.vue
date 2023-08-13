<template>
  <div class="vsrMain">
    <div class="top">
      <div class="search">
        <!-- <h3>{{$t('vsr100.title[3]')}}<img src="@/assets/icon_right@2x.png" alt=""/><span>{{devData.deviceName}}{{'-'+devData.vsrSeries}}</span></h3> -->
        <div class="back" @click="$router.back(-1)">
          <img src="@/assets/newPage/monitoring_icon_left@2x.png" alt />
        </div>
        <h3>
          {{$t('vsr100.title[4]')}}
          <img src="@/assets/icon_right@2x.png" alt />
          <!-- 11-19 {{'-'+devData.vsrSeries}} -->
          <span>{{devData.deviceName}}</span>
        </h3>
      </div>
      <ul class="vsrTabs">
        <li
          :class="`tabsItem ${item.id===activeIndex ? 'active' : ''} ${lang=='en' ? 'tabsItemEn' : ''}`"
          v-for="(item) in tabsData"
          :key="item.id"
          @click="tabsEvent(item)"
        >{{item.name}}</li>
      </ul>
    </div>
    <div class="tabsCon">
      <component :is="moduleName"></component>
    </div>
  </div>
</template>
<script>

import subscription from "@/views/equipment/pages/subscription/subscription.vue"; 
import vsrPandect from "@/views/equipment/pages/vsrPandect/vsrPandect.vue"; //00设备总览 Equipment overview
                                                                            // Equipment Overview
import linkState from "@/views/equipment/pages/linkState/linkState"; //01链路情况 Link State
                                                                     // 01 Link State
import liteLan from "@/views/equipment/pages/LAN/LAN.vue"; //02LAN
import portMapping from "@/views/equipment/pages/portMapping/portMapping.vue"; //03端口映射 port mapping
                                                                               // Port Mapping
import wifi from "@/views/equipment/pages/wifi/wifi.vue"; //04WIFI
import URL from "@/views/equipment/pages/URL/URL.vue"; //05URL
import InternetAudit from "@/views/equipment/pages/InternetAudit/InternetAudit.vue"; //06上网审计 The Internet audit
                                                                                     // The Internet Audit
import fireWall from "@/views/equipment/pages/fireWall/fireWall.vue"; //07防火墙 firewall
                                                                      // 07 Firewall firewall
import vsrQos from "@/views/equipment/pages/vsrQos/vsrQos.vue"; //08物理设备qos Physical device qos
                                                                // 08 Physical Device qos Physical device qos
import staticRoute from "@/views/equipment/pages/lSTATIC/lSTATIC.vue"; //09静态路由 static route
                                                                       // Static route 09 Static route
import DNS from "@/views/equipment/pages/DNS/DNS.vue"; //10DNS
import diagnosticTools from "@/views/equipment/pages/diagnosticTools/diagnosticTools.vue"; //11诊断工具 diagnostic tools
                                                                                           // 11 Diagnostic Tools
import RepairTools from "@/views/equipment/pages/RepairTools/RepairTools.vue"; //12修复工具 Repair tools
                                                                               // 12. Repair Tools
import ipsec from "@/views/equipment/pages/ipsec/ipsec.vue"; //13ipsec
import physicalPort from "@/views/equipment/pages/physicalPort/physicalPort.vue"; //14物理端口 The physical port
                                                                                  // 14 Physical port The physical port
import logicalPort from "@/views/equipment/pages/logicalPort/logicalPort.vue"; //15逻辑端口 logical port
                                                                               // 15 Logical port
import vsrSTATIC from "@/views/equipment/pages/VSTATIC/VSTATIC.vue"; //16 静态路由 STATIC
import streamGroup from "@/views/equipment/pages/streamGroup/streamGroup.vue"; //17流组 Flow group
                                                                               // Flow group
import QOS from "@/views/equipment/pages/QOS/QOS.vue"; //18cloudQOS
import ACL from "@/views/equipment/pages/ACL/ACL.vue"; //19ACL
import BGP from "@/views/equipment/pages/BGP/BGP.vue"; //20BGP
import GRE from "@/views/equipment/pages/GRE/GRE"; //21GRE
import cloudNetWorkAcc from "@/views/equipment/pages/cloudNetWorkAcc/cloudNetWorkAcc.vue"; //22cloud1000网络加速 network acceleration
                                                                                           // 22Cloud1000 Network Acceleration Network Acceleration
import netWorkAcc from "@/views/equipment/pages/netWorkAcc/netWorkAcc.vue"; //23cloud100网络加速 network acceleration
                                                                            // 23Cloud100 Network Acceleration Network Acceleration
import netWorkLink from "@/views/equipment/pages/lVPN/lvpn.vue"; //24vsr100专网连接 Private network connection
                                                                 // 24VSR100 Private Network Connection
import VVPN from "@/views/equipment/pages/VVPN/VVPN.vue"; //25vsr1000专网连接 Private network connection
                                                          // 25VSR1000 Private Network Connection
import SNAT from "@/views/equipment/pages/SNAT/SNAT.vue"; //26 SNAT
import DNAT from "@/views/equipment/pages/DNAT/DNAT.vue"; //27 DNAT
import rateLimit from "@/views/equipment/pages/rateLimit/rateLimit"; //28速度限制 rate limitation
import SNAT100 from "@/views/equipment/pages/SNAT/SNAT100.vue"; //29 SNAT100
import DNAT100 from "@/views/equipment/pages/DNAT/DNAT100.vue"; //30 DNAT100
import sevenFireWall from "@/views/equipment/pages/SevenFireWall/sevenFireWall.vue"; //31 L7FireWall
import fifthGeneration from "@/views/equipment/pages/communication/fifthGeneration.vue";//32  5G
import RELAN from "@/views/equipment/pages/RELAN/RELAN.vue";//33  VSR1100LAN
import rewifi from "@/views/equipment/pages/wifi/rewifi.vue"; //34  REWIFI
import REDhcp from "@/views/equipment/pages/REDHCP/REdhcp.vue";// 35REDHCP
import reipsec from "@/views/equipment/pages/REIpsec/reipsec.vue";// 36REIPSEC

import physicalPort1100 from "@/views/equipment/pages/physicalPort/physicalPort1100.vue"; //37物理端口 The physical port
import diagnosticTools1100 from "@/views/equipment/pages/diagnosticTools/diagnosticTools1100.vue"; //38诊断工具 diagnostic tools
import RepairTools1100 from "@/views/equipment/pages/RepairTools/RepairTools1100.vue"; //391100修复工具 Repair tools
import zone from "@/views/equipment/pages/zone/zone.vue"; //40 1100   Zone 

// Speed limitation rate limitation
// import liteDhcp from "@/views/equipment/pages/lDHCP/lDHCP.vue";
// import liteVpn from "@/views/equipment/pages/lVPN/lvpn.vue";
// import liteStatic from "@/views/equipment/pages/lSTATIC/lSTATIC.vue";
// import liteAcl from "@/views/equipment/pages/LACL/lAcl.vue";
import {deviceCheckInterface, userInfo} from "@/services";
export default {
  props: {},
  components: {},
  data() {
    return {
      tabsData: [{
          //物理端口
          name: this.$t("vsr1000.physicalInterfaces"),
          id: 14,
          componentNmae: physicalPort,
        },{
          //逻辑端口
          name: this.$t("vsr1000.logicalInterfaces"),
          id: 15,
          componentNmae: logicalPort,
        },{
          //订阅
        name: this.$t("subsc.subscription"),
        id: 41,
        componentNmae: subscription,
      },{
          //静态路由
        name: this.$t("newModel.vsr100.staticRoute"),
        id: 16,
        componentNmae: vsrSTATIC,
      }
      ],
      tabList: [
        {
          //设备总览
          name: this.$t("vsr1000.devTopic"),
          id: 0,
          componentNmae: vsrPandect,
        },
        {
          //链路情况
          name: this.$t("vsr1000.lessCase"),
          id: 1,
          componentNmae: linkState,
        },
        {
          name: "LAN",
          id: 2,
          componentNmae: liteLan,
        },
        {
          //端口映射
          name: this.$t("newModel.vsr100.portMapping"),
          id: 3,
          componentNmae: portMapping,
        },
        {
          name: "Wi-Fi",
          id: 4,
          componentNmae: wifi,
        },
        {
          name: "URL",
          id: 5,
          componentNmae: URL,
        },
        {
          //上网审计
          name: this.$t("newModel.vsr100.InternetAudit"),
          id: 6,
          componentNmae: InternetAudit,
        },
        {
          //防火墙
          name: this.$t("newModel.vsr100.firewall"),
          id: 7,
          componentNmae: fireWall,
        },
        {
          name: "QOS",
          id: 8,
          componentNmae: vsrQos,
        },
        {
          //静态路由
          name: this.$t("newModel.vsr100.staticRoute"),
          id: 9,
          componentNmae: staticRoute,
        },
        {
          name: "DNS",
          id: 10,
          componentNmae: DNS,
        },
        {
          //诊断工具
          name: this.$t("newModel.vsr100.diagnosticTools"),
          id: 11,
          componentNmae: diagnosticTools,
        },
        {
          //修复工具
          name: this.$t("newModel.vsr100.RepairTools"),
          id: 12,
          componentNmae: RepairTools,
        },
        {
          name: "IPSEC",
          id: 13,
          componentNmae: ipsec,
        },
        {
          //物理端口
          name: this.$t("vsr1000.physicalPort"),
          id: 14,
          componentNmae: physicalPort,
        },
        {
          //逻辑端口
          name: this.$t("vsr1000.logicPort"),
          id: 15,
          componentNmae: logicalPort,
        },
        {
          //静态路由
          name: this.$t("newModel.vsr100.staticRoute"),
          id: 16,
          componentNmae: vsrSTATIC,
        },
        {
          //流组
          name: this.$t("vsr1000.flowGroup"),
          id: 17,
          componentNmae: streamGroup,
        },
        {
          name: "QOS",
          id: 18,
          componentNmae: QOS,
        },
        {
          name: "ACL",
          id: 19,
          componentNmae: ACL,
        },
        {
          name: "BGP",
          id: 20,
          componentNmae: BGP,
        },
        {
          name: "GRE",
          id: 21,
          componentNmae: GRE,
        },
        {
          name: "网络加速",
          id: 22,
          componentNmae: cloudNetWorkAcc,
        },
        {
          name: "网络加速",
          id: 23,
          componentNmae: netWorkAcc,
        },
        {
          //专网连接
          name: this.$t("vsr1000.networkLink"),
          id: 24,
          componentNmae: netWorkLink,
        },
        {
          name: this.$t("vsr1000.networkLink"),
          id: 25,
          componentNmae: VVPN,
        },
        {
          name: "SNAT",
          id: 26,
          componentNmae: SNAT,
        },
        {
          name: "DNAT",
          id: 27,
          componentNmae: DNAT,
        },
        {
          //速度限制
          name: this.$t("newModel.vsr100.rateLimitation"),
          id: 28,
          componentNmae: rateLimit,
        },
        {
          name: "SNAT100",
          id: 29,
          componentNmae: SNAT100,
        },
        {
          name: "DNAT100",
          id: 30,
          componentNmae: DNAT100,
        },
        {
          //七层防火墙
          name: this.$t("newModel.vsr1100.sevenFirewall"),
          id: 31,
          componentNmae: sevenFireWall,
        },
        {
          //5G
          name: "LTE",
          id: 32,
          componentNmae: fifthGeneration,
        },
        {
          //RELAN
          name: "LAN",
          id: 33,
          componentNmae: RELAN,
        },
        {
          //REWIFI
          name: "WIFI",
          id: 34,
          componentNmae: rewifi,
        },
        {
          //REDHCP
          name: "DHCP",
          id: 35,
          componentNmae: REDhcp,
        },
        {
          //REIPSEC
          name: this.$t("vsr1000.networkLink"),
          id: 36,
          componentNmae: reipsec,
        },
        {
          name: this.$t("vsr1000.physicalPort"),
          id: 37,
          componentNmae: physicalPort1100,
        },
        {
          name: this.$t("newModel.vsr100.diagnosticTools"),
          id: 38,
          componentNmae: diagnosticTools1100,
        },
        {
          name: this.$t("newModel.vsr100.RepairTools"),
          id: 39,
          componentNmae: RepairTools1100,
        },
        {
          name: "Zone",
          id: 40,
          componentNmae: zone,
        },
      ],
      activeIndex: 14,
      moduleName: physicalPort,
      devData: {},
      lang: sessionStorage.getItem("lang") || "en",
    };
  },
  computed: {
    tabName() {
      return this.moduleName;
    },
  },
  methods: {
    tabsEvent(el) {
      this.activeIndex = el.id;
      this.moduleName = el.componentNmae;
    },
    //tab列表初始化
    // TAB list initialization
    //TAB list initialization
    async tabListInit(data) {
      var userData ;
      await userInfo().then(res => {
        userData = res.result;
      });

     // var userData = JSON.parse(window.sessionStorage.getItem('userData'));
      let vsr100Eage = [];
      let vsr100EageNoWfi = [];
      let vsr1000Transit = [];
      let cloud1000Transit = [];
      let cloud100Edge = [];
      let cloud100Acceleration = [0, 9, 6];
      let tabListSortArr = [];
      //1100
      let vsr1100Transit =[];
      if(userData.username == "vsmAdmin" && userData.tenantName == "default"){
        vsr1100Transit = [0, 1, 14, 16, 17, 18, 19, 20, 21, 31, 32, 33, 34, 36, 38, 39];
        vsr100Eage = [0, 2, 3, 4, 5, 6, 7, 8, 28, 9, 10, 11, 12, 24, 20, 29, 30];
        vsr100EageNoWfi = [0, 2, 3, 5, 6, 7, 8, 28, 9, 10, 11, 12, 24, 20];
        vsr1000Transit = [0, 1, 14, 15, 16, 17, 18, 19, 25, 20, 21, 26, 27,31];
        cloud1000Transit = [0, 1, 16, 14, 15, 17, 18, 19, 25, 20, 26, 27];
        cloud100Edge = [3, 5, 6, 7, 8, 9, 11, 12, 24,20];
      }else{
        vsr1100Transit = [0, 1, 14,16, 32, 33, 34, 36];
        vsr100Eage = [0, 2, 3, 4, 5, 6, 7, 8, 28, 9, 10, 11, 12, 24, 29, 30];
        vsr100EageNoWfi = [0, 2, 3, 5, 6, 7, 8, 28, 9, 10, 11, 12, 24];
        vsr1000Transit = [0, 1, 14, 15, 16, 17, 18, 19, 25, 21, 26, 27];
        cloud1000Transit = [0, 1, 16, 14, 15, 17, 18, 19, 25, 26, 27];
        cloud100Edge = [3, 5, 6, 7, 8, 9, 11, 12, 24];
      }
      switch (data.deviceType) {
        case "vsr100":
          let res = await deviceCheckInterface({
            deviceId: data.deviceId,
            interfaceName: "wifi",
          });
          if (res.result) {
            tabListSortArr = vsr100Eage;
          } else {
            tabListSortArr = vsr100EageNoWfi;
          }
          break;
        case "vsr1000":
          tabListSortArr = vsr1000Transit;
          break;
        case "Cloud-vsr1000":
          tabListSortArr = cloud1000Transit;
          break;
        case "Cloud-vsr100":
          if(data.deviceLocation=="Acceleration Gateway"){
            tabListSortArr = cloud100Acceleration
          }else{
            tabListSortArr = cloud100Edge
          }
          break;
        case "vsr1100":
          if(data.deviceLocation=="NaaS"){
            tabListSortArr = vsr1100Transit;
          }else{
            tabListSortArr = vsr1100Transit;
          }
          break;
        default:
          break;
      }
      // let tabListSortArr = JSON.parse(sessionStorage.getItem("devSortArr"));
      // 注释时间 11-19
      // tabListSortArr.forEach((item) => {
      //   this.tabsData.push(this.tabList.find((el) => el.id == item));
      // });
    },
    // 设备在线检查
    devCheckOnline() {
    let  online = this.query.devData.online;
      if(!online){
        this.$message({
          type: "warning",
          message: this.$t("Configuration.EdgeConfiguration"),
        });
        return ;
      }
      return online;
      // return true;
    }
  },
  created() {
    // this.devData = JSON.parse(sessionStorage.getItem("devData"));
    this.devData = JSON.parse(this.$route.query.devData);
    //console.log(JSON.parse(this.$route.query.devData));
    var a = JSON.parse(this.$route.query.devData);
    this.tabListInit(a);
  },
  watch: {},
  mounted() {
    // console.log(JSON.parse(this.$route.query.devData));
  },
};
</script>
<style scoped lang="scss">
.vsrMain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.top {
  width: 100%;
  padding: 20px 30px;
  background: #fff;
  .search {
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    .back {
      float: left;
      width: 26px;
      height: 26px;
      border-radius: 1px;
      border: 1px solid rgba(209, 215, 224, 1);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 9px;
      cursor: pointer;
      img {
        width: 8px;
        height: 12px;
      }
    }
    h3 {
      float: left;
      font-size: 15px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 26px;
      span {
        font-size: 14px;
        line-height: 8px;
      }
      img {
        width: 5px;
        height: 8px;
        margin-left: 5px;
        margin-right: 5px;
      }
    }
  }
  .vsrTabs {
    width: 100%;
    padding-top: 10px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    // zoom: 1;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    // .back {
    //   float: left;
    //   width: 70px;
    //   height: 34px;
    //   background: #3678c8;
    //   border-radius: 7px;
    //   color:#fff;
    //   // border: 1px solid rgba(209, 215, 224, 1);
    //   margin-right: 36px;
    //   text-align: center;
    //   cursor: pointer;
    //   display: table-cell;
    //   vertical-align: middle;
    //   .backIcon {
    //     display: inline-block;
    //     width: 9px;
    //     height: 14px;
    //     position: relative;
    //     top:1px;
    //     background: url("../../../assets/newPage/icon_back_hover@2x.png") no-repeat;
    //     background-size: cover;
    //   }
    //   span {
    //     padding-left: 3px;
    //     line-height: 34px;
    //   }
    // }
    // .backEn{
    //   height: 34px;
    //   font-size: 13px;
    //   span {
    //     padding-left: 3px;
    //     line-height: 34px;
    //   }
    // }
    // .back:hover {
    //   background: #6095D6;
    //   color:#fff;
    //   border:0;
    //   .backIcon {
    //     background: url("../../../assets/newPage/icon_back_hover@2x.png") no-repeat;
    //     background-size: cover;
    //   }
    // }
    // .tabsList {
    //   float: left;
    .tabsItem {
      // float: left;
      // width: 9%;
      // flex:1;
      flex: 0 0 9.090909%;
      height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      text-align: center;
      // line-height: 34px;
      margin-right: 9px;
      margin-top: 10px;
      transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .tabsItemEn {
      height: 40px;
    }
    .tabsItem:last-of-type {
      margin-right: 0;
    }
    .tabsItem:hover {
      background: #3678c8;
      color: #fff;
      border: 1px solid #3678c8;
    }
    .active {
      background: #3678c8;
      color: #fff;
      border: 1px solid #3678c8;
    }
    .active:hover {
      background: rgba(96, 149, 214, 1);
      border: 1px solid rgba(96, 149, 214, 1);
    }
    // }
    // .tabsListEn{
    //   float: left;
    //   display: flex;
    //   width: calc(100% - 110px);
    //   // width: 106px;
    //   // height: 34px;
    //   padding-right: 30px;
    //   font-size: 13px;
    //   .tabsItem {
    //     // float: left;
    //     width: 106px;
    //     // width: 100%;
    //     height: 34px;
    //     background: rgba(255, 255, 255, 1);
    //     border-radius: 7px;
    //     border: 1px solid rgba(209, 215, 224, 1);
    //     text-align: center;
    //     line-height: 30px;
    //     margin-right: 18px;
    //     transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
    //     cursor: pointer;
    //   }
    //   .tabsItem:last-of-type {
    //     margin-right: 0;
    //   }
    //   .tabsItem:first-of-type,.tabsItem:nth-of-type(1) {
    //     line-height: 30px;
    //   }
    //   .tabsItem:hover {
    //     background: #3678c8;
    //     color: #fff;
    //     border-color: #fff;
    //   }
    //   .active {
    //     background: #3678c8;
    //     color: #fff;
    //     border-color: #fff;
    //   }
    //   .active:hover {
    //     background: rgba(96, 149, 214, 1);
    //     border-color: #fff;
    //   }
    // }
  }
}
.tabsCon {
  width: 100%;
  height: 100%;
  background: #fff;
  margin-top: 20px;
  overflow: auto;
}
.tabsCon::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.tabsCon::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.tabsCon::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>