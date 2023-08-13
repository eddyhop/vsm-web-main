<template>
  <div class="addSubnet">
    <div :class="`content ${lang=='en' ? 'contentEn' : ''}`">
      <h4 class="title">
        <span>{{$t('cloudNet.vpc.add')}}VPC</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form :model="ruleForm" :rules="rules" ref="form" class="demo-ruleForm" :inline="true">
          <el-form-item
            :label="$t('cloudNet.vpc.CloudProviders')"
            prop="manufacturerName"
            :label-width="lang == 'en' ? '140px' : '80px'"
          >
            <el-select filterable
              v-model="ruleForm.manufacturerName"
              :placeholder="$t('cloudNet.vpc.remind[0]')"
              @change="startgetList()"
            >
              <el-option
                v-for="item in Types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('cloudNet.vpc.CloudAccount')"
            prop="cloudAccountId"
            :label-width="lang == 'en' ? '180px' : '140px'"
          >
            <el-select filterable
              v-model="ruleForm.cloudAccountId"
              :placeholder="$t('cloudNet.vpc.remind[0]')"
              @change="getZone()"
            >
              <el-option
                v-for="item in cloudAccountList"
                :key="item.id"
                :label="item.accountName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="'VPC' + $t('cloudNet.vpc.name')"
            prop="vpcName"
            :label-width="lang == 'en' ? '140px' : '80px'"
          >
            <el-input v-model="ruleForm.vpcName" placeholder="请输入VPC名称"></el-input>
          </el-form-item>
          <el-form-item
            :label="'VPC' + $t('cloudNet.vpc.territory')"
            prop="regionId"
            :label-width="lang == 'en' ? '180px' : '140px'"
          >
            <el-select filterable
              v-model="ruleForm.regionId"
              :placeholder="$t('cloudNet.vpc.remind[0]')"
              @change="getZone()"
            >
              <el-option
                v-for="item in regionList"
                :key="item.regionId"
                :label="item.localName"
                :value="item.regionId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="'VPC' + $t('cloudNet.vpc.segment')"
            prop="cidrBlock"
            :label-width="lang == 'en' ? '140px' : '80px'"
          >
            <el-input v-model="ruleForm.cidrBlock" placeholder="请输入VPC网段，例如10.0.0.0/16"></el-input>
          </el-form-item>
          <el-form-item
            :label="'Public Subnet' + $t('cloudNet.vpc.name')"
            prop="publicSubnetName"
            :label-width="lang == 'en' ? '180px' : '140px'"
          >
            <el-input v-model="ruleForm.publicSubnetName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('cloudNet.vpc.ThAvailableArea')"
            prop="zoneId"
            :label-width="lang == 'en' ? '140px' : '80px'"
          >
            <el-select filterable v-model="ruleForm.zoneId" :placeholder="$t('cloudNet.vpc.remind[0]')">
              <el-option
                v-for="item in zoneList"
                :key="item.zoneId"
                :label="item.zoneId"
                :value="item.zoneId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="'Public Subnet' + $t('cloudNet.vpc.segment')"
            prop="publicSubnetCidrBlock"
            :label-width="lang == 'en' ? '180px' : '140px'"
          >
            <el-input
              v-model="ruleForm.publicSubnetCidrBlock"
              placeholder="请输入Public Subnet网段，例如10.0.0.0/24"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="submit">
        <button
          class="save"
          type="primary"
          @click.prevent="submitForm('form')"
        >{{$t('cloudNet.vpc.ok')}}</button>
        <button class="cancel" @click="close">{{$t('cloudNet.vpc.cancel')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addVpc,
  getAccountByType,
  getRegionList,
  getZoneList,
  vpcCheck,
  subnetCheck
} from "@/services";
export default {
  data() {
    //vpc网段校验
    // VPC segment calibration
    const VpcCidrCheck = (rule, value, callback) => {
      setTimeout(() => {
        vpcCheck({
          cidr: value
        }).then(res => {
          if (res.message == "请求成功") {
            callback();
          } else {
            return callback(new Error(res.message));
          }
        });
      }, 500);
    };
    //vpc子网校验
    // VPC subnet validation
    const SubnetCidrCheck = (rule, value, callback) => {
      setTimeout(() => {
        subnetCheck({
          subnetCidr: value,
          vpcCidr: this.ruleForm.cidrBlock
        }).then(res => {
          if (res.message == "请求成功") {
            callback();
          } else {
            return callback(new Error(res.message));
          }
        });
      }, 500);
    };
    return {
      lang: "",
      ruleForm: {
        manufacturerName: "",
        cloudAccountId: "",
        vpcName: "",
        regionId: "",
        cidrBlock: "",
        publicSubnetName: "",
        zoneId: "",
        publicSubnetCidrBlock: "",
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId,
        createBy: JSON.parse(sessionStorage.getItem("userData")).username
      },
      cloudAccountList: [], //云账号列表
                            // Cloud account List
      regionList: [], //地域列表
                      // Regional list
      zoneList: [], //可用区列表
                    // List of available areas
      //全部服务器类型
      // All server types
      Types: [
        { value: "AWS_CHINA", label: "AWS中国" }
        // {value:"AWS",label:"AWS"},
        // {value:"AZURE",label:"Azure"},
        // {value:"ALIBABACLOUD",label:"阿里云"},
        // {value:"ALIBABACLOUD", Label :" Aliyun "},
      ],
      rules: {
        manufacturerName: [
          { required: true, message: "请选择云提供商", trigger: "change" }
        ],
        cloudAccountId: [
          { required: true, message: "请选择云账号", trigger: "change" }
        ],
        vpcName: [
          { required: true, message: "请输入VPC名称", trigger: "blur" }
        ],
        regionId: [
          { required: true, message: "请选择VPC地域", trigger: "change" }
        ],
        cidrBlock: [
          { required: true, message: "请输入VPC网段", trigger: "blur" },
          { validator: VpcCidrCheck, trigger: "blur" }
        ],
        publicSubnetName: [
          {
            required: true,
            message: "请输入Public Subnet名称",
            trigger: "blur"
          }
        ],
        zoneId: [
          { required: true, message: "请选择可用区", trigger: "change" }
        ],
        publicSubnetCidrBlock: [
          {
            required: true,
            message: "请输入Public Subnet网段",
            trigger: "blur"
          },
          { validator: SubnetCidrCheck, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    close() {
      this.$parent.isShowAdd = false;
      this.$refs.form.resetFields();
    },
    //获取云账号列表、地域列表
    // Get the list of cloud accounts and the list of places
    startgetList() {
      this.ruleForm.cloudAccountId = "";
      this.ruleForm.regionId = "";
      this.ruleForm.zoneId = "";
      getAccountByType({
        cloudType: this.ruleForm.manufacturerName,
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
      }).then(res => {
        if (res.code === 10000) {
          this.cloudAccountList = res.result;
        }
      });
      getRegionList({
        cloudType: this.ruleForm.manufacturerName,
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
      }).then(res => {
        if (res.code === 10000) {
          this.regionList = res.result;
        }
      });
    },
    //获取可用区列表
    // Gets a list of available areas
    getZone() {
      if (
        this.ruleForm.manufacturerName != "" &&
        this.ruleForm.regionId != ""
      ) {
        this.ruleForm.zoneId = "";
        getZoneList({
          cloudType: this.ruleForm.manufacturerName,
          regionId: this.ruleForm.regionId,
          tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
        }).then(res => {
          if (res.code === 10000) {
            this.zoneList = res.result;
          }
        });
      }
    },
    //确定创建的回调
    // Determines the callback to be created
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addVpc(this.ruleForm).then(res => {
            console.log(res);
            if (res.code == 10000) {
              this.close();
              this.$message.success(this.$t("cloudNet.vpc.remind[3]"));
              this.$parent.getVPCList();
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    }
  },
  created() {
    this.lang = sessionStorage.getItem("lang");
  }
};
</script>

<style lang="scss" scoped>
.addSubnet {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(176, 181, 194, 0.3);
  z-index: 100;
}
.content {
  width: 880px;
  height: 387px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
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
.contentEn {
  width: 1000px;
}
.event {
  padding: 30px 0 0 30px;
  //   overflow: hidden;
}
.submit {
  width: 100%;
  text-align: center;
  position: relative;
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
    // margin-left: 18px;
    z-index: 99999;
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
    cursor: pointer;
    z-index: 99999;
  }
  .save:hover {
    background: rgba(96, 149, 214, 1);
    border: 0;
  }
}
</style>
<style lang="scss">
.addSubnet .event .el-select {
  width: 300px;
  height: 34px;
}
.addSubnet .event .el-input {
  width: 300px;
  height: 34px;
  .el-input__inner {
    height: 100%;
  }
  .el-input__icon {
    line-height: normal;
  }
}
// .addSubnet .el-form{
//     display: flex;
//     flex-wrap: wrap;
//     justify-content: space-between;
// }
// .addSubnet .el-form--inline .el-form-item {
//     margin-right: 0px;
// }
.addSubnet
  .el-form-item.is-required:not(.is-no-asterisk)
  .el-form-item__label-wrap
  > .el-form-item__label:before,
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "" !important;
  color: #f56c6c;
  margin-right: 4px;
}
</style>