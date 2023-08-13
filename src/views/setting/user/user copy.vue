<template>
  <div class="user">
    <div class="search">
      <h3>
        {{$t('UserMan.set')}}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{$t('UserMan.UserMan')}}</span>
      </h3>
      <div class="tab">
        <button
          @click="member"
          :class="`bbt ${tab==1?'active':''}`"
          v-if="type=='1'"
        >{{$t('UserMan.super')}}</button>
        <button
          @click="normal"
          :class="`bbt ${tab==2?'active':''}`"
        >{{$t('UserMan.tenAministrator')}}</button>
      </div>
    </div>
    <comtUser ref="comtUser" v-show="flag==true"></comtUser>
    <comtZh ref="comtZh" v-show="flag==false"></comtZh>
  </div>
</template>
<script>
import {
  userGet,
  userAdd,
  userEdit,
  userDel,
  vsmRentGet,
  vsmRentDel,
  vsmRentShu
} from "@/services";
import comtUser from "./comtUser";
import comtZh from "./comtZh";
export default {
  data() {
    return {
      flag: true,
      activeName: "first",
      usertype: "", //用户登录后的身份
                    // The identity of the user after login
      tab: 1,
      type: JSON.parse(sessionStorage.getItem("userData")).type
    };
  },
  created() {
    // this.$nextTick(function() {
    //   //页面加载完成后执行
    // Execute after the page loads
    //   let lang = sessionStorage.getItem("lang");
    //   let tag = document.getElementsByClassName("bbt");
    //   // let tag = document.getElementsByTagName('label')
    //   let opt = Array.prototype.slice.call(tag);
    //   // console.log(tag)
    //   for (let i in opt) {
    //     // console.log(opt[i])
    //     if (lang == "en") {
    //       // opt[i].style.lineHeight = "16px"
    //       opt[i].style.width = "150px";
    //     } else {
    //     }
    //   }
    // });
  },
  mounted() {
    if (this.type == 1) {
      this.flag = true;
      this.tab = 1;
      this.$refs.comtUser.getUserList();
    } else {
      this.flag = false;
      this.tab = 2;
      this.$refs.comtZh.getRentList();
    }
  },
  methods: {
    member() {
      this.flag = true;
      this.tab = 1;
      this.$refs.comtUser.getUserList();
    },
    normal() {
      this.flag = false;
      this.tab = 2;
      this.$refs.comtZh.getRentList();
    }
  },
  components: { comtUser, comtZh }
};
</script>
<style lang="scss" scoped>
.search {
  width: 100%;
  height: 116px;
  background: white;
  padding: 20px 30px;
  .tab {
    margin-top: 25px;
    button {
      font-size: 14px;
    }
    .bbt {
      float: left;
      width: 106px;
      height: 34px;
      text-align: center;
      // line-height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      margin-right: 18px;
    }
    .active {
      background: rgba(54, 120, 200, 1);
      color: white;
      border: 1px solid #fff;
    }
    .active:hover {
      background: rgba(96, 149, 214, 1);
      border: 1px solid #fff;
    }
  }
  h3 {
    font-size: 15px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    span {
      font-size: 14px;
      line-height: 8px;
    }
    img {
      width: 5px;
      height: 8px;
      margin-left: 5px;
      margin-right: 5px;
    }
  }
}
.user {
  width: 100%;
  height: 100%;
  // background: white;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
}
</style>