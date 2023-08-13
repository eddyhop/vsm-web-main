<template>
  <!-- 加速网关设置 -->
  <div class="gatewaySet">
    <div :class="lang=='en' ? 'contentEn content' : 'content'">
      <h4 class="title">
        <span>{{$t('netWork.AcceleratedSetup')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="lang=='en' ? '200px': '110px'"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item :label="$t('netWork.OpenAccelerate')" prop="accelerationEnable">
            <el-switch
              v-model="ruleForm.accelerationEnable"
              active-color="#3678C8"
              inactive-color="#D1D7E0"
            ></el-switch>
          </el-form-item>
          <el-form-item :label="$t('netWork.tunnelName')" prop="accelerationName">
            <el-input v-model.trim="ruleForm.accelerationName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('netWork.AccelerateGateway')" prop="accelerationDeviceId">
            <el-select filterable v-model="ruleForm.accelerationDeviceId">
              <el-option
                v-for="item in deviceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('netWork.ThisEndInterface')" prop="accelerationLogicalPortId">
            <el-select filterable v-model="ruleForm.accelerationLogicalPortId">
              <el-option
                v-for="item in logicalPortList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('netWork.AccelerateGateway')+'IP'" prop="accelerationIp">
            <el-input v-model="ruleForm.accelerationIp"></el-input>
          </el-form-item>
          <!-- <el-form-item label="隧道IP" prop="extPort">
            <el-input v-model="ruleForm.extPort"></el-input>
          </el-form-item>
          <div class="open">
            <p>
              <span>名称</span>自动生成公网口名称
            </p>
            <p>
              <span>本端IP</span>读取端口IP
            </p>
            <el-form-item label="公网" prop="extPort">
              <el-input v-model="ruleForm.extPort"></el-input>
            </el-form-item>
          </div>
          
          <el-form-item label="加速用途">
            <el-radio-group v-model="ruleForm.resource">
              <el-radio label="出境"></el-radio>
              <el-radio label="自定义"></el-radio>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item :label="$t('netWork.Internal')" prop="accelerationCIDR">
            <el-input type="textarea" v-model="ruleForm.accelerationCIDR" placeholder="多行网段，以逗号隔开。"></el-input>
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
import { sceneAccelerationSet, sceneAccelerationGet } from "@/services";
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
          callback(new Error(this.$t("netWork.msg1")));
        }
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      ruleForm: {
        sceneId: "",
        accelerationEnable: null,
        accelerationName: null,
        accelerationDeviceId: null,
        accelerationLogicalPortId: null,
        accelerationIp: null,
        accelerationCIDR: null,
      },
      rowData: {},
      deviceList: [],
      logicalPortList: [],
      rules: {
        accelerationName: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[0]"),
            trigger: "blur",
          },
        ],
        accelerationDeviceId: [
          {
            required: true,
            message: this.$t("newModel.msg4"),
            trigger: "change",
          },
        ],
        accelerationLogicalPortId: [
          {
            required: true,
            message: this.$t("newModel.msg4"),
            trigger: "change",
          },
        ],
        accelerationIp: [
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
        accelerationCIDR: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[4]"),
            trigger: "blur",
          },
          { validator: IpAddressRule, trigger: "blur" },
        ],
      },
      value: false,
    };
  },
  methods: {
    close() {
      this.$parent.gatewayShow = false;
      this.$refs.form.resetFields();
    },
    dataInit(row) {
      this.rowData = row;
      sceneAccelerationGet({ sceneId: row.sceneId }).then((res) => {
        if (res.code === 10000) {
          this.deviceList = res.result.device;
          this.logicalPortList = res.result.logicalPort;
          this.ruleForm.sceneId = res.result.info.sceneId;
          this.ruleForm.accelerationEnable =
            res.result.info.accelerationEnable == null
              ? false
              : res.result.info.accelerationEnable;
          this.ruleForm.accelerationName = res.result.info.accelerationName;
          this.ruleForm.accelerationDeviceId =
            res.result.info.accelerationDeviceId;
          this.ruleForm.accelerationLogicalPortId =
            res.result.info.accelerationLogicalPortId;
          this.ruleForm.accelerationIp = res.result.info.accelerationIp;
          this.ruleForm.accelerationCIDR = res.result.info.accelerationCIDR;
          // this.$parent.acceleration =
          //   res.result.info.accelerationEnable == null
          //     ? false
          //     : res.result.info.accelerationEnable;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            sceneId: this.ruleForm.sceneId,
            accelerationEnable: this.ruleForm.accelerationEnable,
            accelerationName: this.ruleForm.accelerationName,
            accelerationDeviceId: this.ruleForm.accelerationDeviceId,
            accelerationLogicalPortId: this.ruleForm.accelerationLogicalPortId,
            accelerationIp: this.ruleForm.accelerationIp,
            accelerationCIDR: this.ruleForm.accelerationCIDR,
          };
          sceneAccelerationSet(params).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]"),
              });

              // this.$parent.getVsrList(this.rowData)
              // this.rowData.getWayShow = this.ruleForm.accelerationEnable
              this.$parent.page = 1
              this.$parent.dataInit({
                netName: this.$parent.netName,
                pageNumber: this.$parent.page,
                pageSize: this.$parent.pageSize,
                tenantVrfId: this.$parent.vrfName,
                type: 1,
              },"change");
              this.close();
              // if (this.ruleForm.accelerationEnable) {
              //   this.$parent.acceleration = true;
              // } else {
              //   this.$parent.acceleration = false;
              // }
            }
          });
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.gatewaySet {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.content {
  width: 530px;
  min-height: 490px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%);
  margin-left: -265px;
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
.contentEn {
  width: 580px;
  margin-left: -290px;
}
.formList {
  padding: 30px 30px 30px 15px;
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
.open {
  p {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-bottom: 14px;
    span {
      display: inline-block;
      width: 100px;
      text-align: right;
      padding-right: 12px;
    }
  }
}
</style>
<style lang="scss">
.gatewaySet {
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
  .el-textarea {
    width: 100%;
    height: 80px;
    .el-textarea__inner {
      height: 100%;
      border-radius: 7px;
    }
  }
}
</style>