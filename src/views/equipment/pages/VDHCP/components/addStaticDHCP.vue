<template>
  <div class="addStatic isShow" ref="addStatic">
    <div class="context">
      <h4 class="title">
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item :label="$t('facility.macAddress1')" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('facility.ipAddress1')" prop="ip">
            <el-input v-model="ruleForm.ip"></el-input>
          </el-form-item>
          <el-form-item :label="$t('facility.hostName')" prop="main">
            <el-input v-model="ruleForm.main"></el-input>
          </el-form-item>
          <div class="submit">
            <button @click.prevent="submitForm('ruleForm')">{{$t('facility.save')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { addStaticDhcp } from "@/services";
export default {
  props: {},
  components: {},
  data() {
    return {
      ruleForm: {
        name: "",
        ip: "",
        main: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入MAC地址", trigger: "blur" },
          {
            pattern: /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/,
            message: "请输入正确的MAC地址"
          }
        ],
        ip: [
          { required: true, message: "请输入IP地址", trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]|[1-9]?)\.)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: "请输入正确的IP地址"
          }
        ],
        main: [{ required: true, message: "请输入主机名", trigger: "blur" }]
      }
    };
  },
  computed: {},
  methods: {
    close() {
      this.$refs.addStatic.classList.add("isShow");
      this.$refs.ruleForm.resetFields();
    },
    submitForm(formName) {
      let id = sessionStorage.getItem("vDHCPIp");
      let data = {
        dhcpId: id,
        hostName: this.ruleForm.main,
        id: "",
        ip: this.ruleForm.ip,
        macAddr: this.ruleForm.name,
        status: 0
      };

      this.$refs[formName].validate(valid => {
        if (valid) {
          addStaticDhcp(data).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "新增成功!"
              });
              this.$refs[formName].resetFields();
              this.$refs.addStatic.classList.add("isShow");
              this.$parent.dataInit({ dhcpId: id });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.isShow {
  display: none;
}
.addStatic {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(176, 181, 194, 0.5);
  z-index: 1000;
}
.context {
  width: 550px;
  height: 360px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
  .title {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;

    font-size: 22px;
    font-family: arial, sans-serif;
    font-weight: 500;
    color: rgba(39, 40, 56, 1);
    line-height: 38px;
    i {
      width: 20px;
      height: 20px;
      background: url("../../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.event {
  padding: 0 70px 0 70px;
}
.submit {
  width: 100%;
  text-align: center;
  button {
    width: 140px;
    height: 52px;
    background: rgba(82, 138, 250, 1);
    box-shadow: 0px 2px 5px 0px rgba(86, 175, 254, 0.5);
    border-radius: 25px;
    font-size: 20px;
    font-family: arial, sans-serif;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 52px;
    outline: none;
    border: 0;
    cursor: pointer;
  }
}
</style>