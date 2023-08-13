<template>
  <div class="home">
    <div class="top">
      <linkVsr :data="siteVPN" class="link"></linkVsr>
      <linkVsrCloud :data="clientVPN" class="link"></linkVsrCloud>
      <edgeState :data="vsrNum" class="link"></edgeState>
    </div>
    <div class="middle">
      <!---
      <rank :type="cpuRank" :m="cpu" class="link"></rank>
      <rank :type="weekRank" :m="consume" class="link"></rank>
      <rank :type="memoryRank" :m="memory" class="link"></rank>
      <rank :type="linkRank" :m="loss" class="link"></rank>
      -->
      <sortBy style="height: 100%"></sortBy>
    </div>
    <!-- <div class="footer">
      <rateWatch></rateWatch>
    </div> -->
  </div>
</template>
<script>
import linkVsr from "./components/linkVsr"; //Site VPNs 连接总数
import linkVsrCloud from "./components/linkVsrCloud"; //连接总数 Client VPNs
import edgeState from "./components/edgeState"; //在线设备数量
import rateWatch from "./components/rateWatch"; //速率监控
import sortBy from "./components/sortBy"; //排行
import {
  getLinkNum,
  getCpuMemoryRank,
  getFlowLinkRank,
  getVpnsNum,
  deviceRankingInit
} from "../../services/index"; //获取vsr和vsr_cloud的数据 获取排行数据
                               // Get the data of VSR and VSR_cloud

