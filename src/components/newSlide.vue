<template>
  <div>
    <TreeMenus :menus="menuList"></TreeMenus>
  </div>
</template>
<script>
import TreeMenus from "./component/treeMenus";
export default {
  components: {
    TreeMenus
  },
  data() {
    return {
      // menuData: JSON.parse(sessionStorage.getItem("menuData"))
    };
  },
  computed: {
    menuList() {
      return this.$store.state.Login.menuList;
    }
  },
  watch: {
    // menuData: {
    //   handler(newValue, oldValue) {
    //     console.log(newValue);
    //     this.menuData = newValue;
    //   },
    //   deep: true
    // }
  },
  created() {
    // this.filterMenu(this.menuData);
  },
  methods: {
    // filterMenu(menu) {
    //   menu.map(item => {
    //     item.children = item.children.filter(item => {
    //       return item.title !== "配置文件管理";
    // return item.title ! == "Profile management ";
    //     });
    //   });
    // }
  }
};
</script>