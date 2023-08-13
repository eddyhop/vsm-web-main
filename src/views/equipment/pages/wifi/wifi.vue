<template>
  <!--  -->
  <div class="wifi">
    <div class="form">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="form"
        label-width="auto"
        class="demo-ruleForm"
        @submit.native.prevent
      >
        <el-form-item label="Wi-Fi" prop="enable">
          <el-switch
            v-model="ruleForm.flag"
            @change="openWifi"
            active-color="#3678C8"
            inactive-color="#D1D7E0"
          ></el-switch>
        </el-form-item>
        <el-form-item :label="$t('newModel.wifi.GuestNetwork')" prop="type">
          <el-checkbox v-model="ruleForm.typeFlag"></el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('newModel.wifi.wifiBand')">
          <el-radio-group  v-model="ruleForm.wifiBand">
            <el-radio :label="'2.4GHZ'"  value="2.4GHZ"></el-radio>
            <el-radio :label="'5GHZ'"  value="5GHZ"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('newModel.wifi.rateLimiting')"
          prop="maxRate"
          v-if="ruleForm.typeFlag"
        >
          <el-input v-model="ruleForm.maxRate"></el-input
          ><span style="padding: 0 0 0 15px">kbps</span>
        </el-form-item>
        <el-form-item
          :label="$t('newModel.IPAddress')"
          prop="ipMask"
          v-if="ruleForm.typeFlag"
        >
          <el-input v-model="ruleForm.ipMask"></el-input>
        </el-form-item>
        <el-form-item :label="'SSID ' + $t('newModel.name')" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('newModel.wifi.WhetherEncryption')"
          prop="isOpen"
        >
          <el-checkbox v-model="ruleForm.isOpenFlag"></el-checkbox>
        </el-form-item>
        <el-form-item
          :label="$t('newModel.wifi.password')"
          prop="password"
          v-if="ruleForm.isOpenFlag"
        >
          <el-input type="password" v-model="ruleForm.password" show-password size="small"></el-input>
        </el-form-item>
        <div class="submit">
          <button class="save" v-debounce.prevent="submitForm">
            {{ $t("vsr1000.save") }}
          </button>
          <button class="cancel" @click.prevent="close">
            {{ $t("newModel.empty") }}
          </button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { wifiGetWifiInfo, wifiSaveWifi } from "@/services";
export default {
  data() {
    var NumRule = (rule, value, callback) => {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        console.log(val);
        if (reg.test(val)) {
          if (val >= 0 && val <= 2147483647) {
            callback();
          } else {
            callback(new Error(this.$t("newModel.wifi.msg1")));
          }
        } else {
          callback(new Error(this.$t("newModel.wifi.msg2")));
        }
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        enable: "",
        id: "",
        name: "",
        password: "",
        wifiBand:"2.4GHZ",
        flag: false,
        type: 1,
        typeFlag: false,
        isOpen: 1,
        isOpenFlag: false,
        maxRate: "",
        ipMask: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[0]"),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("UserMan.hint4"),
            trigger: "blur",
          },
          { min: 8, message: this.$t("newModel.wifi.msg3"), trigger: "blur" },
        ],
        maxRate: [
          {
            validator: NumRule,
            trigger: "blur",
          },
        ],
        ipMask: [
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/,
            message: this.$t("vsr1000.makeIP"),
          },
        ],
      },
    };
  },
  methods: {
    //wifi信息初始化
    // Wifi information initializes
    dataInit(params) {
      wifiGetWifiInfo(params).then((res) => {
        if (res.code === 10000) {
          this.ruleForm.id = res.result.id;
          this.ruleForm.flag = res.result.enable ? true : false;
          this.ruleForm.enable = res.result.enable;
          this.ruleForm.name = res.result.name;
          this.ruleForm.password = res.result.password;
          this.ruleForm.typeFlag = res.result.type ? true : false;
          this.ruleForm.isOpenFlag =
            res.result.isOpen === null
              ? false
              : res.result.isOpen === 1
              ? false
              : true;
          this.ruleForm.maxRate = res.result.maxRate;
          this.ruleForm.ipMask = res.result.ipMask;
        }
      });
      if (!this.ruleForm.flag) {
        this.rules.name = [];
      } else {
        this.rules.name = [
          {
            required: true,
            message: this.$t("vsr1000.greRule[0]"),
            trigger: "blur",
          },
        ];
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        let params = {
          devId: JSON.parse(this.$route.query.devData).deviceId,
          name: this.ruleForm.name,
          password: this.ruleForm.password,
          enable: this.ruleForm.flag ? 1 : 0,
          type: this.ruleForm.typeFlag ? 1 : 0,
          // wifiBand: this.ruleForm.wifiBand ? "2.4GHZ" : "5GHZ",
          isOpen: this.ruleForm.isOpenFlag ? 0 : 1,
          maxRate: this.ruleForm.typeFlag ? this.ruleForm.maxRate : "",
          ipMask: this.ruleForm.typeFlag ? this.ruleForm.ipMask : "",
          wifiBand: this.ruleForm.wifiBand
        };
        if (valid) {
          wifiSaveWifi(params).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.qosremind[0]"),
              });
              this.ruleForm.id = res.result.id;
              this.ruleForm.flag = res.result.enable ? true : false;
              this.ruleForm.enable = res.result.enable;
              this.ruleForm.name = res.result.name;
              this.ruleForm.password = res.result.password;
              this.ruleForm.typeFlag = res.result.type ? true : false;
              this.ruleForm.isOpenFlag =
                res.result.isOpen === null
                  ? false
                  : res.result.isOpen === 1
                  ? false
                  : true;
              this.ruleForm.maxRate = res.result.maxRate;
              this.ruleForm.ipMask = res.result.ipMask;
              // this.dataInit({ devId: sessionStorage.getItem("deviceId") });
            }
          });
        }
      });
    },
    close() {
      this.$refs.form.resetFields();
      this.ruleForm.isOpenFlag = false;
      this.ruleForm.typeFlag = false;
      this.ruleForm.password = "";
    },
    openWifi() {
      if (!this.ruleForm.flag) {
        this.rules.name = [];
      } else {
        this.rules.name = [
          {
            required: true,
            message: this.$t("vsr1000.greRule[0]"),
            trigger: "blur",
          },
        ];
      }
    },
  },
  created() {
    let params = {
      devId: JSON.parse(this.$route.query.devData).deviceId,
    };
    this.dataInit(params);
  },
};
</script>
<style scoped lang="scss">
.wifi {
  padding: 41px 0 30px 93px;
}
.submit {
  padding-left: 71px;
  .save {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    outline: none;
    border: 0;
    cursor: pointer;
  }
  .cancel {
    width: 100px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    margin-left: 18px;
  }
  .save:hover {
    background: #6095d6;
  }
}
</style>
<style lang="scss">
.wifi .el-input {
  width: 280px;
  height: 34px;
  .el-input__inner {
    height: 100%;
    border-radius: 7px;
  }
  .el-input__icon {
    line-height: normal;
  }
}
</style>
