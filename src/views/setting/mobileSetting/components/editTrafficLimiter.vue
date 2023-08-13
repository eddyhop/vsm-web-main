<template>
  <div class="contents">
    <div :class="`inner devList ${lang == 'en' ? 'innerEn' : ''}`">
      <div class="top">
        <h2>{{ $t("Traffic.editTrafficLimiter") }}</h2>
        <i @click="$parent.showEditTrafficLimiter = false">
          <img src="../../../../assets/icon_close.png" alt />
        </i>
      </div>
      <div class="main">
        <div class="mainMiddle mainMiddleVpn">
          <el-form :inline="true" class="demo-form-inline form"  :rules="rules"  :model="editForm" ref="editForm"  >
            <el-form-item :label="$t('Mobile.name')" prop="name" label-width="155px" >
              <el-input v-model="editForm.name"  :placeholder="$t('Mobile.name')" style="width: 220px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Mobile.description')" prop="description"  label-width="155px"  >
              <el-input v-model="editForm.description" :placeholder="$t('Mobile.description')" style="width: 220px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Traffic.trafficProfile')" prop="trafficProfileId" label-width="155px">
              <el-select filterable clearable v-model="editForm.trafficProfileId" :placeholder="$t('Traffic.trafficProfile')"  style="width: 220px">
                <el-option
                    v-for="item in profileList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Mobile.priority')" prop="priority" label-width="155px">
                <el-input  v-model="editForm.priority" :placeholder="$t('Mobile.priority')" style="width: 220px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Traffic.destinationMatch')" prop="destMatch" label-width="155px" >
              <el-select filterable clearable v-model="editForm.destMatch" :placeholder="$t('Traffic.destinationMatch')" style="width: 220px" @change="destMatchChange">
                <el-option
                    v-for="item in dest"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Traffic.destinationName')" prop="destName" label-width="155px">
              <el-select filterable clearable v-model="editForm.destName" :placeholder="$t('Traffic.destinationName')" style="width: 220px">
                <el-option
                    v-for="item in destList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="clientName.startsWith(item.name) && editForm.destMatch=='Client'"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Traffic.applicationName')" prop="appName" label-width="155px" v-show="appShow">
              <el-select filterable clearable v-model="editForm.appName" :placeholder="$t('Traffic.applicationName')" style="width: 220px">
                <el-option
                    v-for="item in applist"
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
        <button class="save" v-debounce="save"  :disabled="isSave" >
          {{ $t("Mobile.save") }}
        </button>
        <button class="cancel" @click="$parent.showEditTrafficLimiter = false">
          {{ $t("Mobile.cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import {checkNameInUseTrafficLimiters,saveOrFlushTrafficLimiters,checkPriorityUseTrafficLimiters} from "@/services/index.js";
export default {
  data() {
    let checkNameUse = (rule, value, callback) => {
      if (value && value != this.initialName) {
        checkNameInUseTrafficLimiters({ name: value, tenantId: this.tenantId, type: this.type }).then( (res) => {
                if (res.code == 10000) {
                  callback();
                } else {
                  callback(new Error(this.$t("vsr1000.remind[6]")));
                }
              }
          );
      } else if(value === this.initialName) {
        callback();
      }
    };
    var NumRule = (rule, value, callback) => {

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
      if(value && value != this.initialPriority){
        checkPriorityUseTrafficLimiters({priority: value, tenantId: this.tenantId, type: this.type, connectionId: this.clientId}).then(res => {
             if (res.code == 10000) {
               callback()
             } else {
               callback(new Error(this.$t("subscription.firewall.remind[7]")))
             }
           });
      } else if(value === this.initialPriority) {
        callback();
      }
    };
    return {
      isSave:false,
      fullscreenLoading: false,
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
        appName: [
          {
            required: true,
            message: this.$t('Mobile.enterAppName'),
            trigger: "change"
          }
        ],
      },
      lang: "",
      tenantId: "",
      type:"",
      initialName:"",
      initialPriority:"",
      clientName: "",
      clientId: "",
      editForm: {
        id: "",
        tenantId: "",
        name: "",
        description:"",
        trafficProfileId:"",
        priority:"",
        destMatch:"Client Group",
        destName:"",
        appName:"",
      },
      params: {},
      trafficProfilesData:[],
      profileList:[],
      dest:[{id:"Client Group",name:"Client Group"},{id:"Client",name:"Client"},{id:"Application",name:"Application"}],
      destList:[],
      applist:[],
      clientList:[],
      clientGroupList:[],
      destDisabled:true,
      appShow:true,
    };
  },
  created() {
    this.lang = sessionStorage.getItem("lang");
    this.tenantId = sessionStorage.getItem("tenantValue");
  },
  methods: {
    destMatchChange(){
      this.destDisabled = false;
      this.appShow = true;
      this.destList = [];
      if(this.editForm.destMatch == "Client Group"){
           this.destList = this.clientGroupList;
      }else if (this.editForm.destMatch == "Client"){
           this.destList = this.clientList;
      }else if (this.editForm.destMatch == "Application"){
           this.destList = this.applist;
           this.appShow = false;
      }

      this.rules.appName[0].required = this.appShow ;

    },
    dataInitForEdit(row, clientName) {
      this.initialName=row.name;
      this.initialPriority=row.priority;
      this.initialDestValue=row.destName;
      this.editForm.id=row.id;
      this.editForm.description=row.description;
      this.editForm.name=row.name;
      this.editForm.trafficProfileId=row.trafficProfileId;
      this.editForm.priority=row.priority;
      this.editForm.destMatch=row.destMatch;
      this.editForm.destName=row.destName;
      this.editForm.appName=row.appName;
      this.tenantId=row.tenantId;
      this.clientName=clientName;

      this.isSave = false;
      this.editForm.tenantId = this.tenantId;
      this.destMatchChange();

    },    // 保存
    // save
    save() {
      this.isSave = true;
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if(this.editForm.destMatch == "Application"){
            this.editForm.appName = this.editForm.destName;
          }
          let params = {
            id: this.editForm.id,
            name: this.editForm.name,
            description: this.editForm.description,
            type: this.type,
            priority: this.editForm.priority,
            destMatch: this.editForm.destMatch,
            destName: this.editForm.destName,
            trafficProfileId: this.editForm.trafficProfileId,
            appName: this.editForm.appName,
            tenantId:this.editForm.tenantId,
            clientId:this.clientId,
          };

          saveOrFlushTrafficLimiters(params).then((res) => {
            if (res.code === 10000) {
              this.$refs.editForm.resetFields();
              this.$parent.showEditTrafficLimiter = false;
              this.$message({
                message: this.$t("Mobile.hint8"),
                type: "success",
              });
            } else {
              this.$message({
                type: "warning",
                message: res.message,
              });
            }
            this.$parent.forSearchList();
          });
        } else {
          console.log("error submit!!");
          this.isSave = false;
          return false;
        }
      });
    },
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
    font-family: arial, sans-serif;
    line-height: 34px;
    padding-right: 7px;
    color: #333333;
    white-space: wrap;
  }
  .el-form-item {
    height: 35px;
    margin: 0px;
    font-family: arial, sans-serif;
  }
  .el-form--inline .el-form-item:nth-child(2) {
    margin-right: 0px;
  }
  .el-form-item__error {
    top: 90%;
  }
  .el-form-item {
    font-family: arial, sans-serif;
    width: 50%;
    padding: 6px 0;
    box-sizing: content-box;
    font-family: arial, sans-serif;
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
