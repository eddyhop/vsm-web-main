<template>
  <div class="addMsetting">
    <div :class="lang == 'en' ? 'context contextEn' : 'context'">
      <h4 class="title">
        <span>{{ $t("Mobile.addMobileClientUser") }}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          label-width="150px"
          class="demo-ruleForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item :label="$t('Mobile.userNa')" prop="name" style="height: 20px">
            <el-input
              v-model="ruleForm.name"
              :placeholder="$t('Mobile.importUserName')"
            ></el-input>
            <span style="font-family: arial, sans-serif; color: #3434b6" v-bind:class="{'newLineStyle' : tenantDomain.length > 20}">  @{{tenantDomain}}</span>
          </el-form-item>
          <el-form-item v-bind:class="{'extraSpaceStyle' : tenantDomain.length > 20}" :label="$t('Mobile.pass')" prop="pass" style="height: 20px">
            <el-input
              type="password"
              v-model="ruleForm.pass"
              :placeholder="$t('Mobile.importPass')"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('Mobile.clientGroup')" prop="clientGroup" style="height: 20px;">
            <el-select filterable clearable v-model="ruleForm.clientGroup" :placeholder="$t('Mobile.importClientGroup')" style="width: 300px" width="300px">
              <el-option
                  v-for="item in groupList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="submit">
            <button class="save" type="primary" v-debounce.prevent="submitForm"  :disabled="isSave">
              {{ $t("Mobile.ok") }}
            </button>
            <button class="cancel" @click="close">
              {{ $t("Mobile.cancel") }}
            </button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mobileUserGetTenantVrfList,
  mobileUserAdd,
  mobileUserValidName, getDomainforTenant, getSelectGroupList
} from "@/services/index.js";
export default {
  props: {},
  components: {},
  data() {
    var mobileUserTest = (rule, value, callback) => {
      console.log("test mobileUserValidName --------------------- add");
      if (value) {
        mobileUserValidName({
          id: "",
          vrfId: this.ruleForm.vlfName,
          tenantId: sessionStorage.getItem("tenantValue") ,
          username: value,
        }).then((res) => {
          if (!res.result) {
            callback(new Error(this.$t("Mobile.hint5")));
          } else if (res.code == 203710) {
            callback(new Error(res.message));
          } else {
            callback();
          }
        });
      }
    };
    var checkLength = (rule, value, callback)=>{
      if(value){
        var len = value.length;
        if(len>=8&&len<=16){
          callback()
        }else{
          callback(new Error(this.$t('UserMan.hint20')))
        }
      }
    };

    return {
      tenantId: sessionStorage.getItem("tenantValue") ,
      isSave : false,
      ruleForm: {
        name: "",
        pass: "",
        vlfName: "",
        userId: "",
        clientGroup: ""
      },
      lang: sessionStorage.getItem("lang") || "en",
      tenantDomain: "",
      vlfList: [],
      groupList:[],
      rules: {
        name: [
          {
            required: true,
            message: this.$t("Mobile.importUserName"),
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z][a-zA-Z0-9]{5,32}$/,
            message: this.$t("Mobile.hint6"),
          },
          { validator: mobileUserTest, trigger: "blur" },
        ],
        pass: [
          {
            required: true,
            message: this.$t("Mobile.importPass"),
            trigger: "blur",
          },
          {
            validator: checkLength, trigger: 'blur' },
          {
            // pattern:/(?!^(\d+[a-zA-Z]+[~`!@#$%^&*()_\-\]\[+={}|:;<,>.?/]+)$)^[\w~`!@#$%^&*()_\-\]\[+={}|:;<,>.?/]{1,200}$/,
            // // 正则表达式
            // message: this.$t("UserMan.hint12"),
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
            message: this.$t("Mobile.hint7"),
            trigger: 'blur'
          }
        ],
        clientGroup: [
          {
            required: true,
            message: this.$t("Mobile.importClientGroup"),
            trigger: "blur",
          }
        ]
      },
    };
  },
  computed: {},
  methods: {
    submitForm(formName) {
      // console.log(this.$refs[formName]);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            // createTime: "",
            // id: "",
            password: this.ruleForm.pass,
            tenantId: sessionStorage.getItem("tenantValue") ,
            // tenantUserId: "",
            username: this.ruleForm.name,
            clientGroup: this.ruleForm.clientGroup
          };
          this.isSave = true;
          mobileUserAdd(params).then((res) => {
            if (res.code === 10000) {
              this.$refs.form.resetFields();
              this.$parent.isShow = false;
              this.$message({
                message: this.$t("Mobile.hint8"),
                type: "success",
              });
              this.$refs.form.resetFields();
              this.$parent.dataInit({
                pageNumber: 1,
                pageSize: 10,
                tenantId: sessionStorage.getItem("tenantValue") ,
                username: "",
                vrfId: this.$parent.vlfName,
              });
              this.$parent.page = 1;
            } else {
              this.$message({
                type: "warning",
                message: res.message,
              });
              this.close();
            }
            this.isSave = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    searchData() {
      mobileUserGetTenantVrfList({
        page: 1,
        pageSize: 10,
        tenantId: sessionStorage.getItem("tenantValue") ,
      }).then((res) => {
        if (res.code === 10000) {
          this.vlfList = res.result;
        }
      });
    },
    load() {
      mobileUserGetTenantVrfList({
        page: this.page++,
        pageSize: 10,
        tenantId:sessionStorage.getItem("tenantValue"),
      }).then((res) => {
        if (res.code === 10000) {
          this.vlfList = this.vlfList.concat(res.result);
        }
      });
    },
    close() {
      this.$parent.isShow = false;
      this.$refs.form.resetFields();
    },
    getCilentGroupList(){
      getSelectGroupList({tenantId:sessionStorage.getItem("tenantValue")}).then((res) =>{
        if (res.code === 10000) {
          this.groupList = res.result.clientGroups;
        }
      });
    }
  },
  created() {
    // userInfo().then(res => {
    //   this.tenantDomain = res.result.tenantDomain;
    // });
    if(this.tenantId){
      getDomainforTenant({tenantId:this.tenantId}).then((res) => {
        if (res.code === 10000) {
          this.tenantDomain = res.result;
        }
      });
    }
    this.getCilentGroupList();
  },
  mounted() {},
};
</script>
<style scoped lang="scss">
.addMsetting {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.context {
  width: 500px;
  height: 339px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
  .title {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    i {
      width: 14px;
      height: 14px;
      background: url("../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.contextEn {
  width: 630px;
  height: 350px;
}
.event {
  padding-top: 20px;
}
.submit {
  width: 100%;
  text-align: center;
  padding-top: 20px;
  .save {
    width: 80px;
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
    margin-left: 18px;
  }
  .cancel {
    width: 80px;
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
.vrfName {
  padding-left: 43px;
  padding-bottom: 24px;
  span {
    padding-right: 20px;
  }
}
</style>
<style lang="scss">
.addMsetting .context {
  .el-input {
    width: 240px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
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
.addMsetting .contextEn {
  .el-form-item {
    margin-bottom: 14px;
  }
}
.newLineStyle {
  display: block;
  margin-bottom:100px
}
.extraSpaceStyle {
  padding-top: 15px;
}
</style>
