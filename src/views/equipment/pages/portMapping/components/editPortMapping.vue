<template>
  <!-- 新增端口映射 -->
  <div class="editPortMapping">
    <div class="content">
      <h4 class="title">
        <span>{{$t('newModel.edit')+$t('newModel.vsr100.portMapping')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="lang=='en' ? '120px' : '100px'"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item :label="$t('newModel.port.ExternalPort')" prop="extPort">
            <el-input v-model.number="ruleForm.extPort"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.port.internalPort')" prop="interPort">
            <el-input v-model.number="ruleForm.interPort"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.IPAddress')" prop="ipAddress">
            <el-input v-model="ruleForm.ipAddress"></el-input>
          </el-form-item>
          <el-form-item :label="$t('App.protocol')" prop="proto">
            <el-select filterable v-model="ruleForm.proto">
              <el-option
                v-for="item in protoList"
                :key="item.id"
                :label="item.dictValue"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('newModel.lan.status')" prop="delFlag">
            <el-select filterable v-model="ruleForm.delFlag">
              <el-option :label="$t('newModel.lan.takeEffect')" :value="0"></el-option>
              <el-option :label="$t('newModel.lan.loseEfficacy')" :value="1"></el-option>
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
import { protmapEdit, getDict, protmapCheckExtPort } from "@/services";
export default {
  data() {
    var PortRule = (rule, value, callback) => {
      if (value) {
        if (1 <= value && value <= 65535) {
          callback();
        } else {
          callback(new Error(this.$t('newModel.msg16')));
        }
      }
    };
    var extPort = (rule, value, callback) => {
      if (value) {
        protmapCheckExtPort({
          devId: this.deviceId,
          extPort: value,
          id:this.ruleForm.id
        }).then(res => {
          if (res.success) {
            callback();
          } else {
            callback(new Error(this.$t('newModel.port.msg')));
          }
        });
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      ruleForm: {
        extPort: "",
        interPort: "",
        ipAddress: "",
        proto: "",
        delFlag: "",
        id:""
      },
      rules: {
        extPort: [
          {
            required: true,
            message: this.$t('newModel.msg3'),
            trigger: "blur"
          },
          { type: "number", message:this.$t("newModel.msg7") },
          { validator: PortRule, trigger: "blur" },
          { validator: extPort, trigger: "blur" }
        ],
        interPort: [
          {
            required: true,
            message: this.$t('newModel.msg3'),
            trigger: "blur"
          },
          { type: "number", message:this.$t("newModel.msg7") },
          { validator: PortRule, trigger: "blur" }
        ],
        ipAddress: [
          {
            required: true,
            message: this.$t('newModel.msg3'),
            trigger: "blur"
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]")
          }
        ],
        proto: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[3]"),
            trigger: "change"
          }
        ],
        delFlag: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[3]"),
            trigger: "change"
          }
        ]
      },
      protoList: []
    };
  },
  methods: {
    //提交 submit
    // Submit the submit
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        let params = {
          id: this.ruleForm.id,
          deviceId: this.deviceId,
          extPort: this.ruleForm.extPort,
          interPort: this.ruleForm.interPort,
          ipAddress: this.ruleForm.ipAddress,
          proto: this.ruleForm.proto,
          delFlag: this.ruleForm.delFlag
        };
        if (valid) {
          protmapEdit(params).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]")
              });
              this.$parent.eisShow = false;
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
              this.$parent.eisShow = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消 close
    // Cancel the close
    close() {
      this.$parent.eisShow = false;
    },
    //编辑数据初始化 Get protocol list
    // Edit data to initialize Get Protocol List
    editDataInit(row) {
      getDict({
        groupCode: "port",
        typeCode: "proto"
      }).then(res => {
        if (res.code === 10000) {
          this.protoList = res.result;
        }
      });
      this.ruleForm.id = row.id;
      this.ruleForm.extPort = row.extPort;
      this.ruleForm.interPort = row.interPort;
      this.ruleForm.ipAddress = row.ipAddress;
      this.ruleForm.proto = row.proto;
      this.ruleForm.delFlag = row.delFlag;
    }
  }
};
</script>
<style scoped lang="scss">
.editPortMapping {
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
  height: 447px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -223.5px;
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
  padding: 30px 30px 0 15px;
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
</style>
<style lang="scss">
.editPortMapping {
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