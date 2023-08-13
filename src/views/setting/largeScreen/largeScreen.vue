<template>
  <!-- 大屏页面设置 -->
  <div class="largeScreen">
    <div class="title">
      <h3>
        {{$t('TenServiceSet.set')}}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{$t('newModel.large.tit')}}</span>
      </h3>
      <button :class="lang=='en' ? 'defaultEn default' : 'default'" v-debounce.prevent="resetData">{{$t('newModel.large.RestoreDefault')}}</button>
    </div>
    <div class="largeLink">
      <h3 class="Tit">
        <span>{{$t('newModel.large.BigLink')}}</span>
      </h3>
      <div>
        <el-input v-model="screenURL" style="width:349px;text-algin:center" disabled></el-input>
        <button @click="jump">{{$t('newModel.large.getInto')}}</button>
      </div>
    </div>
    <baseSet ref="baseSet" />
    <!-- <chartSet ref="chartSet" /> -->
    <!-- <div class="monitoring">
      <h3 class="Tit">
        <span>重点监控对象设置</span>
        <div class="btns">
          <button @click="keyPointIsEdit=!keyPointIsEdit">
            <img src="@/assets/newPage/Icon-bianji@2x.png" alt />编辑
          </button>
          <button v-debounce.prevent="submitForm">
            <img src="@/assets/newPage/Icon-baocun@2x.png" alt />保存
          </button>
        </div>
      </h3>
      <div class="keyPoint">
        <h3>重点设备（限5个）</h3>
        <ul class="keyList">
          <li class="keyItemDev" v-for="(item,index) in keyPointDevs" :key="item.id">
            <el-tooltip placement="left" :content="item.deviceName">
              <p>{{item.deviceName}}</p>
            </el-tooltip>
            <el-tooltip placement="left" :content="item.deviceSeries">
              <p>{{item.deviceSeries}}</p>
            </el-tooltip>
            <span class="devClose" v-show="keyPointIsEdit" @click="removeDev(index)">×</span>
          </li>
          <li
            :class=" keyPointIsEdit && keyPointDevs.length<5 ? 'addKeyItemDev' : 'addKeyItemDev active'"
            @click="addKeyPointDev"
          >
            <img src="@/assets/newPage/big_icon_add@2x.png" alt />
          </li>
        </ul>
      </div>
      <div class="keyPoint">
        <h3>重点链路（限5个）</h3>
        <ul class="keyList">
          <li class="keyItemLink" v-for="(item,index) in keyPointlinks" :key="item.id">
            <el-tooltip placement="left" :content="item.linkName">
              <p>{{item.linkName}}</p>
            </el-tooltip>
            <el-tooltip placement="left" :content="item.deviceSeriesOne">
              <p>{{item.deviceSeriesOne}}</p>
            </el-tooltip>
            <el-tooltip placement="left" :content="item.deviceSeriesTwo">
              <p>{{item.deviceSeriesTwo}}</p>
            </el-tooltip>
            <span class="devClose" v-show="keyPointIsEdit" @click="removeLink(index)">×</span>
          </li>
          <li :class=" keyPointIsEdit && keyPointlinks.length<5 ? 'addKeyItemLink' : 'addKeyItemLink active'"
          @click="addKeyPointLink">
            <img src="@/assets/newPage/big_icon_add@2x.png" alt />
          </li>
        </ul>
      </div>
    </div> -->
    <addDevice ref="addDevice" v-show="devShow" />
    <addLink ref="addLink" v-show="linkShow" />
  </div>
