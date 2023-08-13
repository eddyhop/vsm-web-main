<template>
  <div class="addAws">
    <div class="content">
      <h4 class="title">
        <span>{{$t("cloudNet.Rute.addRouteTable")}}</span>
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
          <el-form-item :label="$t('cloudNet.Rute.CloudName')" prop="cloudAccount">
            <el-select filterable v-model="ruleForm.cloudAccount" :placeholder="$t('cloudNet.Rute.remind[0]')" disabled>
              <el-option 
              v-for="item in this.$store.state.Routing.cloudAccountList" 
              :key="item.id" 
              :label="item.accountName" 
              :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="'VPC' + $t('cloudNet.Rute.territory')" prop="regionId">
            <el-select filterable v-model="ruleForm.regionId"  :placeholder="$t('cloudNet.Rute.remind[0]')" disabled>
              <el-option 
              v-for="item in this.$store.state.Routing.regionList" 
              :key="item.regionId" 
              :label="item.localName" 
              :value="item.regionId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="VPC ID" prop="vpcId">
            <el-select filterable v-model="this.$store.state.Routing.vpcId" :placeholder="$t('cloudNet.Rute.remind[0]')" disabled>
              <el-option 
              v-for="item in this.$store.state.Routing.vpcList" 
              :key="item.vpcId" 
              :label="item.vpcId" 
              :value="item.vpcId"></el-option>
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
import { addRoute, } from "@/services"
export default {
  props: [],
  components: {},
  data() {
    return {
      tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId,
      ruleForm: {
        cloudAccount: this.$store.state.Routing.cloudAccount,
        regionId: this.$store.state.Routing.regionId,
        vpcId: this.$store.state.Routing.vpcId,
      },
      rules: {
        cloudAccount: [{ required: true, message: this.$t('cloudNet.Rute.remind[0]'), trigger: "blur" }],
        regionId: [{ required: true, message: this.$t('cloudNet.Rute.remind[0]'), trigger: "blur" }],
        vpcId: [{ required: true, message: this.$t('cloudNet.Rute.remind[0]'), trigger: "blur" }]
      }
    };
  },
  computed: {},
  methods: {
    close() {
      this.$parent.isShowAdd = false;
      this.$refs.form.resetFields();
    },
    submitForm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          addRoute({
            cloudAccountId:this.ruleForm.cloudAccount,
            regionId:this.ruleForm.regionId,
            vpcId:this.ruleForm.vpcId,
          }).then(res => {
            if(res.code === 10000){
              this.$parent.isShowAdd = false;
              this.close();
              this.$parent.$parent.getRouteList();
              this.$message.success(this.$t('cloudNet.Rute.remind[1]'))
            }
          })
        }
      })
    },
  },
  created() {},
  mounted() {}
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
      background: url("../../../../../assets/icon_close.png") no-repeat;
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