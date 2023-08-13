<template>
  <div class="addKey">
    <div class="content">
      <h4 class="title">
        <span>创建密钥对</span>
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
          <div class="tit">密钥对名称</div>
          <el-form-item prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <div class="remind">您无法在密钥对创建后再次下载此文件，请妥善保存</div>
          <div class="submit">
            <button
              class="save"
              type="primary"
              @click.prevent="submitForm('form')"
            >下载密钥对</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { unAssociateSubnet, getSubnetAss, addKey} from "@/services"
export default {
  props: ["unBindScoped"],
  components: {},
  data() {
    return {
      unbindSubnetList:[],
      ruleForm:{
        name:"",
      },
      rules:{
        name: [{ required: true, message: "请选择Subnet ID", trigger: "blur" }],
      }
    };
  },
  computed: {},
  methods: {
    submitForm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          addKey({
              cloudAccountId:this.$parent.ruleForm.cloudAccountId,
              keyName:this.ruleForm.name,
              regionId:this.$parent.ruleForm.regionId,
          }).then(res => {
              if(res.code === 10000){
                  this.$parent.getKeyList();
                  this.close();
                  this.$message.success("创建成功")
              }else{
                  this.$message.error(res.message)
              }
          })
        }
      })
    },
    close(){
      this.$parent.isShowKey = false;
      this.$refs.form.resetFields();
    }
  },
  created() {
    
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.addKey {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(176, 181, 194, 0.3);
  z-index: 100;
  border:1px solid rgba(209,215,224,1);
}
.content {
  width: 404px;
  height: 284px;
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
      background: url("../../../../assets/icon_close.png") no-repeat;
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
    text-align: center;
  }
  .remind{
    font-size:14px;
    font-family:arial, sans-serif;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:20px;
  }
}
.el-form-item{
    margin-bottom:16px;
}
// .el-cascader-menu__list{
  
// }
</style>
<style lang="scss">
// .addKey .event .el-input {
//   width: 322px;
//   height: 34px;
//   border:1px solid rgba(209,215,224,1);
//   .el-input__inner {
//     width: 100%;
//     line-height: 40px;
//   }
// }
.addKey .event .el-form{
    display: block !important;
}
// .el-popper .el-cascader__dropdown{
//   width:322px;
// }
</style>