<template>
  <!-- 新增速度限制 -->
  <div class="addRateLimit">
    <div :class="lang=='en' ? 'contentEn content' : 'content'">
      <h4 class="title">
        <span>{{$t('newModel.add')+$t('newModel.vsr100.rateLimitation')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="lang=='en' ? '220px' : '130px'"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item :label="$t('newModel.name')" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.description')" prop="descprition">
            <el-input v-model="ruleForm.descprition"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.IPAddress')" prop="address">
            <el-input v-model="ruleForm.address" @blur="zhuan"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.rate.UplinkLimit')+' (kbit/s)'" prop="upload">
            <el-input v-model.number="ruleForm.upload"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.rate.SpeedLimitDownside')+' (kbit/s)'" prop="download">
            <el-input v-model.number="ruleForm.download"></el-input>
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
import { speedlimitSave, speedlimitCheck } from "@/services";
import { compare } from "@/utils/change";
export default {
  data() {
    var ipRule = (rule, value, callback) => {
      if (value) {
        let params = {
          deviceId: this.deviceId,
          ip: value,
          id: "",
        };
        speedlimitCheck(params).then((res) => {
          if (res.success) {
            callback();
          } else {
            callback(new Error(this.$t('vsr1000.greRule[5]')));
          }
        });
      }
    };
    var NumRule = (rule, value, callback) => {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val >= 0 && val <= 65535) {
            callback();
          } else {
            callback(new Error(this.$t('newModel.msg8')));
          }
        } else {
          callback(new Error(this.$t('newModel.msg7')));
        }
      } else {
        callback();
      }
    };
    var hopRule = (rule, value, callback) => {
      let val = value * 1;
      let reg = /^[0-9]*$/;
      if (reg.test(val)) {
        if (val >= 0 && val <= 2147483647) {
          callback();
        } else {
          callback(new Error(this.$t("newModel.msg23")));
        }
      } else {
        callback(new Error(this.$t("newModel.msg7")));
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      ruleForm: {
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        name: "",
        address: "",
        download: "",
        upload: "",
        descprition: "",
      },
      rules: {
        name: [{ required: true, message: this.$t('newModel.msg3'), trigger: "blur" }],
        address: [
          { required: true, message: this.$t('newModel.msg3'), trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/,
            message: this.$t("vsr1000.remind2[7]"),
          },
          { validator: ipRule, trigger: "blur" },
        ],
        upload: [
          { required: true, message: this.$t('newModel.msg3'), trigger: "blur" },
          { type: "number", message: this.$t('newModel.msg7') },
          { validator: hopRule, trigger: "blur" },
        ],
        download: [
          { required: true, message: this.$t('newModel.msg3'), trigger: "blur" },
          { type: "number", message: this.$t('newModel.msg7') },
          { validator: hopRule, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    close() {
      this.$parent.isShow = false;
      this.$refs.form.resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            deviceId: this.ruleForm.deviceId,
            name: this.ruleForm.name,
            address: this.ruleForm.address,
            download: this.ruleForm.download,
            upload: this.ruleForm.upload,
            descprition: this.ruleForm.descprition,
          };
          speedlimitSave(params).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]"),
              });
              this.$parent.isShow = false;
              this.$refs[formName].resetFields();
              this.$parent.dataInit({
                pageNumber: this.$parent.page,
                pageSize: this.$parent.pageSize,
                deviceId: this.deviceId,
              });
            } else {
              this.$message({
                type: "warning",
                message: res.message,
              });
              this.$refs[formName].resetFields();
              this.$parent.isShow = false;
            }
          });
        }
      });
    },
    //ip地址转换
    // IP address translation
    zhuan() {
      if (this.ruleForm.address.length) {
        let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/;
        if (reg.test(this.ruleForm.address)) {
          let ip = this.ruleForm.address.split("/")[0];
          let code = this.ruleForm.address.split("/")[1];
          if (code == 32) {
            return;
          } else {
            this.ruleForm.address = compare(ip, code) + "/" + code;
          }
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
.addRateLimit {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.content {
  width: 462px;
  height: 448px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -224px;
  margin-left: -231px;
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
      background: url("../../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.contentEn{
  width: 570px;
  margin-left: -285px;
  .formList{
    padding-left: 20px;
  }
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
.formList {
  padding: 22px 30px 0 23px;
}
</style>
<style lang="scss">
.addRateLimit {
  .el-input,
  .el-select {
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