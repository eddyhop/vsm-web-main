<template>
  <!-- DNAT新增 -->
  <div class="addDNAT">
    <div :class="lang=='en'? 'contentEn content' : 'content'">
      <h4 class="title">
        <span>{{$t('newModel.add')}}DNAT</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="lang=='en' ? 'auto' : '80px'"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item :label="$t('newModel.name')" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.IPOutside')" prop="outIp">
            <el-input v-model="ruleForm.outIp" disabled :placeholder="ruleForm.outIp?'':msg"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.OutsideNetwork')" prop="outPort">
            <el-input v-model="ruleForm.outPort"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.IPAddresss')" prop="localIp">
            <el-input v-model="ruleForm.localIp"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.LocalPort')" prop="locpalPort">
            <el-input v-model="ruleForm.locpalPort"></el-input>
          </el-form-item>
          <el-form-item :label="$t('App.protocol')" prop="protocol">
            <el-select filterable v-model="ruleForm.protocol">
              <el-option
                v-for="item in protocolList"
                :key="item.id"
                :label="item.dictValue"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('newModel.description')" prop="description">
            <el-input v-model="ruleForm.description"></el-input>
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
import { dnatSave, dnatCheckName, getDict, dnatGetOutIp } from "@/services";
export default {
  data() {
    var nameRule = (rule, value, callback) => {
      if (value) {
        dnatCheckName({
          deviceId: this.deviceId,
          name: value,
        }).then((res) => {
          if (res.success) {
            callback();
          } else {
            callback(new Error(this.$t("newModel.msg6")));
          }
        });
      }
    };
    var portRule = (rule, value, callback) => {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val >= 0 && val <= 65535) {
            callback();
          } else {
            callback(new Error(this.$t("newModel.msg8")));
          }
        } else {
          callback(new Error(this.$t("newModel.msg7")));
        }
      } else {
        callback();
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      msg: "",
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      ruleForm: {
        description: "",
        deviceId: "",
        id: "",
        localIp: "",
        locpalPort: "",
        name: "",
        outIp: "",
        outPort: "",
        protocol: "",
      },
      protocolList: [],
      rules: {
        name: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[0]"),
            trigger: "blur",
          },
          { validator: nameRule, trigger: "blur" },
        ],
        outIp: [
          {
            required: true,
            message: this.$t("newModel.msg3"),
            trigger: "blur",
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]"),
          },
        ],
        localIp: [
          {
            required: true,
            message: this.$t("newModel.msg3"),
            trigger: "blur",
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]"),
          },
        ],
        outPort: [
          {
            required: true,
            message: this.$t("newModel.msg3"),
            trigger: "blur",
          },
          { validator: portRule, trigger: "blur" },
        ],
        locpalPort: [
          {
            required: true,
            message: this.$t("newModel.msg3"),
            trigger: "blur",
          },
          { validator: portRule, trigger: "blur" },
        ],
        protocol: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[3]"),
            trigger: "change",
          },
        ],
      },
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            description: this.ruleForm.description,
            deviceId: this.deviceId,
            localIp: this.ruleForm.localIp,
            locpalPort: this.ruleForm.locpalPort,
            name: this.ruleForm.name,
            outIp: this.ruleForm.outIp,
            outPort: this.ruleForm.outPort,
            protocol: this.ruleForm.protocol,
          };
          dnatSave(params).then((res) => {
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
    dataInit() {
      getDict({ groupCode: "nat", typeCode: "proto" }).then((res) => {
        if (res.code === 10000) {
          res.result = res.result.filter(item=>item.dictValue!='ICMP')
          this.protocolList = res.result;
        }
      });
      dnatGetOutIp({ deviceId: this.deviceId }).then((res) => {
        if (res.success) {
          this.ruleForm.outIp = res.result;
        } else {
          this.msg = res.message;
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.addDNAT {
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
  height: 572px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -314px;
  margin-left: -286px;
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
.contentEn {
  width: 540px;
  margin-left: -270px;
  .formList {
    padding: 30px 30px 0 30px;
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
  padding: 30px 30px 0 43px;
}
</style>
<style lang="scss">
.addDNAT {
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