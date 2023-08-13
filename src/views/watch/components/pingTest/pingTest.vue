<template>
  <!-- 诊断工具 -->
  <div class="diagnosticTools">
    <div class="content">
      <div style="padding:20px 0px 0 20px;">
        <el-form
            :model="ruleForm"
            :rules="rules"
            ref="formTs"
            label-width="auto"
            :inline="true"
            class="demo-ruleForm"
            @submit.native.prevent
        >
          <el-row  >
            <el-col :span="7">
              <el-form-item label-width="130px" :label="$t('subscription.dhcpServer.logicalInterface')"   >
                <div class="b">
                  <el-select filterable v-model="ruleForm.ipAddress" :placeholder="$t('vsr1000.remind[7]')" >
                    <el-option
                        v-for="item in options"
                        :key="item.name"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label-width="100px" :label="$t('Monit.repeat')" prop="numberOfRepetitions">
                  <el-input v-model="ruleForm.numberOfRepetitions" style="width: 90px"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label-width="160px" :label="$t('Monit.pacetSize')" prop="dataBlockSize">
                  <el-input v-model="ruleForm.dataBlockSize" style="width: 90px" ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label-width="100px" :label="$t('Monit.interval')+'(s)'" prop="timeOut">
                  <el-input v-model="ruleForm.timeOut" style="width: 90px"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18" >
              <el-form-item   :label="$t('Monit.ipAddress')" prop="host">
                <el-input style="width: 500px" v-model="ruleForm.host" :placeholder="$t('Monit.ipInfo')">172.16.0.59</el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" >
              <!--
              <button class="butTjYm"   @click="TestPingFn" >{{$t('Monit.start')}}</button>
              <button class="butTjqx"   @click="stopPing"   >{{$t('Monit.stop')}}</button>
              <button class="butTjqx" @click="dosomething">{{$t('Monit.refresh')}}</button>