</template>
<script>
import baseSet from "./components/baseSet";
import chartSet from "./components/chartSet";
import addDevice from "./components/addDevice";
import addLink from "./components/addLink";
import {
  screenSettingGetSetInfo,
  vsmScreenSettingMajorMonitorSet,
  vsmScreenSettingRestore,
  vsmScreenSetSkipToScreen
} from "@/services";
import { getToken } from "@/utils/cookie";
export default {
  components: {
    baseSet,
    chartSet,
    addDevice,
    addLink
  },
  data() {
    return {
      lang:sessionStorage.getItem("lang") || "en",
      keyPointDevs: [],//重点设备
                       // The key equipment
      keyPointlinks: [],//重点链路
                        // The key link
      chartSetrules: {},
      screenURL: "www.iLinkAll_bmw.com",//跳转的地址
                                        // Jump address
      linkShow: false,
      devShow: false,
      keyPointIsEdit: false //重点监控对象是否编辑
                            // Focus on monitoring whether the object is edited
    };
  },
  methods: {
    //点击跳转大屏前端
    // Click to jump to the front of the large screen
    jump() {
      // if (
      //   this.$refs.baseSet.baseIsEdit &&
      //   this.$refs.chartSet.chartsIsEdit &&
      //   !this.keyPointIsEdit
      // ) {
        let loginData = JSON.parse(sessionStorage.getItem("loginData"));
        let jsonObject = {
          // username: loginData.username,
          password: loginData.password,
          // token: ""
        };
        vsmScreenSetSkipToScreen(jsonObject).then(res => {
          if (res.code === 10000) {
            let token = getToken();
            let tenantId = JSON.parse(sessionStorage.getItem('userData')).tenantId
            let Id = JSON.parse(sessionStorage.getItem('userData')).userId
            window.open(
              this.screenURL + "?token=" + res.result + "&tenantId=" + tenantId + "&userId=" + Id + "&screenURL=" + this.screenURL
            );
          }
        });
      // } else {
      //   this.$message({
      //     type: "warning",
      //     message: this.$t('newModel.large.msg2')
      //   });
      // }
    },
    //新增重点设备
    // New key equipment
    addKeyPointDev() {
      if (this.keyPointIsEdit && this.keyPointDevs.length<5) {
        this.devShow = true;
        this.$refs.addDevice.dataInit(this.keyPointDevs);
      }
    },
    //新增重点链路
    // New key link
    addKeyPointLink() {
      if (this.keyPointIsEdit && this.keyPointlinks.length<5) {
        this.linkShow = true;
        this.$refs.addLink.dataInit(this.keyPointlinks);
      }
    },
    //恢复默认值
    // Restore default values
    resetData() {
      vsmScreenSettingRestore({
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
      }).then(res => {
        if (res.code === 10000) {
          this.dataInit({
            tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
          });
        }
      });
    },
    //重点监控对象保存
    // Focus on monitoring object saving
    submitForm() {
      let params = {
        id: "",
        majorDevices: this.keyPointDevs.map(item => item.id),
        majorLinks: this.keyPointlinks.map(item => item.id),
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
      };
      vsmScreenSettingMajorMonitorSet(params).then(res => {
        if (res.code === 10000) {
          this.dataInit({
            tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
          });
          this.keyPointIsEdit = false;
          this.$message({
            type: "success",
            message: "设置成功"
          });
        }
      });
    },
    //删除重点链路
    // Delete key links
    removeLink(index) {
      var show89 = localStorage.getItem("show89");
      if(show89 == 'true'){
        this.keyPointlinks.splice(index, 1);
        this.$refs.addLink.dataInit(this.keyPointlinks);
      }else{
        this.$confirm(this.$t("vsr1000.qosremind[1]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue89\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          this.keyPointlinks.splice(index, 1);
          this.$refs.addLink.dataInit(this.keyPointlinks);
          localStorage.setItem("show89",localStorage.getItem("checkedValue89"));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("vsr1000.qosremind[2]")
          });
        });
        }
    },
    //删除重点设备
    // Delete key devices
    removeDev(index) {
      var show90 = localStorage.getItem("show90");
      if(show90 == 'true'){
        this.keyPointDevs.splice(index, 1);
      }else{
        this.$confirm(this.$t("vsr1000.qosremind[1]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue90\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          this.keyPointDevs.splice(index, 1);
          localStorage.setItem("show90",localStorage.getItem("checkedValue90"));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("vsr1000.qosremind[2]")
          });
        });
        }
    },
    //获取大屏页面配置信息
    // Gets big-screen page configuration information
    dataInit(params) {
      screenSettingGetSetInfo(params).then(res => {
        if (res.code === 10000) {
          //基础设置
          // infrastructure
          this.$refs.baseSet.baseForm.titleName = res.result.titleName;
          this.$refs.baseSet.baseForm.timeZone = res.result.timeZone;
          this.$refs.baseSet.baseForm.indexMap = res.result.indexMap;
          this.$refs.baseSet.baseForm.sonMap = res.result.sonMap;
          this.$refs.baseSet.baseForm.companyName = res.result.companyName;
          //图表设置
          // The chart is set
          // this.$refs.chartSet.chartSetForm.linkDelay_x = res.result.linkDelay_x;
          // this.$refs.chartSet.chartSetForm.linkDelayRenew =
          //   res.result.linkDelayRenew;
          // this.$refs.chartSet.chartSetForm.linkDelayHigh =
          //   res.result.linkDelayHigh;
          // this.$refs.chartSet.chartSetForm.linkDelayMid =
          //   res.result.linkDelayLow;
          // this.$refs.chartSet.chartSetForm.linkDelayLow =
          //   res.result.linkDelayLow;
          // this.$refs.chartSet.redLink = "x>=" + res.result.linkDelayHigh;
          // this.$refs.chartSet.yellowLink =
          //   res.result.linkDelayLow + "<=" + "x<" + res.result.linkDelayHigh;
          // this.$refs.chartSet.greenLink = "x<" + res.result.linkDelayLow;
          // this.$refs.chartSet.chartSetForm.linkLoss_x = res.result.linkLoss_x;
          // this.$refs.chartSet.chartSetForm.linkLossRenew =
          //   res.result.linkLossRenew;
          // this.$refs.chartSet.chartSetForm.total_x = res.result.total_x;
          // this.$refs.chartSet.chartSetForm.totalRenew = res.result.totalRenew;
          // this.$refs.chartSet.chartSetForm.warning_x = res.result.warning_x;
          // this.$refs.chartSet.chartSetForm.warningRenew =
          //   res.result.warningRenew;
          // this.$refs.chartSet.chartSetForm.cpu_x = res.result.cpu_x;
          // this.$refs.chartSet.chartSetForm.cpuRenew = res.result.cpuRenew;
          // this.$refs.chartSet.chartSetForm.cpuHigh = res.result.cpuHigh;
          // this.$refs.chartSet.chartSetForm.cpuLow = res.result.cpuLow;
          // this.$refs.chartSet.chartSetForm.cpuMid = res.result.cpuLow;
          // this.$refs.chartSet.redCpu = "y>=" + res.result.cpuHigh + "%";
          // this.$refs.chartSet.yellowCpu =
          //   res.result.cpuLow + "%" + "<=" + "y<" + res.result.cpuHigh + "%";
          // this.$refs.chartSet.greenCpu = "y<" + res.result.cpuLow + "%";
          // this.$refs.chartSet.chartSetForm.ram_x = res.result.ram_x;
          // this.$refs.chartSet.chartSetForm.ramRenew = res.result.ramRenew;
          // this.$refs.chartSet.chartSetForm.ramHigh = res.result.ramHigh;
          // this.$refs.chartSet.chartSetForm.ramLow = res.result.ramLow;
          // this.$refs.chartSet.chartSetForm.ramMid = res.result.ramLow;
          // this.$refs.chartSet.redRam = "z>=" + res.result.ramHigh + "%";
          // this.$refs.chartSet.yellowRam =
          //   res.result.ramLow + "%" + "<=" + "z<" + res.result.ramHigh + "%";
          // this.$refs.chartSet.greenRam = "z<" + res.result.ramLow + "%";
          // this.$refs.chartSet.chartSetForm.rtMonitorRenew =
          //   res.result.rtMonitorRenew;
          // this.$refs.chartSet.chartSetForm.topPeriod = res.result.topPeriod;
          // this.$refs.chartSet.chartSetForm.id = res.result.id;
          //重点监控对象设置
          // Focus on monitoring object Settings
          this.keyPointDevs =
            res.result.majorDevices == null
              ? []
              : res.result.majorDevices.map(item => {
                  return {
                    id: item.id,
                    deviceName: item.name.split(",")[0],
                    deviceSeries: item.name.split(",")[1]
                  };
                });
          this.keyPointlinks =
            res.result.majorLinks == null
              ? []
              : res.result.majorLinks.map(item => {
                  return {
                    id: item.id,
                    linkName: item.name.split(",")[0],
                    deviceSeriesOne: item.name.split(",")[1],
                    deviceSeriesTwo: item.name.split(",")[2]
                  };
                });
          this.screenURL = res.result.screenURL;
        }
      });
    }
  },
  created() {
    this.dataInit({
      tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
    });
  }
};
</script>
<style lang="scss" scoped>
.largeScreen {
  width: 100%;
  height: 100%;
  overflow: auto;
  .title {
    width: 100%;
    height: auto;
    background: white;
    padding: 20px 30px;
    position: relative;
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    h3 {
      float: left;
      padding-top: 7px;
      font-size: 15px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
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
    .default {
      float: right;
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: 0;
      outline: none;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
    .defaultEn{
      height: 40px;
    }
  }
}
.largeScreen::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.largeScreen::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.largeScreen::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.monitoring {
  width: 100%;
  background: #fff;
  padding: 18px 20px 0 30px;
  margin-top: 20px;
}
.largeLink {
  width: 100%;
  background: #fff;
  padding: 18px 20px 20px 30px;
  margin-top: 20px;
  button {
    width: 80px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: 0;
    outline: none;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
    margin-left: 20px;
  }
}
.Tit {
  width: 100%;
  padding-bottom: 16px;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  span {
    float: left;
    font-size: 18px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    position: relative;
    padding-left: 6px;
  }
  span:after {
    content: "";
    position: absolute;
    top: 5px;
    left: 0px;
    width: 2px;
    height: 16px;
    background: rgba(54, 120, 200, 1);
  }
}
.btns {
  float: right;
  button {
    width: 80px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: 0;
    outline: none;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    margin-left: 18px;
    img {
      width: 14px;
      height: 14px;
      margin-right: 6px;
      position: relative;
      top: 1px;
    }
  }
}
.keyPoint {
  h3 {
    font-size: 18px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-bottom: 14px;
  }
  .keyList {
    padding-left: 20px;
    padding-bottom: 20px;
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    .keyItemDev {
      float: left;
      width: 134px;
      height: 80px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      text-align: center;
      position: relative;
      margin-right: 34px;
      p {
        width: 100%;
        padding: 0 16px;
        font-size: 18px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 36px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .devClose {
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
        width: 16px;
        height: 16px;
        background: rgba(209, 215, 224, 1);
        border-radius: 0px 2px 0px 0px;
        text-align: center;
        line-height: 13px;
        font-size: 20px;
        color: #fff;
      }
    }
    .keyItemLink {
      float: left;
      width: 134px;
      height: 111px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      text-align: center;
      position: relative;
      margin-right: 34px;
      padding-top: 12px;
      p {
        width: 100%;
        padding: 0 16px;
        font-size: 18px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 28px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .devClose {
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
        width: 16px;
        height: 16px;
        background: rgba(209, 215, 224, 1);
        border-radius: 0px 2px 0px 0px;
        text-align: center;
        line-height: 13px;
        font-size: 20px;
        color: #fff;
      }
    }
    .addKeyItemDev {
      cursor: pointer;
      float: left;
      width: 134px;
      height: 80px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 34px;
        height: 34px;
      }
    }
    .addKeyItemLink {
      cursor: pointer;
      float: left;
      width: 134px;
      height: 111px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 34px;
        height: 34px;
      }
    }
    .active {
      background: #F5F7FA;
    }
  }
}
</style>
<style lang="scss">
.largeLink .el-input {
  .el-input__inner {
    text-align: center;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }
  .el-input__icon {
    line-height: normal;
  }
}
</style>
