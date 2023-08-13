<template>
  <!-- 新增网关互联 -->
  <div class="addGatewayLink">
    <div class="content">
      <h4 class="title">
        <span>{{$t('netWork.NewGatewayInterconnection')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          label-position="top"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item class="name" :label="$t('DeviceMan.tenant')" prop="tenantId">
            <el-select filterable v-model="ruleForm.tenantId" @change="getDevlist">
              <el-option
                v-for="item in TenantList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('netWork.GatewayConnectionName')" prop="name">
            <el-input v-model.trim="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('netWork.Thegateway1')" prop="deviceId" ref="netWork1">
            <el-select filterable v-model="ruleForm.deviceId" @change="filterItem(ruleForm.deviceId,'one')">
              <el-option v-for="item in DevList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item :label="$t('netWork.Thegateway1') + 'CIDR'" prop="vsrCidr">
            <el-input v-model="ruleForm.vsrCidr"></el-input>
          </el-form-item>-->
          <el-form-item label="As number" prop="asNumber">
            <el-input v-model="ruleForm.asNumberDev" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('netWork.Thegateway2')" prop="edgeId" ref="netWork2">
            <el-select filterable v-model="ruleForm.edgeId" @change="filterItem(ruleForm.edgeId,'two')">
              <el-option
                v-for="item in EdgeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="As number" prop="asNumber">
            <el-input v-model="ruleForm.asNumberEdeg" disabled></el-input>
          </el-form-item>
          <!-- <el-form-item :label="$t('netWork.Thegateway2') + 'CIDR'" prop="vseCidr">
            <el-input v-model="ruleForm.vseCidr"></el-input>
          </el-form-item>-->
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
  sceneNodeGetTransitDevList,
  sceneNodeGetTenantList,
  sceneAdd,
  sceneRepeatName,
  bgpBasisGet
} from "@/services";
export default {
  data() {
    var nameRule = (rule, value, callback) => {
      if (this.ruleForm.tenantId) {
        sceneRepeatName({
          type: 3,
          name: value,
          tenantId: this.ruleForm.tenantId,
        }).then((res) => {
          if (res.result) {
            callback();
          } else {
            callback(new Error(this.$t("vsr1000.greRule[7]")));
          }
        });
      } else {
        callback(new Error(this.$t("netWork.msg7")));
      }
    };
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
          callback(new Error(this.$t("netWork.msg1")));
        }
      }
    };
    return {
      ruleForm: {
        deviceId: "",
        edgeId: "",
        equalType: 1,
        name: "",
        tenantId: "",
        type: 3,
        asNumberDev: "",
        asNumberEdeg: "",
        // vseCidr: "",
        // vsrCidr: "",
      },
      TenantList: [],
      DevList: [],
      EdgeList: [],
      netWorkList: [],
      rules: {
        name: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[0]"),
            trigger: "blur",
          },
          { validator: nameRule, trigger: "blur" },
        ],
        tenantId: [
          {
            required: true,
            message: this.$t("newModel.msg4"),
            trigger: "change",
          },
        ],
        deviceId: [
          {
            required: true,
            message: this.$t("newModel.msg4"),
            trigger: "change",
          },
        ],
        // vsrCidr: [
        //   {
        //     required: true,
        //     message: this.$t("vsr1000.remind2[4]"),
        //     trigger: "blur",
        //   },
        //   { validator: IpAddressRule, trigger: "blur" },
        // ],
        edgeId: [
          {
            required: true,
            message: this.$t("newModel.msg4"),
            trigger: "change",
          },
        ],
        // vseCidr: [
        //   {
        //     required: true,
        //     message: this.$t("vsr1000.remind2[4]"),
        //     trigger: "blur",
        //   },
        //   { validator: IpAddressRule, trigger: "blur" },
        // ],
      },
    };
  },
  methods: {
    //vsr1000设备过滤选项
    // Vsr1000 device filtering options
    filterItem(val, num) {
      if (num == "one") {
        this.EdgeList = this.netWorkList.filter((item) => item.id != val);
        bgpBasisGet({ deviceId: val }).then((res) => {
          if (res.code == 10000 && res.result.asNum) {
            this.ruleForm.asNumberDev = res.result.asNum;
          } else {
            this.ruleForm.asNumberDev = "";
            this.$message({
              type: "warning",
              message: this.$t("netWork.msg5"),
            });
          }
        });
      } else {
        bgpBasisGet({ deviceId: val }).then((res) => {
          if (res.code == 10000 && res.result.asNum) {
            this.ruleForm.asNumberEdeg = res.result.asNum;
          } else {
            this.ruleForm.asNumberEdeg = "";
            this.$message({
              type: "warning",
              message: this.$t("netWork.msg5"),
            });
          }
        });
        this.DevList = this.netWorkList.filter((item) => item.id != val);
      }
    },
    //提交
    // submit
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            deviceId: this.ruleForm.deviceId,
            edgeId: this.ruleForm.edgeId,
            equalType: 1,
            name: this.ruleForm.name,
            tenantId: this.ruleForm.tenantId,
            type: 3,
            // vseCidr: this.ruleForm.vseCidr,
            // vsrCidr: this.ruleForm.vsrCidr,
          };
          sceneAdd(params).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]"),
              });
              this.$parent.page = 1;
              let params = {
                netName: "",
                pageNumber: 1,
                pageSize: this.$parent.pageSize,
                tenantVrfId: this.$parent.vrfName,
                type: 3,
              };
              this.$parent.dataInit(params, "change");
              this.close();
            } else {
              this.$message({
                type: "warning",
                message: res.message,
              });
              this.close();
            }
          });
        }
      });
    },

    //取消
    // cancel
    close() {
      this.$parent.isShow = false;
      this.$refs.form.resetFields();
    },
    //下拉菜单列表获取
    // Pull down menu list to get
    dataInit() {
      sceneNodeGetTenantList().then((res) => {
        this.TenantList = res.result;
      });
    },
    //获取设备
    // Access to equipment
    getDevlist() {
      sceneNodeGetTransitDevList({
        type: 4,
        tenantId: this.ruleForm.tenantId,
      }).then((res) => {
        this.netWorkList = JSON.parse(
          JSON.stringify(res.result.transitGateway)
        );
        this.DevList = res.result.transitGateway;
        this.EdgeList = res.result.edge;
        this.ruleForm.asNumberDev = ""
        this.ruleForm.asNumberEdeg = ""
        this.$refs.netWork1.resetField();
        this.$refs.netWork2.resetField();
      });
    },
  },
};
</script>
<style scoped lang="scss">
.addGatewayLink {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.content {
  width: 539px;
  height: 620px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -310px;
  margin-left: -269.5px;
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
  padding: 30px 20px 0 20px;
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
.name {
  display: flex;
}
</style>
<style lang="scss">
.addGatewayLink {
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
  .el-form-item__label {
    line-height: 0;
  }
  .name {
    .el-form-item__label {
      line-height: 40px;
      padding-right: 10px;
    }
    .el-form-item__content {
      flex: 1;
    }
  }
}
</style>