<template>
  <div class="zhcAdd">
    <div class="cont">
      <div class="title">
        {{$t('TenMan.addTenant')}}
        <span @click="close"></span>
      </div>
      <div class="even">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          :label-width="lang=='en'?'220px':'auto'"
          label-position="left"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item :label="$t('TenMan.tenName')" prop="name">
            <el-input v-model="form.name" :placeholder="$t('TenMan.hint3')" size="small"></el-input>
          </el-form-item>
          <el-form-item :label="$t('TenMan.organization')" prop="zuzhi">
            <el-input v-model="form.zuzhi" :placeholder="$t('TenMan.hint3')" size="small"></el-input>
          </el-form-item>
          <el-form-item :label="$t('TenMan.TenDomainName')" prop="zuhu">
            <el-input v-model="form.zuhu" :placeholder="$t('TenMan.hint3')" size="small"></el-input>
          </el-form-item>
          <el-form-item :label="$t('TenMan.tenDes')" prop="miaoshu">
            <el-input
              v-model="form.miaoshu"
              :placeholder="$t('TenMan.hint3')"
              type="textarea"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="contr">
              <button v-debounce="save" class="save">{{$t('TenMan.save')}}</button>
              <button @click.prevent="close" class="cancel">{{$t('TenMan.cancel')}}</button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { Setrent, rentName } from "@/services";
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (value) {
        if (value == "default") {
          callback(new Error(this.$t("TenMan.hint9")));
        } else {
          rentName({ verifyName: value }).then(res => {
            if (res.code == 10000) {
              callback();
            } else {
              callback(new Error(this.$t("TenMan.hint10")));
            }
          });
        }
      }
    };
    var checkMs = (rule, value, callback) => {
      if (value) {
        if (value.length > 255) {
          callback(new Error(this.$t("TenMan.limit")));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      form: {
        name: "",
        miaoshu: "",
        zuzhi: "",
        zuhu: ""
      },
      rules: {
        name: [
          { required: true, message: this.$t("TenMan.hint4"), trigger: "blur" },
          { validator: checkName, trigger: "blur" }
        ],
        miaoshu: [
          { message: this.$t("TenMan.hint11"), trigger: "blur" },
          { validator: checkMs }
        ],
        zuzhi: [
          { required: true, message: this.$t("TenMan.hint5"), trigger: "blur" }
        ],
        zuhu: [
          { required: true, message: this.$t("TenMan.hint6"), trigger: "blur" },
          {
            pattern: /^(?=^.{3,255}$)(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/,
            message: this.$t("TenMan.hint7")
          }
        ]
      }
    };
  },
  methods: {
    save(formName) {
      let params = {
        name: this.form.name,
        description: this.form.miaoshu,
        organizationName: this.form.zuzhi,
        domain: this.form.zuhu,
        id:"",
      //  userId: JSON.parse(sessionStorage.getItem("userData")).userId
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          Setrent(params).then(res => {
            if (res.code == 10000) {
              this.$message({
                message: this.$t("TenMan.hint8"),
                type: "success"
              });
              this.close();
              this.$refs[formName].resetFields();
              this.$parent.getRent();
            } else {
              this.$message({
                message: this.$t("TenMan.hint10"),
                type: "warning"
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
      this.$parent.addShow = false;
      this.$refs.form.resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
.even {
  min-width: 440px;
  margin: 0 auto;
  margin-top: 30px;
  // margin-left: -5px;
  text-align: center;
  .a {
    div {
      width: 320px;
    }
  }
  .remaind {
    color: darkgray;
  }
  .contr {
    // margin-left: -60px;
    .save:hover {
      background: rgba(96, 149, 214, 1);
    }
  }
  .cancel {
    margin-left: 18px;
    background: rgba(255, 255, 255, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    border: 1px solid rgba(209, 215, 224, 1);
  }
  button {
    color: white;
    border: none;
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
  }
}
.cont {
  width: 580px;
  min-height: 388px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -231px;
  margin-top: -194px;
  border-radius: 7px;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    width: 100%;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    padding: 15px;
    span {
      display: inline-block;
      width: 14px;
      height: 14px;
      background-image: url("../../../assets/icon_close.png");
      background-size: 14px 14px;
    }
  }
}
.zhcAdd {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9;
  background: rgba(32, 42, 59, 0.2);
  .el-form-item {
    margin-bottom: 30px;
    div {
      width: 320px;
    }
  }
}
</style>
