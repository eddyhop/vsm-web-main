<template>
  <div class="editVXLAN" v-show="isShowE">
    <div class="context">
      <h4 class="title">
        <span>VXLAN{{$t('attr.edit')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="editVxLanData"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item :label="$t('attr.name')" prop="name">
            <el-input v-model="editVxLanData.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('attr.tenantRoutingDomain')" prop="vrfName">
            <el-select filterable v-model="editVxLanData.vrfName" :placeholder="$t('facility.select')">
              <el-option label="路由域1" value="shanghai"></el-option>
              <el-option label="路由域2" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('attr.sourceIP')" prop="sourceIp">
            <el-input v-model="editVxLanData.sourceIp"></el-input>
          </el-form-item>
          <el-form-item :label="$t('attr.destIP')" prop="aimIp">
            <el-input v-model="editVxLanData.aimIp"></el-input>
          </el-form-item>
          <el-form-item :label="$t('attr.tunnelIP')" prop="tunIp">
            <el-input v-model="editVxLanData.tunIp"></el-input>
          </el-form-item>
          <el-form-item :label="$t('attr.describe')" prop="descr">
            <el-input type="textarea" v-model="editVxLanData.descr"></el-input>
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
import { editVxLan } from "@/services";
export default {
  props: {
    isShowE:{
      type:Boolean
    }
  },
  components: {},
  data() {
    return {
      editVxLanData: {
        aimIp: "",
        descr: "",
        id: "",
        mid: "",
        name: "",
        sourceIp: "",
        tunIp: "",
        vrfName: ""
      },
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        vrfName: [
          { required: true, message: "请选择租户路由域", trigger: "change" }
        ],
        sourceIp: [
          { required: true, message: "请输入源IP", trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]|[1-9]?)\.)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: "请输入正确的IP地址"
          }
        ],
        aimIp: [
          { required: true, message: "请输入目的地IP", trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]|[1-9]?)\.)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: "请输入正确的IP地址"
          }
        ],
        tunIp: [
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
    close() {
      this.$parent.isShowE = false
    },
    submitForm(formName) {
      // console.log(this.$refs[formName]);

      let _this = this;
      let data = {
        aimIp: this.editVxLanData.aimIp,
        tunIp: this.editVxLanData.tunIp,
        descr: this.editVxLanData.descr,
        name: this.editVxLanData.name,
        sourceIp: this.editVxLanData.sourceIp,
        vrfName: this.editVxLanData.vrfName,
        mid: this.editVxLanData.mid,
        id: this.editVxLanData.id
      };

      this.$refs[formName].validate(valid => {
        if (valid) {
          editVxLan(data).then(res => {
            console.log(res);
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "编辑成功!"
              });
              _this.$parent.isShowE = false
              _this.$parent.getlite({
                mid: mid,
                page: _this.$parent.lNumber,
                pageSize: _this.$parent.lSize
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    dataInit(row) {
      this.editVxLanData.aimIp = row.aimIp;
      this.editVxLanData.tunIp = row.tunIp;
      this.editVxLanData.descr = row.descr;
      this.editVxLanData.name = row.name;
      this.editVxLanData.sourceIp = row.sourceIp;
      this.editVxLanData.vrfName = row.vrfName;
      this.editVxLanData.mid = row.mid;
      this.editVxLanData.id = row.id;
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.editVXLAN {
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
.editVXLAN {
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