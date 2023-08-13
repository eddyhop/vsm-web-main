<template>
  <div class="contents VpnPop">
    <div :class="`inner devList ${lang == 'en' ? 'innerEn' : ''}`">
      <div class="top">
        <h2>{{ $t("Mobile.editClientGroup") }}</h2>
        <i @click="$parent.showEditGroup = false">
          <img src="../../../../assets/icon_close.png" alt />
        </i>
      </div>
      <div class="main">
        <div class="mainMiddle mainMiddleVpn">
          <el-form :inline="true" class="demo-form-inline form"  :rules="rules"  :model="form" ref="form"  >
            <el-form-item :label="$t('Mobile.name')"  prop="name"  :label-width="`${lang == 'en' ? '195px' : '120px'}`" >
              <el-input v-model="form.name"  :placeholder="$t('Mobile.name')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Mobile.description')" prop="description"  :label-width="`${lang == 'en' ? '195px' : '120px'}`"  >
              <el-input v-model="form.description" :placeholder="$t('Mobile.description')" ></el-input>
            </el-form-item>
            <el-form-item :label="$t('Mobile.subnetAddress')"  prop="subnetAddress" :label-width="`${lang == 'en' ? '195px' : '120px'}`" >
              <el-input v-model="form.subnetAddress" :placeholder="$t('Mobile.subnetAddress')" @blur="zhuan()"  ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="mainFooter">
          <div class="left">
            <el-form :inline="true" class="demo-form-inline form" :rules="rules1" :model="form1" ref="form1" >
              <el-form-item :label="$t('Mobile.advertisedSubnets')" prop="issued" :label-width="`${lang == 'en' ? '195px' : '120px'}`"  >
                <el-input v-model="form1.issued" :placeholder="$t('Mobile.advertisedSubnets')"  ></el-input>
                <span class="add" @click="addData2"></span>
              </el-form-item>
              <div v-for="(item, index) in form1.data" :key="index" class="item" >
                <el-form-item
                    :label-width="`${lang == 'en' ? '195px' : '120px'}`"
                    :label="$t('Mobile.advertisedSubnets')"
                    :prop="'data.' + index + '.issued'"
                    :rules="[
                    {
                      pattern:
                        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]|3[0-2]?)$/,
                      message: $t('subscription.dhcpServer.remind[6]'),
                    },
                  ]"
                >
                  <el-input v-model="item.issued" placeholder></el-input>
                  <span class="del" @click="delData2(index)"></span>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <el-form :inline="true" class="demo-form-inline form prRight" :model="form2" :hide-required-asterisk="true" :rules="rules2" ref="form2" >
            <el-form-item label="DNS"  prop="dns" :label-width="`${lang == 'en' ? '195px' : '120px'}`">
              <el-input v-model="form2.dns" placeholder="DNS"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="footer">
        <button class="save" v-debounce="save">
          {{ $t("Mobile.save") }}
        </button>
        <button class="cancel" @click="$parent.showEditGroup = false">
          {{ $t("Mobile.cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import {addClientGroup, checkPoolIp, checkSubnetAddress, isNameUse, isubnetIsAlready} from "@/services/index.js";
import { compare } from "@/utils/change";
export default {
  data() {
    let checkName = (rule, value, callback) => {
      if (value) {
        if(this.form.name != this.form.oldName){
          isNameUse({ name: value, tenantId: this.tenantId }).then(
              (res) => {
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
    let checkSubnetAdd = (rule, value, callback) => {
      if (value) {
        checkSubnetAddress({ groupId: this.form.id, cidr: value }).then((res) => {
            if (res.code == 10000) {
               callback();
            } else {
              callback(new Error(this.$t("Mobile.subnetRange")));
            }
          });
      }else{
        callback();
      }
    };

    var isAlready = (rule, value, callback) => {
      if (value) {
          if(this.form.subnetAddress != this.form.oldSubnetAddress){
            if(this.form.subnetAddress.split("/")[0] != this.form.oldSubnetAddress.split("/")[0]){
              isubnetIsAlready({tenantId:this.tenantId,cidr:this.form.subnetAddress,oldIp:this.form.oldSubnetAddress}).then((res) => {
                if (res.code == 10000) {
                  callback(new Error(this.$t("Mobile.alreadySubnetAddress")));
                } else {
                  callback();
                }
              });
            }else {
              callback();
            }
          }else {
            callback();
          }
      } else {
        callback();
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
          { validator: checkName, trigger: "blur" },
        ],
        subnetAddress: [
          {
            required: true,
            message: this.$t("Mobile.enterSubnetAddress"),
            trigger: "blur",
          },
          {
            pattern:
                /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]|3[0-2]?)$/,
            message: this.$t("subscription.dhcpServer.remind[6]"),
            trigger: "blur",
          },
          { validator: checkSubnetAdd, trigger: "blur" },
          { validator: isAlready, trigger: "blur" },
        ]
      },
      rules1: {
        issued: [
          {
            required: true,
            message: this.$t("Mobile.enterAdvertisedSubnets"),
            trigger: "blur",
          },
          {
            pattern:
                /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]|3[0-2]?)$/,
            message: this.$t("subscription.dhcpServer.remind[6]"),
            trigger: "blur",
          },
        ],
      },
      rules2: {
        dns: [
          // { required: true, message: this.$t("subscription.dhcpServer.empty"), trigger: "blur" },
          {
            pattern:
                /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("subscription.dhcpServer.remind[6]"),
            trigger: "blur",
          },
        ],
      },
      lang: "",
      tenantId: "",
      form: {
        id: "",
        description: "",
        name: "",
        subnetAddress: "",
        oldName: "",
        oldSubnetAddress: "",
      },
      form1: {
        issued: "",
        data: [],
      },
      form2: {
        dns: "",
      },
      params: {},
    };
  },
  props: {
    devId: {
      type: String,
    },
  },
  created() {
    this.lang = sessionStorage.getItem("lang");
    this.tenantId = sessionStorage.getItem("tenantValue");
  },
  methods: {
    // 增加data2数据
    // Add datA2 data
    addData2() {
      this.form1.data.push({ issued: "" });
    },
    // 删除data2数据
    // Delete datA2 data
    delData2(index) {
      this.form1.data.splice(index, 1);
    },
    // 保存
    // save
    save() {
      let _this = this;
      let p1 = new Promise((resolve, reject) => {
        _this.$refs["form"].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
      let p2 = new Promise((resolve, reject) => {
        _this.$refs["form1"].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
      let p3 = new Promise((resolve, reject) => {
        _this.$refs["form2"].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
      Promise.all([p1, p2, p3]).then(
          () => {
            let issueRouteLists = [];
            _this.form1.data.map((item) => {
              if(item.issued != ''){
                issueRouteLists.push(item.issued);
              }
            });
            issueRouteLists.unshift(_this.form1.issued);
            _this.params.id = _this.form.id;
            _this.params.name = _this.form.name;
            _this.params.description = _this.form.description;
            _this.params.dns = _this.form2.dns;
            _this.params.advertisedSubnets = issueRouteLists;
            _this.params.subnetAddress = _this.form.subnetAddress;
            _this.params.tenantId = _this.tenantId;
            var show107 = localStorage.getItem("show107g");
            if (show107 == "true") {
              addClientGroup(_this.params).then((res) => {
                if (res.code === 10000) {
                  _this.$refs['form'].resetFields();
                  _this.$refs['form1'].resetFields();
                  _this.$refs['form2'].resetFields();

                  _this.$message.success(_this.$t("Mobile.setSuccess"));
                  _this.$parent.showEditGroup = false;
                  _this.$parent.getClientGroupData({
                    pageNumber: 1,
                    pageSize: 10,
                    tenantId: sessionStorage.getItem("tenantValue")
                  });
                } else {
                  _this.$message.error(_this.$t("Vpn.hint3"));
                }
              });
            } else {
              this.$confirm(
                  this.$t("Mobile.areYouSure") +
                  "<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue107g\",this.checked)' type='checkbox'> " +
                  this.$t("doNotShowThisAgain") +
                  "</label></div>",
                  {
                    confirmButtonText: this.$t("vsr1000.OK"),
                    cancelButtonText: this.$t("vsr1000.cancel"),
                    dangerouslyUseHTMLString: true,
                    type: "warning",
                  }
              ).then(() => {
                addClientGroup(_this.params).then((res) => {
                  if (res.code === 10000) {
                    _this.$refs['form'].resetFields();
                    _this.$refs['form1'].resetFields();
                    _this.$refs['form2'].resetFields();

                    _this.$message.success(_this.$t("Mobile.setSuccess"));
                    _this.$parent.showEditGroup = false;
                    _this.$parent.getClientGroupData({
                      pageNumber: 1,
                      pageSize: 10,
                      tenantId: sessionStorage.getItem("tenantValue")
                    });
                    localStorage.setItem("show107g",localStorage.getItem("checkedValue107g"));
                  } else {
                    _this.$message.error(_this.$t("Vpn.hint3"));
                  }
                });
              });
            }
          },
          () => {}
      );
    },
    dataInit(row) {
      this.form1.data = [];
      this.form1.issued = "";
      this.form.id = row.id;
      this.form.name = row.name;
      this.form.oldName = row.name;
      this.form.description = row.description;
      this.form.subnetAddress = row.subnetAddress;
      this.form.oldSubnetAddress = row.subnetAddress;
      this.form2.dns = row.dns;
     // this.form1.issued = row.advertisedSubnets;
      if(row.advertisedSubnets!=''){
        let sub = row.advertisedSubnets.split(",");
        this.form1.issued = sub[0];
        sub.slice(1).map((item) => {
           this.form1.data.push({ issued: item });
        });
      }
    },
    zhuan() {
      let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      let args = this.form.subnetAddress.split("/")
      if(args.length>1){
        let ip = args[0];
        let code = args[1];
        if (reg.test(ip)) {
          if (code == 32) {
            return;
          } else {
            this.form.subnetAddress = compare(ip, code)+"/"+code;
          }
        }
      }
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
    width: 700px;
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
    width: 900px;
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
    line-height: 44px;
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
