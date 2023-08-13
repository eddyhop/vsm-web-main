<template>
  <div class="accountAdd" id="accountAdd">
    <div class="inner">
      <div class="top">
        <h2>{{this.$t('cloudAccount.addTitle')}}</h2>
        <i @click="close">
          <img src="../../../../assets/icon_close.png" alt />
        </i>
      </div>
      <div class="form">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="lang=='en' ? '150px' : '130px'"
          class="demo-ruleForm formList"
        >
          <el-form-item :label="$t('cloudAccount.cloudServerName')" prop="name">
            <el-input v-model="ruleForm.name" :placeholder="$t('cloudAccount.remind[1]')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('cloudDev.submit')" prop="radio">
            <!-- <el-select filterable v-model="ruleForm.manufacturerName" :placeholder="$t('cloudDev.remind[0]')" @change="changeCloudServer(ruleForm.manufacturerName)">
              <el-option
                      v-for="item in Types"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
            </el-select>-->
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
          <div v-if="ruleForm.radio=='AWS_CHINA' || ruleForm.radio=='AWS'">
            <el-form-item
              :label="$t('cloudAccount.cloudServerId')"
              prop="awsCId"
              v-if="ruleForm.radio=='AWS_CHINA'"
            >
              <el-input v-model="ruleForm.awsCId" :placeholder="$t('cloudAccount.remind[1]')"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('cloudAccount.cloudServerId')"
              prop="awsId"
              v-if="ruleForm.radio=='AWS'"
            >
              <el-input v-model="ruleForm.awsId" :placeholder="$t('cloudAccount.remind[1]')"></el-input>
            </el-form-item>
            <el-form-item label="Access Key" prop="AWSCaccess" v-if="ruleForm.radio=='AWS_CHINA'">
              <el-input v-model="ruleForm.AWSCaccess" :placeholder="$t('cloudAccount.remind[1]')"></el-input>
            </el-form-item>
            <el-form-item label="Access Key" prop="AWSaccess" v-if="ruleForm.radio=='AWS'">
              <el-input v-model="ruleForm.AWSaccess" :placeholder="$t('cloudAccount.remind[1]')"></el-input>
            </el-form-item>
            <el-form-item label="Secret Key" prop="AWSCsecret" v-if="ruleForm.radio=='AWS_CHINA'">
              <el-input v-model="ruleForm.AWSCsecret" :placeholder="$t('cloudAccount.remind[1]')"></el-input>
            </el-form-item>
            <el-form-item label="Secret Key" prop="AWSsecret" v-if="ruleForm.radio=='AWS'">
              <el-input v-model="ruleForm.AWSsecret" :placeholder="$t('cloudAccount.remind[1]')"></el-input>
            </el-form-item>
          </div>
          <div v-if="ruleForm.radio=='ALIYUN'">
            <el-form-item label="Access Key" prop="ALaccess">
              <el-input v-model="ruleForm.ALaccess" :placeholder="$t('cloudAccount.remind[1]')"></el-input>
            </el-form-item>
            <el-form-item label="Secret Key" prop="ALsecret">
              <el-input v-model="ruleForm.ALsecret" :placeholder="$t('cloudAccount.remind[1]')"></el-input>
            </el-form-item>
          </div>
          <div v-if="ruleForm.radio=='TENCENT'">
            <el-form-item label="Access Key" prop="TXaccess">
              <el-input v-model="ruleForm.TXaccess" :placeholder="$t('cloudAccount.remind[1]')"></el-input>
            </el-form-item>
            <el-form-item label="Secret Key" prop="TXsecret">
              <el-input v-model="ruleForm.TXsecret" :placeholder="$t('cloudAccount.remind[1]')"></el-input>
            </el-form-item>
          </div>
          <div v-if="ruleForm.radio=='AZURE' || ruleForm.radio=='AZURE_CHINA'">
            <el-form-item :label="$t('cloudAccount.subscription')" prop="azureSubId" v-if="ruleForm.radio=='AZURE'">
              <el-input v-model="ruleForm.azureSubId" :placeholder="$t('cloudAccount.remind[1]')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('cloudAccount.subscription')" prop="azureCSubId" v-if="ruleForm.radio=='AZURE_CHINA'">
              <el-input v-model="ruleForm.azureCSubId" :placeholder="$t('cloudAccount.remind[1]')"></el-input>
            </el-form-item>
            <el-form-item
              label="Directory ID"
              prop="azureDirectoryId"
              v-if="ruleForm.radio=='AZURE'"
            >
              <el-input
                v-model="ruleForm.azureDirectoryId"
                :placeholder="$t('cloudAccount.remind[1]')"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="Directory ID"
              prop="azureCDirectoryId"
              v-if="ruleForm.radio=='AZURE_CHINA'"
            >
              <el-input
                v-model="ruleForm.azureCDirectoryId"
                :placeholder="$t('cloudAccount.remind[1]')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('cloudAccount.applyId')" prop="azureaccessKey" v-if="ruleForm.radio=='AZURE'">
              <el-input
                v-model="ruleForm.azureaccessKey"
                :placeholder="$t('cloudAccount.remind[1]')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('cloudAccount.applyId')" prop="azureCaccessKey" v-if="ruleForm.radio=='AZURE_CHINA'">
              <el-input
                v-model="ruleForm.azureCaccessKey"
                :placeholder="$t('cloudAccount.remind[1]')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('cloudAccount.applyKey')" prop="azureaccessSecret" v-if="ruleForm.radio=='AZURE'">
              <el-input
                v-model="ruleForm.azureaccessSecret"
                :placeholder="$t('cloudAccount.remind[1]')"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('cloudAccount.applyKey')"
              prop="azureCaccessSecret"
              v-if="ruleForm.radio=='AZURE_CHINA'"
            >
              <el-input
                v-model="ruleForm.azureCaccessSecret"
                :placeholder="$t('cloudAccount.remind[1]')"
              ></el-input>
            </el-form-item>
          </div>
          <div class="button">
            <el-button
              type="primary"
              v-debounce.prevent ="submitForm"
              class="sure"
            >{{$t('cloudAccount.save')}}</el-button>
            <el-button class="cancel" @click="close">{{$t('cloudAccount.cancel')}}</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { cloudAccountAdd, cloudAccountValidationAccountName } from "@/services";
