<template>
  <!-- 网络设备配置 -->
  <div class="netWorkVsrMain">
    <h1 class="logo">
      <img src="@/assets/logo.png" alt />
    </h1>
    <Head />
    <div class="content">
      <div class="top">
        <div class="search">
          <!-- <h3>{{$t('vsr100.title[3]')}}<img src="@/assets/icon_right@2x.png" alt=""/><span>{{devData.deviceName}}{{'-'+devData.vsrSeries}}</span></h3> -->
          <!-- <div class="back" @click="$router.back(-1)">
          <img src="@/assets/newPage/monitoring_icon_left@2x.png" alt />
          </div>-->
          <h3>
            <!-- {{$t('vsr100.title[3]')}}
            <img src="@/assets/icon_right@2x.png" alt />-->
            <span>{{devData.deviceName}}{{'-'+devData.vsrSeries}}</span>
          </h3>
        </div>
        <ul :class="lang=='en' ? 'vsrTabsEn vsrTabs' : 'vsrTabs'">
          <!-- <dt :class="`back ${lang == 'en' ? 'backEn' : ''}`" @click="$router.back(-1)">
          <i class="backIcon"></i>
          <span>{{$t('vsr100.title[0]')}}</span>
        </dt>
          <dd :class="`tabsList ${lang =='en' ? 'tabsListEn' : ''  }`">-->
          <li
            :class="`tabsItem ${item.id===activeIndex ? 'active' : ''}`"
            v-for="(item) in tabsData"
            :key="item.id"
            @click="tabsEvent(item)"
          >{{item.name}}</li>
          <!-- </dd> -->
        </ul>
      </div>
      <div class="tabsCon">
        <component :is="moduleName"></component>
      </div>
    </div>
  </div>
</template>
<script>
import Head from "@/components/Head.vue";
import vsrPandect from "@/views/equipment/pages/vsrPandect/vsrPandect.vue"; //00设备总览
                                                                            // Equipment Overview
import linkState from "@/views/equipment/pages/linkState/linkState"; //01链路情况
                                                                     // 01 Link condition
import liteLan from "@/views/equipment/pages/LAN/LAN.vue"; //02LAN
import portMapping from "@/views/equipment/pages/portMapping/portMapping.vue"; //03端口映射
                                                                               // 03 port mapping
import wifi from "@/views/equipment/pages/wifi/wifi.vue"; //04WIFI
import URL from "@/views/equipment/pages/URL/URL.vue"; //05URL
import InternetAudit from "@/views/equipment/pages/InternetAudit/InternetAudit.vue"; //06上网审计
                                                                                     // 06 Online audit
import fireWall from "@/views/equipment/pages/fireWall/fireWall.vue"; //07防火墙
                                                                      // 07 firewall
import vsrQos from "@/views/equipment/pages/vsrQos/vsrQos.vue"; //08物理设备qos
                                                                // Physical device qos
import staticRoute from "@/views/equipment/pages/lSTATIC/lSTATIC.vue"; //09静态路由
                                                                       // 09 Static routing
import DNS from "@/views/equipment/pages/DNS/DNS.vue"; //10DNS
import diagnosticTools from "@/views/equipment/pages/diagnosticTools/diagnosticTools.vue"; //11诊断工具
                                                                                           // 11 Diagnostic Tools
import RepairTools from "@/views/equipment/pages/RepairTools/RepairTools.vue"; //12修复工具
                                                                               // 12 Repair Tools
import ipsec from "@/views/equipment/pages/ipsec/ipsec.vue"; //13ipsec
import physicalPort from "@/views/equipment/pages/physicalPort/physicalPort.vue"; //14物理端口
                                                                                  // 14 Physical port
import logicalPort from "@/views/equipment/pages/logicalPort/logicalPort.vue"; //15逻辑端口
                                                                               // 15 Logical port
