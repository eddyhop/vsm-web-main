<template>
  <div class="thirdCertification">
    <div class="context">
      <h4 class="title">
        <span>{{$t('Mobile.ThirdPartyCertification')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          label-width="110px"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item :label="$t('Mobile.serveAddress')" prop="address">
            <el-input v-model="ruleForm.address"></el-input>
          </el-form-item>
          <el-form-item :label="$t('Mobile.pass')" prop="pass">
            <el-input v-model="ruleForm.pass" show-password></el-input>
          </el-form-item>
          <el-form-item :label="$t('Mobile.port')" prop="port">
            <el-input v-model="ruleForm.port"></el-input>
          </el-form-item>
          <el-form-item :label="$t('Mobile.remarks')" prop="der">
            <el-input type="textarea" v-model="ruleForm.der"></el-input>
          </el-form-item>
        </el-form>
        <div class="submit">
          <button
            class="save"
            type="primary"
            @click.prevent="submitForm('form')"
            v-control
          >{{$t('Mobile.ok')}}</button>
          <!-- <button class="cancel" @click="close">{{$t('Mobile.cancel')}}</button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getRadius, createRadius } from "@/services/index.js";
export default {
  props: {},
  components: {},
  data() {
    return {
      ruleForm: {
        address: "",
        pass: "",
        port: "",
        der: ""
      },
      rules: {
        address: [
          {
            required: true,
            message: this.$t("vsr1000.aclremind[8]"),
            trigger: "blur"
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.aclremind[11]")
          }
        ],
        pass: [
          {
            required: true,
            message: this.$t("Mobile.importPass"),
            trigger: "blur"
          }
        ],
        port: [
          {
            required: true,
            message: this.$t("Mobile.isPort"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {},
  methods: {
    submitForm(formName) {
      // console.log(this.$refs[formName]);

      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            enable: this.$parent.three,
            memo: this.ruleForm.der,
            port: this.ruleForm.port,
            secret: this.ruleForm.pass,
            server: this.ruleForm.address,
            tenantId: sessionStorage.getItem("tenantValue")
          };
          createRadius(params).then(res => {
            if (res.code === 10000) {
              this.$message({
                message: this.$t("Mobile.setSuccess"),
                type: "success"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    close() {
      this.$parent.isShowT = false;
    },
    //下发
    // Issued by the
    postReduis() {},
    dataInit() {
      getRadius({
        tenantId: sessionStorage.getItem("tenantValue")
      }).then(res => {
        if (res.code === 10000) {
          this.ruleForm.address = res.result.server;
          this.ruleForm.pass = res.result.secret;
          this.ruleForm.port = res.result.port;
          this.ruleForm.der = res.result.memo;
        }
      });
    }
  },
  created() {
    this.dataInit();
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.thirdCertification {
  flex: 1;
  margin-top: 20px;
  background: #fff;
  padding: 20px 30px;
  overflow-x: hidden;
  overflow-y: auto;
}
.context {
  // overflow: auto;
  .title {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    // border-bottom: 1px solid rgba(231, 231, 231, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    // i {
    //   width: 14px;
    //   height: 14px;
    //   background: url("../../../../assets/icon_close.png") no-repeat;
    //   background-size: cover;
    //   cursor: pointer;
    // }
  }
}
// .event {
//   padding-top: 20px;
//   // text-align: center;
//   .tit {
//     padding-bottom: 14px;
//   }
// }
.submit {
  width: 100%;
  // text-align: center;
  // padding-top: 30px;
  margin-left: 110px;
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
.thirdCertification .context {
  .el-input {
    width: 308px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .el-textarea {
    width: 308px;
    height: 82px;
    .el-textarea__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-textarea__icon {
      line-height: normal;
    }
  }
  .el-form-item__label {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
}
</style>