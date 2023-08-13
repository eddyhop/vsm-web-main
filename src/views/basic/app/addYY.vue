<template>
  <div class="addzh">
    <div class="cont">
      <div class="title">
        {{$t('App.add')}} {{$t('App.applicationGroups')}}
        <span @click="close"></span>
      </div>
      <div class="even">
        <el-form :model="form" :rules="rules" ref="form" label-width="150px" @submit.native.prevent>
          <el-form-item :label="$t('App.name')" prop="name">
            <el-input v-model="form.name" :placeholder="$t('App.prompt1')" size="small"></el-input>
          </el-form-item>
          <el-form-item :label="$t('App.description')">
            <el-input v-model="form.describe" :placeholder="$t('App.prompt2')" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="contr">
              <button ref="btn" v-debounce="save" class="save">{{$t('App.save')}}</button>
              <button @click.prevent="close" class="cancel">{{$t('App.cancel')}}</button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {applySet, appNamExit, userInfo} from "@/services";
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("App.prompt3")));
      } else {
        if (value.length > 32) {
          callback(new Error(this.$t("App.prompt4")));
        } else {
          let tenantId = "";
          tenantId = sessionStorage.getItem("tenantValue") ;
          appNamExit({
            verifyName: value,
            verifyScope: tenantId,
            verifyId: ""
          }).then(res => {
            if (this.flag) {
              this.rules.ten[0].required = true;
              if (this.form.ten == "") {
                callback(new Error(this.$t("App.hint9")));
              } else if (this.form.ten != "" && res.code == 200608) {
                callback(new Error(this.$t("App.hint10")));
              } else if (this.form.ten != "" && res.code == 10000) {
                callback();
              }
            } else {
              this.rules.ten[0].required = false;
              if (res.code == 500) {
                callback(new Error(this.$t("App.hint10")));
              } else {
                callback();
              }
            }
          });
        }
      }
    };
    return {
      type: "",
      flag: false,
      form: {
        ten: "",
        tenList: [],
        options: [],
        value: "",
        options2: [],
        val2: "",
        name: "",
        describe: "",
        rootPort: "",
        goalPort: ""
      },
      rules: {
        name: [
          { required: true, message: this.$t("App.prompt1"), trigger: "blur" },
          { validator: checkName, trigger: "change" }
        ],
      },
      log: true
    };
  },
  created() {
    userInfo().then(res => {
      this.type = res.result.type;
    });
    this.flag = this.type == 1 ? true : false;
    this.form={
      ...this.form,
      ten:sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : ''
    }
  },
  methods: {
    chosePort(val) {
      for (let i in this.form.options2) {
        if (val == this.form.options2[i].id) {
          if (
            this.form.options2[i].name == "TCP" ||
            this.form.options2[i].name == "UDP"
          ) {
            this.log = false;
            this.rules.rootPort[0].required = true;
            this.rules.goalPort[0].required = true;
          } else {
            this.log = true;
            this.rules.rootPort[0].required = false;
            this.rules.goalPort[0].required = false;
            this.form.goalPort = "";
            this.form.rootPort = "";
          }
        }
      }
      this.$refs.form.validate(valid => {
        if (valid) {
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    save(formName) {
      let params = {
        appName: this.form.name,
        appDscp: this.form.value,
        appDescription: this.form.describe,
        appProtocol: this.form.val2,
        sourcePort: this.form.rootPort,
        destinationPort: this.form.goalPort,
        tenantId: this.type == 1 ? this.form.ten : this.$parent.tenantId
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          applySet(params).then(res => {
            if (res) {
              this.$refs.btn.disabled = false;
            }
            if (res.code === 10000) {
              this.$message({
                message: this.$t("App.hint18"),
                type: "success"
              });
              this.close();
              this.$parent.getApply();
            } else {
              this.$message({
                message: this.$t("App.hint19"),
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
      this.$refs.form.resetFields();
      this.form.describe = ''
      this.$parent.addShow = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.even {
  width: 450px;
  margin: 0 auto;
  margin-top: 30px;
  text-align: center;
  margin-left: -10px;
  .a {
    div {
      width: 300px;
    }
  }
  .remaind {
    color: darkgray;
    font-size: 14px;
  }
  .contr {
    margin-left: -60px;
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
  width: 500px;
  min-height: 267px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -231px;
  margin-top: -253px;
  box-shadow: 0px 10px 20px 0px rgba(102, 102, 102, 0.1);
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
.addzh {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9;
  background: rgba(32, 42, 59, 0.2);
}
</style>