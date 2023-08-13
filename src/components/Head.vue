<template>
  <header class="header">
    <div class="headerLeft">
      <img class="logo" src="../assets/logo_Netlinkz.png" alt="">
      <div class="formList headerLeft flml10">
        {{$t('DeviceMan.tenant')}}
        <div class="message">
          <div :class="`opt ${lang == 'en' ? 'optEn' : ''}`">
            <el-select filterable :disabled="type != 1" v-model="tenantValue" :placeholder="$t('DeviceMan.choose')" @change="tenantSearch" size="small">
              <el-option style="font-family: arial, sans-serif" value :label="$t('DeviceMan.all')"></el-option>
              <el-option style="font-family: arial, sans-serif"
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div >
      <ul class="header-context headerRight">
        <li class="lange">
          <el-dropdown
            trigger="click"
            @command="switchLanguage"
            @visible-change="changeDirection"
          >
            <span class="link">
              {{ language }}
              <i class="el-icon-arrow-down el-icon--right" v-if="this.flag"></i>
              <i class="el-icon-arrow-up el-icon--right" v-else></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="简体中文">简体中文</el-dropdown-item>
              <el-dropdown-item command="English">English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li class="userMsg">
          <span class="userPic">
            <img src="@/assets/homePage/home_heard@2x.png" alt />
          </span>
          <b>{{ name }}</b>
          <i class="logout" @click="handleCommand">
            <img src="@/assets/homePage/home_icon_close@2x.png" alt />
          </i>
        </li>
      </ul>
    </div>
    <el-dialog customClass="dialogStyle" :visible="isIdle" >
      <IdleModal/>
    </el-dialog>
  </header>
