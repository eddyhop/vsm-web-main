<template>
  <!--  -->
  <div class="deviceSign">
    <div :class="lang=='en' ? 'content contentEn' : 'content'">
      <h4 class="title">
        <span>{{$t('DeviceMan.register')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="lang=='en' ? '190px' : '90px'"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item :label="$t('Configuration.devName')" prop="deviceName">
            <el-input v-model="ruleForm.deviceName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.Deployment')" prop="radio" class="address">
            <el-radio-group v-model="ruleForm.radio" class="radioList" @change="radioChange">
              <div class="radioItem">
                <el-radio :label="'AWS_CHINA'" class="radioEl">{{$t('cloudAccount.AwsC')}}</el-radio>
                <el-radio :label="'ALIYUN'" class="radioEl">{{$t('cloudAccount.Aliyun')}}</el-radio>
                <!-- <el-radio :label="'AWS'" class="radioEl">AWS</el-radio> -->
                <!-- <el-radio :label="'AZURE'" class="radioEl">Azure</el-radio> -->
                <!-- <el-radio :label="'AZURE_CHINA'" class="radioEl">{{$t('cloudAccount.AzureC')}}</el-radio> -->
              </div>
              <!-- <div class="radioItem">
                <el-radio :label="'ALIYUN'" class="radioEl">{{$t('cloudAccount.Aliyun')}}</el-radio>
                <el-radio :label="'TENCENT'" class="radioEl">{{$t('cloudAccount.TencentCloud')}}</el-radio>
                <el-radio :label="'HUAWEI'" class="radioEl">{{$t('cloudAccount.Hicloud')}}</el-radio>
                <el-radio :label="'VMWARE'" class="radioEl">用户网络</el-radio>
              </div> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.Ethernet')" prop="ip">
            <el-input v-model="ruleForm.ip"></el-input>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.SelectCloud')" prop="accountId">
            <el-select filterable v-model="ruleForm.accountId">
              <el-option
                v-for="(item) in accountIdList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <p class="alt">{{$t('DeviceMan.hint17')}}</p>
          <div class="submit">
            <button class="save" v-debounce.prevent="submitForm">{{$t('DeviceMan.RegisteredPlant')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { cloudAccountAccount, cloudRegister } from "@/services";
export default {
  data() {
    return {
      lang: sessionStorage.getItem("lang") ||"en",
      ruleForm: {
        radio: "AWS_CHINA",
        accountId: "",
        ip: "",
        deviceName: "",
        deviceId: "",
        tenantId: "",
      },
      accountIdList: [],
      rules: {},
    };
  },
  methods: {
    //提交 
    // submit
    //submit
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid){
          let params = {
            tenantId:this.ruleForm.tenantId,
            deviceId:this.ruleForm.deviceId,
            deviceName:this.ruleForm.deviceName,
            ip:this.ruleForm.ip,
            accountId:this.ruleForm.accountId
          }
          cloudRegister(params).then(res=>{
            if(res.code==10000){
              this.$message.success(this.$t("DeviceMan.hint15"));
              this.$parent.getList()
              this.close()
            }else{
              this.$message({
                type: "warning",
                message: res.message,
              });
              this.close()
            }
          })
        }
      })
    },
    //取消
    // cancel
    //cancel
    close() {
      this.$parent.SignShow = false;
      this.$refs.form.resetFields();
    },
    //数据初始化
    // Data initialization
    //Data initialization
    dataInit(row) {
      this.ruleForm.deviceName = row.deviceName;
      this.ruleForm.deviceId = row.id;
      this.ruleForm.tenantId = row.tenantId;
      this.getAccountIdList();
    },
    //获取云账号列表
    // Get a list of cloud accounts
    //Get a list of cloud accounts
    getAccountIdList() {
      cloudAccountAccount({
        tenantId: JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId,
        type: this.ruleForm.radio,
      }).then((res) => {
        if (res.code === 10000) {
          this.accountIdList = res.result;
        }
      });
    },
    //单选框选择
    // Radio box selection
    //Radio box selection
    radioChange(val) {
      this.getAccountIdList();
    },
  },
  created() {},
};
</script>
<style scoped lang="scss">
.deviceSign {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.content {
  width: 494px;
  height: 496px;
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
      background: url("../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.contentEn{
   width: 560px;
   margin-left: -280px;
  .formList {
    padding-right: 20px;
  }
  .radioList{
    padding-left: 90px;
  }
  .submit .save{
    width: 130px;
  }
}
.formList {
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  padding: 30px 42px 0 18px;
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
.radioList {
  width: 100%;
  padding-left: 40px;
}
.radioItem:first-of-type {
  margin-bottom: 14px;
}
// .radioItem {
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   .radioEl {
//     margin-right: 0;
//     flex: 1;
//   }
// }
.alt {
  color: rgba(216, 144, 18, 1);
  line-height: 20px;
  padding-left: 26px;
  padding-bottom: 30px;
}
</style>
<style lang="scss">
.deviceSign .content .formList {
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
  .address {
    .el-form-item__label-wrap {
      float: none;
    }
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .el-radio__input.is-checked .el-radio__inner {
      border-color: #3678c8;
      background: #3678c8;
    }
    .el-radio__input.is-checked + .el-radio__label {
      color: rgba(51, 51, 51, 1);
    }
  }
}
</style>