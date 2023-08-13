<template>
  <div class="content" id="login">
    <div class="top">
      <h1>
        <img class="loginLogo" src="../../assets/logo-Netlinkz.png" alt />
      </h1>
      <div class="dropdown">
        <el-dropdown trigger="click" @command="switchLanguage" @visible-change="changeDirection">
          <span class="el-dropdown-link">
            {{language}}
            <i class="el-icon-arrow-down el-icon--right" v-if="this.flag"></i>
            <i class="el-icon-arrow-up el-icon--right" v-else></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="简体中文">简体中文</el-dropdown-item>
            <el-dropdown-item command="English">English</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="body">
      <div class="main">
        <div class="form">
          <h2>{{$t('Login.login')}}</h2>
          <el-form ref="form" class="demo-ruleForm" :model="ruleForm">
            <el-form-item
              prop="name"
              :rules="[
      { required: true, message: $t('Login.userName')},
    ]"
            >
              <i>
                <img src="../../assets/login_icon_user.png" alt />
              </i>
              <el-input
                type="text"
                v-model="ruleForm.name"
                autocomplete="off"
                :placeholder="$t('Login.userName')"
                value=""
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="checkPass"
              :rules="[
      { required: true, message: $t('Login.passWord')},
    ]"
            >
              <i>
                <img src="../../assets/login_icon_password.png" alt />
              </i>
              <el-input
                type="password"
                v-model="ruleForm.checkPass"
                autocomplete="off"
                :placeholder="$t('Login.passWord')"
                @keyup.native.enter="submitForm('form')"
                value=""
              ></el-input>
            </el-form-item>
            <el-form-item style="text-align: right !important;">
              <el-button type="primary" @click.prevent="submitForm('form')">{{$t('Login.login')}}</el-button>
            </el-form-item>
          </el-form>
          <h3>{{$t('Login.platform')}}</h3>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Login, userInfo } from "@//services/index";
import { setToken } from "@/utils/cookie";
import plug from "@/utils/plug";
export default {
  data() {
    return {
      language: sessionStorage.getItem("lan") || "English",
      flag: true,
      ruleForm: {
        name: "",
        checkPass: ""
      }
    };
  },
  created() {
    // console.log("A cookie associated with a cross-site resource at 1.2")
  },
  methods: {
    // 改变下拉箭头方向
    // Change the direction of the drop-down arrow
    changeDirection(e) {
      this.flag = !e;
    },
    submitForm(formName) {
      let _this = this;
      let params = {
        username: this.ruleForm.name,
        password: this.ruleForm.checkPass
      };
      // sessionStorage.setItem("loginData", JSON.stringify(params));
      this.$refs[formName].validate(valid => {
        if (valid) {
          Login(params).then(res => {
            if (res.code === 10000) {
              this.afterLogin(res);
            } else if (res.code == 298899) {
              this.$message({
                type: "error",
                dangerouslyUseHTMLString: true,
                message: res.message
              });
            } else {
              // this.$message.error("用户名或密码错误!")
              // This.$message.error(" User name or password error!" )
              this.$message({
                type: "error",
                dangerouslyUseHTMLString: true,
                message: res.message
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 切换语言
    // To switch between languages
    switchLanguage(command) {
      window.location.reload();
      if (command === "简体中文") {
        sessionStorage.setItem("lan", "简体中文");
        sessionStorage.setItem("lang", "cn");
        sessionStorage.setItem("User-Language", "zh-CN");
        this.language = "简体中文";
        this.$i18n.locale = "cn";
      } else if (command === "English") {
        sessionStorage.setItem("lan", "English");
        sessionStorage.setItem("lang", "en");
        sessionStorage.setItem("User-Language", "en-US");
        this.language = "English";
        this.$i18n.locale = "en";
      }
    },
    //登录配置
    // Login configuration
    afterLogin(res) {
      let accessToken = res.result;
      setToken(res.result);
      sessionStorage.setItem("refresfError", "false");
      userInfo().then(res => {
        // delete res.result.permissions;
        // let roles = [];
        // res.result.roles.forEach(e => {
        //   roles.push(e.name);
        // });
        // sessionStorage.setItem("roles", JSON.stringify(roles));
        //sessionStorage.setItem("userData", JSON.stringify(res.result));

       // sessionStorage.setItem("type", res.result.type);
        if(res.result.type==1){
          sessionStorage.setItem("tenantValue", "");
        }else{
          sessionStorage.setItem("tenantValue", JSON.stringify(res.result).tenantId);
        }
        //加载菜单
        // Load the menu
        plug.initRouter(this);
        this.$router.push("/home");
      });
      var lan = this.$i18n.locale;
      if(lan=="en"){
          sessionStorage.setItem("User-Language", "en-US");
      }else if(lan=="cn"){
          sessionStorage.setItem("User-Language", "zh-CN");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  min-width: 1440px;
  overflow: hidden;
  background: url("../../assets/new_login_bg.png") no-repeat;
  background-size: cover;
  .top {
    width: 100%;
    height: 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      width: 55px;
      height: 56px;
      margin: 15px 0 0 40px;
    }
    .dropdown {
      margin-right: 10px;
      cursor: pointer;
    }
    .loginLogo {
      width: 150px;
      height: 40px;
    }
  }
  .body {
    width: 100%;
    height: calc(100vh - 60px);
    position: relative;
    .main {
      width: 380px;
      height: 290px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      opacity: 0.85;
      position: absolute;
      right: 180px;
      box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
      padding: 30px 0 29px 0;
      h3 {
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 20px;
      }
      h2 {
        font-size: 18px;
        font-family: arial, sans-serif;
        font-weight: 800;
        color: rgb(10, 10, 10);
        line-height: 20px;
        text-shadow: 1px 1px 1px rgb(173, 166, 166), 0 0 2px rgb(167, 167, 255), 0 0 2px rgb(32, 32, 41);
      }
      .form {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
@media screen and (max-width: 1440px) {
  .main {
    top: 104px;
  }
}
@media screen and (min-width: 1441px) {
  .main {
    top: 200px;
  }
}
</style>
<style lang="scss">
#login {
  .el-dropdown {
    display: block;
    width: 100px;
    height: 28px;
    border-radius: 5px;
    border: 1px solid rgb(120, 121, 123);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgb(249, 249, 250);
    line-height: 20px;
  }
  .el-input__inner {
    width: 320px;
    height: 48px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(54, 120, 200, 1);
    padding-left: 48px;
    font-size: 16px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    border: 1px solid rgba(209, 215, 224, 1);
  }
  .el-input__inner:hover {
    border-color: #3678c8;
  }
  .el-form-item__content {
    text-align: center;
    i {
      img {
        position: absolute;
        top: 50%;
        left: 16px;
        z-index: 10;
        transform: translateY(-50%);
      }
    }
  }
  .el-form-item {
    margin: 20px;
  }
  .el-button--primary {
    width: 140px;
    height: 36px;
    background: #3678c8;
    border-radius: 7px;
    font-size: 18px;
    color: rgba(255, 255, 255, 1);
    line-height: 10px;
    &:hover {
      background: #6095d6 !important;
    }
  }
  .el-form-item__error {
    left: 48px;
    top: 100%;
    color: #ba2727;
  }
  .el-form-item.is-error .el-input__inner {
    border-color: #ba2727;
  }
}
</style>