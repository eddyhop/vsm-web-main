<template>
  <div class="vsrPandectMain">
    <div class="vsrPanCon">
      <dl class="hint">
        <dt>
          {{$t('Monit.vsnEdge')}}
          <br />
          {{devTypeNum}}
        </dt>
        <dd>
          <p class="devName">
            <span>{{deviceName}}</span>
            <span>{{deviceSeries}}</span>
            <span class="msg" v-if="online">
              <i></i>
              {{$t('Monit.onIine')}}
            </span>
            <span class="msg" v-else>
              <i id="offLine"></i>
              {{$t('Monit.offLine')}}
            </span>
          </p>
          <p class="devTime">
            <span>{{$t('Monit.edgeUptime')}}：{{secondsFormat(keepTime)}}</span>
            <!-- <span>{{$t('vsr1000.sustainOnLine')}}：{{getTime(startTime)}}</span> -->
          </p>
        </dd>
        <dd class="frBut">
          <div>{{$t('Monit.restartVPN')}}</div>
          <div>{{$t('Monit.rebootEdge')}}</div>
        </dd>
      </dl>
      
      <ul class="showList">
        <el-row :gutter="20">
          <el-col :span="6">
            <li class="slItem">
              <h5>{{$t('Monit.cpu')}}</h5>
              <div class="showNum">{{cpu}}%</div>
              <!-- cpu负载进度条 -->
              <div class="xui-process">
                <i id="icon-flag" class="xui-icon-flag" v-show="cpu==0 ? false : true"></i>
                <div class="xui-process-static"></div>
                <div id="process-bar" class="xui-process-active"></div>
              </div>
            </li>
          </el-col>
          <el-col :span="6">
            <li class="slItem">
              <h5>{{$t('Monit.memory')}}</h5>
              <div class="showNum">{{memory}}%</div>
              <!-- 内存占有率进度条 -->
              <div class="xui-process">
                <i id="icon-flag2" class="xui-icon-flag" v-show="memory==0 ? false : true"></i>
                <div class="xui-process-static"></div>
                <div id="process-bar2" class="xui-process-active2"></div>
              </div>
            </li>
          </el-col>
          <el-col :span="6">
            
            <li class="slItem">
              <h5 style="padding-bottom:10px;">{{$t('Monit.acitvetotaclVPNS')}}</h5>
              <div class="showNum1"><span>{{$t('Monit.siteVPNs')}}</span> {{tunnelAll}}</div>
              <div class="showNum1"><span>{{$t('Monit.clientVPNs')}}</span> {{tunnelAll}}</div>
            </li>
          </el-col>
          <el-col :span="6">
            <li class="slItem lastItem">
              <h5>{{$t('vsr1000.flow')}}</h5>
              <p class="flow">
                <i class="up"></i>
                <span>{{$t('vsr1000.up')}}</span>
                <b>{{flowUp}}</b>
              </p>
              <p class="flow">
                <i class="down"></i>
                <span>{{$t('vsr1000.down')}}</span>
                <b>{{flowDown}}</b>
              </p>
              <p style="font-size:12px;color:#999999;">{{$t('Monit.tatalInfo')}}</p>
            </li>
          </el-col>
        </el-row>
      </ul>
      <pandectPic />
      <addGroup v-if="isShow" />
    </div>
  </div>
