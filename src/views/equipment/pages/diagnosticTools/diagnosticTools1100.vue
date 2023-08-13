<template>
  <!-- 诊断工具 -->
  <div class="diagnosticTools">
    <div class="content">
      <div class="opeate">
        <div class="title">{{$t('newLang100.diagnosticTools.title1')}}</div>
        <div class="btns">
          <button
            v-for="(item) in tabs"
            :class="{active:item.id===tabIndex}"
            @click="tabEvent(item.id)"
            :key="item.id"
          >{{item.name}}</button>
        </div>
      </div>
      <div class="argument">
        <h4>{{$t('newLang100.diagnosticTools.title2')}}</h4>
        <div class="formList">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="form"
            class="demo-ruleForm"
            @submit.native.prevent
            :inline="true"
          >
            <!-- <div
              class="formItem"
              v-for="item in ruleForm.formList"
              :key="item.id"
              v-show="item.id===tabIndex"
            >
              <el-form-item v-for="el in item.formCon" :key="el.label" :label="el.label" prop="ip">
                <el-input v-model="ruleForm.ip"></el-input>
              </el-form-item>
            </div>-->
            <div class="formItem" v-if="tabIndex===0">
              <el-form-item
                :label="$t('newLang100.diagnosticTools.title3')"
                label-width="70px"
                prop="numberOfRepetitions"
                v-if="tabIndex===0"
                :class="lang=='en'?'enlang':''"
              >
                <el-input v-model="ruleForm.numberOfRepetitions"></el-input>
                <span>{{$t('newLang100.diagnosticTools.title7')}}</span>
              </el-form-item>
              <el-form-item :class="lang=='en'?'enlang':''" :label="$t('newLang100.diagnosticTools.title14')" label-width="70px" prop="timeOut">
                <el-input v-model="ruleForm.timeOut"></el-input>
                <span>{{$t('newLang100.diagnosticTools.title8')}}</span>
              </el-form-item>
              <el-form-item :label="$t('newLang100.diagnosticTools.title5')" label-width="90px" prop="dataBlockSize">
                <el-input v-model="ruleForm.dataBlockSize"></el-input>
                <span>byte</span>
              </el-form-item>
              <!-- <el-form-item :class="lang=='en'?'enlang':''" :label="$t('newLang100.diagnosticTools.title6')" label-width="50px" prop="ipAddress">
                <el-input v-model="ruleForm.ipAddress"></el-input>
              </el-form-item> -->
              

              <el-form-item
                  :label="$t('newLang100.diagnosticTools.title13')"
                  :prop="ipAddress"
                  
                  >
                  <div class="b">
                    <el-select filterable v-model="ruleForm.ipAddress" :placeholder="$t('vsr1000.remind[7]')">
                      <el-option
                        v-for="item in options"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name"
                      ></el-option>
                    </el-select>
                  </div>
                </el-form-item>


                <div class="diagnostic">
                  <div class="address">
                    <div class="addressInp">
                      <span>{{$t('newLang100.diagnosticTools.title10')}}</span>
                      <input type="text" v-model="host" :placeholder="$t('newLang100.diagnosticTools.remind1')" />
                    </div>
                    <button v-debounce.prevent="submitForm">{{$t('newLang100.diagnosticTools.title12')}}</button>
                  </div>
                  <div class="result">
                    <h4>{{$t('newLang100.diagnosticTools.title11')}}</h4>
                    <div class="resultList">
                      <div v-for="item in diagnoseResult" :key="item.id" v-show="item.id===tabIndex">
                        <p v-for="(el,index) in item.value" :key="index">{{el}}</p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div class="formItem" v-if="tabIndex===1">
               <IpsecTool ref="IpsecTool" v-if="tabIndex==1" />
            </div>
            <div class="formItem" v-if="tabIndex===2">
               <LteTool ref="LteTool" v-if="tabIndex==2" />
            </div>
            <div class="formItem" v-if="tabIndex===3">
               <WifiTool ref="WifiTool" v-if="tabIndex==3" />
            </div>

          </el-form>
        </div>
      </div>
      
      
      
    </div>
  </div>
</template>
<script>
import {
  vsreNetPing, //ping下发 Ping issued
  getVsrePing, //ping获取 Ping to get
  getVsrePort,
  networkdiagnosisCheckHost //host检查 The host check
} from "@/services";
import WifiTool from "./components/wifiTool";
import IpsecTool  from "./components/ipsecTool";
import LteTool from "./components/lteTool";
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
      devData:JSON.parse(this.$route.query.devData),
      lang: sessionStorage.getItem('lang'),
      tabs: [
        {
          id: 0,
          name: "Ping"
        },
        {
          id: 1,
          name: "IPsec Status"
        },
        {
          id: 2,
          name: " LTE status"
        },
        {
          id: 3,
          name: " Wifi status"
        },
      ],
      domains: [
          {
            value: ""
          }
      ],
      options: [],
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
        port: "", //端口 port
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
          { validator: numberValRule, trigger: "blur" },
          { validator: PortRule, trigger: "blur" }
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
      path: "",
      socket: "",
      myInterval: "",
      host: "" //目标地址 target address 
               // Target address target Address
    };
  },
  components: {
    IpsecTool,
    LteTool,
    WifiTool,
  },
  methods: {
    tabEvent(index) {
      this.tabIndex = index;
      clearInterval(this.myInterval);
      if (this.socket) {
        this.closeWeb();
      }
      if(index==0){
        this.dataInit();
      }
    },
    dataInit() {
      getVsrePort({devSerNum:JSON.parse(this.$route.query.devData).deviceId}).then(res => {
        if (res.code === 10000) {
            if(res.result!=null){
              this.options=res.result;
            }
        }
      });
    },

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
                    vsreNetPing({
                      devSerNum: this.devData
                        .vsrSeries,
                      rid: this.rid,
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
          getVsrePing({
            devSerNum: this.devData.vsrSeries,
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
  destroyed() {
    clearInterval(this.myInterval);
    if (this.socket) {
      this.closeWeb();
    }
  },
  created() {
    this.dataInit();
  },

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
</style>