import vsrSTATIC from "@/views/equipment/pages/VSTATIC/VSTATIC.vue"; //16STATIC
import streamGroup from "@/views/equipment/pages/streamGroup/streamGroup.vue"; //17流组
                                                                               // 17 flow group
import QOS from "@/views/equipment/pages/QOS/QOS.vue"; //18cloudQOS
import ACL from "@/views/equipment/pages/ACL/ACL.vue"; //19ACL
import BGP from "@/views/equipment/pages/BGP/BGP.vue"; //20BGP
import GRE from "@/views/equipment/pages/GRE/GRE"; //21GRE
import cloudNetWorkAcc from "@/views/equipment/pages/cloudNetWorkAcc/cloudNetWorkAcc.vue"; //22cloud1000网络加速
                                                                                           // 22cloud1000 network acceleration
import netWorkAcc from "@/views/equipment/pages/netWorkAcc/netWorkAcc.vue"; //23cloud100网络加速
                                                                            // 23cloud100 network acceleration
import netWorkLink from "@/views/equipment/pages/lVPN/lvpn.vue"; //24vsr100专网连接
                                                                 // 24VSR100 private network connection
import VVPN from "@/views/equipment/pages/VVPN/VVPN.vue"; //25vsr1000专网连接
                                                          // 25VSR1000 private network connection
import SNAT from "@/views/equipment/pages/SNAT/SNAT.vue"; //26 SNAT
import DNAT from "@/views/equipment/pages/DNAT/DNAT.vue"; //27 DNAT
import rateLimit from "@/views/equipment/pages/rateLimit/rateLimit"; //28速度限制
                                                                     // 28 Speed limit
