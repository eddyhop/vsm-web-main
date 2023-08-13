<template>
  <div class="vsrPandectMain">
    <div class="vsrPanCon">
      <dl class="hint">
        <dt>
            {{ location }}
        </dt>
        <dd>
          <p class="devName">
            <span>{{deviceName}}</span>
            <span>{{deviceSeries}}</span>
            <span class="msg" v-if="online">
              <i></i>
              {{ $t("Monit.controlPlane") }}
            </span>
            <span class="msg" v-else>
              <i id="offLine"></i>
              {{ $t("Monit.controlPlane") }}
            </span>
          </p>
          <p class="devTime">
            <span>{{$t('Monit.routerAS')}}：{{routerAS}}</span>
            <span>{{$t('Monit.routerID')}}：{{routerID}}</span>
          </p>
        </dd>

      </dl>
      
      <ul class="showList">
        <el-row :gutter="20">
          <el-col :span="12">
            <li class="slItem lastItem">
              <h5 style="padding-bottom:10px;">{{$t('Monit.bfdSession')}} {{$t('Monit.up')}}</h5>
              <p class="flow">
                <span class="showNum1 "></span>  <b>{{bfdUp}}</b>
              </p>
            </li>
          </el-col>

          <el-col :span="12">
            <li class="slItem lastItem">
              <h5 style="padding-bottom:10px;">{{$t('Monit.bfdSession')}} {{$t('Monit.down')}}</h5>
              <p class="flow">
                <span class="showNum1 "></span>  <b>{{bfdDown}}</b>
              </p>
            </li>
          </el-col>
          
        </el-row>
      </ul>
      <bfdStatus />
    </div>
  </div>
</template>
<script>

import bfdStatus from "./components/bfdStatus";
import { bfdDeviceBaseInfo } from "@/services";
export default {
  props: {},
  components: {
    bfdStatus
  },
  data() {
    return {
      //设备名称
      // Device name
      deviceName: "",
      //序列号
      // The serial number
      deviceSeries: JSON.parse(this.$route.query.devData).vsrSeries,
      online: null,
      devType: JSON.parse(this.$route.query.devData).deviceType,
      //设备类型
      location: JSON.parse(this.$route.query.devData).location,
      devTypeNum: "",
      bfdDown: "0",
      bfdUp: "0",
      routerAS: "",
      routerID: "",
    };
  },
  computed: {},
  methods: {
    //获取设备基础信息
    // Get basic information about the device
    getDevDataInit(params) {
      bfdDeviceBaseInfo(params).then(res => {
        if (res.code === 10000) {
          this.deviceName = res.result.deviceName;
          this.deviceSeries = res.result.deviceSeries;
          this.routerAS =  res.result.routerAS;
          this.routerID =  res.result.routerID;
          this.bfdDown =  res.result.bfdDown == null ? 0 :res.result.bfdDown;
          this.bfdUp =  res.result.bfdUp == null ? 0 : res.result.bfdUp;
          this.online = res.result.online;
        }
      });
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
    this.timer = setInterval(() => {
      this.getDevDataInit(params);
    }, 1000 * 600);
  },


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
      width: 45px;
      height: 45px;
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
            background: rgb(255, 0, 0);
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
      height: 100px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(235, 235, 235, 1);
      text-align: center;
      padding: 0 25px;
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
.operate {
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .add:hover{
    background: #6095D6;
  }
  button {
    float: right;
    width: 150px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    border: none;
    outline: none;
    cursor: pointer;
    display: table-cell;
    vertical-align: middle;
    img {
      width: 14px;
      height: 14px;
      position: relative;
      top: 1px;
    }
  }
  .flBut{
    padding: 0 15px;
    &.onBut{
      background: rgba(54, 120, 200, 1);
      color: #ffffff;
    }
    width: auto;
    float: left;
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-right: 20px;
    &:hover{
      background: #6095D6;
      color: #ffffff;
    }
  }
  .close {
    float: right;
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-left: 23px;
  }
}
// @keyframes process {
//   0% {
//     background-position: 0 0;
//   }
//   100% {
//     background-position: 20px 0;
//   }
// }
</style>