export default {
  data() {
    return {
      vsrNum: "",
      VsrCloudNum: "",
      siteVPN: "",
      clientVPN: "",
      cpuRank: {
        type: this.$t("Home.cpu"),
        type2: this.$t("Home.cpu"),
        content: this.$t("Home.cpuLoad"),
        default: this.$t("Home.hint1"),
        name:'1'
      },
      weekRank: {
        type: this.$t("Home.flow"),
        type2: this.$t("Home.tenantFlow"),
        content: this.$t("Home.traffic"),
        default: this.$t("Home.hint2"),
        name:'2'
      },
      memoryRank: {
        type: this.$t("Home.memory"),
        type2: this.$t("Home.memory"),
        content: this.$t("Home.usage"),
        default: this.$t("Home.hint3"),
        name:'1'
      },
      linkRank: {
        type: this.$t("Home.link"),
        type2: this.$t("Home.link"),
        content: this.$t("Home.packet"),
        default: this.$t("Home.hint4"),
        name:'1'
      },
      memory: [],
      cpu: [],
      loss: [],
      consume: []
    };
  },
  methods: {
    // 单位换算
    // Unit conversion
    bytesToSize(bytes) {
      if (bytes === 0) return "0.00 B";
      var k = 1024;
      var sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      var i = Math.floor(Math.log(bytes) / Math.log(k));
      // return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
      return parseFloat(bytes / Math.pow(k, i)).toFixed(2) + sizes[i];
    },
    // 获取连接总数
    // Get total number of connections
    getLinkNums(params) {
      getLinkNum(params).then(res => {
        if (res.code === 10000 && res.result !== null) {
          this.vsrNum = res.result.vsr0001;
          this.VsrCloudNum = res.result.vsr0002;
        }
      });
    },
    getVpnNum(params){
      getVpnsNum(params).then(res => {
        if (res.code === 10000 && res.result !== null) {
          this.siteVPN = res.result.siteVpn;
          this.clientVPN = res.result.clientVpn;
        }
      });
      /*
      if(params.tenantId && params.tenantId === "") {
        let tenantsList = JSON.parse(sessionStorage.getItem('tenantsList'));
        let totalMobileConnections = 0;
        tenantsList && tenantsList.map((tenant) => {
          params.tenantId = tenant.id;
          getVpnsNum(params).then(res => {
          if (res.code === 10000 && res.result !== null) {
            totalMobileConnections += Number(res.result.clientVpn);
            console.log(Number(res.result.clientVPN));
            console.log(res.result.clientVPN);
            }
          });
          this.clientVPN = totalMobileConnections;
          console.log("TOTAL  : " + totalMobileConnections)
        })
      }
      */
    },
    async CpuMemoryRankDataInit(params) {
      let CpuMemoryRank = await getCpuMemoryRank(params);

      // 获取CPU和内存排行
      // Gets CPU and memory rankings
      if (CpuMemoryRank.code === 10000 && CpuMemoryRank.result !== null) {
        CpuMemoryRank.result.cpu.sort((a, b) => {
          let aa = Number(a.data);
          let bb = Number(b.data);
          return bb - aa;
        });
        CpuMemoryRank.result.memory.sort((a, b) => {
          let aa = Number(a.data);
          let bb = Number(b.data);
          return bb - aa;
        });
        CpuMemoryRank.result.cpu = CpuMemoryRank.result.cpu.filter(item => {
          return item.name !== null && item.name !== "";
        });
        CpuMemoryRank.result.memory = CpuMemoryRank.result.memory.filter(
          item => {
            return item.name !== null && item.name !== "";
          }
        );
        let arr1 = CpuMemoryRank.result.cpu.slice(0, 5);
        let arr2 = CpuMemoryRank.result.memory.slice(0, 5);
        this.cpu = [];
        this.memory = [];
        if (arr1.length >= 1) {
          arr1.forEach((item, index) => {
            let num = Number(item.data).toFixed(2) + "%";
            this.cpu.push({ rank: index + 1, name: item.name, load: num });
          });
        }
        if (arr2.length >= 1) {
          arr2.forEach((item, index) => {
            let num = Number(item.data).toFixed(2) + "%";
            this.memory.push({ rank: index + 1, name: item.name, load: num });
          });
        }
      }
    },
    async FlowLinkRankDataInit(params) {
      let FlowLinkRank = await getFlowLinkRank(params);
      // 获取流量和链路状态排行
      // Gets traffic and link status rankings
      if (FlowLinkRank.code === 10000 && FlowLinkRank.result !== null) {
        FlowLinkRank.result.consume.sort((a, b) => {
          let aa = Number(a.data);
          let bb = Number(b.data);
          return bb - aa;
        });
        FlowLinkRank.result.loss.sort((a, b) => {
          let aa = Number(a.data);
          let bb = Number(b.data);
          return bb - aa;
        });
        FlowLinkRank.result.consume = FlowLinkRank.result.consume.filter(
          item => {
            return item.name !== null && item.name !== "";
          }
        );
        FlowLinkRank.result.loss = FlowLinkRank.result.loss.filter(item => {
          return item.name !== null && item.name !== "";
        });
        let arr1 = FlowLinkRank.result.consume.slice(0, 5);
        let arr2 = FlowLinkRank.result.loss.slice(0, 5);
        this.consume = [];
        this.loss = [];
        if (arr1.length >= 1) {
          arr1.forEach((item, index) => {
            let num = this.bytesToSize(Number(item.data));
            this.consume.push({
              rank: index + 1,
              name: item.name,
              load: num
            });
          });
        }
        if (arr2.length >= 1) {
          arr2.forEach((item, index) => {
            let num = Number(item.data).toFixed(2) + "%";
            this.loss.push({ rank: index + 1, name: item.name, load: num });
          });
        }
      }
    },
    rankingInit(params){
     deviceRankingInit(params);
    }
  },
  created() {
    
   // this.type = JSON.parse(sessionStorage.getItem("userData")).type;
   // this.id =JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId || "";
    this.id = sessionStorage.getItem("tenantValue");
    let params = {
      userType: this.type,
      tenantId: this.id
    };
    this.getLinkNums(params);
    this.getVpnNum(params);
    // this.CpuMemoryRankDataInit(params);
    // this.rankingInit(params);

  },
  components: {
    linkVsr,
    linkVsrCloud,
    edgeState,
    rateWatch,
    sortBy
  }
};
</script>
<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
  border-radius: 7px 2px 0px 0px;
  padding-left: 20px;
  .top {
    width: 100%;
    overflow: hidden;
    border-radius: 7px;
    .link {
      float: left;
      margin-right: 20px;
    }
    .link:nth-child(3) {
      margin-right: 0px;
    }
  }
  .middle {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin-top: 20px;
    border-radius: 7px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
    .link {
      width: calc(25% - 15px);
      float: left;
      margin-right: 20px;
    }
    .link:nth-child(4) {
      margin-right: 0px;
    }
  }
  .footer {
    margin-top: 20px;
    width: 100%;
    // height: calc(100% - 425px);
    // height: 45.6%;
  }
  @media screen and (max-width: 1440px) {
    .footer {
      height: 355px;
    }
  }
  @media screen and (min-width: 1441px) {
    .footer {
      height: calc(100% - 425px);
      min-height: 355px;
    }
  }
}
</style>