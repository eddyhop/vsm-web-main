<template>
  <div class="addDHCP" v-show="isShow">
    <div class="context">
      <h4 class="title">
        <span>DHCP{{$t('facility.new')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="139px"
          class="demo-ruleForm"
        >
          <el-form-item :label="$t('facility.serverName')" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>

          <el-form-item :label="$t('facility.addressPool')" required>
            <el-col :span="10">
              <el-form-item prop="addressPoolFirst">
                <el-input v-model="ruleForm.addressPoolFirst"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="4">
              <span></span>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="addressPoolLast">
                <el-input v-model="ruleForm.addressPoolLast"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('facility.addressLease')" prop="leaseTime">
            <el-input v-model.number="ruleForm.leaseTime"></el-input>
          </el-form-item>
          <el-form-item :label="$t('facility.gateway1')" prop="gateIp">
            <el-input v-model="ruleForm.gateIp"></el-input>
          </el-form-item>
          <el-form-item :label="$t('facility.preferredDnsServer1')" prop="dnsSer">
            <el-input v-model="ruleForm.dnsSer"></el-input>
          </el-form-item>
          <el-form-item :label="$t('facility.describe')" prop="describe">
            <el-input type="textarea" v-model="ruleForm.describe"></el-input>
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
import { addDhcp } from "@/services/index";
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
        describe: "",
        addressPoolFirst: "",
        addressPoolLast: "",
        leaseTime: 0,
        gateIp: "",
        dnsSer: ""
      },
      rules: {
        name: [{ required: true, message: "请输入服务名称", trigger: "blur" }],
        addressPoolFirst: [
          { required: true, message: "请输入地址", trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]|[1-9]?)\.)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: "请输入正确的IP地址"
          }
        ],
        addressPoolLast: [
          { required: true, message: "请输入地址", trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]|[1-9]?)\.)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: "请输入正确的IP地址"
          }
        ],
        describe: [],
        leaseTime: [{ type: "number", message: "地址租期必须为数字值" }],
        gateIp: [
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]|[1-9]?)\.)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: "请输入正确的IP地址"
          }
        ],
        dnsSer: [
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
      let _this = this;
      // console.log(this.$refs[formName]);
      let mid = sessionStorage.getItem("mid");

      this.$refs[formName].validate(valid => {
        if (valid) {
          addDhcp({
            name: this.ruleForm.name,
            descr: this.ruleForm.describe,
            ipStt: this.ruleForm.addressPoolFirst,
            ipEnd: this.ruleForm.addressPoolLast,
            leaseTime: this.ruleForm.leaseTime+"",
            gateIp: this.ruleForm.gateIp,
            dnsSer: this.ruleForm.dnsSer,
            mid: mid
          }).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "新增成功!"
              });
              this.$refs[formName].resetFields();
              _this.$parent.getlite({ mid });
              _this.$parent.isShow = false;
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
.addDHCP {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(176, 181, 194, 0.3);
  z-index: 100;
}
.context {
  width: 982px;
  height: 643px;
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
  padding: 40px 289px 30px 128px;
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