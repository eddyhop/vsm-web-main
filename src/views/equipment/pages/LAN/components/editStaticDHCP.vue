<template>
  <!-- 编辑静态DHCP -->
  <div class="editStaticDHCP">
    <div class="content">
      <h4 class="title">
        <span>{{$t('newModel.edit')+$t('newModel.static')}}DHCP</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="lang=='en' ? '130px' : '85px'"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item :label="'MAC'+$t('newModel.lan.address')" prop="mac">
            <el-input v-model="ruleForm.mac" placeholder="08:E9:A4:8F:C3:B2"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.IPAddress')" prop="ip">
            <el-input v-model="ruleForm.ip"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.lan.tenancyTaerm')" prop="leasetime">
            <el-input v-model.number="ruleForm.leasetime"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.lan.hostName')" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
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
import { staticdhcpEdit,staticdhcpCheck } from "@/services";
export default {
  data() {
    var leasetimeRule = (rule, value, callback) => {
      if (value) {
        if (2 < value && value < 99999999) {
          callback();
        } else {
          callback(new Error(this.$t('newModel.lan.msg4')));
        }
      }
    };
    var macRule = (rule, value, callback) => {
      if (value) {
        staticdhcpCheck({
          devId: this.deviceId,
          mac: value,
          id: this.ruleForm.id
        }).then(res => {
          if (res.success) {
            callback();
          } else {
            callback(new Error(this.$t('newModel.lan.msg3')));
          }
        });
      }
    };
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      ruleForm: {
        name: "",
        mac: "",
        ip: "",
        leasetime: "",
        id: ""
      },
      rules: {
        mac: [
          {
            required: true,
            message: this.$t("vsr100.lan.enterContent"),
            trigger: "blur"
          },
          {
            pattern: /^([A-Fa-f0-9][A-Fa-f0-9]){1}(\:([A-Fa-f0-9][A-Fa-f0-9]))*$/,
            message: this.$t('newModel.lan.msg2')
          },
          { validator: macRule, trigger: "blur" }
        ],
        ip: [
          {
            required: true,
            message: this.$t("vsr100.lan.enterContent"),
            trigger: "blur"
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr100.lan.remind[3]")
          }
        ],
        leasetime: [
          {
            required: true,
            message: this.$t("vsr100.lan.enterContent"),
            trigger: "blur"
          },
          { type: "number", message: this.$t('newModel.msg7') },
          { validator: leasetimeRule, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            deviceId: this.deviceId,
            mac: this.ruleForm.mac,
            ip: this.ruleForm.ip,
            leasetime: this.ruleForm.leasetime,
            id: this.ruleForm.id,
            name: this.ruleForm.name
          };
          staticdhcpEdit(params).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]")
              });
              this.close();
              this.$parent.dataInit({
                devId: this.deviceId,
                pageNumber: this.$parent.page,
                pageSize: this.$parent.pageSize
              });
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
              this.close();
            }
          });
        }
      });
    },
    close() {
      this.$parent.eisShow = false;
    },
    dataInit(row) {
      this.ruleForm.name = row.name;
      this.ruleForm.mac = row.mac;
      this.ruleForm.ip = row.ip;
      this.ruleForm.leasetime = row.leasetime;
      this.ruleForm.id = row.id;
    }
  }
};
</script>
<style scoped lang="scss">
.editStaticDHCP {
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
  height: 387px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -193.5px;
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
.editStaticDHCP {
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
}
</style>