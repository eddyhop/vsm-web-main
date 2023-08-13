<template>
  <div class="slide">
    <div class="portalTitle">
      VSN Orchestration Portal
    </div>
    <el-collapse v-model="activeName">
      <div v-for="item in menus" :key="item.id">
        <div v-if="!item.showAlways" @click="tabsActive(item.id,item.path,'','home')" :class="`coll-item ${activeIndex===item.id ? 'active' : ''}`">
          <img :src="'data:image/png;base64,'+item.icon" alt class="el-icon" />
          <span :class="lang==='cn'?'choise':'choise1'">{{lang==="cn"?item.title:item.titleEnglish}}</span>
        </div>
        <el-collapse-item v-else>
          <template slot="title">
            <img :src="'data:image/png;base64,'+item.icon" alt class="el-icon" />
            <span :class="lang==='cn'?'choise':'choise1'">{{lang==="cn"?item.title:item.titleEnglish}}</span>
          </template>
          <div v-for="menu in item.children"  :key="menu.id" @click="tabsActive(menu.id,item.path,menu.path,'other')" :class="`coll-item itemSpecial ${activeIndex===menu.id ? 'active' : ''}`">
            <span :class="lang==='cn'?'':'langChange'">{{lang==="cn"?menu.title:menu.titleEnglish}}</span>
            <!-- <Slide :menus="menu.children"></Slide> -->
          </div>
        </el-collapse-item>
      </div>
    </el-collapse>
  </div>
</template>
<script>
//data:image/png;base64,
export default {
  name: "Slide",
  data() {
    return {
      activeName: "1",
      activeIndex: 0,
      menuData: [],
      lang: sessionStorage.getItem("lang") || "en",
      meunList: []
    };
  },
  props: {
    menus: {
      type: Array
    }
  },
  methods: {
    tabsActive(index, url, path, type) {
      if (type === "home") {
        this.$router.push("/home");
      } else {
        this.$router.push(url + "/" + path);
      }

      // let type = JSON.parse(sessionStorage.getItem("userData")).type;
      // if (type === 2) {
      //   if (url === "/company" || url === "/") {
      //     this.$message({
      //       type: "warning",
      //       message: `${
      //         url == "/company"
      //           ? this.$t("TenServiceSet.vpnIpAllot")
      //           : this.$t("Mobile.MobileUser")
      //       }${this.$t("Vpn.routerAlt")}`
      //     });
      //   } else {
      //     this.$router.push(url);
      //   }
      // } else {
      //   this.$router.push(url);
      // }
      this.activeIndex = index;
    }
  },
  created() {
    // console.log(this.menus, "123");
    // let allMenuData = [];
    // this.menus.forEach(el => {
    //   if (el.type == -1) {
    //     el.children.forEach(item => {
    //       allMenuData.push(item);
    //     });
    //   }
    // });
    // this.meunList = allMenuData
    // console.log(allMenuData,"1234")
  }
};
</script>
<style lang="scss" scoped>
.slide {
  width: 100%;
  padding-top: 20px;
  flex: 1;
  font-size: 0.14rem;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(247, 248, 250, 1);
  .portalTitle {
    font-size: 16px;
    font-family: arial, sans-serif;
    font-weight: bold;
    padding: 0 0 15px 0;
    border-bottom: 0.1rem solid;
  }
  .el-icon {
    width: 16px;
    height: 16px;
  }
  .choise {
    padding-left: 13px;
  }
  .choise1 {
    padding-left: 13px;
    font-size: 13px;
  }
  .coll-item {
    width: 200px;
    min-height: 34px;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-left: 20px;
    margin: 7px 0;
    font-size: 14px;
  }
  .coll-item:hover {
    background: linear-gradient(
      270deg,
      rgba(46, 50, 63, 1) 0%,
      rgba(83, 91, 116, 1) 100%
    );
    position: relative;
    &:after {
      content: "";
      width: 4px;
      height: 100%;
      background: #3678c8;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .itemSpecial {
    padding-left: 47px;
  }
  .langChange {
    font-size: 13px;
    line-height: 20px;
  }
}
.active {
  background: #3678c8 !important;
  border-radius: 3px;
}
</style>
<style lang="scss">
.slide .el-collapse {
  padding: 20px 0 0 0;
  border: 0;
  background: transparent;

  .el-collapse-item__wrap {
    background: transparent;
    border: 0;
    .el-collapse-item__content {
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(247, 248, 250, 1);
      padding-bottom: 0;
    }
  }
  .el-collapse-item__header {
    background: transparent;
    border: 0;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(247, 248, 250, 1);
    padding-left: 20px;
  }
}
</style>