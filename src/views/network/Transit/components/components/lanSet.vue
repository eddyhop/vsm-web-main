<template>
  <!-- lan口设置 -->
  <div class="lanSet">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="form"
      :label-width="lang=='en' ? '220px' : '120px'"
      class="demo-ruleForm"
      @submit.native.prevent
      :disabled="$parent.isCloud"
    >
      <el-form-item :label="$t('vsr100.lan.IPSite')" prop="ip">
        <el-input v-model="ruleForm.ip" :placeholder="$t('vsr100.lan.enterContent')" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('vsr100.lan.subnetMask')" prop="code">
        <el-input v-model="ruleForm.code" :placeholder="$t('vsr100.lan.enterContent')" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('netWork.DHCPServer')" prop="DHCPShow">
        <el-switch v-model="DHCPShow" active-color="#3678C8" inactive-color="#D1D7E0"></el-switch>
      </el-form-item>
      <div class="DHCP" v-if="DHCPShow">
        <el-form-item :label="$t('vsr100.dhcp.startAddress')" prop="ipStart">
          <el-input
            v-model="ruleForm.ipStart"
            :placeholder="$t('vsr100.dhcp.enterContent')"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('vsr100.dhcp.endAddress')" prop="ipEnd">
          <el-input
            v-model="ruleForm.ipEnd"
            :placeholder="$t('vsr100.dhcp.enterContent')"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('vsr100.dhcp.addressLease')" prop="leaseTime">
          <el-input
            v-model.number="ruleForm.leaseTime"
            :placeholder="$t('vsr100.dhcp.enterContent')"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('vsr100.dhcp.gateway')" prop="gatewayIp">
          <el-input
            v-model="ruleForm.gatewayIp"
            :placeholder="$t('vsr100.dhcp.enterContent')"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('vsr100.dhcp.preferred')" prop="dnsIp">
          <el-input
            v-model="ruleForm.dnsIp"
            :placeholder="$t('vsr100.dhcp.enterContent')"
            size="small"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getLanDetails, dhcpGetServiceByDeviceId } from "@/services";
export default {
  data() {
    return {
      lang: sessionStorage.getItem("lang") || "en",
      ruleForm: {
        ip: "",
        code: "",
        id: "",
        mac: "",
        ipStart: "",
        ipEnd: "",
        leaseTime: "",
        gatewayIp: "",
        dnsIp: "",
        id: "",
        lanId: "",
        dhcpId: "",
      },
      DHCPShow: false,
      rules: {
        ip: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[4]"),
            trigger: "blur",
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]"),
          },
        ],
        code: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[4]"),
            trigger: "blur",
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]"),
          },
        ],
      },
    };
  },
  methods: {
    //提交
    // submit
    submitForm() {
      let falg = null;
      this.$refs.form.validate((valid) => {
        if (valid) {
          falg = true;
        } else {
          console.log("error submit!!");
          falg = false;
        }
      });
      return falg;
    },
    //数据初始化
    // Data initialization
    dataInit() {
      if (this.$parent.isCloud) {
        this.ruleForm.ip = "0.0.0.0";
        this.ruleForm.code = "0.0.0.0";
        this.DHCPShow = false;
      } else {
        getLanDetails({
          deviceId: sessionStorage.getItem("edgeDevId"),
        }).then((res) => {
          if (res.code === 10000) {
            if (res.result == null) {
              this.ruleForm.ip = "";
              this.ruleForm.code = "";
              this.ruleForm.lanId = "";
            } else {
              this.ruleForm.ip = res.result.ip;
              this.ruleForm.code = res.result.ipMask;
              this.ruleForm.lanId = res.result.id;
            }
          }
        });
        dhcpGetServiceByDeviceId({
          deviceId: sessionStorage.getItem("edgeDevId"),
        }).then((res) => {
          if (res.code === 10000) {
            if (res.result == null) {
              this.DHCPShow = false;
              this.ruleForm.ipStart = "";
              this.ruleForm.ipEnd = "";
              this.ruleForm.leaseTime = "";
              this.ruleForm.gatewayIp = "";
              this.ruleForm.dnsIp = "";
              this.ruleForm.dhcpId = "";
            } else {
              if (res.result.serverEnabled) {
                this.DHCPShow = true;
                this.ruleForm.ipStart = res.result.ipStart;
                this.ruleForm.ipEnd = res.result.ipEnd;
                this.ruleForm.leaseTime = res.result.leaseTime;
                this.ruleForm.gatewayIp = res.result.gatewayIp;
                this.ruleForm.dnsIp = res.result.dnsIp;
                this.ruleForm.dhcpId = res.result.id;
              } else {
                this.DHCPShow = false;
                this.ruleForm.ipStart = res.result.ipStart;
                this.ruleForm.ipEnd = res.result.ipEnd;
                this.ruleForm.leaseTime = res.result.leaseTime;
                this.ruleForm.gatewayIp = res.result.gatewayIp;
                this.ruleForm.dnsIp = res.result.dnsIp;
                this.ruleForm.dhcpId = res.result.id;
              }
            }
          }
        });
      }
    },
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="scss">
.lanSet {
  width: 100%;
  height: 474px;
  margin-bottom: 20px;
  margin-top: 10px;
}
</style>
<style lang="scss">
.lanSet {
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