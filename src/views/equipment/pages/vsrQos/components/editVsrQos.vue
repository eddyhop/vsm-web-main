<template>
  <!--  -->
  <div class="addVsrQos">
    <div :class="lang=='en' ? 'contentEn content' : 'content'">
      <h4 class="title">
        <span>{{$t('newModel.edit')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="lang=='en' ? 'auto' : '70px'"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item :label="$t('newModel.name')" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.description')" prop="description">
            <el-input v-model="ruleForm.description"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.fire.priority')" prop="priority">
            <el-select filterable v-model="ruleForm.priority">
              <el-option
                v-for="item in priorityList"
                :key="item.id"
                :label="item.dictValue"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('App.protocol')" prop="protocol">
            <el-select filterable v-model="ruleForm.protocol" @change="protocolChange(ruleForm.protocol)">
              <el-option
                v-for="item in protoList"
                :key="item.id"
                :label="item.dictValue"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('newModel.fire.sourceAddress')" prop="sourceAddress">
            <el-input v-model="ruleForm.sourceAddress"></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr100.static.IPSite')" prop="targetAddress">
            <el-input v-model="ruleForm.targetAddress"></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.port')" prop="port">
            <div class="port">
              <el-input
                type="textarea"
                :disabled="portDisabled"
                :placeholder="$t('newModel.msg19')"
                v-model="ruleForm.port"
              ></el-input>
            </div>
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
  getDict,
  vsmsimpleqosEditQos,
  vsmsimpleqosGetQosNameIsEnable
} from "@/services";
export default {
  data() {
    var nameRule = (rule, value, callback) => {
      if (value) {
        vsmsimpleqosGetQosNameIsEnable({
          devId: JSON.parse(this.$route.query.devData).deviceId,
          name: value,
          id:this.ruleForm.id
        }).then(res => {
          if (res.success) {
            callback();
          } else {
            callback(new Error(this.$t('newModel.msg6')));
          }
        });
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      ruleForm: {
        id: "",
        name: "",
        priority: "",
        protocol: "",
        description: "",
        sourceAddress: "",
        targetAddress: "",
        port: "",
        deviceId: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('newModel.msg3'),
            trigger: "blur"
          },
          { validator: nameRule, trigger: "blur" }
        ],
        priority: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[3]"),
            trigger: "change"
          }
        ],
        protocol: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[3]"),
            trigger: "change"
          }
        ],
        sourceAddress: [
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]")
          }
        ],
        targetAddress: [
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]")
          }
        ]
      },
      portDisabled: false,
      protoList: [],
      priorityList: []
    };
  },
  methods: {
    //提交
    // submit
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            id: this.ruleForm.id,
            name: this.ruleForm.name,
            priority: this.ruleForm.priority,
            protocol: this.ruleForm.protocol,
            description: this.ruleForm.description,
            sourceAddress: this.ruleForm.sourceAddress,
            targetAddress: this.ruleForm.targetAddress,
            port: this.ruleForm.port,
            deviceId: JSON.parse(this.$route.query.devData).deviceId
          };
          vsmsimpleqosEditQos(params).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]")
              });
              this.$parent.eisShow = false;
              this.$parent.dataInit({
                pageNumber: this.$parent.page,
                pageSize: this.$parent.pageSize,
                deviceId: JSON.parse(this.$route.query.devData).deviceId
              });
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
              this.$parent.isShow = false;
            }
          });
        }
      });
    },
    //关闭
    // Shut down
    close() {
      this.$parent.eisShow = false;
    },
    //编辑数据初始化
    // Edit data initialization
    editDataInit(row) {
      this.ruleForm.name = row.name;
      this.ruleForm.priority = row.priority;
      this.ruleForm.protocol = row.protocol;
      this.ruleForm.description = row.description;
      this.ruleForm.sourceAddress = row.sourceAddress;
      this.ruleForm.targetAddress = row.targetAddress;
      this.ruleForm.port = row.port;
      this.ruleForm.id = row.id;
    },
    //协议选择
    // Protocol selection
    protocolChange(val) {
      let protoName = this.protoList.find(item => item.id == val).dictValue;
      if (protoName == "icmp" || protoName == "ALL") {
        this.portDisabled = true;
        this.ruleForm.port = "";
      } else {
        this.portDisabled = false;
      }
    },
    //获取优先级与协议
    // Get priorities and protocols
    async getDataList(row) {
      let proto = await getDict({ groupCode: "qos", typeCode: "proto" });
      let priority = await getDict({ groupCode: "qos", typeCode: "priority" });
      if (proto.code === 10000) {
        this.protoList = proto.result;
        this.priorityList = priority.result;
        let protoName = this.protoList.find(item => item.id == row.protocol)
          .dictValue;
        if (protoName == "icmp" || protoName == "ALL") {
          this.portDisabled = true;
          this.ruleForm.port = "";
        } else {
          this.portDisabled = false;
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
.addVsrQos {
  width: 100%;
  height: 100%;
  position: fixed;
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
.formList {
  padding: 30px 30px 0 43px;
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
.port {
  width: 322px;
  height: 94px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  border: 1px solid rgba(209, 215, 224, 1);
}
</style>
<style lang="scss">
.addVsrQos {
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
  .el-textarea {
    width: 100%;
    height: 100%;
    .el-textarea__inner {
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
}
</style>