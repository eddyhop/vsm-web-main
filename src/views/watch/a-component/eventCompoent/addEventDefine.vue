<template>
  <div class="addzh" id="adEvent">
    <div class="cont">
      <div class="title">
        {{$t('Alarm.add')}} {{$t('Alarm.eventDefinition')}}
        <span @click="close"></span>
      </div>
      <div class="even">
        <el-form :model="inputMessage" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm"  @submit.native.prevent>
          <el-form-item
            :label="$t('Alarm.eventName')"
            prop="eventName"
          >
            <el-input
              v-model="inputMessage.eventName"
              autocomplete="off"
              :placeholder="$t('Alarm.hint2')"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item
            :label="$t('Alarm.eventDefinition')"
            prop="eventTypeName"
            :rules="[{ required: true, message: $t('Alarm.hint3')}]"
          >
            <el-select filterable v-model="inputMessage.eventTypeName">
              <el-option v-for="(item,index) in choseList" :key="index" :label="item.eventName" :value="item.eventNum"></el-option>
            </el-select>
          </el-form-item> -->
          <span class="ecee">
            <el-form-item label=""  label-width="71px"
              prop="eventTypeName"
            >
              <div class="region" style="display:flex;margin-left:35px">
                <div style="margin-left:5px;margin-right:5px;" :class="lang=='en'?'enlab':''" v-show="leftShow">{{$t('Alarm.eventThresholdValue')}}</div>
                <el-input
                  v-model.number="worth"
                  autocomplete="off"
                  :placeholder="$t('Alarm.value')"
                  v-show="leftShow"
                ></el-input>
                <div style="margin-left:5px;margin-right:5px;" v-show="leftShow">{{$t('Alarm.character')}}</div>
                <el-select filterable v-model="region" v-show="leftShow">
                  <el-option label="<" value="<"></el-option>
                  <el-option label="=" value="="></el-option>
                  <el-option label="<=" value="<="></el-option>
                </el-select>  
                
                <div style="margin-left:5px;margin-right:5px;" :class="lang=='en'?'enlab':''">{{$t('Alarm.eventDefinition')}}</div>
                <el-select filterable v-model.number="inputMessage.eventTypeName" @change="choseEve">
                  <el-option v-for="(item,index) in choseList" :key="index" :label="lang=='en'? item.eventNameEn : item.eventName" :value="item.eventNum"></el-option>
                </el-select>
                <div style="margin-left:5px;margin-right:5px;" v-show="rightShow">{{$t('Alarm.character')}}</div>
                <el-select filterable v-model="region1" v-show="rightShow">
                  <el-option :label="$t('Alarm.none')" value=""></el-option>
                  <el-option label="<" value="<"></el-option>
                  <el-option label="=" value="="></el-option>
                  <el-option label="<=" value="<="></el-option>
                </el-select>  
                <div style="margin-left:5px;margin-right:5px;" :class="lang=='en'?'enlab':''" v-show="rightShow">{{$t('Alarm.eventThresholdValue')}}</div>
                <el-input
                  v-model.number="worth1"
                  autocomplete="off"
                  :placeholder="$t('Alarm.value')"
                  v-show="rightShow"
                ></el-input>
              </div>
            </el-form-item>
          </span>
          <el-form-item
            :label="$t('Alarm.continueTime')"
            prop="keepTime"
            :rules="[{ required: true, message: $t('Alarm.hint3')},
            {pattern:  /^\+?[1-9]\d*$/, message: $t('Alarm.hint13')}]"
          >
            <span class="time-limit">
              <el-input
                v-model.number="inputMessage.keepTime"
                autocomplete="off"
                :placeholder="$t('Alarm.hint14')"
                id="input"
              ></el-input>
            </span>
            <el-select filterable v-model="selectTime" id="select">
              <!-- <el-option :label="$t('Alarm.seconds')" value="second"></el-option> -->
              <el-option :label="$t('Alarm.minutes')" value="minute"></el-option>
              <!-- <el-option :label="$t('Alarm.hours')" value="hour"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('Alarm.alarmRank')"
            prop="warningLevelName"
            :rules="[{ required: true, message: $t('Alarm.hint3')}]"
          >
            <el-select filterable v-model="inputMessage.warningLevelName" :disabled="couldChose">
              <el-option :label="$t('Alarm.normal1')" :value="$t('Alarm.normal1')"></el-option>
              <el-option :label="$t('Alarm.serious1')" :value="$t('Alarm.serious1')"></el-option>
              <!-- <el-option label="紧急" value="紧急"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item id="button">
            <!-- <el-button v-debounce="submitForm" class="save bg">{{$t('Alarm.save')}}</el-button> -->
            <el-button v-debounce="submitForm"  class="off">{{$t('Alarm.next')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { addRow,checkWarningEventName } from "@/services/index.js";
export default {
  data() {
    var checkName = (rule, value, callback) => {
      //设备离线
      // Equipment offline
      if(value==5){
        callback()
      }else if(value==6){//流量
                         // traffic
        if(typeof(this.worth)!='number'){
          callback(new Error(this.$t('Alarm.remind1')))
        }else{
          if(this.worth<0){
            callback(new Error(this.$t('Alarm.remind2')))
          }else{
            callback()
          }
        }
      }else if(value==7){//专网链接中断
                         // The private network link is broken
        if(typeof(this.worth)!='number'){
          callback(new Error(this.$t('Alarm.remind1')))
        }else{
          if(this.worth>100||this.worth<0){
            callback(new Error(this.$t('Alarm.remind3')))
          }else{
            callback()
          }
        }
      }else if(value==1||value==2){//CPU和内存
                                   // CPU and memory
        if(typeof(this.worth)!='number'||typeof(this.worth1)!='number'||this.worth<0||this.worth1<0){
          callback(new Error(this.$t('Alarm.remind1')))
        }else{
          if(this.region1!=""){
            if(this.worth>=this.worth1||this.worth>100||this.worth1>100){
              callback(new Error(this.$t('Alarm.remind4')))
            }else{
              callback()
            }
          }else{
            if(this.worth>100||this.worth1>100){
              callback(new Error(this.$t('Alarm.remind5')))
            }else{
              callback()
            }
          }
        }
      }
      else{//其它
           // other
        if(typeof(this.worth)!='number'||typeof(this.worth1)!='number'||this.worth<0||this.worth1<0){
          callback(new Error(this.$t('Alarm.remind1')))
        }else{
          if(this.region1!=''){
            if(this.worth>=this.worth1){
              callback(new Error(this.$t('Alarm.remind6')))
            }else{
              callback()
            }  
          }else{
            callback()
          }
        }
      }
    }
    var name = (rule, value, callback)=>{
        if(value){
          checkWarningEventName({eventName:value,tenantId:this.tenantId}).then(res=>{
            if(res.code==10000){
              callback()
            }else{
              callback(new Error(this.$t('Alarm.remind7')))
            }
          })
        }
    }
    return {
      lang: sessionStorage.getItem('lang'),
      leftShow:true,
      rightShow:true,
      couldChose: false,
      inputMessage: {
        eventName: "",
        eventTypeName: 1,
        thresholdNum: "",
        keepTime: "",
        warningLevelName: ""
      },
      selectTime: this.$t("Alarm.minutes"),
      choseList: [],
      region: "<",
      region1: "<",
      worth: 0,
      worth1: 0,
      rules:{
        eventTypeName:[
            { required: true, message: this.$t('Alarm.hint3'), trigger: 'blur' },
            { validator: checkName, trigger: 'change' }
        ],
        eventName:[
          { required: true, message: this.$t('Alarm.hint3'), trigger: 'blur' },
          { validator: name, trigger: 'change' }
        ]
      }
    };
  },
  created() {
    this.tenantId =JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId || "";
  },
  methods: {
    choseEve(val){
      //设备离线
      // Equipment offline
      if(val==5){
        this.leftShow = false
        this.rightShow = false
        this.region1 = ""
        this.region = ""
        this.inputMessage.warningLevelName = this.$t('Alarm.urgency')
        this.couldChose = true
      }else if(val==6){//时延，专网链接中断
                       // Delay, interrupt private network link
        this.rightShow = false
        this.leftShow = true
        this.region1 = ""
        this.inputMessage.warningLevelName = this.$t('Alarm.normal1')
        this.couldChose = false
      }else if(val==7){//时延，专网链接中断
                       // Delay, interrupt private network link
        this.rightShow = false
        this.leftShow = true
        this.region1 = ""
        this.inputMessage.warningLevelName = this.$t('Alarm.urgency')
        this.couldChose = true
      }
      else{
        this.leftShow = true
        this.rightShow = true
        this.region1 = "<"
        this.region = "<"
        this.inputMessage.warningLevelName = this.$t('Alarm.normal1')
        this.couldChose = false
      }
    },
    close() {
      this.$parent.addShow = false;
    },
    submitForm(formName) {
      let time = this.inputMessage.keepTime;
      if (this.selectTime === "second") {
        time = parseInt(this.inputMessage.keepTime / 60);
        if (
          this.inputMessage.keepTime / 60 > 0 &&
          this.inputMessage.keepTime / 60 < 1
        ) {
          time = 1;
        }
      } else if (this.selectTime === "hour") {
        time = parseInt(this.inputMessage.keepTime * 60);
      }
      let eventTypeName = ""
      this.choseList.map(item=>{if(item.eventNum==this.inputMessage.eventTypeName){
        //当中文的时间名称不为undefined，说明item中的是eventName
        if (item.eventName != undefined){
            eventTypeName = item.eventName;
          }else{//否则就是eventNameEn
            eventTypeName = item.eventNameEn;
          }
      }})
      let params = {
        // deviceSerNums: "",
        tenantId: this.tenantId,
        eventName: this.inputMessage.eventName,
        eventTypeName: eventTypeName,
        keepTime: time,
        // thresholdNum: this.inputMessage.thresholdNum,
        warningLevelName: this.inputMessage.warningLevelName,
        operator: this.region,
        operatorNum: this.worth,
        nextOperator: this.region1,
        nextOperatorNum: this.region1 =='' ? 0 : this.worth1,
      };
      // this.$parent.addInfo = params
      // console.log(this.$parent.addInfo)
      let message1 = this.$t("Alarm.hint5");
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.$parent.addShow = false;
          this.$parent.addInfo = params
          this.$parent.addShow=false
          this.$parent.choseDevShow=true
          // addRow(params).then(res => {
          //   if (res.code === 10000) {
          //     sessionStorage.setItem('eventId',res.result.id)
          //     this.$parent.getTableInfor();
          //     this.$message({
          //       message: message1,
          //       type: "success"
          //     });
          //   } else {
          //     this.$message({
          //       message: res.message,
          //       type: "warning"
          //     });
          //   }
          // });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$parent.addShow = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.cont {
  min-width: 462px;
  min-height: 07px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -531px;
  margin-top: -253.5px;
  box-shadow: 0px 10px 20px 0px rgba(102, 102, 102, 0.1);
  border-radius: 7px;
  box-sizing: border-box;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    width: 100%;
    border-bottom: 1px solid #d1d7e0;
    padding: 16px 20px 12px;
    span {
      display: inline-block;
      width: 14px;
      height: 14px;
      background-image: url("../../../../assets/icon_close.png");
      background-size: 100%;
    }
  }
}
.addzh {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9;
  background: rgba(32, 42, 59, 0.2);
}
.even {
  padding: 30px;
  box-sizing: border-box;
  .enlab{
    line-height: normal;
    width: 70px;
  }
  .threshold {
    position: relative;
    span {
      position: absolute;
      top: 0;
      right: 7px;
      color: rgba(51, 51, 51, 1);
    }
  }
}
</style>
<style lang="scss">
#adEvent {
  .ecee{
    .el-form-item__error{
      margin-left: 100px !important;
    }
  }
  .time-limit{
    .el-input__inner {
      width: 743px !important;
    }
  }
  .region{
    
    .el-input__inner {
      width: 126px !important;
      height: 34px !important;
      padding-left: 11px !important;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: #333333;
    }  
  }
  .even .el-form-item__label {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    padding: 0px;
  }
  .el-form-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 26px;
    height: 34px;
  }
  .el-form-item__content {
    margin-left: 10px !important;
    display: flex;
  }
  .el-input__inner {
    width: 867px !important;
    height: 34px !important;
    padding-left: 11px !important;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: #333333;
  }
  #input {
    // width: 200px !important;
    margin-right: 10px;
  }
  #select {
    width: 113px !important;
  }
  .el-input {
    width: auto;
    height: auto;
  }
  .save {
    width: 100px;
    height: 34px;
    background: #fff;
    border-radius: 7px;
    color: #666666;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    line-height: 34px;
    padding: 0px;
    border: none;
  }
  .off {
    width: 70px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    line-height: 34px;
    padding: 0px;
    margin-left: 18px;
    &:hover {
      background: #3678c8;
      color: #fff;
      border: none;
    }
  }
  #button {
    display: flex;
    justify-content: center;
    .bg {
      background: #3678c8;
      color: #fff;
      border: none;
      &:hover {
        background: #6095d6;
        border: none;
      }
    }
  }
  .el-form-item__error {
    left: 11px;
  }
}
</style>