export default {
  data() {
    const CloudNameRule = (rule, value, callback) => {
      var regEn = /[`!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
      if (regEn.test(value) || regCn.test(value)) {
        return callback(new Error(this.$t('cloudAccount.msg1')));
      } else {
        callback();
      }
    };
    const CloudNameCheck = (rule, value, callback) => {
      cloudAccountValidationAccountName({
        accountName: value,
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId,
      }).then((res) => {
        if (res.code === 10000) {
          callback();
        } else {
          callback(new Error(res.message));
        }
      });
    };
    return {
      ruleForm: {
        radio: "AWS_CHINA",
        manufacturerName: "",
        name: "",
        awsCId: "",
        AWSCaccess: "",
        AWSCsecret: "",
        awsId: "",
        AWSaccess: "",
        AWSsecret: "",
        ALaccess: "",
        ALsecret: "",
        TXaccess: "",
        TXsecret: "",
        azureDirectoryId: "",
        azureSubId: "",
        azureaccessKey: "",
        azureaccessSecret: "",
        azureCDirectoryId: "",
        azureCSubId: "",
        azureCaccessKey: "",
        azureCaccessSecret: "",
      },
      rules: {
        manufacturerName: [
          {
            required: true,
            message: this.$t("cloudAccount.remind[0]"),
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: this.$t('cloudAccount.msg2'), trigger: "blur" },
          { validator: CloudNameRule, trigger: "blur" },
          { validator: CloudNameCheck, trigger: "blur" },
        ],
        awsCId: [{ required: true, message: this.$t('cloudAccount.msg3'), trigger: "blur" }],
        awsId: [{ required: true, message: this.$t('cloudAccount.msg3'), trigger: "blur" }],
        AWSaccess: [
          { required: true, message: this.$t('cloudAccount.msg4'), trigger: "blur" },
        ],
        AWSsecret: [
          { required: true, message: this.$t('cloudAccount.msg5'), trigger: "blur" },
        ],
        AWSCaccess: [
          { required: true, message: this.$t('cloudAccount.msg4'), trigger: "blur" },
        ],
        AWSCsecret: [
          { required: true, message: this.$t('cloudAccount.msg5'), trigger: "blur" },
        ],
        ALaccess: [
          { required: true, message: this.$t('cloudAccount.msg4'), trigger: "blur" },
        ],
        ALsecret: [
          { required: true, message: this.$t('cloudAccount.msg5'), trigger: "blur" },
        ],
        TXaccess: [
          { required: true, message: this.$t('cloudAccount.msg4'), trigger: "blur" },
        ],
        TXsecret: [
          { required: true, message: this.$t('cloudAccount.msg5'), trigger: "blur" },
        ],
        azureaccessKey: [
          { required: true, message: this.$t('cloudAccount.msg4'), trigger: "blur" },
        ],
        azureaccessSecret: [
          { required: true, message: this.$t('cloudAccount.msg5'), trigger: "blur" },
        ],
        azureCaccessKey: [
          { required: true, message: this.$t('cloudAccount.msg4'), trigger: "blur" },
        ],
        azureCaccessSecret: [
          { required: true, message: this.$t('cloudAccount.msg5'), trigger: "blur" },
        ],
        azureDirectoryId: [
          { required: true, message: this.$t('cloudAccount.msg6'), trigger: "blur" },
        ],
        azureSubId: [
          { required: true, message: this.$t('cloudAccount.msg7'), trigger: "blur" },
        ],
        azureCDirectoryId: [
          { required: true, message: this.$t('cloudAccount.msg6'), trigger: "blur" },
        ],
        azureCSubId: [
          { required: true, message: this.$t('cloudAccount.msg7'), trigger: "blur" },
        ],
      },
      lang: sessionStorage.getItem("lang") ||"en",
      // //全部服务器类型
      // All server types
      // Types: [
      //   { value: "AWS_CHINA", label: "AWS中国" },
      // {value: AWS_CHINA, Label: AWS CHINA},
      //   // {value:"ALIBABACLOUD",label:"阿里云"},
      // {value:"ALIBABACLOUD", Label :" Aliyun "},
      //   // {value:"AWS",label:"AWS"},
      //   // {value:"AZURE",label:"Azure"},
      // ],
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let tenantId =JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId;

          cloudAccountAdd({
            accessKey: this.getAccessVal()[0],
            accessSecret: this.getAccessVal()[1],
            awsId: this.getAccessVal()[2],
            azureDirectoryId: this.getAccessVal()[3],
            azureSubId: this.getAccessVal()[4],
            id: this.ruleForm.id,
            type: this.ruleForm.radio,
            tenantId: tenantId,
            name: this.ruleForm.name,
          }).then((res) => {
            if (res.code === 10000) {
              this.$parent.getTableList();
              this.close();
              this.$message.success(this.$t("cloudAccount.remind[0]"));
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    //获取skck
    // Get SKCK
    //Get SKCK
    getAccessVal() {
      switch (this.ruleForm.radio) {
        case "ALIYUN":
          return [this.ruleForm.ALaccess, this.ruleForm.ALsecret, "", "", ""];
          break;
        case "TENCENT":
          return [this.ruleForm.TXaccess, this.ruleForm.TXsecret, "", "", ""];
          break;
        case "AWS":
          return [
            this.ruleForm.AWSaccess,
            this.ruleForm.AWSsecret,
            this.ruleForm.awsId,
            "",
            "",
          ];
          break;
        case "AWS_CHINA":
          return [
            this.ruleForm.AWSCaccess,
            this.ruleForm.AWSCsecret,
            this.ruleForm.awsCId,
            "",
            "",
          ];
          break;
        case "AZURE":
          return [
            this.ruleForm.azureaccessKey,
            this.ruleForm.azureaccessSecret,
            "",
            this.ruleForm.azureDirectoryId,
            this.ruleForm.azureSubId,
          ];
          break;
        case "AZURE_CHINA":
          return [
            this.ruleForm.azureCaccessKey,
            this.ruleForm.azureCaccessSecret,
            "",
            this.ruleForm.azureCDirectoryId,
            this.ruleForm.azureCSubId,
          ];
          break;
        default:
          break;
      }
    },
    // changeCloudServer(val) {
    //   this.ruleForm.manufacturerName = this.Types.find(
    //     (item) => item.value === val
    //   ).label;
    //   this.ruleForm.type = val;
    // },
    // 关闭弹窗
    // Close Windows
    // Close the popover
    close() {
      this.$parent.isShowAdd = false;
      this.$refs.form.resetFields();
    },
    //单选框选择
    // Radio box selection
    // Radio box selection
    radioChange(val) {
      console.log(val);
    },
  },
};
</script>
<style lang="scss" scoped>
.accountAdd {
  width: 100%;
  height: 100%;
  background: rgba(32, 42, 59, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  .inner {
    min-width: 550px;
    min-height: 450px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .top {
      height: 49px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 18px;
      border-bottom: 1px solid #d1d7e0;
      h2 {
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      i {
        img {
          width: 14px;
          height: 14px;
        }
      }
    }
    .form {
      padding: 27px 30px 60px 20px;
      .formList {
        .button {
          position: absolute;
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
          // margin-right: 146px;
          // display: flex;
          // justify-content: flex-end;
          text-align: center;
          .sure {
            width: 100px;
            height: 34px;
            background: rgba(54, 120, 200, 1);
            border-radius: 7px;
            padding: 0px;
            font-size: 14px;
            font-family: arial, sans-serif;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            &:hover {
              background: #6095d6 !important;
            }
          }
          .cancel {
            width: 70px;
            height: 34px;
            background: rgba(255, 255, 255, 1);
            border-radius: 7px;
            border: 1px solid rgba(209, 215, 224, 1);
            padding: 0px;
            font-size: 14px;
            font-family: arial, sans-serif;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            &:hover {
              color: #fff;
              background: rgba(54, 120, 200, 1) !important;
              border-color: rgba(54, 120, 200, 1);
            }
          }
        }
      }
    }
  }
}
.radioList {
  width: 100%;
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
</style>
<style lang="scss">
#accountAdd {
  .el-input__inner {
    width: 100%;
    height: 34px;
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    padding-left: 8px;
  }
  .el-form-item {
    margin-bottom: 26px;
    // display: flex;
    // justify-content: center;
  }
  .el-form-item__content {
    line-height: 34px;
  }
  .el-form-item__label {
    line-height: 34px;
    padding: 0 10px 0 0;
  }

  .el-radio__input.is-checked .el-radio__inner {
    border-color: #3678c8;
    background: #3678c8;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: rgba(51, 51, 51, 1);
  }
}
</style>