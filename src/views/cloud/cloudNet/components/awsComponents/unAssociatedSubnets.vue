<template>
  <div class="AssociatedSubnets">
    <div class="content">
      <h4 class="title">
        <span>取消关联</span>
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
          <div class="tit">Subnet ID</div>
          <el-form-item prop="associationId">
            <el-cascader
            v-model="ruleForm.associationId"
            :options="unbindSubnetList"
            :props="{ multiple: true,value:'associationId',label:'subnetId' }"
            collapse-tags
            clearable></el-cascader>
          </el-form-item>
          <div class="submit">
            <button
              class="save"
              type="primary"
              @click.prevent="submitForm('form')"
            >{{$t('cloudNet.Rute.ok')}}</button>
          </div>
        </el-form>
        
      </div>
    </div>
  </div>
</template>
<script>
import { unAssociateSubnet, getSubnetAss} from "@/services"
export default {
  props: ["unBindScoped"],
  components: {},
  data() {
    return {
      unbindSubnetList:[],
      ruleForm:{
        associationId:"",
      },
      rules:{
        associationId: [{ required: true, message: "请选择Subnet ID", trigger: "change" }],
      }
    };
  },
  computed: {},
  methods: {
    //获取子网列表(未绑定的)
    // Get the subnet list (unbound)
    getSubnetbind(scope){
        let associateList = [];
        scope.routeTableAssociations.map((v,i) => {
            if(v.subnetId != ""){
                let msg = {
                    associationId:v.routeTableAssociationId,
                    subnetId:v.subnetId,
                };
                associateList.push(msg)
            }
        })
      getSubnetAss({
        cloudAccountId:this.$store.state.Routing.cloudAccount,
        regionId:this.$store.state.Routing.regionId,
        vpcId:scope.vpcId,
        associateList:associateList
      }).then(res => {
        if(res.code === 10000){
          if(res.result == null){
            this.$message("该路由表暂未关联任何子网")
          }else{
            this.$parent.isShowUnAss = true;
            this.unbindSubnetList = res.result;
          }
          
        }
      })
    },
    submitForm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          var subnetIds = "";
          this.ruleForm.associationId.map((v,i) => {
            subnetIds = subnetIds + v + ","
          })
          subnetIds = subnetIds.substr(0,subnetIds.length-1);
          unAssociateSubnet({
            cloudAccountId:this.$store.state.Routing.cloudAccount,
            regionId:this.$store.state.Routing.regionId,
            associationIds:subnetIds
          }).then(res => {
            if(res.code === 10000){
              this.close();
              this.$parent.$parent.getRouteList();
              this.$message.success("取消关联成功");
            }
          })
        }
      })
    },
    close(){
      this.$parent.isShowUnAss = false;
      this.$refs.form.resetFields();
    }
  },
  created() {
    
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.AssociatedSubnets {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(176, 181, 194, 0.3);
  z-index: 100;
}
.content {
  width: 404px;
  height: 248px;
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
.submit {
  width: 100%;
  text-align: center;
  padding-top: 30px;
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
  .save:hover {
    background: rgba(96, 149, 214, 1);
    border: 0;
  }
}
.event {
  text-align: center;
  .tit {
    padding: 30px 0 20px 0;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
}

// .el-cascader-menu__list{
  
// }
</style>
<style lang="scss">
.AssociatedSubnets .event .el-input {
  width: 322px;
  height: 34px;
  .el-input__inner {
    width: 100%;
  }
  .el-input__icon {
    line-height: normal;
  }
}
// .el-popper .el-cascader__dropdown{
//   width:322px;
// }
</style>