-->
              <ul class="tabs">
                <li
                    :class="item.id === activeIndex ? 'active' : ''"
                    style="width: 60px;"
                    v-for="(item) in tabsData"
                    :key="item.id"
                    @click="tabsEvent(item)"
                >{{item.name}}</li>
              </ul>



            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="diagnostic" style="border-top:1px solid #dddddd">
        <div class="result">
          <div class="resultList">
            <div v-for="item in diagnoseResult" :key="item.id" >
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
  vsreNetPing, //ping下发 Ping issued
  getVsrePing, //ping获取 Ping to get
  getLogicPortIP,
  savePing, updatePing, getPing, stopPing,
  networkdiagnosisCheckHost, userInfo, //host检查 The host check
} from "@/services";
export default {
  data() {
    var numberOfRepetitionsRule = (rule, value, callback) => {
      if(value){
        if (value <= 100 && value > 0 ) {
          callback();
        } else {
          callback(this.$t('newLang100.diagnosticTools.remind9'));
        }
      }else{
        callback();
      }
    };
    var dataBlockSizeRule = (rule, value, callback) => {
          if(value){
              if (value <= 8190 && value >= 56 ) {
                callback();
              } else {
                callback(this.$t('newLang100.diagnosticTools.remind10'));
              }
          }else{
            callback();
          }
    };

    var timeOutRule = (rule, value, callback) => {
          if(value){
              if (value <= 60 && value >= 1 ) {
                callback();
              } else {
                callback(this.$t('newLang100.diagnosticTools.remind11'));
              }
          }else{
            callback();
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
    return {
      devData:JSON.parse(this.$route.query.devData),
      username: "",
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
      tabsData: [
        {
          name: this.$t('Monit.start'),
          id: 0
        },
        {
          name: this.$t('Monit.stop'),
          id: 1
        },
        {
          name: this.$t('Monit.refresh'),
          id: 2
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
        numberOfRepetitions: "5", //重复次数 times of repetition
                                 // Times of repetition
        timeOut: "1", //超时时间 time-out period
                     // Time out period
        dataBlockSize: "60", //数据块大小 Block size
                           // Block size
        ipAddress: "", //源ip sourceIP
                       // Source IP sourceIP

        host: "" //目标地址 target address // Target address target Address
      },
      rules: {
        numberOfRepetitions: [
          // { type: "number", message: "输入的值必须为数字" },
          // {type: "number", message: "Input value must be number"},
          { validator: numberValRule, trigger: "blur" },
          { validator: numberOfRepetitionsRule, trigger: "blur" }
        ],
        timeOut: [
            { validator: numberValRule, trigger: "blur" },
            { validator: timeOutRule, trigger: "blur" }
        ],
        dataBlockSize: [
            { validator: numberValRule, trigger: "blur" },
            { validator: dataBlockSizeRule, trigger: "blur" }
            ],
        host: [
          {
            required: true,
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("Monit.remind12"),
            trigger: "blur"
          }
        ],
      },
      diagnoseResult: [
        {
          id: 0,
          value: []
        }
      ],
      rid: "",
      resultVal: "",
      path: "",
      socket: "",
      myInterval: "",
      activeIndex:0,
      favFlag:"",
    };
  },
  components: {

  },
  methods: {

  tabsEvent(el) {
    this.activeIndex = el.id;
    this.favFlag = el.id === 0 ? false : true;

    if(el.id === 0 ){
      this.TestPingFn();
    }else if(el.id === 1 ){
      this.stopPing();
    }else{
      this.dosomething();
    }
  },
    dataInit() {
      this.deviceId = this.$parent.edgeName ;
      getPing({username:this.username,devNum:this.devData.vsrSeries}).then(res=>{
        if(res.result.rid!=""){
          this.rid = res.result.rid;
          this.ruleForm.host= res.result.param.host;
          this.ruleForm.ipAddress = res.result.param.ipAddress;
          this.ruleForm.timeOut = res.result.param.timeOut;
          this.ruleForm.dataBlockSize = res.result.param.dataBlockSize;
          this.ruleForm.numberOfRepetitions = res.result.param.numberOfRepetitions;

          if(res.result.result!=""){
            this.resultVal = res.result.result;
            this.msgShow(this.resultVal);
          }

        }else{
          this.ruleForm.host= "";
          this.ruleForm.ipAddress = "";
          this.ruleForm.timeOut = "1";
          this.ruleForm.dataBlockSize ="60";
          this.ruleForm.numberOfRepetitions = "5";
        }
      });

      getLogicPortIP({deviceId:this.deviceId}).then(res=>{
        this.options= res.result;
      })

    },
    TestPingFn(formName) {
      console.log("Ping Test 开始........................");
      this.$refs.formTs.validate(valid => {
        if (valid) {
          // this.initWs();
          this.getRid();
            this.ruleHost().then(res => {
              if (res) {
                let param = {
                  devSerNum: this.devData.vsrSeries,
                  rid: this.rid,
                  host: this.ruleForm.host,
                  ipAddress: this.ruleForm.ipAddress.split("/")[0],
                  timeOut: this.ruleForm.timeOut,
                  dataBlockSize: this.ruleForm.dataBlockSize,
                  numberOfRepetitions: this.ruleForm.numberOfRepetitions,
                  username : this.username,
                };
                vsreNetPing(param).then(res => {
                  if (res.code == 10000) {
                    savePing(param);//保存ping参数
                    //this.diagnoseResult[this.tabIndex].value = [this.$t("Monit.pingTestRun")];
                    this.diagnoseResult = [];
                    this.diagnoseResult.push({id: this.tabIndex,value: [this.$t("Monit.pingTestRun")]});
                    //this.setTimer();
                    this.resultVal = "";
                  }
                });
           }
         });
        }
      });
    },
    stopPing(){
      if(this.rid){
        stopPing({devSerNum:this.devData.vsrSeries,rid:this.rid,result:this.resultVal,username : this.username}).then(res => {
          if(res.code === 10000){
            this.dosomething("stop");
          }else{
            this.diagnoseResult = [];
            this.diagnoseResult.push({id: this.tabIndex,value: [this.$t("Monit.pingError")]});
            //this.setTimer();
            this.resultVal = "";
          }
        });
      }
    },
    //目标地址检查
    // Destination address check
    // Target address check
    ruleHost() {
      return networkdiagnosisCheckHost({ host: this.ruleForm.host }).then(res => {
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
    //获取诊断状态
    // Get diagnostic status
    //Get diagnostic status
    dosomething(stop) {
      if(this.rid){
        getVsrePing({
          devSerNum: this.devData.vsrSeries,
          rid: this.rid
        }).then(res => {
          if(res.code === 10000){
            /*if(this.resultVal==""){
              this.resultVal = res.result;
            }else{
              this.resultVal = this.resultVal+"#"+res.result;
            }*/
            this.resultVal = res.result;
            if(stop=="stop"){
              this.rid = "";
            }
          }
          this.msgShow(this.resultVal);
          updatePing({rid:this.rid,result:this.resultVal,username : this.username});//保存ping结果信息
        });
      }
    },
    //轮询调用
    // Polling calls
    //Polling calls
    setTimer() {
      /*this.myInterval = window.setInterval(() => {
        // setTimeout(() => {
        this.dosomething(); //调用接口的方法 Call the methods of the interface
                            // Call the methods of the interface
        // }, 1);
      }, 4000);*/
    },
    msgShow(msg) {
      if(msg!=null&&msg!=""){
        let arr = msg.split("#");
        let data = "";
        this.diagnoseResult=[];
        for(var i=0;i<arr.length ; i++){
          if(arr[i]==""){
            continue;
          }
          data  = JSON.parse(arr[i]);
          this.diagnoseResult.push({id: i,value: data });
        }
      }
    }
  },
  destroyed() {

  /*
   clearInterval(this.myInterval);
    if (this.socket) {
      this.closeWeb();
    }*/
  },
  created() {
    userInfo().then(res => {
      this.username = res.result.username;
      this.dataInit();
    });
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
  height: calc(100% - 6px);
  padding: 16px 20px 2px;
  h4 {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
}
.resultList {
  width: 100%;
  height: calc(100% - 2px);
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
    width: 100px;
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
  width: 100px;
}
.butTjYm{
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
.b {
  .el-select {
    width: 150px;
    .el-input {
      width: 150px;
    }
  }
}

.tabs {
  padding-top: 21px;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  li:nth-of-type(1){
    &:hover {
      background: #3678c8;
      color: white
    }
  }
  li:nth-of-type(2){
    &:hover {
      color: white;
      background: #3678c8;
    }
  }
  // li:nth-of-type(3){
  //   width: 150px;
  //   &:hover {
  //     color: white;
  //     background: #3678c8;
  //   }
  // }
  li {
    float: left;
    width: 156px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    text-align: center;
    line-height: 34px;
    margin-right: 18px;
    transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
    cursor: pointer;
  }
  .active {
    background: #3678c8;
    color: #fff;
    border: none;
    &:hover {
      background: #6095d6;
      border: none;
    }
  }
}
</style>