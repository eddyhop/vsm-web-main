<template>
  <!-- 诊断工具 -->
  <div class="diagnosticTools">
    <div class="content">
      <div style="padding:20px 20px 0 20px;">
        <el-form :model="ruleForm" :rules="rules" ref="form">
          <el-row >
            <el-col :span="6">
              <el-form-item label-width="130px" :label="$t('Monit.physicalInterface')" prop="port">
                  <el-select filterable v-model="ruleForm.port" class="w100bf">
                    <el-option v-for="item in ports" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="130px" :label="$t('Monit.repeat')" prop="numberOfRepetitions">
                  <el-input v-model="ruleForm.numberOfRepetitions" class="w100bf"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="130px" :label="$t('Monit.pacetSize')" prop="dataBlockSize">
                  <el-input v-model="ruleForm.dataBlockSize" class="w100bf"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="130px" :label="$t('Monit.intercal')" prop="timeOutH">
                  <el-input v-model="ruleForm.timeOutH" class="w100bf"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label-width="130px" :label="$t('Monit.ipAddress')" prop="host">
                <el-input class="w100bf"  v-model="host" :placeholder="$t('Monit.ipInfo')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <button class="butTj" v-debounce.prevent="submitForm">{{$t('Monit.start')}}</button>
              <button class="butTjqx" v-debounce.prevent="initData">{{$t('Monit.refresh')}}</button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="diagnostic" style="border-top:1px solid #dddddd">
        <div class="result">
          <div class="resultList">
            <div v-for="item in diagnoseResult" :key="item.id" v-show="item.id===tabIndex">
              <p v-for="(el,index) in item.value" :key="index">{{el}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  networkdiagnosisPing, //ping下发 Ping issued
                        // Ping issued ping issued
  networkdiagnosisGetPing, //ping获取 Ping to get
                           // Ping Get ping to get
  networkdiagnosisTraceroute, //tracerout下发 Tracerout issued
                              // Tracerout issues Tracerout issued
  networkdiagnosisGetTraceroute, //traceroute获取 Traceroute to obtain
                                 // Traceroute Obtain Traceroute to obtain
  networkdiagnosisMtr, //mtr下发 MTR issued
                       // MTR issued MTR Issued
  networkdiagnosisFGetMtr, //mtr获取 MTR access
                           // MTR access
  networkdiagnosisIperf, //iperf下发 Iperf issued
                         // Iperf issued AN IPERF
  networkdiagnosisGetIperf, //iperf获取 Iperf to obtain
                            // Words and Expressions Iperf to obtain words and expressions
  networkdiagnosisNslookup, //nslookup下发 Nslookup issued
                            // Nslookup issues NSLOOKUP
  networkdiagnosisGetNslookup, //nslookup获取 Nslookup access
                               // Nslookup to get NSLookup Access
  networkdiagnosisHttping, //httping下发 Httping issued
                           // So HTTPING is issuing HTTPING
  networkdiagnosisGetHttping, //httping获取 Httping access
                              // Httping Get Httping Access
  networkdiagnosisMessageOnClose, //socket关闭, Close the socket,
                                  // I want you to Close the socket.
  networkdiagnosisCheckHost, logicalPortGetSelect //host检查 The host check
  // Host check The host check
} from "@/services";
export default {
  data() {
    var numberOfRepetitionsRule = (rule, value, callback) => {
      if (value < 129) {
        callback();
      } else {
        callback(this.$t('newLang100.diagnosticTools.remind2'));
      }
    };
    var numberValRule = (rule, value, callback) => {
      if (value.length) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        // console.log(val, reg.test(val), "test");
        if (reg.test(val)) {
          if (val <= 0) {
            callback(new Error(this.$t('newLang100.diagnosticTools.remind3')));
          } else {
            callback();
          }
        } else {
          if (val <= 0) {
            callback(new Error(this.$t('newLang100.diagnosticTools.remind3')));
          } else {
            callback(new Error(this.$t('newLang100.diagnosticTools.remind4')));
          }
        }
      } else {
        callback();
      }
    };
    var PortRule = (rule, value, callback) => {
      if (value) {
        if (1 <= value && value <= 65535) {
          callback();
        } else {
          callback(new Error(this.$t('newLang100.diagnosticTools.remind5')));
        }
      }
    };
    var DNSRule = (rule, value, callback) => {
      if (value) {
        networkdiagnosisCheckHost({ host: value }).then(res => {
          if (res.success) {
            callback();
          } else {
            callback(new Error(this.$t('newLang100.diagnosticTools.remind6')));
          }
        });
      }
    };
    return {
       devData:this.$parent.devData,
      lang: sessionStorage.getItem('lang'),
      tabs: [
        {
          id: 0,
          name: "Ping"
        },
        {
          id: 1,
          name: "TraceRoute"
        },
        {
          id: 2,
          name: "Mtr"
        },
        {
          id: 3,
          name: "Iperf"
        },
        {
          id: 4,
          name: "Nslookup"
        },
        {
          id: 5,
          name: "Httping"
        }
      ],
      tabIndex: 0,
      ruleForm: {
        //ping
        numberOfRepetitions: "", //重复次数 times of repetition 
                                 // Times of repetition
        timeOut: "", //超时时间 time-out period
                     // Time out period
        dataBlockSize: "", //数据块大小 Block size
                           // Block size
        ipAddress: "", //源ip sourceIP 
                       // Source IP sourceIP
        //TraceRoute
        timeOutT: "", //超时时间 time-out period
                      // Time out period
        toST: "", //top
        ipAddressT: "", //源ip sourceIP 
                        // Source IP sourceIP
        //mtr
        numberOfRepetitionsM: "", //重复次数 times of repetition 
                                  // Times of repetition
        timeOutM: "", //超时时间 time-out period
                      // Time out period
        port: [], //端口 port
                  // Port to port
        dns: "", //
        //httping
        numberOfRepetitionsH: "", //重复次数 times of repetition 
                                  // Times of repetition
        timeOutH: "" //超时时间 time-out period
                     // Time out period
      },
      rules: {
        numberOfRepetitions: [
          // { type: "number", message: "输入的值必须为数字" },
          // {type: "number", message: "Input value must be number"},
          { validator: numberValRule, trigger: "blur" },
          { validator: numberOfRepetitionsRule, trigger: "blur" }
        ],
        numberOfRepetitionsM: [
          // { type: "number", message: "输入的值必须为数字" },
          // {type: "number", message: "Input value must be number"},
          { validator: numberValRule, trigger: "blur" },
          { validator: numberOfRepetitionsRule, trigger: "blur" }
        ],
        numberOfRepetitionsH: [
          // { type: "number", message: "输入的值必须为数字" },
          // {type: "number", message: "Input value must be number"},
          { validator: numberValRule, trigger: "blur" },
          { validator: numberOfRepetitionsRule, trigger: "blur" }
        ],
        toST: [{ validator: numberValRule, trigger: "blur" }],
        timeOut: [{ validator: numberValRule, trigger: "blur" }],
        timeOutT: [{ validator: numberValRule, trigger: "blur" }],
        timeOutM: [{ validator: numberValRule, trigger: "blur" }],
        timeOutH: [{ validator: numberValRule, trigger: "blur" }],
        dataBlockSize: [{ validator: numberValRule, trigger: "blur" }],
        ipAddress: [
          {
            required: true,
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]")
          }
        ],
        ipAddressT: [
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]")
          }
        ],
        port: [
          // { type: "number", message: "输入的值必须为数字" },
          // {type: "number", message: "Input value must be number"},
          //{ validator: numberValRule, trigger: "blur" },
          //{ validator: PortRule, trigger: "blur" }
        ],
        dns: [{ validator: DNSRule, trigger: "blur" }]
      },
      diagnoseResult: [
        {
          id: 0,
          value: []
        },
        {
          id: 1,
          value: []
        },
        {
          id: 2,
          value: []
        },
        {
          id: 3,
          value: []
        },
        {
          id: 4,
          value: []
        },
        {
          id: 5,
          value: []
        }
      ],
      rid: "",
      ports:[],
      path: "",
      socket: "",
      myInterval: "",
      host: "" //目标地址 target address 
               // Target address target Address
    };
  },
  methods: {
    tabEvent(index) {
      this.tabIndex = index;
      clearInterval(this.myInterval);
      if (this.socket) {
        this.closeWeb();
      }
    },
    initData(){
      this.deviceId = this.$parent.edgeName ;
      logicalPortGetSelect({deviceId:this.deviceId,tenantId:this.tenantId}).then(res=>{
        this.ports= res.result.port;
      })
    }
    ,
    //关闭webSocket
    // Close the webSocket
    // close the webSocket
    closeWeb() {
      networkdiagnosisMessageOnClose({ randomId: this.rid }).then(res => {});
      this.socket.onclose();
      this.socket = "";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.initWs();
          this.getRid()
          if (this.host.length) {
            this.ruleHost().then(res => {
              if (res) {
                switch (this.tabIndex) {
                  case 0:
                    networkdiagnosisPing({
                      host: this.host,
                      ipAddress: this.ruleForm.ipAddress,
                      timeOut: this.ruleForm.timeOut,
                      dataBlockSize: this.ruleForm.dataBlockSize,
                      numberOfRepetitions: this.ruleForm.numberOfRepetitions
                    }).then(res => {
                      if (res.code == 10000) {
                        this.setTimer();
                      }
                    });
                    break;
                  case 1:
                    networkdiagnosisTraceroute({
                      devSerNum: this.devData.deviceSerialNumber,
                      rid: this.rid,
                      host: this.host,
                      ipAddress: this.ruleForm.ipAddressT,
                      timeOut: this.ruleForm.timeOutT,
                      toS: this.ruleForm.toST
                    }).then(res => {
                      if (res.code == 10000) {
                        this.setTimer();
                      }
                    });
                    break;
                  case 2:
                    networkdiagnosisMtr({
                      devSerNum: this.devData
                        .deviceSerialNumber,
                      rid: this.rid,
                      host: this.host,
                      ipAddress: this.ruleForm.ipAddressM,
                      timeOut: this.ruleForm.timeOutM,
                      numberOfRepetitions: this.ruleForm.numberOfRepetitionsM
                    }).then(res => {
                      if (res.code == 10000) {
                        this.setTimer();
                      }
                    });
                    break;
                  case 3:
                    networkdiagnosisIperf({
                      devSerNum: this.devData
                        .deviceSerialNumber,
                      rid: this.rid,
                      host: this.host,
                      port: this.ruleForm.port
                    }).then(res => {
                      if (res.code == 10000) {
                        this.setTimer();
                      }
                    });
                    break;
                  case 4:
                    networkdiagnosisNslookup({
                      devSerNum: this.devData
                        .deviceSerialNumber,
                      rid: this.rid,
                      host: this.host,
                      dns: this.ruleForm.dns
                    }).then(res => {
                      if (res.code == 10000) {
                        this.setTimer();
                      }
                    });
                    break;
                  case 5:
                    networkdiagnosisHttping({
                      devSerNum: this.devData
                        .deviceSerialNumber,
                      rid: this.rid,
                      host: this.host,
                      timeOut: this.ruleForm.timeOutH,
                      numberOfRepetitions: this.ruleForm.numberOfRepetitionsH
                    }).then(res => {
                      if (res.code == 10000) {
                        this.setTimer();
                      }
                    });
                    break;
                  default:
                    break;
                }
              } else {
                this.$message({
                  type: "warning",
                  message: this.$t('newLang100.diagnosticTools.remind7')
                });
              }
            });
          } else {
            this.$message({
              type: "warning",
              message: this.$t('newLang100.diagnosticTools.remind1')
            });
          }
        }
      });
    },
    //目标地址检查
    // Destination address check
    // Target address check
    ruleHost() {
      return networkdiagnosisCheckHost({ host: this.host }).then(res => {
        if (res.success) {
          return true;
        } else {
          return false;
        }
      });
    },
    getRid(){

      this.rid = parseInt((Math.random() + 1) * Math.pow(10, 6 - 1));
    },
    //ws连接
    // Ws connection
    // ws connections
    initWs() {
      if (typeof WebSocket === "undefined") {
        alert(this.$t('newLang100.diagnosticTools.remind8'));
      } else {
        let path =
          "ws://39.103.136.149:8888/ws/long/" +
          parseInt((Math.random() + 1) * Math.pow(10, 6 - 1));
        // 实例化socket
        // Instantiate a socket
        // Instantiate the socket
        this.socket = new WebSocket(path);
        this.rid = path.slice(-6);
        // 监听socket连接
        // Monitor socket connection
        //Monitor socket connection
        this.socket.onopen = this.open;
        // 监听socket错误信息
        // Listen for socket error messages
        //Listen for socket error messages
        this.socket.onerror = this.error;
        // 监听socket消息
        // Listen for socket messages
        //Listen for socket messages
        this.socket.onmessage = this.getMessage;
        // 关闭websocket
        // Close the websocket
        // close the websocket
        this.socket.onclose = this.close;
      }
    },
    open: function() {
      // this.send(parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)) + "");
      console.log("socket连接成功");
      //Socket connection successful
    },
    error: function() {
      console.log("连接错误");
      // connection error
    },
    getMessage: function(msg) {
      console.log(msg);
      this.msgShow(msg);
    },
    send: function(params) {
      this.socket.send(params);
    },
    close: function() {
      console.log("socket已经关闭");
      //Socket has been closed.
    },
    //获取诊断状态
    // Get diagnostic status
    //Get diagnostic status
    dosomething() {
      switch (this.tabIndex) {
        case 0:
          networkdiagnosisGetPing({
            devSerNum: this.devData.deviceSerialNumber,
            rid: this.rid
          }).then(res => {
            this.msgShow(res.result)
          });
          break;
        case 1:
          networkdiagnosisGetTraceroute({
            devSerNum: this.devData.deviceSerialNumber,
            rid: this.rid
          }).then(res => {
            this.msgShow(res.result)
          });
          break;
        case 2:
          networkdiagnosisFGetMtr({
            devSerNum: this.devData.deviceSerialNumber,
            rid: this.rid
          }).then(res => {
            this.msgShow(res.result)
          });
          break;
        case 3:
          networkdiagnosisGetIperf({
            devSerNum: this.devData.deviceSerialNumber,
            rid: this.rid
          }).then(res => {
            this.msgShow(res.result)
          });
          break;
        case 4:
          networkdiagnosisGetNslookup({
            devSerNum: this.devData.deviceSerialNumber,
            rid: this.rid
          }).then(res => {
            this.msgShow(res.result)
          });
          break;
        case 5:
          networkdiagnosisGetHttping({
            devSerNum: this.devData.deviceSerialNumber,
            rid: this.rid
          }).then(res => {
            this.msgShow(res.result)
          });
          break;
        default:
          break;
      }
    },
    //轮询调用
    // Polling calls
    //Polling calls
    setTimer() {
      this.myInterval = window.setInterval(() => {
        // setTimeout(() => {
        this.dosomething(); //调用接口的方法 Call the methods of the interface
                            // Call the methods of the interface
        // }, 1);
      }, 4000);
    },
    msgShow(msg) {
      let data = JSON.parse(msg);

      this.diagnoseResult[this.tabIndex].value = data;
      // this.diagnoseResult[
      //   this.tabIndex
      // ].value.concat(data);
    }
  },
  created() {
    this.tenantId = sessionStorage.getItem("tenantValue");
    this.initData();
  },
  destroyed() {
    clearInterval(this.myInterval);
    if (this.socket) {
      this.closeWeb();
    }
  }
};
</script>
<style scoped lang="scss">
.diagnosticTools {
  width: 100%;
  height: 100%;
  padding: 20px 30px 30px;
}
.content {
  width: 100%;
  height: 100%;
  border-radius: 0px 0px 2px 2px;
  border: 1px solid rgba(209, 215, 224, 1);
}
.opeate {
  width: 100%;
  padding: 20px 20px 0 20px;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .title {
    float: left;
    line-height: 34px;
    font-size: 16px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .btns {
    float: right;
  }
}
.btns {
  button {
    width: 100px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    border: 1px solid rgba(209, 215, 224, 1);
    outline: none;
    cursor: pointer;
    margin-left: 14px;
  }
  .active {
    background: rgba(54, 120, 200, 1);
    border-color: rgba(54, 120, 200, 1);
    color: rgba(255, 255, 255, 1);
  }
  .active:hover {
    background: rgba(96, 149, 214, 1);
  }
}
.diagnostic {
  width: 100%;
  height: calc(100% - 165px);
}
.address {
  width: 100%;
  height: 34px;
  line-height: 34px;
  display: flex;
  padding-right: 20px;
  // zoom: 1;
  // &:after {
  //   display: block;
  //   clear: both;
  //   content: "";
  //   visibility: hidden;
  //   height: 0;
  // }
  .addressInp {
    flex: 1;
    border-radius: 7px 2px 0px 0px;
    border: 1px solid rgba(209, 215, 224, 1);
    border-left: 0;
  }
  span {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding: 0 20px;
  }
  input {
    border: 0;
    outline: none;
  }
  button {
    margin-left: 14px;
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    border: 0;
    outline: none;
    cursor: pointer;
  }
}
.result {
  width: 100%;
  height: calc(100% - 40px);
  padding: 16px 20px 20px;
  h4 {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-bottom: 13px;
  }
}
.resultList {
  width: 100%;
  height: calc(100% - 32px);
  overflow: auto;
}
.argument {
  padding-top: 16px;
  h4 {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    padding-bottom: 14px;
    padding-left: 20px;
  }
}
.formList {
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  padding-left: 20px;
  // .formItem {
  span {
    padding-left: 10px;
    margin-right: 15px;
  }
  .enlang ::v-deep .el-form-item__label{
    line-height: normal;
  }
  // display: flex;
  // }
}
</style>
<style lang="scss">
.diagnosticTools {
  .el-input,
  .el-select {
    width: 140px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
}
.w100bf{
  width: 100% !important;
}
.butTj{
  margin-left: 14px;
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    border: 0;
    outline: none;
    cursor: pointer;
}
.butTjqx{
  width: 100px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    border: 1px solid rgba(209, 215, 224, 1);
    outline: none;
    cursor: pointer;
    margin-left: 14px;
}
</style>