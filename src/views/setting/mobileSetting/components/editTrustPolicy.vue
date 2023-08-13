<template>
  <div class="contents">
    <div :class="`inner devList ${lang == 'en' ? 'innerEn' : ''}`">
      <div class="top">
        <h2>{{ $t("Mobile.editTrustPolicy") }}</h2>
        <i @click="$parent.showEditTrust = false">
          <img src="../../../../assets/icon_close.png" alt />
        </i>
      </div>
      <div class="main">
        <div class="mainMiddle mainMiddleVpn">
          <el-form :inline="true" class="demo-form-inline form"  :rules="rules"  :model="form" ref="form"  >
            <el-form-item :label="$t('Mobile.name')"  prop="name"  label-width="155px" >
              <el-input v-model="form.name"  :placeholder="$t('Mobile.name')" style="width: 220px" :disabled="isDefault"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Mobile.description')" prop="description"  label-width="155px"  >
              <el-input v-model="form.description" :placeholder="$t('Mobile.description')" style="width: 220px" :disabled="isDefault"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Mobile.action')" prop="action" label-width="155px">
              <el-select filterable clearable v-model="form.action" :placeholder="$t('Mobile.action')"  style="width: 220px">
                <el-option
                    v-for="item in actions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Mobile.priority')" prop="priority" label-width="155px">
              <el-input  v-model="form.priority" :placeholder="$t('Mobile.priority')" style="width: 220px" :disabled="isDefault"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Mobile.sourceMatch')" prop="sourceMatch" label-width="155px" >
              <el-select filterable clearable v-model="form.sourceMatch" :placeholder="$t('Mobile.sourceMatch')" disabled style="width: 220px">
                <el-option
                    v-for="item in source1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Mobile.sourceName')" prop="sourceName" label-width="155px">
              <el-select filterable clearable v-model="form.sourceName" :placeholder="$t('Mobile.sourceName')" disabled style="width: 220px">
                <el-option
                    v-for="item in source2"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Mobile.destMatch')" prop="destMatch" label-width="155px">
              <el-select filterable clearable v-model="form.destMatch" :placeholder="$t('Mobile.destMatch')"  style="width: 220px" @change="destMatchChange">
                <el-option
                    v-for="item in dest"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Mobile.destName')" prop="destName" label-width="155px">
              <el-select filterable clearable v-model="form.destName" :placeholder="$t('Mobile.destName')"  :disabled="destDisabled" style="width: 220px">
                <el-option
                    v-for="item in destList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="item.id==form.sourceName && form.sourceMatch=='Client'"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Mobile.appMatch')" prop="appMatch" label-width="155px" v-show="appShow">
              <el-select filterable clearable v-model="form.appMatch" :placeholder="$t('Mobile.appMatch')"  style="width: 220px" @change="appMatchChange">
                <el-option
                    v-for="item in appM"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>

            </el-form-item>
            <el-form-item :label="$t('Mobile.appName')" prop="appName" label-width="155px" v-show="appShow">
              <el-select filterable clearable v-model="form.appName" :placeholder="$t('Mobile.appName')"  :disabled="appDisabled" style="width: 220px">
                <el-option
                    v-for="item in applicationList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Mobile.reflexive')" prop="reflexive" label-width="155px">
              <el-select filterable clearable v-model="form.reflexive" :placeholder="$t('Mobile.reflexive')"  style="width: 220px">
                <el-option
                    v-for="item in reflexiveOpt"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>

            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="footer">
        <button class="save" v-debounce="save">
          {{ $t("Mobile.save") }}
        </button>
        <button class="cancel" @click="$parent.showEditTrust = false">
          {{ $t("Mobile.cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import {trustPolicyCanNameUse,addTrustPolocy,trustSelectOptions,trustPolicyCanPriorityUse} from "@/services/index.js";
export default {
  data() {
    let checkNameUse = (rule, value, callback) => {
      if(this.isDefault){
        callback();
      }
      if (value) {
        if(this.form.name != this.form.oldname){
          trustPolicyCanNameUse({ name: value, tenantId: this.tenantId , type: this.type }).then( (res) => {
                if (res.code == 10000) {
                  callback();
                } else {
                  callback(new Error(this.$t("vsr1000.remind[6]")));
                }
              }
          );
        }else{
          callback();
        }
      }
    };
    var NumRule = (rule, value, callback) => {

      if(this.isDefault){
        callback();
      }
      let val = value * 1;
      let reg = /^[0-9]*$/;
      if (reg.test(val)) {
        if (val >= 1 && val <= 65535) {
          callback();
        } else {
          callback(new Error(this.$t('vsr1000.aclremind[10]')));
        }
      } else {
        callback(new Error(this.$t("vsr1000.aclremind[10]")));
      }
    };
    let checkPriority = (rule,value,callback) => {
      if(value){
        if(this.form.priority != this.form.oldpriority){
          trustPolicyCanPriorityUse({priority: value, clientId: this.form.clientId}).then(res => {
            if (res.code == 10000) {
              callback()
            } else {
              callback(new Error(this.$t("subscription.firewall.remind[7]")))
            }
          });
        }else{
          callback()
        }

      }
    };
    return {
      rules: {
        name: [
          {
            required: true,
            message: this.$t("Mobile.enterName"),
            trigger: "blur"
          },{
            validator: checkNameUse, trigger: "blur"
          }
        ],
        action: [
          {
            required: true,
            message: this.$t("Mobile.enterAction"),
            trigger: "blur"
          }
        ],
        priority: [
          {
            required: true,
            message: this.$t('Mobile.enterPriority'),
            trigger: "blur"
          },{
            validator: NumRule, trigger: "blur"
          },{
            validator: checkPriority, trigger: "blur"
          }
        ],
        sourceMatch: [
          {
            required: true,
            message: this.$t("Mobile.enterSourceMatch"),
            trigger: "blur"
          }
        ],
        sourceName: [
          {
            required: true,
            message: this.$t("Mobile.enterSourceName"),
            trigger: "blur"
          }
        ],
        destMatch: [
          {
            required: true,
            message: this.$t("Mobile.enterDestMatch"),
            trigger: "blur"
          }
        ],
        destName: [
          {
            required: true,
            message: this.$t("Mobile.enterDestName"),
            trigger: "blur"
          }
        ],
        appMatch: [
          {
            required: true,
            message: this.$t('Mobile.enterAppMatch'),
            trigger: "change"
          }
        ],
        appName: [
          {
            required: true,
            message: this.$t('Mobile.enterAppName'),
            trigger: "change"
          }
        ],
        reflexive: [
          {
            required: true,
            message: this.$t('Mobile.enterReflexive'),
            trigger: "change"
          }
        ]
      },
      lang: "",
      tenantId: "",
      type:"",
      clientName: "",
      clientId: "",
      isDefault: false,
      form: {
        id: "",
        tenantId: "",
        clientId: "",
        name: "",
        oldname:"",
        description:"",
        action:"",
        priority:"",
        oldpriority:"",
        sourceMatch:"Client Group",
        sourceName:"",
        destMatch:"",
        destName:"Any",
        appMatch:"",
        appName:"Any",
        reflexive:"Yes",
      },
      params: {},
      actions:[{id:"1",name:"Permit"},{id:"0",name:"Deny"}],
      source1:[{id:'Client Group',name:'Client Group'},{id:'Client',name:'Client'}],
      source2:[{id:'',name:''}],
      dest:[{id:"Client Group",name:"Client Group"},{id:"Client",name:"Client"},{id:"Application Group",name:"Application Group"},{id:"Application",name:"Application"}],
      destList:[],
      applicationList:[],
      appM:[{id:"Application Group",name:"Application Group"},{id:"Application",name:"Application"}],
      reflexiveOpt:[{id:"Yes",name:"Yes"},{id:"No",name:"No"}],
      applist:[],
      appGrouplist:[],
      clientList:[],
      clientGroupList:[],
      destDisabled:true,
      appDisabled:true,
      appShow:true,
    };
  },
  created() {
    this.lang = sessionStorage.getItem("lang");
    this.tenantId = sessionStorage.getItem("tenantValue");
  },
  methods: {
    destMatchChange(){
   //   this.form.destName = "Any";
      this.destDisabled = false;
      this.appShow = true;
      this.destList = [];
      if(this.form.destMatch == "Client Group"){
        this.destList = this.clientGroupList;
      }else if (this.form.destMatch == "Client"){
        this.destList = this.clientList;
      }else if (this.form.destMatch == "Application Group"){
        this.destList = this.appGrouplist;
        this.appShow = false;
      }else if (this.form.destMatch == "Application"){
        this.destList = this.applist;
        this.appShow = false;
      }

      this.rules.appMatch[0].required = this.appShow ;
      this.rules.appName[0].required = this.appShow ;

    },
    appMatchChange(){
      this.appDisabled = false;
      this.applicationList = [];
      if (this.form.appMatch == "Application Group"){
        this.applicationList = this.appGrouplist;
      }else if (this.form.appMatch == "Application"){
        this.applicationList = this.applist;
      }
    },
    // 保存
    // save
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.appShow){
            this.form.appMatch = "";
            this.form.appName = "";
          }
          let params = {
            id:this.form.id,
            name: this.form.name,
            description: this.form.description,
            action: this.form.action,
            type: this.type,
            priority: this.form.priority,
            sourceMatch: this.form.sourceMatch,
            sourceName: this.form.sourceName,
            destMatch: this.form.destMatch,
            destName: this.form.destName,
            appMatch: this.form.appMatch,
            appName: this.form.appName,
            reflexive: this.form.reflexive,
            tenantId:this.form.tenantId,
            clientId:this.form.clientId,
          };
          addTrustPolocy(params).then((res) => {
            if (res.code === 10000) {
              this.$refs.form.resetFields();
              this.$parent.showEditTrust = false;
              this.$message({
                message: this.$t("Mobile.hint8"),
                type: "success",
              });
              this.$parent.trustPolicyList();

            } else {
              this.$message({
                type: "warning",
                message: res.message,
              });
              this.$parent.showEditTrust = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    dataInit(row,clientName) {
      this.isDefault = false;
      this.form.id = row.id;
      this.form.name = row.name;
      this.form.oldname = row.name;
      if(row.description==null){
        this.form.description = "";
      }else{
        this.form.description = row.description;
      }
      this.form.action = row.action;
      this.form.type = row.type;
      this.form.priority = row.priority;
      this.form.oldpriority = row.priority;
      this.form.sourceMatch = row.sourceMatch;
      this.form.sourceName = row.sourceName;
      this.form.destMatch = row.destMatch;
      this.form.destName = row.destName;
      this.form.appMatch = row.appMatch;
      this.form.appName = row.appName;
      this.form.reflexive = row.reflexive;
      this.form.tenantId = row.tenantId;
      this.form.clientId = row.clientId;

      if(row.priority=="65536"&&row.description=="This is the default trust policy"){
        this.isDefault = true;
      }
      let sName = clientName;
      if(row.type == "2"){
        sName = clientName.split("@")[0];
        this.form.sourceMatch = "Client";
      }
      this.clientName = sName;
      this.source2[0].id = row.clientId;
      this.source2[0].name = sName;

      this.type = row.type;
      trustSelectOptions({tenantId:row.tenantId}).then((res)=>{
        if (res.code === 10000) {
          this.applist =  res.result.app;
          this.appGrouplist = res.result.appGroup;
          this.clientList = res.result.client;
          this.clientGroupList = res.result.clientGroup;

          this.destMatchChange();
          this.appMatchChange();

        }
      });

    }
  },
};
</script>
<style lang="scss" scoped>
.contents {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(32, 42, 59, 0.5);
  top: 0;
  left: 0;
  z-index: 10;
  .inner {
    width: 600px;
    max-height: 550px;
    padding-bottom: 20px;
    overflow: auto;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .top {
      display: flex;
      height: 48px;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      border-bottom: 1px solid #d1d7e0;
      margin-bottom: 30px;
      h2 {
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      i {
        img {
          width: 14px;
          height: 14px;
        }
      }
    }
    .main {
      .mainTop {
        display: flex;
        padding-left: 50px;
        color: #333333;
        font-family: arial, sans-serif;
        font-weight: 400;
        margin-bottom: 30px;
        .right {
          margin-right: 80px;
          span:nth-child(1) {
            margin-right: 12px;
          }
        }
      }
      .mainTopen {
        padding-left: 110px;
      }
      .mainMiddle {
        width: 100%;
        // border: 1px solid #d1d7e0;
        margin: 0 auto;
        padding: 0;
        display: flex;
        justify-content: space-between;
        .form {
          width: 100%;
          .add {
            display: block;
            width: 34px;
            height: 34px;
            background: rgba(255, 255, 255, 1);
            border-radius: 7px;
            border: 1px solid rgba(209, 215, 224, 1);
            background: url("../../../../assets/newPage/deviceconfiguration_icon_arp_add@2x.png")
            no-repeat center;
            background-size: 16px 16px;
          }
          .del {
            display: block;
            width: 34px;
            height: 34px;
            background: rgba(255, 255, 255, 1);
            border-radius: 7px;
            border: 1px solid rgba(209, 215, 224, 1);
            background: url("../../../../assets/newPage/deviceconfiguration_icon_arp_delete@2x.png")
            no-repeat center;
            background-size: 16px 16px;
          }
        }
      }
      .mainFooter {
        // padding-left: 50px;
        // display: flex;
        position: relative;
        .left {
          width: 50%;
          .form {
            margin-bottom: 14px;
          }
          .add {
            display: block;
            width: 34px;
            height: 34px;
            background: rgba(255, 255, 255, 1);
            border-radius: 7px;
            border: 1px solid rgba(209, 215, 224, 1);
            background: url("../../../../assets/newPage/deviceconfiguration_icon_arp_add@2x.png")
            no-repeat center;
            background-size: 16px 16px;
            position: absolute;
            right: -40px;
            top: 0;
          }
          .del {
            display: block;
            width: 34px;
            height: 34px;
            background: rgba(255, 255, 255, 1);
            border-radius: 7px;
            border: 1px solid rgba(209, 215, 224, 1);
            background: url("../../../../assets/newPage/deviceconfiguration_icon_arp_delete@2x.png")
            no-repeat center;
            background-size: 16px 16px;
            position: absolute;
            right: -40px;
            top: 0;
          }
        }
      }
    }
    .footer {
      margin-top: 5px;
      text-align: center;
      .save {
        margin-right: 18px;
        width: 100px;
        height: 34px;
        background: rgba(54, 120, 200, 1);
        border-radius: 7px;
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        border: none;
        outline: none;
        &:hover {
          background: #6095d6;
        }
      }
      .cancel {
        width: 90px;
        height: 34px;
        background: rgba(255, 255, 255, 1);
        border-radius: 7px;
        border: 1px solid rgba(209, 215, 224, 1);
        outline: none;
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        &:hover {
          background: rgba(54, 120, 200, 1);
          color: #fff;
          border-color: rgba(54, 120, 200, 1);
        }
      }
    }
  }
  .innerEn {
    width: 800px;
  }
  .el-input__inner {
    width: 395px;
    height: 34px;
    line-height: 0px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-left: 10px;
  }
  .el-form-item {
    height: 70px;
    margin: 0px;
  }
}
.devList::-webkit-scrollbar {
  width: 4px;
}

.devList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

.devList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>
<style lang="scss">
.VpnPop {
  .el-form-item__content {
    line-height: 0px;
  }
  .el-input__inner {
    width: 195px;
    height: 34px;
    line-height: 0px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-left: 10px;
  }
  .el-form-item__label {
    // width:63px;
    line-height: 34px;
    padding-right: 7px;
    color: #333333;
    white-space: wrap;
  }
  .el-form-item {
    height: 35px;
    margin: 0px;
  }
  .el-form--inline .el-form-item:nth-child(2) {
    margin-right: 0px;
  }
  .el-form-item__error {
    top: 90%;
  }
  .el-form-item {
    width: 50%;
    padding: 6px 0;
    box-sizing: content-box;
  }
  .left {
    .el-form-item {
      width: 100%;
    }
  }
  .prRight {
    position: absolute;
    right: 0;
    top: 0;
    width: 50%;
    .el-form-item {
      width: 100%;
    }
  }
}
</style>
