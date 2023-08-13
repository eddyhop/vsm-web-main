<template>
  <!-- 新增Transit组网 -->
  <div class="addTransit">
    <div class="content">
      <h4 class="title">
        <span>{{$t('netWork.addnetwork')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="lang=='en'? '165px' : '130px'"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item :label="$t('netWork.NetworkName')" prop="name">
            <el-input v-model.trim="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="Transit Gateway" prop="deviceId">
            <el-select filterable v-model="ruleForm.deviceId" @change="devCahne(ruleForm.deviceId)">
              <el-option
                v-for="item in TransitList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
              <!-- <el-option label="本地设备A" value="2"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="As number" prop="asNumber">
            <el-input v-model="ruleForm.asNumber" disabled></el-input>
          </el-form-item>
          <el-form-item
            class="tunAddress"
            :label="$t('netWork.TunnelAddressPool')"
            prop="tunnelAddressPool"
          >
            <span>10</span>
            <el-input v-model.trim="ruleForm.tunnelAddressPool"></el-input>
            <span>0.0/16</span>
          </el-form-item>
          <div class="place" v-if="shift && ruleForm.deviceId">
            <!-- <el-form-item :label="$t('netWork.name')" prop="publicName">
              <el-input v-model.trim="ruleForm.publicName"></el-input>
            </el-form-item>-->
            <!-- <el-form-item :label="$t('vsr1000.logicPort')" prop="portId">
              <el-select filterable v-model="ruleForm.portId">
                <el-option
                  v-for="item in LogicalPortList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item :label="$t('vsr1000.IPSite')" prop="selfIp">
              <el-input v-model="ruleForm.selfIp"></el-input>
            </el-form-item>
            <el-form-item :label="$t('vsr100.dhcp.gateway')" prop="network">
              <el-input v-model="ruleForm.network"></el-input>
            </el-form-item>-->
            <el-form-item :label="$t('netWork.publicNetwork')" prop="publicIp">
              <el-input v-model="ruleForm.publicIp"></el-input>
            </el-form-item>
          </div>
          <div class="cloud" v-if="!shift">
            <p>
              <span>{{$t('netWork.name')}}</span>
              {{cloudDevData.name}}
            </p>
            <p>
              <span>{{$t('vsr1000.physicalPort')}}</span>
              {{cloudDevData.portName}}
            </p>
            <!-- <p>
              <span>{{$t('vsr1000.IPSite')}}</span>
              {{cloudDevData.ip}}
            </p>
            <p>
              <span>{{$t('vsr100.dhcp.gateway')}}</span>
              {{cloudDevData.gateway}}
            </p>
            <p>
              <span>{{$t('netWork.publicNetwork')}}</span>
              {{cloudDevData.publicIp}}
            </p> -->
            <el-form-item :label="$t('vsr1000.IPSite')" prop="selfIp">
              <el-input v-model="ruleForm.selfIp"></el-input>
            </el-form-item>
            <el-form-item :label="$t('vsr100.dhcp.gateway')" prop="network">
              <el-input v-model="ruleForm.network"></el-input>
            </el-form-item>
            <el-form-item :label="$t('netWork.publicNetwork')" prop="publicIp">
              <el-input v-model="ruleForm.publicIp"></el-input>
            </el-form-item>
            <p>
              <span>vlan_id</span>
              {{cloudDevData.vlanId}}
            </p>
          </div>
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
  sceneAdd,
  sceneNodeGetTransitDevList,
  sceneNodeGetLogicalPortList,
  sceneRepeatName,
  sceneGetCloudInfo,
  bgpBasisGet,
} from "@/services";
export default {
  data() {
    var nameRule = (rule, value, callback) => {
      sceneRepeatName({
        type: 1,
        name: value,
        tenantId: this.$parent.vrfName,
      }).then((res) => {
        if (res.result) {
          callback();
        } else {
          callback(new Error(this.$t("vsr1000.greRule[7]")));
        }
      });
    };
    var NumRule = (rule, value, callback) => {
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
    var tunAddressRule = (rule, value, callback) => {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val >= 0 && val <= 255) {
            callback();
          } else {
            callback(new Error(this.$t("newModel.msg25")));
          }
        } else {
          callback(new Error(this.$t("newModel.msg7")));
        }
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      ruleForm: {
        asNumber: "",
        deviceId: "",
        name: "",
        network: "",
        portId: "",
        publicIp: "",
        // publicName: "",
        selfIp: "",
        tunnelAddressPool: "",
        type: 1,
      },
      cloudDevData: {},
      TransitList: [],
      LogicalPortList: [],
      rules: {
        name: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[0]"),
            trigger: "blur",
          },
          { validator: nameRule, trigger: "blur" },
        ],
        deviceId: [
          {
            required: true,
            message: this.$t("newModel.msg4"),
            trigger: "change",
          },
        ],
        asNumber: [
          {
            required: true,
            message: this.$t("newModel.msg3"),
            trigger: "blur",
          },
          // { validator: NumRule, trigger: "blur" },
        ],
        // publicName: [
        //   {
        //     required: true,
        //     message: this.$t("vsr1000.greRule[0]"),
        //     trigger: "blur",
        //   },
        // ],
        // portId: [
        //   {
        //     required: true,
        //     message: this.$t("newModel.msg4"),
        //     trigger: "change",
        //   },
        // ],
        selfIp: [
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
        network: [
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
        publicIp: [
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
        tunnelAddressPool: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[4]"),
            trigger: "blur",
          },
          { validator: tunAddressRule, trigger: "blur" },
        ],
      },
      shift: true,
    };
  },
  methods: {
    //提交
    // submit
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        let params = {
          asNumber: this.ruleForm.asNumber,
          deviceId: this.ruleForm.deviceId,
          name: this.ruleForm.name,
          network: this.ruleForm.network,
          // portId: this.ruleForm.portId,
          publicIp: this.ruleForm.publicIp,
          publicName: this.ruleForm.publicName,
          selfIp: this.ruleForm.selfIp,
          tunnelAddressPool:
            "10." + this.ruleForm.tunnelAddressPool + ".0.0/16",
          type: 1,
        };
        if (valid) {
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
                type: 1,
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消
    // cancel
    close() {
      this.$parent.addTransShow = false;
      this.$refs.form.resetFields();
      this.shift = true;
    },
    //设备类型转化
    // Device type conversion
    devCahne(val) {
      let type = this.TransitList.find((item) => item.id == val).deviceType;
      // console.log(type)
      this.shift = type == "0" ? true : false;
      if (type != "0") {
        sceneGetCloudInfo({ deviceId: val }).then((res) => {
          this.cloudDevData = res.result;
        });
        // sceneNodeGetLogicalPortList({ devId: val }).then((res) => {
        //   this.LogicalPortList = res.result;
        // });
      } 
      // else {
      //   sceneGetCloudInfo({ deviceId: val }).then((res) => {
      //     this.cloudDevData = res.result;
      //   });
      // }
      bgpBasisGet({ deviceId: val }).then((res) => {
        if (res.code == 10000 && res.result.asNum) {
          this.ruleForm.asNumber = res.result.asNum;
        } else {
          this.ruleForm.asNumber = "";
          this.$message({
            type: "warning",
            message: this.$t("netWork.msg5"),
          });
        }
      });
    },
    //获取新增场景的1000设备
    // Get 1000 devices for the new scenario
    getVsrTransit() {
      sceneNodeGetTransitDevList({ type: 0 }).then((res) => {
        this.TransitList = res.result;
      });
    },
  },
};
</script>
<style scoped lang="scss">
.addTransit {
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
  //   height: 447px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%);
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
      background: url("../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.formList {
  padding: 30px 30px 30px 30px;
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
.cloud {
  padding-bottom: 16px;
  p {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 34px;
    span {
      display: inline-block;
      width: 125px;
      text-align: right;
      padding-right: 10px;
    }
  }
}
.tunAddress {
  span {
    padding: 10px;
    color: #ccc;
  }
}
</style>
<style lang="scss">
.addTransit .content .formList {
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
  .tunAddress {
    .el-input,
    .el-select {
      // width: 322px;
      width: 50px;
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
}
</style>