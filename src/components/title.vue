<template>
  <div class="title">
    <span>{{$t(`menu.${this.$route.path.slice(1)}`)}}</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pathList: [
        { path: "/home", title: "" },
        { path: "/shebei", title: "设备管理" },
        { path: "/zhpath", title: "租户路由域" },
        { path: "/yinyon", title: "应用" },
        { path: "/peizhi", title: "配置文件管理" },
        { path: "/facility", title: "设备" },
        { path: "/sbWatch", title: "设备监控" },
        { path: "/alarm", title: "告警管理" },
        { path: "/note", title: "日志" },
        { path: "/user", title: "用户管理" },
        { path: "/zhgl", title: "租户管理" },
        { path: "/timeSet", title: "时间管理" },
        { path: "/identity", title: "身份认证" },
        { path: "/vsc", title: "VSC管理" },
        { path: "/upDate", title: "本地升级" },
      ],
      nowTitle: sessionStorage.getItem('title')
    };
  },
  watch: {
    // $route(to) {
    //   var a = this.pathList;
    //   for (var i in a) {
    //     if (a[i].path == to.path) {
    //       let c = a[i].title
    //       sessionStorage.setItem('title',c)
    //       this.nowTitle = a[i].title;
    //     }
    //   }
    // }
  }
};
</script>
<style lang="scss" scoped>
.title {
  font-size: 20px;
  font-family: arial, sans-serif;
  font-weight: bold;
  color: rgba(39, 40, 56, 1);
  line-height: 38px;
  margin-bottom: 10px;
}
</style>