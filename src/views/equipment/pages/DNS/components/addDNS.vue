<template>
  <!-- 新增DNS -->
  <div class="addDNS">
    <div class="content">
      <h4 class="title">
        <span>{{$t('newLang100.dns.title5')}} DNS</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          label-width="70px"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item :label="$t('newLang100.dns.title2')" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newLang100.dns.title3')" :class="lang=='en'?'enlang':''" prop="domain">
            <el-input v-model="ruleForm.domain"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newLang100.dns.title7')" prop="server">
            <el-input v-model="ruleForm.server"></el-input>
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
import { dnsAdd } from "@/services";
export default {
  data() {
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      lang: sessionStorage.getItem('lang'),
      ruleForm: { name: "", domain: "", server: "" },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('newLang100.dns.title8'),
            trigger: "blur"
          },
          {
            pattern:  /^[0-9a-zA-Z_]{1,}$/,
            message: this.$t('newLang100.dns.title9')
          }
        ],
        domain: [
          {
            required: true,
            message: this.$t('newLang100.dns.title8'),
            trigger: "blur"
          }
        ],
        server: [
          {
            required: true,
            message: this.$t('newLang100.dns.title8'),
            trigger: "blur"
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]")
          }
        ]
      }
    };
  },
  methods: {
    //取消
    // cancel
    //close
    close() {
      this.$parent.isShow = false;
      this.$refs.form.resetFields();
    },
    //提交
    // submit
    //submit
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            deviceId: this.deviceId,
            name: this.ruleForm.name,
            domain: this.ruleForm.domain,
            server: this.ruleForm.server
          };
          dnsAdd(params).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]")
              });
              this.$parent.isShow = false;
              this.$refs[formName].resetFields();
              this.$parent.dataInit({
                deviceId: this.deviceId,
                pageNumber: this.$parent.page,
                pageSize: this.$parent.pageSize
              });
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
              this.$refs[formName].resetFields();
              this.$parent.isShow = false;
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.addDNS {
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
  height: 328px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -164px;
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
  padding: 30px 30px 0 35px;
  .enlang ::v-deep .el-form-item__label{
    line-height: normal;
  }
}
</style>
<style lang="scss">
.addDNS {
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