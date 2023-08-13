<template>
  <div class="addAws">
    <div class="content">
      <h4 class="title">
        <span>{{$t('cloudNet.vpc.add')}}{{$t('cloudNet.vpc.subnet')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          label-width="100px"
          class="demo-ruleForm"
          :inline="true"
        >
          <el-form-item :label="$t('cloudNet.vpc.CloudAccount')" prop="cloudAccount">
            <el-select filterable v-model="ruleForm.cloudAccount" :placeholder="$t('cloudNet.vpc.remind[0]')" disabled>
              <el-option 
              v-for="item in cloudAccountList" 
              :key="item.id" 
              :label="item.accountName" 
              :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="'VPC' + $t('cloudNet.vpc.territory')" prop="regionId">
            <el-select filterable v-model="ruleForm.regionId"  :placeholder="$t('cloudNet.vpc.remind[0]')" disabled>
              <el-option 
              v-for="item in regionList" 
              :key="item.regionId" 
              :label="item.localName" 
              :value="item.regionId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="VPC ID" prop="vpcId">
            <el-select filterable v-model="ruleForm.vpcId" :placeholder="$t('cloudNet.vpc.remind[0]')" disabled>
              <el-option 
              v-for="item in vpcList" 
              :key="item.vpcId" 
              :label="item.vpcId" 
              :value="item.vpcId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('cloudNet.vpc.subnet')+$t('cloudNet.vpc.name')" prop="subnetName">
            <el-input v-model="ruleForm.subnetName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('cloudNet.vpc.ThAvailableArea')" prop="zoneId">
            <el-select filterable v-model="ruleForm.zoneId" :placeholder="$t('cloudNet.vpc.remind[0]')">
              <el-option 
              v-for="item in zoneList" 
              :key="item.zoneId" 
              :label="item.zoneId" 
              :value="item.zoneId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('cloudNet.vpc.SubSegments')" prop="cidrBlock">
            <el-input v-model="ruleForm.cidrBlock"></el-input>
          </el-form-item>
          <div class="submit">
            <button
              class="save"
              type="primary"
              @click.prevent="submitForm('form')"
            >{{$t('cloudNet.vpc.ok')}}</button>
            <button class="cancel" @click="close">{{$t('cloudNet.vpc.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { addRoute, getAccountByType, getRegionList, getVpcList, getZoneList, addSubnet, subnetCheck, getVpcListByPage} from "@/services"
export default {
  props: ["subnetMsg"],
  components: {},
  data() {
    //vpc子网校验
    // VPC subnet validation
    const SubnetCidrCheck = (rule,value,callback) => {
        setTimeout(() => {
          subnetCheck({
              subnetCidr:value,
              vpcCidr:this.subnetMsg.cidrBlock,
          }).then(res => {
              if(res.message == "请求成功"){
                  callback()
              }else{
                  return callback(new Error(res.message))
              }
          })
        },500)
    }
    return {
      tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId,
      cloudAccountList:[],  //云账号列表
                            // Cloud account List
      regionList:[],        //VPC地域列表
                            // VPC geography list
      vpcList:[],           //VPC列表
                            // VPC list
      zoneList:[],          //可用区列表
                            // List of available areas
      ruleForm: {
        cloudAccount: this.subnetMsg.cloudAccountId,
        regionId: this.subnetMsg.regionId,
        vpcId: this.subnetMsg.vpcId,
        subnetName:"",
        zoneId:"",
        cidrBlock:"",
        vpcCidrBlock:"",
      },
      rules: {
        cloudAccount: [{ required: true, message: "请选择云账户名", trigger: "change" }],
        regionId: [{ required: true, message: "请选择VPC地域", trigger: "change" }],
        vpcId: [{ required: true, message: "请选择VPC ID", trigger: "change" }],
        subnetName: [{ required: true, message: "请填写子网名字", trigger: "blur" }],
        cidrBlock: [
          { required: true, message: "请填写子网网段", trigger: "blur" },
          { validator: SubnetCidrCheck, trigger:"blur"}
        ],
        zoneId: [{ required: true, message: "请选择可用区", trigger: "change" }]
      },
      //全部服务器类型
      // All server types
      Types:[
          {value:"AWS_CHINA",label:"AWS中国"},
          {value:"AWS",label:"AWS"},
          {value:"AZURE",label:"Azure"},
          {value:"ALIBABACLOUD",label:"阿里云"},
      ],
    };
  },
  computed: {},
  methods: {
    close() {
      this.$parent.isShowAddSubnet = false;
      this.$refs.form.resetFields();
    },
    submitForm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          addSubnet({
            tenantId:this.tenantId,
            createBy:JSON.parse(sessionStorage.getItem("userData")).username,
            cloudAccountId:this.ruleForm.cloudAccount,
            regionId:this.ruleForm.regionId,
            vpcId:this.ruleForm.vpcId,
            subnetName:this.ruleForm.subnetName,
            zoneId:this.ruleForm.zoneId,
            cidrBlock:this.ruleForm.cidrBlock,
            vpcCidrBlock:this.vpcCidrBlock,
          }).then(res => {
            if(res.code === 10000){
              this.close();
              this.$parent.$refs.Subnet.getSubnetList();
              this.$message.success(this.$t('cloudNet.vpc.remind[3]'))
            }else{
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    //获取云账号、VPC地域、VPC ID列表
    // Get a list of cloud accounts, VPC locations, and VPC ids
    async getList(){
      let Index = this.Types.findIndex((v,i) => {
        return v.label == this.subnetMsg.manufacturerName
      })
      await getAccountByType({
        cloudType:this.Types[Index].value,
        tenantId:this.tenantId,
      }).then(res => {
        if(res.code === 10000){
          this.cloudAccountList = res.result;
        }
      })
      await getRegionList({
        cloudType:this.Types[Index].value,
        tenantId:this.tenantId,
      }).then(res => {
        if(res.code === 10000){
          this.regionList = res.result;
        }
      })
      await this.getVPCList();
      await this.getZone(this.Types[Index].value)
    },
    //获取VPC列表
    // Gets the VPC list
    getVPCList(){
        getVpcListByPage({
            content:this.$parent.searchContent,
            page:this.$parent.page,
            pageSize:this.$parent.pageSize,
            tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId,
        }).then(res => {
            if(res.code === 10000){
                this.vpcList = res.result.records;
                let Index = res.result.records.findIndex((v,i) => {
                  return v.vpcId == this.subnetMsg.vpcId;
                })
                this.vpcCidrBlock = res.result.records[Index].cidrBlock;
            }
        })
    },
    // //获取VPC列表
    // Gets the VPC list
    // getVPCList(){
    //   getVpcList({
    //     cloudAccountId:this.subnetMsg.cloudAccountId,
    //     regionId:this.subnetMsg.regionId,
    //   }).then(res => {
    //     if(res.code === 10000){
    //       this.vpcList = res.result;
    //       let Index = res.result.findIndex((v,i) => {
    //         return v.vpcId == this.subnetMsg.vpcId;
    //       })
    //       console.log(Index)
    //       console.log(this.subnetMsg.vpcId)
    //       console.log(res.result)
    //       // this.vpcCidrBlock = res.result[Index].cidrBlock;
    //     }
    //   })
    // },
    //获取可用区列表
    // Gets a list of available areas
    getZone(cloudType){
      getZoneList({
          cloudType:cloudType,
          regionId:this.subnetMsg.regionId,
          tenantId:this.tenantId,
      }).then(res => {
          if(res.code === 10000){
              this.zoneList = res.result;
          }
      })
    },
  },
  created() {},
  mounted() {
    this.getList();
  }
};
</script>
<style scoped lang="scss">
.addAws {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(176, 181, 194, 0.3);
  z-index: 100;
}
.content {
  width: 462px;
  height: 501px;
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
      background: url("../../../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.event {
  padding-top: 30px;
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
    cursor: pointer;
  }
  .save:hover {
    background: rgba(96, 149, 214, 1);
    border: 0;
  }
}
</style>
<style lang="scss">
.addAws .event .el-input {
  width: 322px;
  height: 34px;
  .el-input__inner {
    height: 100%;
  }
  .el-input__icon {
    line-height: normal;
  }
}
</style>