</template>
<script>
import pandectPic from "./components/pandectPic";
import addGroup from "./components/addGroup";
import { deviceBaseInfo } from "@/services";
export default {
  props: {},
  components: {
    pandectPic,
    addGroup
  },
  data() {
    return {
      isShow: false,
      //设备名称
      // Device name
      deviceName: "",
      //序列号
      // The serial number
      deviceSeries: JSON.parse(this.$route.query.devData).vsrSeries,
      //上线时间
      // Online time
      startTime: new Date() * 1,
      //持续在线
      // Continue to online
      keepTime: new Date() * 1,
      //cpu负载
      // CPU load
      cpu: "",
      //内存
      // memory
      memory: "",
      //链路总数
      // The total number of links
      tunnelAll: "",
      //已连接设备数
      // Number of connected devices
      tunnelActive: "",
      //上行
      // The upside
      flowUp: "",
      //下行
      // The downside
      flowDown: "",
      //点击收藏夹类型
      // Click favorites type
      type: "",
      interval: "",
      online: null,
      devType: JSON.parse(this.$route.query.devData).deviceType,
      devTypeNum: ""

    };
  },
  computed: {},
  methods: {
    //获取设备基础信息
    // Get basic information about the device
    getDevDataInit(params) {
      deviceBaseInfo(params).then(res => {
        if (res.code === 10000) {
          this.deviceName = res.result.deviceName;
          this.deviceSeries = res.result.deviceSeries;
          this.startTime = res.result.startTime || 0;
          this.keepTime = res.result.keepTime || 0;
          this.cpu = res.result.cpu;
          this.memory = res.result.memory;
          this.tunnelAll = res.result.tunnelAll;
          this.tunnelActive = res.result.tunnelActive;
          this.flowUp = '' + this.changeMaxSize(res.result.flowUp,this.finedMaxSize(res.result.flowUp)) + this.finedMaxSize(res.result.flowUp) + 'ps';
          this.flowDown = '' + this.changeMaxSize(res.result.flowDown,this.finedMaxSize(res.result.flowDown)) + this.finedMaxSize(res.result.flowDown) + 'ps';
          this.online = res.result.online;
          this.setProgress(res.result.cpu, res.result.memory, 100);
        }
      });
    },
    //进度条设置
    // Progress bar setting
    setProgress(cpuD, memoryD, totalGet) {
      var flag = document.getElementById("icon-flag"),
        processBar = document.getElementById("process-bar"),
        flag2 = document.getElementById("icon-flag2"),
        processBar2 = document.getElementById("process-bar2"),
        cpuWidthPercentage = Math.round((cpuD / totalGet) * 100),
        memoryWidthPercentage = Math.round((memoryD / totalGet) * 100);

      if (cpuWidthPercentage >= 100) {
        cpuWidthPercentage = 100;
      }
      if (memoryWidthPercentage >= 100) {
        memoryWidthPercentage = 100;
      }
      flag.style.left = cpuWidthPercentage - 5 + "%";
      processBar.style.width = cpuWidthPercentage + "%";
      flag2.style.left = memoryWidthPercentage - 5 + "%";
      processBar2.style.width = memoryWidthPercentage + "%";
      if (cpuWidthPercentage == 0) {
        processBar.style.borderStyle = "none";
      }
      if (memoryWidthPercentage == 0) {
        processBar2.style.borderStyle = "none";
      }
    },
    //时间格式转换
    // Time format conversion
    getTime(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let miao = date.getSeconds();
      let list = [year, month, day, hour, minute, miao];
      let list2 = [];
      for (let i in list) {
        if (list[i] < 10) {
          let a = "" + 0 + list[i];
          list2.push(a);
        } else {
          list2.push(list[i]);
        }
      }
      let needTime =
        "" +
        list2[0] +
        "/" +
        list2[1] +
        "/" +
        list2[2] +
        " " +
        list2[3] +
        ":" +
        list2[4] +
        ":" +
        list2[5];
      return needTime;
    },
    secondsFormat(s) {
      var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
                                             // Math.floor() is rounded down
      var hour = Math.floor((s - day * 24 * 3600) / 3600);
      var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
      var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
      return (
        day +
        this.$t("vsr1000.Days") +
        hour +
        this.$t("vsr1000.Hours") +
        minute +
        this.$t("vsr1000.Minutes") +
        second +
        this.$t("vsr1000.Seconds")
      );
    },
    finedMaxSize(val) {
      if (val === 0) return "b";
      let arr = ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
      let a = 0;
      val = val / 8 
      while (val >= 1024) {
        val = val / 1024;
        a += 1;
      }
      return arr[a];
    }, // 是每一个数据换算到最大单位
       // Is each data conversion to the maximum unit
    changeMaxSize(val,unit) {
      if (val === 0) return val;
      let arr = ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
      let a = 0;
      val = val / 8
      while (arr.indexOf(unit) > a) {
        val = val / 1024;
        a += 1;
      }
      return parseFloat(Number(val.toFixed(4)));
    },
    flowSwitch(flowVlueBytes) {
      //流量装换
      // Changing all traffic
      var flow = "";
      if (flowVlueBytes < 1024) {
        flow = flowVlueBytes + "bps";
      } else if (flowVlueBytes / 1024 < 1024) {
        flow =
          (Math.round(flowVlueBytes / 1024) > 0
            ? Math.round(flowVlueBytes / 1024)
            : 0) + "Kbps";
      } else if (
        flowVlueBytes / 1024 >= 1024 &&
        flowVlueBytes / 1024 / 1024 < 1024
      ) {
        //如果赠送流量大于1MB且小于1    GB的则显示为MB
        // If the complimentary flow is more than 1MB and less than 1GB, it will be displayed as MB
        flow =
          (Math.round(flowVlueBytes / 1024 / 1024) > 0
            ? Math.round(flowVlueBytes / 1024 / 1024)
            : 0) + "Mbps";
      } else if (flowVlueBytes / 1024 / 1024 >= 1024) {
        //如果流量大于1Gb
        // If the flow is greater than 1Gb
        var gb_Flow = flowVlueBytes / 1024 / 1024 / 1024; //toFixed(1);四舍五入保留一位小数
                                                          // toFixed(1); Round it to a decimal place
        flow = gb_Flow.toFixed(1) + "Gbps";
      } else {
        flow = "0bps";
      } //如果赠送流量小于1MB.则显示为KB
        // If the complimentary flow is less than 1MB. It is displayed as KB
      return flow;
    }
  },
  created() {

    //this.devType = this.$parent.devType ;//'vsr1000';
    var dtype=this.devType;
    let params = {
      deviceId: JSON.parse(this.$route.query.devData).deviceId,  //this.$parent.deviceId,//'429511429322706944'
      deviceType: this.devType == "vsr1000" ? "0001" : this.devType == "vsr100" ? "0002" : this.devType == "Cloud-vsr1000" ? "000106" : this.devType == "vsr1100" ? "0003" : "000206"
    };
    if(dtype.includes("Cloud")){
      this.devTypeNum = dtype.substring(9);
    }else{
      this.devTypeNum = dtype.substring(3);
    }
    this.getDevDataInit(params);
  },
  mounted() {
    // this.setProgress(50,50, 100);
  }
};
</script>
<style scoped lang="scss">
.vsrPandectMain {
  width: 100%;
  // height: 100%;
  padding: 20px 30px 30px;
  .vsrPanCon {
    width: 100%;
    // height: 100%;
    border-radius: 7px;
    border: 1px solid rgba(235, 235, 235, 1);
    padding: 16px 18px 20px;
  }
  .hint {
    padding-bottom: 20px;
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    dt,
    dd {
      float: left;
    }
    dt {
      width: 40px;
      height: 40px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: 1px solid rgba(54, 120, 200, 1);
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      text-align: center;
    }
    dd {
      padding-left: 12px;
      .devName {
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 20px;
        span {
          padding-right: 14px;
        }
        .msg {
          font-size: 14px;
          font-family: arial, sans-serif;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          i {
            width: 8px;
            height: 8px;
            background: #029805;
            border-radius: 50%;
            display: inline-block;
            margin-right: 5px;
          }
          #offLine {
            background: rgba(209, 215, 224, 1);
          }
        }
      }
      .devTime {
        font-size: 12px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 17px;
        span {
          padding-right: 14px;
        }
      }
    }
  }
  .showList {
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    .slItem {
      height: 132px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(235, 235, 235, 1);
      text-align: center;
      padding: 0 40px;
      h5 {
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 20px;
        padding-top: 18px;
      }
      .showNum {
        font-size: 22px;
        font-family: arial, sans-serif;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 30px;
        padding-top: 8px;
        padding-bottom: 20px;
      }
      .showNum1 {
        span{
          font-size: 18px;
        }
        font-size: 22px;
        font-family: arial, sans-serif;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 30px;
      }
      .linkNum {
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
      .flow {
        font-size: 16px;
        font-family: arial, sans-serif;
        color: #666666;
        padding-left: 32px;
        display: flex;
        align-items: center;
        i {
          width: 18px;
          height: 3px;
        }
        .up {
          background: #3678c8;
        }
        .down {
          background: #36c3c8;
        }
        span {
          font-size: 14px;
          font-family: arial, sans-serif;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 20px;
          padding: 0 10px;
        }
        b {
          font-size: 22px;
          font-family: arial, sans-serif;
          font-weight: 500;
          color: #333333;
          line-height: 30px;
        }
      }
    }
    .slItem:nth-of-type(3) .showNum {
      padding-bottom: 14px;
    }
    .lastItem {
      margin-right: 0;
      text-align: center;
      .flow {
        justify-content: center;
        padding-left: 0;
      }
      h5 {
        text-align: center;
        padding-bottom: 8px;
      }
    }
    .slItem:first-of-type h5 {
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
    }
  }
}
.xui-process {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  // padding: 28px 0 12px;
  width: 100%;
}
.xui-icon-flag {
  position: absolute;
  top: -8px;
  left: -5px;
  width: 0;
  height: 0;
  border-width: 6px;
  border-color: transparent;
  border-style: solid;
  border-top-color: #d89012;
}
#icon-flag {
  border-top-color: #ba2727;
}
.xui-process-static {
  width: 100%;
  height: 8px;
  border-radius: 10px;
  // -webkit-box-shadow: 0 0 5px#E7EBF3;
  // box-shadow: 0 0 5px #e7ebf3;
  background-color: #e7ebf3;
}
.xui-process-active2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 8px;
  // border: 1px solid #e8b04e;
  border-radius: 10px;
  background-image: linear-gradient(
    -60deg,
    transparent 0,
    transparent 5px,
    #d89012 5px,
    #d89012 10px,
    transparent 10px,
    transparent 15px,
    #d89012 20px
  );
  background-color: #e8b04e;
  background-size: 10px 10px;
  // box-shadow: 1px 1px 5px #e8b04e;
  -webkit-animation: process 800ms infinite linear;
  animation: process 800ms infinite linear;
}
.xui-process-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 8px;
  // border: 1px solid #e76f6f;
  border-radius: 10px;
  background-image: linear-gradient(
    -60deg,
    transparent 0,
    transparent 5px,
    #ba2727 5px,
    #ba2727 10px,
    transparent 10px,
    transparent 15px,
    #ba2727 20px
  );
  background-color: #e76f6f;
  background-size: 10px 10px;
  // box-shadow: 1px 1px 5px #e76f6f;
  -webkit-animation: process 800ms infinite linear;
  animation: process 800ms infinite linear;
}
// @keyframes process {
//   0% {
//     background-position: 0 0;
//   }
//   100% {
//     background-position: 20px 0;
//   }
// }
.frBut{
  float:right !important;
  div{
    float:left; margin-left:10px; height:40px; color:#FFFFFF;background: #3678c8; line-height:40px; padding:0 15px;
  }
}
</style>