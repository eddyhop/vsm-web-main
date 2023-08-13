<template>
  <div class="contents VpnPop">
    <div :class="`inner devList ${lang == 'en' ? 'innerEn' : ''}`">
      <div class="top">
        <h2>{{ $t("subscription.dhcpServer.addMobileClientPoole") }}</h2>
        <i @click="$parent.addPoolsShow = false">
          <img src="../../../../../../assets/icon_close.png" alt />
        </i>
      </div>
      <div class="main">
        <div class="mainMiddle mainMiddleVpn">
          <el-form
            :inline="true"
            class="demo-form-inline form"
            :rules="rules"
            :model="form"
            ref="form"
          >
            <el-form-item
              :label="$t('subscription.dhcpServer.name')"
              prop="name"
              :label-width="`${lang == 'en' ? '195px' : '120px'}`"
            >
              <el-input
                v-model="form.name"
                :placeholder="$t('subscription.dhcpServer.name')"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('subscription.dhcpServer.description')"
              prop="description"
              :label-width="`${lang == 'en' ? '195px' : '120px'}`"
            >
              <el-input
                v-model="form.description"
                :placeholder="$t('subscription.dhcpServer.description')"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('subscription.dhcpServer.addressPool')"
              prop="pop"
              :label-width="`${lang == 'en' ? '195px' : '120px'}`"
            >
              <el-input
                v-model="form.pop"
                :placeholder="$t('subscription.dhcpServer.addressPool')"
                @blur="zhuan()"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('subscription.dhcpServer.maskLength')"
              prop="mask"
              :label-width="`${lang == 'en' ? '195px' : '120px'}`"
            >
              <el-input
                v-model="form.mask"
                :placeholder="$t('subscription.dhcpServer.maskLength')"
                @blur="zhuan()"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="mainFooter">
          <div class="left">
            <el-form
              :inline="true"
              class="demo-form-inline form"
              :rules="rules1"
              :model="form1"
              ref="form1"
            >
              <el-form-item
                :label="$t('subscription.dhcpServer.advertisedSubnets')"
                prop="issued"
                :label-width="`${lang == 'en' ? '195px' : '120px'}`"
              >
                <el-input
                  v-model="form1.issued"
                  :placeholder="$t('subscription.dhcpServer.advertisedSubnets')"
                ></el-input>
                <span class="add" @click="addData2"></span>
              </el-form-item>
              <div
                v-for="(item, index) in form1.data"
                :key="index"
                class="item"
              >
                <el-form-item
                  :label-width="`${lang == 'en' ? '195px' : '120px'}`"
                  :label="$t('subscription.dhcpServer.advertisedSubnets')"
                  :prop="'data.' + index + '.issued'"
                  :rules="[
                    {
                      required: true,
                      message: $t('subscription.dhcpServer.remind[6]'),
                      trigger: 'blur',
                    },
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
          <el-form
            :inline="true"
            class="demo-form-inline form prRight"
            :model="form2"
            :hide-required-asterisk="true"
            :rules="rules2"
            ref="form2"
          >
            <el-form-item
              label="DNS"
              prop="dns"
              :label-width="`${lang == 'en' ? '195px' : '120px'}`"
            >
              <el-input v-model="form2.dns" placeholder="DNS"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="footer">
        <button class="save" v-debounce="save">
          {{ $t("subscription.save") }}
        </button>
        <button class="cancel" @click="$parent.addPoolsShow = false">
          {{ $t("subscription.cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { addVpnPop, checkPoolIp, findPollName } from "@/services/index.js";
import { compare } from "@/utils/change";
export default {
  data() {
    let checkName = (rule, value, callback) => {
      if (value) {
        findPollName({ poolnName: value, deviceId: this.deviceId }).then(
          (res) => {
            if (res.code == 10000) {
              callback();
            } else {
              callback(new Error(this.$t("vsr1000.remind[6]")));
            }
          }
        );
      }
    };
    var popIpChk = (rule, value, callback) => {
      if (value) {
        if (value == "0.0.0.0") {
          callback(new Error(this.$t("subscription.dhcpServer.remind[9]")));
        }
        let params = { devId: this.deviceId, poolIp: value };
        checkPoolIp(params).then((res) => {
          if (res.code == 10000) {
            callback();
          } else {
            callback(new Error(this.$t("subscription.dhcpServer.remind[8]")));
          }
        });
      } else {
        callback();
      }
    };
    return {
      rules: {
        name: [
          {
            required: true,
            message: this.$t("subscription.dhcpServer.remind[0]"),
            trigger: "blur",
          },
          { validator: checkName, trigger: "blur" },
        ],
        pop: [
          {
            required: true,
            message: this.$t("subscription.dhcpServer.remind[4]"),
            trigger: "blur",
          },
          {
            pattern:
              /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("subscription.dhcpServer.remind[6]"),
            trigger: "blur",
          },
          { validator: popIpChk, trigger: "blur" },
        ],
        mask: [
          {
            required: true,
            message: this.$t("subscription.dhcpServer.remind[5]"),
            trigger: "blur",
          },
          {
            pattern: /^(?:[1-9]|([1-2][0-9])?|3[0-2])$/,
            message: this.$t("Vpn.hint8"),
          },
        ],
      },
      rules1: {
        issued: [
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
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      deviceSerialNumber: JSON.parse(this.$route.query.devData).vsrSeries,
      devName: "", //设备名称
      // Device name
      devSerial: "", //设备序列号
      // Device serial number
      tenantId: "",
      form: {
        description: "",
        name: "",
        pop: "",
        mask: "",
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
      let p1 = new Promise((resolve, reject) => {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
      let p2 = new Promise((resolve, reject) => {
        this.$refs["form1"].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
      let p3 = new Promise((resolve, reject) => {
        this.$refs["form2"].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
      Promise.all([p1, p2, p3]).then(
        () => {
          let issueRouteLists = [];
          this.form1.data.map((item) => {
            issueRouteLists.push(item.issued);
          });
          issueRouteLists.unshift(this.form1.issued);
          this.params.name = this.form.name;
          this.params.description = this.form.description;
          this.params.dns_value = this.form2.dns;
          this.params.issueRouteList = issueRouteLists;
          this.params.maxMask = this.form.mask;
          this.params.netSegment = this.form.pop;
          this.params.deviceId = this.deviceId;
          this.params.tenantId = this.tenantId;
          (this.params.relationId = ""),
            (this.params.deviceSerial = this.deviceSerialNumber);
          addVpnPop(this.params).then((res) => {
            if (res.code === 10000) {
              this.$message.success(this.$t("Vpn.hint2"));
              this.$parent.addPoolsShow = false;
              this.$parent.getTenantService();
            } else {
              this.$message.error(this.$t("Vpn.hint3"));
              this.$parent.addPoolsShow = false;
              this.$parent.getTenantService();
            }
          });
        },
        () => {}
      );
    },
    zhuan() {
      let reg =
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (reg.test(this.form.pop)) {
        let ip = this.form.pop;
        let code = this.form.mask;
        if (code == 32) {
          return;
        } else {
          this.form.pop = compare(ip, code);
        }
      }
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
            background: url("../../../../../../assets/newPage/deviceconfiguration_icon_arp_add@2x.png")
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
            background: url("../../../../../../assets/newPage/deviceconfiguration_icon_arp_delete@2x.png")
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
            background: url("../../../../../../assets/newPage/deviceconfiguration_icon_arp_add@2x.png")
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
            background: url("../../../../../../assets/newPage/deviceconfiguration_icon_arp_delete@2x.png")
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