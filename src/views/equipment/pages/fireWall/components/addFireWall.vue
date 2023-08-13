<template>
  <!-- 新增防火墙 -->
  <div class="addFireWall">
    <div :class="lang=='en' ? 'contentEn content' : 'content'">
      <h4 class="title">
        <span>{{$t('newModel.add')}}</span>
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
          <el-form-item :label="$t('newModel.action')" prop="action">
            <el-select filterable v-model="ruleForm.action">
              <el-option
                v-for="item in actionList"
                :key="item.id"
                :label="item.dictValue"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('newModel.fire.priority')" prop="priority">
            <el-input v-model="ruleForm.priority"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.fire.sourceAddress')" prop="srcAddress">
            <el-input v-model="ruleForm.srcAddress"></el-input>
          </el-form-item>
          <el-form-item :label="$t('App.sourcePort')" prop="srcPort">
            <el-input v-model="ruleForm.srcPort"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.fire.DestinationIP')" prop="tarAddress">
            <el-input v-model="ruleForm.tarAddress"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.fire.DestinationPort')" prop="tarPort">
            <el-input v-model="ruleForm.tarPort"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.fire.protocol')" prop="proto">
            <el-select filterable v-model="ruleForm.proto">
              <el-option
                v-for="item in protoList"
                :key="item.id"
                :label="item.dictValue"
                :value="item.id"
              ></el-option>
            </el-select>
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
import { getDict, firewalldAdd } from "@/services";
export default {
  data() {
    // var priorityRule = (rule, value, callback) => {
    //   if (value) {
    //     if (1 <= value && value <= 65535) {
    //       callback();
    //     } else {
    //       callback(new Error("优先级的范围为1-65535"));
    // Callback (new Error(" priority range 1-65535"));
    //     }
    //   }
    // };
    // var PortRule = (rule, value, callback) => {
    //   if (value) {
    //     if (1 <= value && value <= 65535) {
    //       callback();
    //     } else {
    //       callback(new Error("端口的范围为1-65535"));
    // Callback (new Error(" port range 1-65535"));
    //     }
    //   }
    // };
    var NumRule = (rule, value, callback) => {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val >= 1 && val <= 65535) {
          callback();
          } else {
            callback(new Error(this.$t('newModel.msg16')));
          }
        } else {
          callback(new Error(this.$t("newModel.fire.numVal")));
        }
      } else {
        callback();
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      ruleForm: {
        name: "",
        action: "",
        priority: "",
        srcPort: "",
        srcAddress: "",
        tarPort: "",
        tarAddress: "",
        proto: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[0]"),
            trigger: "blur"
          }
        ],
        action: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[3]"),
            trigger: "change"
          }
        ],
        priority: [
          // { type: "number", message: "输入的值必须为数字" },
          // {type: "number", message: "Input value must be number"},
          {
            required: true,
            message: this.$t('newModel.msg3'),
            trigger: "blur"
          },
          { validator: NumRule, trigger: "blur" }
        ],
        srcAddress: [
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/,
            message: this.$t('vsr1000.remind[16]')
          }
        ],
        srcPort: [
          // { type: "number", message: "输入的值必须为数字" },
          // {type: "number", message: "Input value must be number"},
          { validator: NumRule, trigger: "blur" }
        ],
        tarAddress: [
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/,
            message: this.$t('vsr1000.remind[16]')
          }
        ],
        tarPort: [
          // { type: "number", message: "输入的值必须为数字" },
          // {type: "number", message: "Input value must be number"},
          { validator: NumRule, trigger: "blur" }
        ],
        proto: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[3]"),
            trigger: "change"
          }
        ]
      },
      actionList: [],
      protoList: []
    };
  },
  methods: {
    //提交
    // submit
    //submit
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            deviceId: this.deviceId,
            name: this.ruleForm.name,
            action: this.ruleForm.action,
            priority: this.ruleForm.priority,
            srcPort: this.ruleForm.srcPort,
            srcAddress: this.ruleForm.srcAddress,
            tarPort: this.ruleForm.tarPort,
            tarAddress: this.ruleForm.tarAddress,
            proto: this.ruleForm.proto
          };
          firewalldAdd(params).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]")
              });
              this.$parent.isShow = false;
              this.$refs[formName].resetFields();
              this.$parent.dataInit({
                pageNumber: this.$parent.page,
                pageSize: this.$parent.pageSize,
                deviceId: this.deviceId
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
    },
    //取消
    // cancel
    //close
    close() {
      this.$parent.isShow = false;
      this.$refs.form.resetFields();
    },
    //获取下拉列表数据
    // Gets the drop-down list data
    //Gets the drop-down list data
    async getDataList() {
      let action = await getDict({ groupCode: "firewall", typeCode: "action" });
      let proto = await getDict({ groupCode: "firewall", typeCode: "proto" });
      this.protoList = proto.result;
      this.actionList = action.result.filter(item => {
        return item.dictValue !== "返回";
      });
    }
  }
};
</script>
<style scoped lang="scss">
.addFireWall {
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
  height: 628px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -314px;
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
  .formList{
    padding-left: 25px;
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
  padding: 22px 30px 0 43px;
}
</style>
<style lang="scss">
.addFireWall {
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