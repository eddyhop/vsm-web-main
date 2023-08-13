<template>
  <!-- SNAT  -->
  <div class="SNAT">
    <div :class="lang=='en'? 'contentEn content' : 'content'">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="form"
        label-width="auto"
        label-position="right"
        @submit.native.prevent
      >
        <el-form-item :label="$t('newModel.name')" prop="name">
          <el-input
            v-model="ruleForm.name"
            :placeholder="$t('vsr100.lan.enterContent')"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('newModel.description')" prop="description">
          <el-input
            v-model="ruleForm.description"
            :placeholder="$t('vsr100.lan.enterContent')"
            size="small"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="输出" prop="output">
          <el-checkbox v-model="ruleForm.output"></el-checkbox>
        </el-form-item>-->
        <el-form-item :label="$t('newModel.NetworkInterface')" prop="outInterfaceName">
          <el-select filterable v-model="ruleForm.outInterfaceName">
            <el-option
              v-for="item in outIpList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('newModel.IPOutside')" prop="outIp">
          <el-input
            v-model="ruleForm.outIp"
            :placeholder="$t('vsr100.lan.enterContent')"
            size="small"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="转发" prop="forwarding">
          <el-switch v-model="ruleForm.forwarding" active-color="#3678C8" inactive-color="#D1D7E0"></el-switch>
        </el-form-item>-->
        <div class="submit">
          <button class="save" v-debounce.prevent="submitForm">{{$t('vsr1000.save')}}</button>
          <button class="remove" @click="removeSnat">{{$t('newModel.empty')}}</button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  snatGet,
  snatGetInterface,
  snatSave,
  snatDel,
  snatCheckDelete,
} from "@/services";
import plug from "@/utils/plug";
export default {
  data() {
    return {
      lang:sessionStorage.getItem("lang") || "en",
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      ruleForm: {
        id: "",
        name: "",
        description: "",
        output: true,
        forwarding: true,
        outInterfaceName: "",
        outIp: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[0]"),
            trigger: "blur",
          },
        ],
        outInterfaceName: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[3]"),
            trigger: "change",
          },
        ],
        outIp: [
          { required: true, message: this.$t('newModel.msg3'), trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]"),
          },
        ],
      },
      outIpList: [],
    };
  },
  methods: {
    //清空
    // empty
    removeSnat() {
      if (this.ruleForm.id.length) {
        var show54 = localStorage.getItem("show54");
        if(show54 == 'true'){
          
            snatCheckDelete({ deviceId: this.deviceId }).then((res) => {
              if (res.success) {
                snatDel({ ids: this.ruleForm.id }).then((res) => {
                  if (res.code === 10000) {
                    this.$message({
                      type: "success",
                      message: this.$t("vsr1000.remind2[2]"),
                    });
                    this.ruleForm = {
                      id: "",
                      name: "",
                      description: "",
                      output: true,
                      forwarding: true,
                      outInterfaceName: "",
                      outIp: "",
                    };
                    this.$refs.form.resetFields();
                  } else if (res.code !== 10000) {
                    this.$message({
                      type: "warning",
                      message: res.message,
                    });
                  }
                });
              } else {
                this.$message({
                  type: "warning",
                  message: res.message,
                });
              }
            });
        }else{
          this.$confirm(this.$t('newModel.msg17')+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue54\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
            confirmButtonText: this.$t("vsr1000.OK"),
            cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning",
          })
          .then(() => {
            snatCheckDelete({ deviceId: this.deviceId }).then((res) => {
              if (res.success) {
                snatDel({ ids: this.ruleForm.id }).then((res) => {
                  if (res.code === 10000) {
                    this.$message({
                      type: "success",
                      message: this.$t("vsr1000.remind2[2]"),
                    });
                    this.ruleForm = {
                      id: "",
                      name: "",
                      description: "",
                      output: true,
                      forwarding: true,
                      outInterfaceName: "",
                      outIp: "",
                    };
                    this.$refs.form.resetFields();
                    localStorage.setItem("show54",localStorage.getItem("checkedValue54"));
                  } else if (res.code !== 10000) {
                    this.$message({
                      type: "warning",
                      message: res.message,
                    });
                  }
                });
              } else {
                this.$message({
                  type: "warning",
                  message: res.message,
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t('vsr1000.closeDel'),
            });
          });

        }
        
      } else {
        this.$message({
          type: "warning",
          message: this.$t('newModel.msg18'),
        });
      }
    },
    //提交
    // submit
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          plug.debounce(this.saveSnat(), 500);
        }
      });
    },
    //save保存
    // Save save
    saveSnat() {
      let params = {
        id: this.ruleForm.id,
        deviceId: this.deviceId,
        name: this.ruleForm.name,
        description: this.ruleForm.description,
        output: this.ruleForm.output,
        forwarding: this.ruleForm.forwarding,
        outInterfaceName: this.ruleForm.outInterfaceName,
        outIp: this.ruleForm.outIp,
      };
      snatSave(params).then((res) => {
        if (res.code === 10000) {
          this.$message({
            type: "success",
            message: this.$t("vsr1000.qosremind[0]"),
          });
          this.dataInit();
        } else {
          this.$message({
            type: "warning",
            message: res.message,
          });
        }
      });
    },
    //获取外网接口下拉菜单
    // Gets the outer network interface drop-down menu
    getOutIpSelect() {
      snatGetInterface({ deviceId: this.deviceId }).then((res) => {
        if (res.code === 10000) {
          this.outIpList = res.result;
        }
      });
    },
    //数据初始化
    // Data initialization
    dataInit() {
      snatGet({ deviceId: this.deviceId }).then((res) => {
        if (res.code === 10000 && res.result != null) {
          this.ruleForm.id = res.result.id;
          this.ruleForm.name = res.result.name;
          this.ruleForm.description =
            res.result.description == null ? "" : res.result.description;
          this.ruleForm.output = res.result.output;
          this.ruleForm.forwarding = res.result.forwarding;
          this.ruleForm.outInterfaceName = res.result.outInterfaceName;
          this.ruleForm.outIp = res.result.outIp;
        }
      });
    },
  },
  created() {
    this.dataInit();
    this.getOutIpSelect();
  },
};
</script>
<style scoped lang="scss">
.SNAT {
}
.content {
  padding: 30px 0 0 80px;
}
.contentEn{
  padding-left: 40px;
  .submit{
    padding-left: 130px;
  }
}
.submit {
  padding-left: 68px;
  .save {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: 0;
    outline: none;
    cursor: pointer;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
  }
  .save:hover {
    background: rgba(96, 149, 214, 1);
  }
  .remove {
    width: 100px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    outline: none;
    margin-left: 15px;
  }
}
</style>
<style lang="scss">
.SNAT {
  .el-input,
  .el-select {
    width: 280px;
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