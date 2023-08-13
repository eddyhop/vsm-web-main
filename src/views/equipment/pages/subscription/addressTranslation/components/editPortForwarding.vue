<template>
  <div class="editStatic">
    <div class="context">
      <div class="title">
        {{$t('subscription.addressTranslation.editPortForwarding')}}
        <span class="close" @click="close"></span>
      </div>
      <div class="item" :style="lang == 'en' ? '' : 'marginLeft:70px'">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="auto"
          :inline="true"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item :label="$t('subscription.addressTranslation.name')" prop="name">
            <div class="item-ipt">
              <el-input
                v-model="form.name"
                :placeholder="$t('subscription.addressTranslation.name')"
                size="small"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item :label="$t('subscription.addressTranslation.description')" prop="description">
            <div class="item-ipt">
              <el-input
                v-model="form.description"
                :placeholder="$t('subscription.addressTranslation.description')"
                size="small"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.addressTranslation.ingressLogicalInterface')" prop="snat">
            <div class="item-ipt">
              <el-select filterable v-model="form.snat" size="small">
                <el-option
                    v-for="item in nat"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :label="$t('subscription.addressTranslation.externalIPAddress')" prop="outIp">
            <div class="item-ipt">
              <el-input v-model.number="form.outIp" size="small"  disabled ></el-input>
            </div>
          </el-form-item>
          <el-form-item :label="$t('subscription.addressTranslation.externalPort')" prop="outPort">
            <div class="item-ipt">
              <el-input v-model.number="form.outPort" size="small"></el-input>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.addressTranslation.internalIPAddress')" prop="localIp">
            <div class="item-ipt">
              <el-input
                v-model="form.localIp"
                :placeholder="$t('subscription.addressTranslation.internalIPAddress')"
                size="small"
              ></el-input>
            </div>
          </el-form-item>
          
          <el-form-item :label="$t('subscription.addressTranslation.internalPort')" prop="locpalPort">
            <div class="item-ipt">
              <el-input v-model="form.locpalPort" size="small"></el-input>
            </div>
          </el-form-item>
          <el-form-item :label="$t('subscription.addressTranslation.protocol')" prop="protocol">
            <div class="item-ipt">
              <el-select filterable v-model="form.protocol" size="small">
                <el-option
                    v-for="item in protocolList"
                    :key="item.id"
                    :label="item.dictValue"
                    :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>


          <div class="contr">
            <button type="primary" v-debounce="save" class="save">{{$t('subscription.save')}}</button>
            <button @click.prevent="close" class="cancel">{{$t('subscription.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { getDict, snatGet, dnatCheckName, dnatSave} from "@/services";
export default {
  data() {
    var nameRule = (rule, value, callback) => {
      if (value) {
        if (this.form.oldname != this.form.name) {
          dnatCheckName({
            deviceId: this.deviceId,
            id: this.form.id,
            name: value,
          }).then((res) => {
            if (res.success) {
              callback();
            } else {
              callback(new Error(this.$t("newModel.msg6")));
            }
          });
        } else {
          callback();
       }
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
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      isEdit: false,
      lang: sessionStorage.getItem("lang"),
      form: {
        id:"",
        name: "",
        oldname:"",
        description: "",
        localIp: "",
        locpalPort: "",
        protocol: "",
        snat: "",
        outIp: "0.0.0.0/0",
        _outIp: "",
        outPort: "",
      },
      nat: [],
      protocolList:[],
      rules: {
        name: [
          {
            required: true,
            message: this.$t("subscription.addressTranslation.remind[0]"),
            trigger: "blur",
          },
          { validator: nameRule, trigger: "blur" },
        ],
        outIp: [
          {
            required: true,
            message: this.$t("subscription.addressTranslation.remind[5]"),
            trigger: "blur",
          },
        ],
        localIp: [
          {
            required: true,
            message: this.$t("subscription.addressTranslation.remind[7]"),
            trigger: "blur",
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]"),trigger: "blur",
          },
        ],
        outPort: [
          {
            required: true,
            message: this.$t("subscription.addressTranslation.remind[6]"),
            trigger: "blur",
          },
          { validator: portRule, trigger: "blur" },
        ],
        locpalPort: [
          {
            required: true,
            message: this.$t("subscription.addressTranslation.remind[8]"),
            trigger: "blur",
          },
          { validator: portRule, trigger: "blur" },
        ],
        protocol: [
          {
            required: true,
            message: this.$t("subscription.addressTranslation.remind[4]"),
            trigger: "change",
          },
        ],
        snat: [
          {
            required: true,
            message: this.$t("subscription.addressTranslation.remind[3]"),
            trigger: "change"
          }
        ],
      },
    };
  },
  methods: {
    close() {
      this.$parent.editPortForwardingShow = false;
      this.$refs.form.resetFields();
    }
    ,
    save(formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            description: this.form.description,
            deviceId: this.deviceId,
            localIp: this.form.localIp,
            id: this.form.id,
            locpalPort: this.form.locpalPort ,
            name: this.form.name,
            outIp: this.form.outIp,
            outPort: this.form.outPort ,
            protocol: this.form.protocol,
            outInterface: this.form.snat,
          };
          dnatSave(params).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]"),
              });
              this.close();
              this.$refs[formName].resetFields();
              this.$parent.dataInit();
            } else {
              this.$message({
                type: "warning",
                message: res.message,
              });
              this.$refs[formName].resetFields();
              this.close();
            }
          });
        }
      });
    },
    dataInit(row) {
      this.GetSNAT();
      getDict({ groupCode: "nat", typeCode: "proto" }).then((res) => {
        if (res.code === 10000) {
          res.result = res.result.filter((item) => item.dictValue != "ICMP");
          this.protocolList = res.result;
        }
      });
      this.form.description = row.description;
      this.form.id = row.id;
      this.form.localIp = row.localIp;
      this.form.locpalPort = row.locpalPort;
      this.form.name = row.name;
      this.form.oldname = row.name;
      this.form._outIp = row.outIp;
      this.form.outIp = "0.0.0.0/0"
      this.form.outPort = row.outPort;
      this.form.protocol = row.protocol;
      this.form.snat = row.outInterface;
    },
    GetSNAT() {
      snatGet({ deviceId: this.deviceId }).then((res) => {
        if (res.code === 10000 && res.result != null) {
          this.nat[0] ={id:res.result.outInterfaceId,name:res.result.outInterfaceName};
        }
      });
    }
  },
  created() {
  },
};
</script>
<style lang="scss" scoped>
.item-ipt {
  width: 320px;
}
.item {
  margin-top: 10px;
  padding: 10px;
  .contr {
    text-align: center;
    // margin-left: 20px;
    margin-bottom: 28px;
  }
  .save:hover {
    background: rgba(96, 149, 214, 1);
  }
  button {
    color: white;
    border: none;
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
  }
  .cancel {
    margin-left: 18px;
    background: rgba(255, 255, 255, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    border: 1px solid rgba(209, 215, 224, 1);
  }
}
.context {
  width: 560px;
  // height: 387px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    width: 100%;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    padding: 15px;
    span {
      display: inline-block;
      width: 14px;
      height: 14px;
      background-image: url("../../../../../../assets/icon_close.png");
      background-size: 14px 14px;
    }
  }
}
.editStatic {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
</style>
<style lang="scss">
.editStatic {
  .el-select {
    width: 100%;
    height: 32px;
    .el-input {
      height: 100%;
      .el-input__inner {
        height: 100%;
      }
      .el-input__icon {
        line-height: normal;
      }
    }
  }
}
</style>