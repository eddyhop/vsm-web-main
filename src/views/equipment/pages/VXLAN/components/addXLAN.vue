<template>
  <div class="addXLAN" v-show="isShow">
    <div class="context">
      <h4 class="title">
        <span>VXLAN{{$t('attr.add')}}</span>
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
          <el-form-item :label="$t('attr.name')" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('attr.tenantRoutingDomain')" prop="vrfName">
            <el-select filterable v-model="ruleForm.vrfName" :placeholder="$t('attr.choose')">
              <el-option label="路由域1" value="shanghai"></el-option>
              <el-option label="路由域2" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('attr.sourceIP')" prop="Ip">
            <el-input v-model="ruleForm.Ip"></el-input>
          </el-form-item>
          <el-form-item :label="$t('attr.destIP')" prop="goalIp">
            <el-input v-model="ruleForm.goalIp"></el-input>
          </el-form-item>
          <el-form-item :label="$t('attr.tunnelIP')" prop="IpTunnel">
            <el-input v-model="ruleForm.IpTunnel"></el-input>
          </el-form-item>
          <el-form-item :label="$t('attr.describe')" prop="describe">
            <el-input type="textarea" v-model="ruleForm.describe"></el-input>
          </el-form-item>
          <div class="submit">
            <button @click.prevent="submitForm('ruleForm')">{{$t('attr.save')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { addVxLan, getRentUser, getPolicyName } from "@/services/index";
export default {
  props: {
    isShow: {
      type: Boolean
    }
  },
  components: {},
  data() {
    return {
      ruleForm: {
        name: "",
        Ip: "",
        goalIp: "",
        mtu: "",
        mss: "",
        describe: "",
        vrfName: "",
        IpTunnel: "",
        policyList: []
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        vrfName: [
          { required: true, message: "请选择租户路由域", trigger: "change" }
        ],
        Ip: [
          { required: true, message: "请输入源IP", trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]|[1-9]?)\.)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: "请输入正确的IP地址"
          }
        ],
        goalIp: [
          { required: true, message: "请输入目的地IP", trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]|[1-9]?)\.)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: "请输入正确的IP地址"
          }
        ],
        IpTunnel: [
          { required: true, message: "请输入隧道IP", trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]|[1-9]?)\.)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: "请输入正确的IP地址"
          }
        ]
      }
    };
  },
  computed: {},
  methods: {
    //关闭新增弹框
    // Close the new pop-up box
    close() {
      this.$parent.isShow = false;
      this.$refs.ruleForm.resetFields();
    },
    submitForm(formName) {
      // console.log(this.$refs[formName]);
      let mid = sessionStorage.getItem("mid");

      let _this = this;
      let data = {
        aimIp: this.ruleForm.goalIp,
        tunIp: this.ruleForm.IpTunnel + "/30",
        descr: this.ruleForm.describe,
        name: this.ruleForm.name,
        sourceIp: this.ruleForm.Ip,
        vrfName: this.ruleForm.vrfName,
        mid: mid
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          addVxLan(data).then(res => {
            console.log(res);
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "新增成功!"
              });
              this.$refs[formName].resetFields();
              _this.$parent.isShow = false;
              _this.$parent.getlite({ mid: mid ,page:this.$parent.lNumber,pageSize:this.$parent.lSize});
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
.addXLAN {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(176, 181, 194, 0.3);
  z-index: 100;
}
.context {
  width: 694px;
  height: 634px;
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
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
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
  padding: 30px 111px 30px 99px;
  .line {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      width: 20px;
      height: 2px;
      background: rgba(196, 198, 207, 1);
    }
  }
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
<style lang="scss">
.addXLAN {
  .el-input {
    width: 320px;
  }
  .el-textarea {
    width: 320px;
    height: 82px;
    .el-textarea__inner {
      height: 100%;
    }
  }
}
</style>