// import liteDhcp from "@/views/equipment/pages/lDHCP/lDHCP.vue";
// import liteVpn from "@/views/equipment/pages/lVPN/lvpn.vue";
// import liteStatic from "@/views/equipment/pages/lSTATIC/lSTATIC.vue";
// import liteAcl from "@/views/equipment/pages/LACL/lAcl.vue";
import { deviceCheckInterface } from "@/services";
export default {
  props: {},
  components: {},
  data() {
    return {
      lang: sessionStorage.getItem("lang") || "en",
      tabsData: [],
      tabList: [
        {
          name: this.$t("vsr1000.devTopic"),
          id: 0,
          componentNmae: vsrPandect
        },
        {
          name: this.$t("vsr1000.lessCase"),
          id: 1,
          componentNmae: linkState
        },
        {
          name: "LAN",
          id: 2,
          componentNmae: liteLan
        },
        {
          name: this.$t('newModel.vsr100.portMapping'),
          id: 3,
          componentNmae: portMapping
        },
        {
          name: "Wi-Fi",
          id: 4,
          componentNmae: wifi
        },
        {
          name: "URL",
          id: 5,
          componentNmae: URL
        },
        {
          name: this.$t('newModel.vsr100.InternetAudit'),
          id: 6,
          componentNmae: InternetAudit
        },
        {
          name: this.$t('newModel.vsr100.firewall'),
          id: 7,
          componentNmae: fireWall
        },
        {
          name: "QOS",
          id: 8,
          componentNmae: vsrQos
        },
        {
          name: this.$t('newModel.vsr100.staticRoute'),
          id: 9,
          componentNmae: staticRoute
        },
        {
          name: "DNS",
          id: 10,
          componentNmae: DNS
        },
        {
          name: this.$t('newModel.vsr100.diagnosticTools'),
          id: 11,
          componentNmae: diagnosticTools
        },
        {
          name: this.$t('newModel.vsr100.RepairTools'),
          id: 12,
          componentNmae: RepairTools
        },
        {
          name: "IPSEC",
          id: 13,
          componentNmae: ipsec
        },
        {
          name: this.$t("vsr1000.physicalPort"),
          id: 14,
          componentNmae: physicalPort
        },
        {
          name: this.$t('vsr1000.logicPort'),
          id: 15,
          componentNmae: logicalPort
        },
        {
          name: "STATIC",
          id: 16,
          componentNmae: vsrSTATIC
        },
        {
          name: this.$t("vsr1000.flowGroup"),
          id: 17,
          componentNmae: streamGroup
        },
        {
          name: "QoS",
          id: 18,
          componentNmae: QOS
        },
        {
          name: "ACL",
          id: 19,
          componentNmae: ACL
        },
        {
          name: "BGP",
          id: 20,
          componentNmae: BGP
        },
        {
          name: "GRE",
          id: 21,
          componentNmae: GRE
        },
        {
          name: "网络加速",
          id: 22,
          componentNmae: cloudNetWorkAcc
        },
        {
          name: "网络加速",
          id: 23,
          componentNmae: netWorkAcc
        },
        {
          name: this.$t("vsr1000.networkLink"),
          id: 24,
          componentNmae: netWorkLink
        },
        {
          name: this.$t("vsr1000.networkLink"),
          id: 25,
          componentNmae: VVPN
        },
        {
          name: "SNAT",
          id: 26,
          componentNmae: SNAT
        },
        {
          name: "DNAT",
          id: 27,
          componentNmae: DNAT
        },
        {
          name: this.$t('newModel.vsr100.rateLimitation'),
          id: 28,
          componentNmae: rateLimit
        }
      ],
      activeIndex: 0,
      moduleName: vsrPandect,
      devData: {},
      lang: sessionStorage.getItem("lang")
    };
  },
  components: {
    Head
  },
  computed: {
    tabName() {
      return this.moduleName;
    }
  },
  methods: {
    tabsEvent(el) {
      this.activeIndex = el.id;
      this.moduleName = el.componentNmae;
    },
    //tab列表初始化
    // TAB list initialization
    async tabListInit(data) {
      let vsr100Eage = [0, 2, 3, 4, 5, 6, 7, 8, 28, 9, 10, 11, 12, 24, 20];
      let vsr100EageNoWfi = [0, 2, 3, 5, 6, 7, 8, 28, 9, 10, 11, 12, 24, 20];
      let vsr1000Transit = [0, 1, 14, 15, 16, 17, 18, 19, 25, 20, 21, 26, 27];
      let cloud1000Transit = [0, 1, 16, 14, 15, 17, 18, 19, 25, 20, 26, 27];
      let cloud100Edge = [3, 5, 6, 7, 8, 9, 11, 12, 24,20];
      let cloud100Acceleration = [0, 9, 6];
      let tabListSortArr = [];
      switch (data.deviceType) {
        case "vsr100":
          let res = await deviceCheckInterface({
            deviceId: data.deviceId,
            interfaceName: "wifi",
          });
          if (res.reuslt) {
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
        default:
          break;
      }
      // let tabListSortArr = JSON.parse(sessionStorage.getItem("devSortArr"));
      tabListSortArr.forEach(item => {
        this.tabsData.push(this.tabList.find(el => el.id == item));
      });
    }
  },
  created() {
    this.devData = JSON.parse(this.$route.query.devData);
    this.tabListInit(JSON.parse(this.$route.query.devData));
  },
  watch: {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.netWorkVsrMain {
  width: 100%;
  height: 100%;
  position: relative;
  background: rgba(234, 238, 244, 1);
}
.logo {
  position: absolute;
  top: 13px;
  left: 40px;
  width: 153px;
  height: 34px;
  z-index: 10;
  img {
    width: 100%;
    height: 100%;
  }
}
.content {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  padding: 30px;
}
.top {
  width: 100%;
  padding-bottom: 20px;
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
    .tabsItem {
      // float: left;
      // width: 9%;
      flex: 1;
      // flex: 0 0 9.090909%;
      height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      // line-height: 34px;
      margin-right: 9px;
      margin-top: 10px;
      transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
      cursor: pointer;
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
  }
  .vsrTabsEn{
    .tabsItem{
      height: 42px;
      // line-height: 20px;
    }
  }
}
.tabsCon {
  width: 100%;
  height: 100%;
  background: #fff;
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