</template>
<script>
import IdleModal from "@/components/IdleModal";
import {logout, removeToken} from "@/utils/cookie";
import {
  deviceSelect, userInfo
} from "@/services";
export default {
  computed: {
    isIdle() {
     return this.$store.state.idleVue.isIdle;
    }
  },
  props: {},
  components: {
    IdleModal
  },
  data() {
    return {
      tenantValue:undefined,
      type: '',
      options: [],
      language: "",
      flag: true,
      name: '',
      lang: sessionStorage.getItem("lang") || "en",
    };
  },
  created() {
    userInfo().then(res => {
        this.type = res.result.type;
        this.name = res.result.username;
        this.getAllList();
        if(sessionStorage.getItem("tenantValue")){
          this.tenantValue=sessionStorage.getItem("tenantValue");
        }else{
          this.tenantValue = ''
        }
        let lang = sessionStorage.getItem("lang") || "en";
        if (lang) {
          lang === "en"
              ? (this.language = "English")
              : (this.language = "简体中文");
        } else {
          this.language = "English";
        }
        this.$nextTick(function () {
          //页面加载完成后执行
          // Execute after the page loads
          let lang = sessionStorage.getItem("lang");
          let tag = document.getElementsByClassName("lab-height");
          // let tag = document.getElementsByTagName('label')
          let opt = Array.prototype.slice.call(tag);
          // console.log(tag)
          for (let i in opt) {
            // console.log(opt[i])
            if (lang == "en") {
              // opt[i].style.lineHeight = "16px"
              opt[i].style.fontSize = "13px";
            } else {
            }
          }
        });
    });
  },
  methods: {
    tenantSearch(){
      sessionStorage.setItem("tenantValue", this.tenantValue);
      var _this=this;
      setTimeout(function(){
        if(_this.$route.name=="allocation"){
          _this.$router.push({
            path: "/base/device",
            query: { devData: _this.$router.query},
          });
        }else{
          _this.$router.go(0)
        }
      },500)
    },
    getAllList() {
      deviceSelect().then((res) => {

        res.result.forEach(tiem =>{
          if(tiem.name!="default"){
            this.options.push(tiem);
          }
        })
        window.sessionStorage.setItem('tenantsList', JSON.stringify(this.options));
        if(this.type==2){
          this.tenantValue=this.options[0].id;
          sessionStorage.setItem("tenantValue", this.tenantValue);
        }
       // this.options = res.result;

      });
    },
    // 改变下拉箭头方向
    // Change the direction of the drop-down arrow
    changeDirection(e) {
      this.flag = !e;
    },
    //退出登录
    // Log out
    handleCommand(command) {
      var show1 = localStorage.getItem("show1");
      console.log("666666666666666666666666666666 : ", show1);

      if(show1 == 'true'){
        removeToken();
        sessionStorage.removeItem("tenantValue")
        this.$router.push("/login");
        this.$router.options.isAddDynamicMenuRoutes = false;
      }else{
        this.$confirm(this.$t("Login.hint1")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue1\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("Login.hint"), {
          confirmButtonText: this.$t("Login.ok"),
          cancelButtonText: this.$t("Login.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning",
        }).then(() => {
          logout();
          sessionStorage.removeItem("userData");
          sessionStorage.removeItem("menuData");
          removeToken();
          sessionStorage.removeItem("tenantValue")
          this.$router.push("/login");
          this.$router.options.isAddDynamicMenuRoutes = false;
          localStorage.setItem("show1",localStorage.getItem("checkedValue1"));

        }).catch(() => {
          this.$message({
            type: "info",
            message: this.$t("Login.closeDel"),
          });
        });
      }
    },
    // 切换语言
    // To switch between languages
    switchLanguage(command) {
      window.location.reload();
      this.language = command;
      if (command === "简体中文") {
        sessionStorage.setItem("lan", "简体中文");
        sessionStorage.setItem("lang", "cn");
        sessionStorage.setItem("User-Language", "zh-CN");
        this.$i18n.locale = "cn";
      } else if (command === "English") {
        sessionStorage.setItem("lan", "English");
        sessionStorage.setItem("lang", "en");
        sessionStorage.setItem("User-Language", "en-US");
        this.$i18n.locale = "en";
      }
    },
  },
  mounted() {},
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.$nextTick(function () {
          //页面加载完成后执行
          // Execute after the page loads
          let lang = sessionStorage.getItem("lang");
          let tag = document.getElementsByClassName("lab-height");
          // let tag = document.getElementsByTagName('label')
          let opt = Array.prototype.slice.call(tag);
          // console.log(tag)
          for (let i in opt) {
            // console.log(opt[i])
            if (lang == "en") {
              // opt[i].style.lineHeight = "16px"
              opt[i].style.fontSize = "13px";
            } else {
            }
          }
        });
      },
      // 深度观察监听
      // Deep observation monitoring
      deep: true,
    },
  },
};
</script>
<style scoped lang="scss">
.header {
  width: 100%;
  height: 60px;
  background: #efefef;
}
.header-context {
  display: flex;
  align-items: center;
  padding-right: 40px;
  .search {
    padding-right: 31px;
    border-right: 1px solid rgba(198, 199, 198, 0.2);
    i {
      width: 26px;
      height: 26px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.message {
  padding-left: 30px;
  i {
    position: relative;
    width: 26px;
    height: 31px;
    display: flex;
    img {
      width: 100%;
      height: 100%;
    }
    b {
      width: 20px;
      height: 20px;
      background: rgba(255, 50, 41, 1);
      border: 2px solid rgba(255, 255, 255, 0.84);
      border-radius: 50%;
      text-align: center;
      font-style: normal;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 254, 254, 1);
      position: absolute;
      left: 16px;
      top: 3px;
    }
  }
}
.userMsg {
  padding-left: 30px;
  display: flex;
  align-items: center;
  b {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: #505FF6;
    padding-left: 13px;
    padding-right: 27px;
  }
  .userPic {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #efefef;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 34px;
      height: 35px;
      margin-top: -5px;
    }
  }
  .logout {
    width: 28px;
    height: 28px;
    display: flex;
    justify-self: end;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.lange {
  // height: 100%;
  display: flex;
  align-items: center;
  width: 75px;
}
.link {
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color:#505FF6
}
.logo {
  margin-left: 15px;
  width: 150px;
  height: 40px;
}
.formList {
  zoom: 1;
  margin-left: 250px;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .opt {
    float: left;
  }
}
.flml10{
  float: left;
  margin-left: 72px;
}
</style>
<style lang="scss">
.header .el-dropdown {
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
.headerLeft {
  font-family: arial, sans-serif;
  font-weight: 400;
  float: left;
  color: #505FF6;
  height: 60px;
  display: flex;
  align-items: center;
}
.headerRight {
  color: #505FF6;
  float: right;
  height: 60px;
  font-family: arial, sans-serif;
  font-weight: 400;
}
.dialogStyle {
  width: 40% !important;
  min-width: 400px !important;
  align-items: center !important;
}
</style>
