<template>
  <div class="addRoute">
    <div class="content">
      <h4 class="title">
        <span>{{$t('cloudNet.Rute.add')}}路由条目</span>
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
          <el-form-item label="目标网段" prop="cidrBlock" label-width="110px">
            <el-input v-model="ruleForm.cidrBlock" placeholder="请输入目标网段，例如10.0.0.0/24"></el-input>
          </el-form-item>
          <el-form-item label="下一跳类型" prop="type" label-width="110px">
            <el-select filterable v-model="ruleForm.type"  placeholder="请选择" @change="nextTypeChange()">
              <el-option 
              v-for="item in RouteType" 
              :key="item.value" 
              :label="item.name" 
              :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下一跳实例ID" prop="instanceId" label-width="110px">
            <el-select filterable v-model="ruleForm.instanceId" :placeholder="InstanceTit" :disabled="useHas">
              <el-option 
              v-for="item in instanceList" 
              :key="item" 
              :label="item" 
              :value="item"></el-option>
            </el-select>
          </el-form-item>
          <div class="submit">
            <button
              class="save"
              type="primary"
              @click.prevent="submitForm('form')"
            >{{$t('cloudNet.Rute.ok')}}</button>
            <button class="cancel" @click="close">{{$t('cloudNet.Rute.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { addRoute, getInstanceList, addRouteEntry, routeCheck, } from "@/services"
export default {
  props: ["entryScoped"],
  components: {},
  data() {
    const RouteCidrCheck = (rule,value,callback) => {
      setTimeout(() => {
        routeCheck({
          cidr:value
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
      ruleForm: {
        cidrBlock: "",
        type:"",
        instanceId: "",
      },
      instanceList:[],  //下一跳实例ID列表
                        // The next hop is the list of instance ids
      rules: {
        cidrBlock: [
          { required: true, message: "请输入目标网段", trigger: "blur" },
          { validator: RouteCidrCheck, trigger:"blur"}
        ],
        type: [{ required: true, message: "请选择下一跳类型", trigger: "change" }],
        instanceId: [{ required: true, message: "请选择下一跳实例ID", trigger: "change" }]
      },
      RouteType:[
            {name:"VPC Egress Only Internet Gateway",value:"EGRESS_ONLY_INTERNET_GATEWAY"},
            {name:"VPC internet gateway",value:"GATEWAY"},
            {name:"EC2 instance",value:"INSTANCE"},
            {name:"VPC NAT gateway",value:"NAT_GATEWAY"},
            {name:"EC2 network interface",value:"NETWORK_INTERFACE"},
            {name:"EC2 Transit Gateway",value:"TRANSIT_GATEWAY"},
            {name:"VPC peering connection",value:"VPC_PEERING_CONNECTION"},
            // {name:"Outpost Local Gateway",value:"OUTPOST_LOCAL_GATEWAY"},   //AWS中国不支持
            // {name:" National Local Gateway",value:"OUTPOST_LOCAL_GATEWAY"}, not available for AWS China
            {name:"Virtual Private Gateway",value:"VIRTUAL_PRIVATE_GATEWAY"},
        ],
      useHas:false,  
      InstanceTit:"请先选择下一跳实例ID",
    };
  },
  computed: {},
  methods: {
    close() {
      this.$parent.isShowAdd = false;
      this.$refs.form.resetFields();
      this.instanceList = [];
      this.InstanceTit = "请先选择下一跳实例ID";
      this.useHas = false;
    },
    //获取实例ID列表
    // Gets the list of instance ids
    getAllInstance(){
        getInstanceList({
            cloudAccountId:this.$store.state.Routing.cloudAccount,
            regionId:this.$store.state.Routing.regionId,
            type:this.ruleForm.type,
            vpcId:this.entryScoped.vpcId
        }).then(res => {
            if(res.code === 10000){
                this.instanceList = res.result;
                if(res.result.length == 0){
                  this.InstanceTit = "该类型暂无下一跳实例，请重新选择类型";
                  this.useHas = true;
                }else{
                  this.ruleForm.instanceId = res.result[0];
                  this.InstanceTit = "请选择";
                  this.useHas = false;
                }
                
            }
        })
    },
    //下一跳类型改变时重新获取实例ID
    // The instance ID is retrieved when the next hop type changes
    nextTypeChange(){
        this.getAllInstance();
    },
    //确定新增路由条目
    // Determine the new route entry
    submitForm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          let Index = this.$parent.entryList.findIndex((v,i) => {
            return v.destinationCidrBlock == this.ruleForm.cidrBlock
          })
          console.log(Index)
          if(Index == -1){
            addRouteEntry({
              cidrBlock:this.ruleForm.cidrBlock, 
              cloudAccountId:this.$store.state.Routing.cloudAccount,
              regionId:this.$store.state.Routing.regionId,
              instanceId:this.ruleForm.instanceId,
              type:this.ruleForm.type,
              routeTableId:this.entryScoped.routeTableId
            }).then(res => {
              if(res.code === 10000){
                this.close();
                this.$parent.$parent.$parent.getRouteList(1);
                this.$message.success("新增路由条目成功")
              }else{
                this.$message.error(res.message);
              }
            })
          }else{
            this.$message.error("该网段已存在，不可重复添加")
          }
        }
      })
    },
    //将下一跳类型设置默认值
    // Sets the default value for the next hop type
    setDefault(){
        // this.ruleForm.type = this.RouteType[0].value;
        // this.getAllInstance();
    },
  },
  created() {},
  mounted() {
      this.setDefault();
  }
};
</script>
<style scoped lang="scss">
.addRoute {
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
  height: 328px;
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
.addRoute .event .el-input {
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