<template>
  <!-- 专网连接 -->
  <div class="netWorkLinkSet">
    <div class="content">
      <h4 class="title">
        <span>{{$t('vsr1000.networkLink')}}</span>
        <i class="close" @click="close"></i>
      </h4>

      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="lang=='en' ? '150px' : '100px'"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item :label="$t('netWork.OpeNetwork')" prop="vpnEnable">
            <el-switch v-model="ruleForm.vpnEnable" active-color="#3678C8" inactive-color="#D1D7E0"></el-switch>
          </el-form-item>
          <h4 :class="lang=='en' ? 'devTitle devTitleEn' : 'devTitle'">
            <span>{{lang=='en' ? 'Server' : 'Server端'}}</span>
          </h4>
          <el-form-item :label="$t('netWork.name')" prop="serDeviceName">
            <el-input v-model="ruleForm.serDeviceName" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.bandwidth')+' (kbps)'" prop="serWide">
            <el-input v-model.number="ruleForm.serWide"></el-input>
          </el-form-item>
          <el-form-item :label="$t('netWork.InternetAddress')" prop="serAddr">
            <el-input v-model="ruleForm.serAddr"></el-input>
          </el-form-item>
          <h4 :class="lang=='en' ? 'devTitle devTitleEn' : 'devTitle'">
            <span>{{lang=='en' ? 'Client' : 'Client端'}}</span>
          </h4>
          <el-form-item :label="$t('netWork.name')" prop="cliDeviceName">
            <el-input v-model="ruleForm.cliDeviceName" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.bandwidth')+' (kbps)'" prop="cliWide">
            <el-input v-model.number="ruleForm.cliWide"></el-input>
          </el-form-item>
          <el-form-item :label="$t('netWork.InternetAddress')" prop="cliAddr">
            <el-input v-model="ruleForm.cliAddr"></el-input>
          </el-form-item>
          <div class="submit">
            <button class="save" v-debounce.prevent="submitForm">{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  sceneNodeGetVpnDetails,
  sceneNodeVpnAdd,
  sceneRepeatIp,
} from "@/services";
export default {
  data() {
    var broadRule = (rule, value, callback) => {
      if (value) {
        if (0 <= value && value < 100000000) {
          callback();
        } else {
          callback(new Error(this.$t("vsr1000.remind2[14]")));
        }
      } else {
        callback();
      }
    };
    var ipRule = (rule, value, callback) => {
      if (value) {
        sceneRepeatIp({ ip: value, deviceId: this.ruleForm.deviceId }).then(
          (res) => {
            if (res.result) {
              callback();
            } else {
              callback(new Error(this.$t("vsr1000.greRule[5]")));
            }
          }
        );
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      ruleForm: {
        vpnEnable: false,
        serDeviceName: "",
        serWide: "",
        serAddr: "",
        cliDeviceName: "",
        cliWide: "",
        cliAddr: "",
        sceneDeviceId: "",
        sceneId: "",
        vseVpnId: null,
        vsrVpnId: null,
        deviceId: "",
      },
      rules: {
        serWide: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[4]"),
            trigger: "blur",
          },
          { type: "number", message: this.$t("vsr1000.remind2[6]") },
          { validator: broadRule, trigger: "blur" },
        ],
        serAddr: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[4]"),
            trigger: "blur",
          },
          // {
          //   pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/,
          //   message: this.$t("vsr1000.remind2[7]"),
          // },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]"),
          },
          // { validator: ipRule, trigger: "blur" },
        ],
        cliWide: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[4]"),
            trigger: "blur",
          },
          { type: "number", message: this.$t("vsr1000.remind2[6]") },
          { validator: broadRule, trigger: "blur" },
        ],
        cliAddr: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[4]"),
            trigger: "blur",
          },
          // {
          //   pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/,
          //   message: this.$t("vsr1000.remind2[7]"),
          // },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]"),
          },
          // { validator: ipRule, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //取消
    // cancel
    close() {
      this.$parent.netWorkShow = false;
      // this.$refs.form.resetFields();
    },
    //提交
    // submit
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            cliAddr: this.ruleForm.cliAddr,
            cliWide: this.ruleForm.cliWide,
            sceneDeviceId: this.ruleForm.sceneDeviceId,
            sceneId: this.ruleForm.sceneId,
            serAddr: this.ruleForm.serAddr,
            serWide: this.ruleForm.serWide,
            type: 2,
            vpnStatus: this.ruleForm.vpnEnable,
            // vseVpnId: this.ruleForm.vseVpnId,
            // vsrVpnId: this.ruleForm.vsrVpnId,
            // cliDeviceName: this.ruleForm.cliDeviceName,
            // serDeviceName: this.ruleForm.serDeviceName,
          };
          sceneNodeVpnAdd(params).then((res) => {
            if (res.code === 10000) {
              this.close();
              this.$parent.page = 1;
              let params = {
                netName: "",
                pageNumber: this.$parent.page,
                pageSize: this.$parent.pageSize,
                tenantVrfId: this.$parent.vrfName,
                type: 2,
              };
              this.$parent.dataInit(params, "change");
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]"),
              });
            }
          });
        }
      });
    },
    //获取专网连接数据
    // Gets private network connection data
    dataInit(row) {
      this.ruleForm.sceneDeviceId = row.sceneDeviceId;
      this.ruleForm.sceneId = row.sceneId;
      sceneNodeGetVpnDetails({ sceneDeviceId: row.sceneDeviceId }).then(
        (res) => {
          if (res.code === 10000) {
            this.ruleForm.vpnEnable = res.result.vpnEnable;
            this.ruleForm.serDeviceName = res.result.serDeviceName;
            this.ruleForm.serWide = Number(res.result.serWide);
            this.ruleForm.serAddr = res.result.serAddr;
            this.ruleForm.cliDeviceName = res.result.cliDeviceName;
            this.ruleForm.cliWide = Number(res.result.cliWide);
            this.ruleForm.cliAddr = res.result.cliAddr;
            this.ruleForm.deviceId = res.result.deviceId;
            // this.ruleForm.vseVpnId = res.result.vseVpnId;
            // this.ruleForm.vsrVpnId = res.result.vsrVpnId;
          }
        }
      );
    },
  },
};
</script>
<style scoped lang="scss">
.netWorkLinkSet {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.content {
  width: 500px;
  height: 626px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -313px;
  margin-left: -250px;
  .title {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    i {
      width: 14px;
      height: 14px;
      background: url("../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.formList {
  padding: 15px 30px 0 15px;
}
.submit {
  width: 100%;
  text-align: center;
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
    margin-left: 18px;
  }
  .cancel {
    width: 70px;
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
.devTitle {
  width: 100%;
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  padding-bottom: 14px;
  span {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 12px;
  }
}
.devTitleEn {
  span {
    width: 150px;
  }
}
</style>
<style lang="scss">
.netWorkLinkSet {
  .el-input,
  .el-select {
    // width: 322px;
    width: 100%;
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