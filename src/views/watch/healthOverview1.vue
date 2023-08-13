<template>
  <div class="vsrMain">
    <div class="top">
      <div class="search">
        <!-- <h3>{{$t('vsr100.title[3]')}}<img src="@/assets/icon_right@2x.png" alt=""/><span>{{devData.deviceName}}{{'-'+devData.vsrSeries}}</span></h3> -->
       <!--
        <div class="back" @click="$router.back(-1)">
          <img src="@/assets/newPage/monitoring_icon_left@2x.png" alt />
        </div>
        -->
        <h3>
          {{$t('Monit.monitoring')}}
          <img src="@/assets/icon_right@2x.png" alt />
          <span>{{$t('Monit.healthOverview')}}</span>
        </h3>
      </div>
      <el-row>
        <el-col :span="12" style="font-family: arial, sans-serif; padding-top:20px;">
          {{$t('Monit.edgeName')}}
          <el-select filterable size="small" v-model="edgeName" @change="edgeChange" clearable >
            <el-option
                v-for="item in edgeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <ul class="vsrTabs">
            <li
              :class="`tabsItem ${item.id===activeIndex ? 'active' : ''} ${lang=='en' ? 'tabsItemEn' : ''}`"
              v-for="(item) in tabsData"
              :key="item.id"
              @click="tabsEvent(item)"
            >{{item.name}}</li>
            <!-- </dd> -->
          </ul>
        </el-col>
      </el-row>
    </div>
    <div class="tabsCon" v-if="edgeName">
      <component :is="moduleName"></component>
    </div>
    <div class="tabsCon" v-else>
      <div style="padding:250px 0;text-align: center;">
        <div><img width="100" src="data:image/png;base64,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"></div>
        <div style="font-family: arial, sans-serif; font-size:14px;line-height:50px;color:#666666;">{{$t('Monit.edgeInfo')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import proHealthOverview from "@/views/watch/components/proHealthOverview/proHealthOverview.vue";
import interfaceStatus from "@/views/watch/components/interfaceStatus/interfaceStatus.vue";
import vpnStatus from "@/views/watch/components/vpnStatus/vpnStatus.vue";
import forwardingTable from "@/views/watch/components/forwardingTable/forwardingTable.vue";
import pingTest from "@/views/watch/components/pingTest/pingTest.vue";
import {getDevSelect,getDevice} from "@/services";

export default {
  props: {},
  components: {},
  data() {
    return {
      edgeName:"",
      edgeList:[],
      edgeType:"",
      tabsData: [{
          //健康概览
          name: this.$t("Monit.healthOverview"),
          id: 0,
          componentNmae: proHealthOverview,
        },{
          //接口状态
          name: this.$t("Monit.interfaceStatus"),
          id: 1,
          componentNmae: interfaceStatus,
        },{
          //VPN状态
        name: this.$t("Monit.vpnStatus"),
        id: 2,
        componentNmae: vpnStatus,
      },{
          //转发表
        name: this.$t("Monit.forWardingTable"),
        id: 3,
        componentNmae: forwardingTable,
      },{
          //Ping测试
        name: this.$t("Monit.pingTest"),
        id: 4,
        componentNmae: pingTest,
      }
      ],
      tabList: [
        {
          //健康概览
          name: this.$t("Monit.healthOverview"),
          id: 0,
          componentNmae: proHealthOverview,
        },
        {
          //接口状态
          name: this.$t("Monit.interfaceStatus"),
          id: 1,
          componentNmae: interfaceStatus,
        },
        {
          //VPN状态
          name: this.$t("Monit.vpnStatus"),
          id: 2,
          componentNmae: vpnStatus,
        },
        {
          //转发表
          name: this.$t("Monit.forwardingTable"),
          id: 3,
          componentNmae: forwardingTable,
        },
        {
          //Ping测试
          name: this.$t("Monit.pingTest"),
          id: 4,
          componentNmae: pingTest,
        }
      ],
      activeIndex: 0,
      moduleName: null,
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
    async  tabListInit(data) {
      var vsr1100Transit=[];
      var vsr100Eage=[];
      var vsr100EageNoWfi=[];
      var vsr1000Transit=[];
      var cloud1000Transit=[];
      var cloud100Edge=[];
      var userData = JSON.parse(window.sessionStorage.getItem('userData'));
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
    },
    async edgeListInit() {
      let tenantId = JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId;
       getDevSelect({ tenantId: tenantId }).then((res) => {
        this.edgeList = res.result;
        //  if(this.edgeList.length>0){
        //    this.edgeName = this.edgeList[0].id;
        //    this.getDeviceinfo(this.edgeName);
        //  }
      });
    },
    getDeviceinfo(deviceId){
      getDevice({ deviceId: deviceId }).then((data) => {
        let  res = data.result;
        this.devData = res;
        this.edgeType = res.deviceType;

        let params = {
          deviceId: res.id,
          deviceType: res.deviceType,
          deviceName: res.deviceName,
          vsrSeries: res.deviceSerialNumber,
          tenantId: res.tenantId,
        };
        this.$router.push({
          path: "/watch/healthOverview",
          query: { devData: JSON.stringify(params) },
        });

        this.moduleName=this.tabsData[this.activeIndex].componentNmae;
      });
    }
    ,
    edgeChange(){
      this.moduleName = null;
      this.getDeviceinfo(this.edgeName );
    }
  },
   created() {
     this.edgeListInit();
     this.tabListInit();
  },
  watch: {},
  mounted() {
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
      flex: 0.2;
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