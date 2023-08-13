<template>
  <div class="contents VpnPop">
    <div :class="`inner devList ${lang == 'en' ? 'innerEn' : ''}`">
      <div class="top">
        <h2>{{ $t("Mobile.editConnection") }}</h2>
        <i @click="onClose">
          <img src="../../../../assets/icon_close.png" alt />
        </i>
      </div>
      <div class="main">
        <div class="mainMiddle mainMiddleVpn">
          <el-form :inline="true" class="demo-form-inline form"  :rules="rules"  :model="form" ref="form"  >
            <el-form-item :label="$t('Mobile.name')"  prop="name"  label-width="125px" >
              <el-input v-model="form.name"  :placeholder="$t('Mobile.name')" width = "300"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Mobile.description')" prop="description"  label-width="125px"  >
              <el-input v-model="form.description" :placeholder="$t('Mobile.description')" ></el-input>
            </el-form-item>
            <el-form-item :label="$t('Mobile.IPAddress')"  prop="ip" label-width="125px"  >
              <el-autocomplete
                  v-model="form.ip"
                  :fetch-suggestions="querySearch"
                  :placeholder="$t('Mobile.IPAddress')"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item :label="$t('Mobile.Preference')"  prop="preference" label-width="125px" >
              <el-input v-model="form.preference" :placeholder="$t('Mobile.Preference')"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="footer">
        <button class="save" v-debounce="save">
          {{ $t("Mobile.save") }}
        </button>
        <button class="cancel" @click="onClose">
          {{ $t("Mobile.cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import {connIsNameUse,uptConnection,getclientGroupIPList} from "@/services/index.js";
export default {
  data() {
    let checkNameUse = (rule, value, callback) => {
      if (value) {
        if(this.form.name != this.form.oldName){
          connIsNameUse({ name: value, tenantId: this.tenantId }).then( (res) => {
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
        if(value!=this.oldPriority) {
         /* firewalldIsOnlyPriority({priority: value, deviceId: this.deviceId}).then(res => {
            if (res.code == 10000) {
              callback()
            } else {
              callback(new Error(this.$t("subscription.firewall.remind[7]")))
            }
          })*/
          callback()
        }else{
          callback()
        }
      }
    };
    let chkip = (rule, value, callback) => {
      if (value) {
        let reg  = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error(this.$t("vsr1000.greRule[2]")));
        }
      }
    };

    let chkVal = (rule, value, callback) => {
      if (value) {
        if(value != this.form.oldip){
          let bl = false;
          this.ipList.forEach(item =>{
            if(value == item.ip){
              bl = true;
            }
          });
          if(bl){
            sessionStorage.removeItem("clientsData")
            callback();
          }else{
            const currentClientsData = JSON.parse(sessionStorage.getItem("clientsData"))
            var matchingClientData = currentClientsData.filter((d) => {
              return d.cgId == this.form.groupId
            });
            matchingClientData = matchingClientData.filter((e) => {
              return e.connectionIp == value
            })
            if(matchingClientData.length>0) {
              callback(new Error(this.$t("Mobile.ipAddressInUse")));
            } else {
              callback(new Error(this.$t("Mobile.ipAddressOutOfClientGroup")));
            }
          }
        }else{
          sessionStorage.removeItem("clientsData")
          callback();
        }
      }
    };

    return {
      rules: {
        name: [
          {
            required: true,
            message: this.$t("Mobile.enterName"),
            trigger: "blur",
          },
          { validator: checkNameUse, trigger: "blur" },
        ],
        ip: [
          {
            required: true,
            message: this.$t("Mobile.enterIP"),
            trigger: "blur",
          },
          {
            validator: chkip, trigger: "blur"
          },
          {
            validator: chkVal, trigger: "blur"
          }
        ],
        preference: [
          {
            required: true,
            message: this.$t('Mobile.enterPreference'),
            trigger: "blur"
          },
          {
            validator: NumRule, trigger: "blur"
          },
          {
            validator:checkPriority , trigger: "blur"
          }
        ]
      },
      lang: "",
      tenantId: "",
      searchVal: "",
      initLock: true,
      form: {
        id: "",
        description: "",
        name: "",
        oldName:"",
        ip: "",
        oldip: "",
        preference: "",
        tenantId:"",
        clientId:"",
        groupId:"",
      },
      params: {},
      ipList: [],
    };
  },
  created() {
    this.lang = sessionStorage.getItem("lang");
    this.tenantId = sessionStorage.getItem("tenantValue");
  },
  methods: {
    onClose(){
      this.$parent.isShow2 = false;
      this.initLock = true;
    },
    querySearch (queryString, cb) {
      let restaurants = this.ipList
      if(this.initLock){
        queryString = "";
        this.initLock = false;
      }
      let results = queryString ? restaurants.filter((restaurant) => {
        return (restaurant.value.indexOf(queryString)  > -1);
      }) : restaurants;
      // 调用 callback 返回建议列表的数据
      let newRes = [] ;
      if(results.length<10){
        newRes = results;
      }else{
        for(let i=0;i<10;i++){
          newRes.push(results[i]);
        }
      }
      cb(newRes);
    },
    handleSelect(item){
    },
    // 保存
    // save
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            id: this.form.id,
            name: this.form.name,
            description: this.form.description,
            tenantId: this.form.tenantId,
            clientId: this.form.clientId,
            ip: this.form.ip,
            preference: this.form.preference
          };
          uptConnection(params).then((res) => {
            if (res.code === 10000) {
              this.$refs.form.resetFields();
              this.$parent.isShow2 = false;
              this.$message({
                message: this.$t("Mobile.hint8"),
                type: "success",
              });
              this.$parent.clientConnectionList();

            } else {
              this.$message({
                type: "warning",
                message: res.message,
              });
              this.close();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    dataInit(row) {
      this.form.id = row.id;
      this.form.name = row.name;
      this.form.oldName = row.name;
      this.form.description = row.description;
      this.form.ip = row.ip;
      this.form.oldip = row.ip;
      this.form.preference = row.preference;
      this.form.tenantId = row.tenantId;
      this.form.clientId = row.clientId;
      this.form.groupId = row.groupId;

      getclientGroupIPList({groupId:row.groupId}).then((res) => {
        if (res.code === 10000) {
          this.ipList = res.result.ipList;
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
  z-index: 100;
  .inner {
    width: 500px;
    max-height: 447px;
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
      margin-top: 25px;
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
    width: 700px;
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
    height: 55px;
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
