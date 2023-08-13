<template>
  <div class="addDHCP" v-show="isShow2">
    <div class="context">
      <h4 class="title">
        <span>DHCP{{$t('facility.edit')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="editData"
          :rules="rules"
          ref="ruleForm"
          label-width="139px"
          class="demo-ruleForm"
        >
          <el-form-item :label="$t('facility.serverName')" prop="name">
            <el-input v-model="editData.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('facility.describe')" prop="descr">
            <el-input type="textarea" v-model="editData.descr"></el-input>
          </el-form-item>

          <el-form-item :label="$t('facility.addressPool')" required>
            <el-col :span="10">
              <el-form-item prop="ipStt">
                <el-input v-model="editData.ipStt"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="4">
              <span></span>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="ipEnd">
                <el-input v-model="editData.ipEnd"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('facility.addressLease')" prop="leaseTime">
            <el-input v-model.number="editData.leaseTime"></el-input>
          </el-form-item>
          <el-form-item :label="$t('facility.gateway1')" prop="gateIp">
            <el-input v-model="editData.gateIp"></el-input>
          </el-form-item>
          <el-form-item :label="$t('facility.preferredDnsServer1')" prop="dnsSer">
            <el-input v-model="editData.dnsSer"></el-input>
          </el-form-item>
          <el-form-item class="submit">
            <el-button round type="primary" @click.prevent="submitForm('ruleForm')">{{$t('facility.save')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { editDhcp } from "@/services/index";
export default {
  props: {
    isShow2: {
      type: Boolean
    }
  },
  components: {},
  data() {
    return {
      editData: {
        addressPool: "",
        descr: "",
        dnsSer: "",
        gateIp: "",
        id: "",
        ipEnd: "",
        ipStt: "",
        leaseTime: null,
        mid: "",
        name: ""
      },
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        ipStt: [
          { required: true, message: "请输入地址", trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]|[1-9]?)\.)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: "请输入正确的IP地址"
          }
        ],
        ipEnd: [
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
    close() {
      this.$parent.isShow2 = false;
    },
    submitForm(formName) {
      let _this = this;
      // console.log(this.$refs[formName]);

      this.$refs[formName].validate(valid => {
        if (valid) {
          editDhcp({
            name: this.editData.name,
            descr: this.editData.descr,
            ipStt: this.editData.ipStt,
            ipEnd: this.editData.ipEnd,
            leaseTime: this.editData.leaseTime + "",
            gateIp: this.editData.gateIp,
            dnsSer: this.editData.dnsSer,
            mid: this.editData.mid,
            id: this.editData.id
          }).then(res => {
            // console.log(res);
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "编辑成功!"
              });
              _this.$parent.getlite({ mid: _this.editData.mid });
              _this.$parent.isShow2 = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    dataInit(row) {
      this.editData.addressPool = row.addressPool
      this.editData.descr = row.descr
      this.editData.dnsSer = row.dnsSer
      this.editData.gateIp = row.gateIp
      this.editData.id = row.id
      this.editData.ipEnd = row.ipEnd
      this.editData.ipStt = row.ipStt
      this.editData.leaseTime = row.leaseTime
      this.editData.mid = row.mid
      this.editData.name = row.name
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
}
</style>