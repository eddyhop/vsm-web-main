<template>
  <div class="slide">
    <el-collapse v-model="activeName">
      <router-link
        to="/home"
        @click.native="tabsActive(0)"
        :class="`coll-item ${activeIndex===0 ? 'active' : ''}`"
        tag="div"
      >
        <img src="../assets/homePage/home_icon_home@2x.png" alt class="el-icon" />
        <span class="choise">首页</span>
      </router-link>
      <el-collapse-item>
        <template slot="title">
          <img src="../assets/homePage/home_icon_basis@2x.png" alt class="el-icon" />
          <span class="choise">基础</span>
        </template>
        <router-link
          to="/device"
          @click.native="tabsActive(1)"
          :class="`coll-item itemSpecial ${activeIndex===1 ? 'active' : ''}`"
          tag="div"
        >设备管理</router-link>
        <router-link
          to="/zhpath"
          @click.native="tabsActive(2)"
          :class="`coll-item itemSpecial ${activeIndex===2 ? 'active' : ''}`"
          tag="div"
        >租户路由域(vrf)</router-link>
        <router-link
          to="/app"
          @click.native="tabsActive(3)"
          :class="`coll-item itemSpecial ${activeIndex===3 ? 'active' : ''}`"
          tag="div"
        >应用</router-link>
        <router-link
          to="/deploy"
          @click.native="tabsActive(4)"
          :class="`coll-item itemSpecial ${activeIndex===4 ? 'active' : ''}`"
          tag="div"
        >配置文件管理</router-link>
        <router-link
          to="/upgrade"
          @click.native="tabsActive(5)"
          :class="`coll-item itemSpecial ${activeIndex===5 ? 'active' : ''}`"
          tag="div"
        >设备升级</router-link>
      </el-collapse-item>
      <router-link
        to="/devLayout"
        @click.native="tabsActive(6)"
        :class="`coll-item ${activeIndex===6 ? 'active' : ''}`"
        tag="div"
      >
        <img src="../assets/homePage/home_icon_equipment@2x.png" alt class="el-icon" />
        <span class="choise">设备配置</span>
      </router-link>
      <el-collapse-item name="4">
        <template slot="title">
          <img src="../assets/homePage/home_icon_monitoring@2x.png" alt class="el-icon" />
          <span class="choise">监控</span>
        </template>
        <router-link
          to="/devWatch"
          @click.native="tabsActive(7)"
          :class="`coll-item itemSpecial ${activeIndex===7 ? 'active' : ''}`"
          tag="div"
        >设备监控</router-link>
        <!-- <router-link to="/alarm" class="coll-item itemSpecial" tag="div">链路监控</router-link> -->
        <!-- <router-link to="/shebei" class="coll-item itemSpecial" tag="div">设备可用性</router-link>
        <router-link to="/shebei" class="coll-item itemSpecial" tag="div">应用监测</router-link>-->
        <router-link
          to="/alarm"
          @click.native="tabsActive(8)"
          :class="`coll-item itemSpecial ${activeIndex===8 ? 'active' : ''}`"
          tag="div"
        >告警管理</router-link>
        <router-link
          to="/note"
          @click.native="tabsActive(9)"
          :class="`coll-item itemSpecial ${activeIndex===9 ? 'active' : ''}`"
          tag="div"
        >日志</router-link>
      </el-collapse-item>
      <el-collapse-item name="5">
        <template slot="title">
          <img src="../assets/homePage/home_icon_auxiliary@2x.png" alt class="el-icon" />
          <span class="choise">辅助工具</span>
        </template>
      </el-collapse-item>
      <el-collapse-item name="6">
        <template slot="title">
          <img src="../assets/homePage/home_icon_cloud@2x.png" alt class="el-icon" />
          <span class="choise">云</span>
        </template>
        <router-link
          to="/cloudAccount"
          @click.native="tabsActive(10)"
          :class="`coll-item itemSpecial ${activeIndex===10 ? 'active' : ''}`"
          tag="div"
        >云账号管理</router-link>
        <!-- <router-link
          to="/cloudNet"
          @click.native="tabsActive(11)"
          :class="`coll-item itemSpecial ${activeIndex===11 ? 'active' : ''}`"
          tag="div"
        >云网络管理</router-link> -->
          <!-- 自添 -->
          <!-- <template>
            <span class="choise coll-item itemSpecial">云网络管理</span>
          </template> -->
        <router-link
          to="/cloudNet"
          @click.native="tabsActive(99)"
          :class="`coll-item itemSpecial ${activeIndex===99 ? 'active' : ''}`"
          tag="div"
        >路由管理</router-link>
        <router-link
          to="/cloudVpc"
          @click.native="tabsActive(100)"
          :class="`coll-item itemSpecial ${activeIndex===100 ? 'active' : ''}`"
          tag="div"
        >VPC创建</router-link>
        <!-- ------ -->
        <router-link
          to="/cloudDev"
          @click.native="tabsActive(12)"
          :class="`coll-item itemSpecial ${activeIndex===12 ? 'active' : ''}`"
          tag="div"
        >云设备</router-link>
      </el-collapse-item>
      <el-collapse-item name="7">
        <template slot="title">
          <img src="../assets/homePage/home_icon_opology@2x.png" alt class="el-icon" />
          <span class="choise">拓扑</span>
        </template>
        <router-link
          to="/tpSet"
          @click.native="tabsActive(13)"
          :class="`coll-item itemSpecial ${activeIndex===13 ? 'active' : ''}`"
          tag="div"
        >网络拓扑设置</router-link>
        <router-link
          to="/tenTpSearch"
          @click.native="tabsActive(14)"
          :class="`coll-item itemSpecial ${activeIndex===14 ? 'active' : ''}`"
          tag="div"
        >租户拓扑查询</router-link>
        <router-link
          to="/tpDevSearch"
          @click.native="tabsActive(15)"
          :class="`coll-item itemSpecial ${activeIndex===15 ? 'active' : ''}`"
          tag="div"
        >设备搜索</router-link>
        <router-link
          to="/tpApprove"
          @click.native="tabsActive(16)"
          :class="`coll-item itemSpecial ${activeIndex===16 ? 'active' : ''}`"
          tag="div"
        >资源审批</router-link>
      </el-collapse-item>
      <el-collapse-item name="8">
        <template slot="title">
          <img src="../assets/homePage/home_icon_set@2x.png" alt class="el-icon" />
          <span class="choise">设置</span>
        </template>
        <router-link
          to="/user"
          @click.native="tabsActive(17)"
          :class="`coll-item itemSpecial ${activeIndex===17 ? 'active' : ''}`"
          tag="div"
        >用户管理</router-link>
        <router-link
          to="/zhgl"
          @click.native="tabsActive(18)"
          :class="`coll-item itemSpecial ${activeIndex===18 ? 'active' : ''}`"
          tag="div"
        >租户管理</router-link>
        <router-link
          to="/rolePrivileges"
          @click.native="tabsActive(19)"
          :class="`coll-item itemSpecial ${activeIndex===19 ? 'active' : ''}`"
          tag="div"
        >角色权限</router-link>
        <router-link
          to="/company"
          @click.native="tabsActive(20)"
          :class="`coll-item itemSpecial ${activeIndex===20 ? 'active' : ''}`"
          tag="div"
        >移动端地址池分配</router-link>
        <router-link
          to="/mobileSeting"
          @click.native="tabsActive(21)"
          v-show="type==2?false:true"
          :class="`coll-item itemSpecial ${activeIndex===21 ? 'active' : ''}`"
          tag="div"
        >移动用户设置</router-link>
        <router-link
          to="/timeSet"
          v-show="type==1?false:true"
          @click.native="tabsActive(22)"
          :class="`coll-item itemSpecial ${activeIndex===22 ? 'active' : ''}`"
          tag="div"
        >时间设置</router-link>
        <router-link
          to="/identity"
          v-show="type==1?false:true"
          @click.native="tabsActive(23)"
          :class="`coll-item itemSpecial ${activeIndex===23 ? 'active' : ''}`"
          tag="div"
        >身份认证</router-link>
        <router-link
          to="/vsc"
          v-show="type==1?false:true"
          @click.native="tabsActive(24)"
          :class="`coll-item itemSpecial ${activeIndex===24 ? 'active' : ''}`"
          tag="div"
        >VSC管理</router-link>
        <router-link
          to="/upDate"
          v-show="type==1?false:true"
          @click.native="tabsActive(25)"
          :class="`coll-item itemSpecial ${activeIndex===25 ? 'active' : ''}`"
          tag="div"
        >本地升级</router-link>
        <router-link
          to="/tuopu"
          @click.native="tabsActive(26)"
          :class="`coll-item itemSpecial ${activeIndex===26 ? 'active' : ''}`"
          tag="div"
        >拓扑</router-link>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  data() {
    return {
      type: JSON.parse(sessionStorage.getItem("userData")).type,
      slideList: [
        {
          name: "",
          slideItem: []
        }
      ],
      activeName: "1",
      activeIndex: 0
    };
  },
  computed: {},
  methods: {
    tabsActive(index) {
      this.activeIndex = index;
    }
  },
  created() {},
  mounted() {},
  watch: {
    $route(to) {}
  }
};
</script>
<style scoped lang="scss">
.slide {
  width: 100%;
  padding-top: 20px;
  flex: 1;
  font-size: 0.14rem;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(247, 248, 250, 1);
  .el-icon {
    width: 16px;
    height: 16px;
  }
  .choise {
    padding-left: 13px;
  }
  .coll-item {
    width: 200px;
    height: 34px;
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
  // .active{
  //   background: #3678C8 !important;
  //   border-radius:3px;
  // }
  // .router-link-active{
  //   background: #3678C8 !important;
  //   border-radius:3px;
  // }
}
.router-link-active {
  background: #3678c8 !important;
  border-radius: 3px;
}
</style>
<style lang="scss">
.slide .el-collapse {
  border: 0;
  background: #202a3b;

  .el-collapse-item__wrap {
    background: #202a3b;
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
    background: #202a3b;
    border: 0;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(247, 248, 250, 1);
    padding-left: 20px;
  }
}
</style>