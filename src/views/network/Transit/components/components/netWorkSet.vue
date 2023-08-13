<template>
  <!-- 专网连接设置 -->
  <div class="netWorkSet">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="form"
      label-width="100px"
      class="demo-ruleForm"
      @submit.native.prevent
    >
      <h4 class="title">
        <span>Server端</span>
      </h4>
      <el-form-item label="名称" prop="ip">
        <el-input v-model="ruleForm.ip"></el-input>
      </el-form-item>
      <el-form-item label="带宽" prop="ip">
        <el-input v-model="ruleForm.ip"></el-input>
      </el-form-item>
      <el-form-item label="互联地址" prop="ip">
        <el-input v-model="ruleForm.ip"></el-input>
      </el-form-item>
      <h4 class="title">
        <span>Client端</span>
      </h4>
      <el-form-item label="名称" prop="ip">
        <el-input v-model="ruleForm.ip"></el-input>
      </el-form-item>
      <el-form-item label="带宽" prop="ip">
        <el-input v-model="ruleForm.ip"></el-input>
      </el-form-item>
      <el-form-item label="互联地址" prop="ip">
        <el-input v-model="ruleForm.ip"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        //提交
        // submit
        submitForm(formName) {
          this.$refs[formName].validate(valid => {
            if (valid) {
            } else {
              console.log("error submit!!");
              return false;
            }
          });
        }
      },
      rules: {}
    };
  },
  methods: {}
};
</script>
<style scoped lang="scss">
.netWorkSet {
  width: 100%;
  height: 474px;
  margin-bottom: 20px;
  margin-top: 10px;
}
.title {
  width: 100%;
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  padding-bottom: 14px;
  span {
      display: inline-block;
      width: 100px;
      text-align: right;
      padding-right: 12px;
  }
}
</style>
<style lang="scss">
.netWorkSet {
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