<template>
  <!-- 新增Edge -->
  <div class="addEdge">
    <div :class="lang=='en' ? 'contentEn content' : 'content'">
      <h4 class="title">
        <span>{{$t('netWork.AddPortMapping')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="eventList">
        <ul class="steps">
          <li class="stepItem">
            <b class="active">1</b>
            <span>{{$t('netWork.EdgeNode')}}</span>
          </li>
          <li class="line"></li>
          <li class="stepItem">
            <b>2</b>
            <span>{{$t('netWork.LanPort')}}</span>
          </li>
          <li class="line"></li>
          <li class="stepItem">
            <b>3</b>
            <span>{{$t('netWork.SetupNetworkSegment')}}</span>
          </li>
          <!-- <li class="line"></li> -->
          <!-- <li class="stepItem">
            <b>4</b>
            <span>专网连接设置</span>
          </li>-->
        </ul>
        <!-- <keep-alive>
        <component :is="moduleName"></component>
        </keep-alive>-->
        <edgeSelect ref="edgeSelect" v-show="activeIndex===0" />
        <lanSet ref="lanSet" v-show="activeIndex===1" />
        <intranetSet ref="intranetSet" v-show="activeIndex===2" />
        <div class="submit">
          <button
            class="cancel"
            @click.prevent="close"
            v-show="activeIndex===0"
          >{{$t('vsr1000.cancel')}}</button>
          <!-- <button class="save" v-debounce.prevent="submitForm">下一步</button> -->
          <button class="prev" @click="prevEvent" v-show="activeIndex>0">{{$t('netWork.lastStep')}}</button>
          <button
            class="save"
            @click.prevent="submitForm"
          >{{activeIndex !== 2 ? $t('netWork.nextStep') : $t('DeviceMan.save')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import edgeSelect from "./components/edgeSelect";
import lanSet from "./components/lanSet";
import intranetSet from "./components/intranetSet";
// import netWorkSet from "./components/netWorkSet";
import { sceneNodeAddEdge } from "@/services";
export default {
  data() {
    return {
      lang: sessionStorage.getItem("lang") || "en",
      isCloud:null,
      activeIndex: 0,
      moduleName: edgeSelect,
      stepsList: [
        {
          id: 0,
          componentNmae: edgeSelect,
        },
        {
          id: 1,
          componentNmae: lanSet,
        },
        {
          id: 2,
          componentNmae: intranetSet,
        },
        // {
        //   id: 3,
        //   componentNmae: netWorkSet
        // }
      ],
      netData: {
        sceneId: "",
        netDeviceId: "",
        sceneDeviceId: "",
      },
      rowData: {},
    };
  },
  components: {
    edgeSelect,
    lanSet,
    intranetSet,
  },
  methods: {
    //单选设置
    // The radio set
    chaneCheck() {
      let params = {
        pageNumber: 1,
        pageSize: 10,
        deviceId: sessionStorage.getItem("edgeDevId"),
      };
      this.$refs.lanSet.dataInit();
      this.$refs.intranetSet.dataInit(params);
    },
    submitForm() {
      let stepsList = Array.from(document.querySelectorAll(".stepItem b"));
      this.activeIndex++;
      if (this.activeIndex == 2) {
        if (!this.$refs.lanSet.submitForm()) {
          this.activeIndex = 1;
        }
        // console.log(this.$refs.lanSet.submitForm())
      }
      if (this.activeIndex == 1) {
        //lan设置数据初始化
        // LAN set data initialization
        this.$refs.lanSet.dataInit();
      } else if (this.activeIndex == 2) {
        let params2 = {
          pageNumber: 1,
          pageSize: 10,
          deviceId: sessionStorage.getItem("edgeDevId"),
        };
        //内网网段设置数据初始化
        // Internal network segment setup data initialization
        this.$refs.intranetSet.dataInit(params2);
      }
      if (this.activeIndex > 2) {
        let params = {
          deviceId: this.netData.netDeviceId,
          dnsIp: this.$refs.lanSet.ruleForm.dnsIp,
          edgeId: sessionStorage.getItem("edgeDevId"),
          gatewayIp: this.$refs.lanSet.ruleForm.gatewayIp,
          ip: this.$refs.lanSet.ruleForm.ip,
          ipEnd: this.$refs.lanSet.ruleForm.ipEnd,
          ipStart: this.$refs.lanSet.ruleForm.ipStart,
          leaseTime: this.$refs.lanSet.ruleForm.leaseTime,
          mask: this.$refs.lanSet.ruleForm.code,
          // num: "",
          lanId: this.$refs.lanSet.ruleForm.lanId,
          dhcpId: this.$refs.lanSet.ruleForm.dhcpId,
          sceneDeviceId: this.netData.sceneDeviceId,
          sceneId: this.netData.sceneId,
          // serAddr: "",
          // serWide: "",
          serverEnabled:
            this.$refs.lanSet.DHCPShow == null
              ? false
              : this.$refs.lanSet.DHCPShow,
          staticIds: this.$refs.intranetSet.multipleSelection.length
            ? this.$refs.intranetSet.multipleSelection
                .map((item) => item.id)
                .join(",")
            : "",
        };
        sceneNodeAddEdge(params).then((res) => {
          if (res.code === 10000) {
            this.$message({
              type: "success",
              message: this.$t("vsr1000.remind2[5]"),
            });
            this.$parent.getVsrList(this.rowData);
            this.$parent.edegShow = false;
            this.$refs.intranetSetdevType = "";
            this.$refs.intranetSetsearchVal = "";
          }
        });
      }
      if (this.activeIndex >= 2) {
        this.activeIndex = 2;
      }
      // this.moduleName = this.stepsList[this.activeIndex].componentNmae;
      stepsList[this.activeIndex].classList.add("active");
    },
    close() {
      this.$parent.edegShow = false;
      this.activeIndex = 0;
      this.$refs.intranetSetdevType = "";
      this.$refs.intranetSetsearchVal = "";
      let stepsList = Array.from(document.querySelectorAll(".stepItem b"));
      stepsList.forEach((item, index) => {
        if (index == 0) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    },
    //上一步
    // The previous step
    prevEvent() {
      let stepsList = Array.from(document.querySelectorAll(".stepItem b"));
      stepsList[this.activeIndex].classList.remove("active");
      this.activeIndex--;
      // this.moduleName = this.stepsList[this.activeIndex].componentNmae;
      if (this.activeIndex <= 0) {
        this.activeIndex = 0;
      }
    },
    dataInit(row) {
      this.rowData = row;
      this.netData.sceneId = row.sceneId;
      this.netData.netDeviceId = row.netDeviceId;
      this.netData.sceneDeviceId = row.sceneDeviceId;
      this.activeIndex = 0;
      let stepsList = Array.from(document.querySelectorAll(".stepItem b"));
      stepsList.forEach((item, index) => {
        if (index == 0) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
      let params = {
        searchKey: "",
        type: "",
        sceneId: this.netData.sceneId,
        pageNumber: 1,
        pageSize: 10,
      };
      //edge节点数据初始化
      // Edge node data initialization
      this.$refs.edgeSelect.dataInit(params);
      // //lan设置数据初始化
      // LAN set data initialization
      // await this.$refs.lanSet.dataInit();
      // let params2 = {
      //   pageNumber: 1,
      //   pageSize: 10,
      //   deviceId: sessionStorage.getItem("edgeDevId"),
      // };
      // //内网网段设置数据初始化
      // Internal network segment setup data initialization
      // await this.$refs.intranetSet.dataInit(params2);
    },
    getEdgeDevId(val) {},
  },
};
</script>
<style scoped lang="scss">
.addEdge {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.content {
  width: 724px;
  height: 682px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -341px;
  margin-left: -362px;
  .title {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    i {
      width: 14px;
      height: 14px;
      background: url("../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.contentEn {
  width: 800px;
  margin-left: -400px;
}
.submit {
  width: 100%;
  text-align: center;
  .save {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    outline: none;
    border: 0;
    cursor: pointer;
    margin-left: 18px;
  }
  .cancel {
    width: 70px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    margin-left: 18px;
  }
  .save:hover {
    background: #6095d6;
  }
  .prev {
    width: 100px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(54, 120, 200, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    outline: none;
    cursor: pointer;
  }
}
.eventList {
  width: 100%;
  height: calc(100% - 48px);
  padding: 20px 30px 0 30px;
}
.steps {
  display: flex;
  justify-content: space-between;
  padding-bottom: 22px;
  align-items: center;
  .stepItem {
    b,
    span {
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
    }
    b {
      display: inline-block;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      text-align: center;
      line-height: 25px;
      background: #d7d7d7;
      margin-right: 10px;
    }
    .active {
      background: rgba(54, 120, 200, 1);
      color: #fff;
    }
  }
  .line {
    width: 40px;
    height: 1px;
    background: #d7d7d7;
  }
}
</style>