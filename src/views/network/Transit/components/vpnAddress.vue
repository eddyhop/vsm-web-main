<template>
  <!-- vpn地址池分配 -->
  <div class="vpnAddress">
    <div :class="lang=='en' ? 'content contentEn' : 'content'">
      <h4 class="title">
        <span>{{$t('netWork.addressPoolAllocation')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="lang=='en' ? '170px' : '80px'"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <div class="device">
            <p>
              <span>{{$t('Home.deviceName')}}</span>{{deviceName}}
            </p>
            <p>
              <span>{{$t('DeviceMan.devNumber')}}</span>{{deviceNum}}
            </p>
          </div>
          <div class="address">
            <el-form-item :label="$t('Vpn.place')" prop="netSegment">
              <el-input v-model="ruleForm.netSegment" :placeholder="$t('Vpn.segment')"></el-input>
            </el-form-item>
            <span class="space"></span>
            <el-form-item prop="maxMask" class="codes">
              <el-input v-model="ruleForm.maxMask" :placeholder="$t('Vpn.mask')"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="DNS" prop="dns_value">
            <el-input v-model="ruleForm.dns_value" :placeholder="$t('Vpn.segment')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('Vpn.distribution')" prop="issueRouteList">
            <el-input type="textarea" v-model="ruleForm.issueRouteList"></el-input>
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
import { sceneGetAddrPool, sceneAddAddrPool } from "@/services";
export default {
  data() {
    var IpAddressRule = (rule, value, callback) => {
      if (value) {
        let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/;
        let ipArr = value.split(",");
        let flag = null;
        ipArr.forEach((item) => {
          if (reg.test(item)) {
            flag = true;
          } else {
            flag = false;
          }
        });
        if (flag) {
          callback();
        } else {
          callback(new Error(this.$t('netWork.msg1')));
        }
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      ruleForm: {
        dns_value: "",
        id: "",
        issueRouteList: "",
        maxMask: "",
        netSegment: "",
        sceneId: ""
      },
      deviceName:"",
      deviceNum:"",
      rules: {
        netSegment:[
          { required: true, message: this.$t("Vpn.empty"), trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("Vpn.hint5")
          }
        ],
        maxMask:[
          { required: true, message: this.$t("Vpn.empty"), trigger: "blur" },
          {
            pattern: /^(?:[1-9]|([1-2][0-9])?|3[0-2])$/,
            message: this.$t("Vpn.hint8")
          }
        ],
        dns_value:[
          // { required: true, message: this.$t("Vpn.empty"), trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("Vpn.hint5")
          }
        ],
        issueRouteList:[
          { required: true, message: this.$t("Vpn.empty"), trigger: "blur" },
          { validator: IpAddressRule, trigger: "blur" },
        ]
      }
    };
  },
  methods: {
    //提交
    // submit
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            dns_value: this.ruleForm.dns_value,
            id: this.ruleForm.id,
            issueRouteList: this.ruleForm.issueRouteList.split(","),
            maxMask: this.ruleForm.maxMask,
            netSegment: this.ruleForm.netSegment,
            sceneId: this.ruleForm.sceneId
          };
          sceneAddAddrPool(params).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]")
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
    //取消
    // cancel
    close() {
      this.$parent.vpnAddressShow = false;
      this.$refs.form.resetFields();
    },
    dataInit(row) {
      sceneGetAddrPool({ sceneId: row.sceneId }).then(res => {
        if (res.code === 10000 && res.result != null) {
          this.ruleForm.dns_value = res.result.dns_value;
          this.ruleForm.issueRouteList = res.result.routeIssue;
          this.ruleForm.maxMask = res.result.maxMask;
          this.ruleForm.netSegment = res.result.netSegment;
          this.deviceNum = res.result.deviceNum
          this.deviceName = res.result.deviceName
          this.ruleForm.id = res.result.id
        }
      });
      this.ruleForm.sceneId = row.sceneId;
    }
  }
};
</script>
<style scoped lang="scss">
.vpnAddress {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.content {
  width: 480px;
  height: 442px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -221px;
  margin-left: -240px;
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
.contentEn{
  width: 570px;

  margin-left: -285px;

  .device{
    p span{
      width: 170px;
    }
  }
}
.formList {
  padding: 30px 30px 0 30px;
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
.device {
  p {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-bottom: 14px;
    span {
      display: inline-block;
      width: 80px;
      text-align: right;
      padding-right: 10px;
    }
  }
}
.address {
  width: 100%;
  display: flex;
}
.space {
  padding: 0 10px;
}
</style>
<style lang="scss">
.vpnAddress .content .formList {
  .el-input,
  .el-select {
    // width: 322px;
    width: 160px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .codes .el-form-item__content {
    margin-left: 0 !important;
  }

  .el-textarea .el-textarea__inner {
    resize: none;
    width: 100%;
    height: 80px;
  }
}
</style>