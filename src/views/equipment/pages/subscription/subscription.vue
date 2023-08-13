<template>
  <div class="subscription">
    <div class="btns">
      <ul class="setListVn">
        <li v-for="(item) in tabsData" :key="item.id" @click="tabEvent(item)" :class="{active:item.id==activeIndex}">{{item.name}}</li>
      </ul>
    </div>
    <component :is="moduleName"></component>
  </div>
</template>
<script>
import dhcpServer from "@/views/equipment/pages/subscription/dhcpServer/dhcpServer.vue";
import addressTranslation from "@/views/equipment/pages/subscription/addressTranslation/addressTranslation.vue";
import vpns from "@/views/equipment/pages/subscription/vpns/vpns.vue";
import firewall from "@/views/equipment/pages/subscription/firewall/firewall.vue";
export default {
  props: {},
  components: {},
  data() {
    
    return {
      lang: sessionStorage.getItem("lang") || "en",
      tabsData: [
        {
          name: this.$t('subscription.addressAssignment'),
          id: 0,
          componentNmae: dhcpServer
        },
        {
          name: this.$t('subscription.addressTranslationTitle'),
          id: 1,
          componentNmae: addressTranslation
        },
        {
          name: this.$t('Config.naasTunnel'),
          id: 3,
          componentNmae: vpns
        },
        {
          name: this.$t('subscription.firewallTitle'),
          id: 4,
          componentNmae: firewall
        }
      ],
      activeIndex: 0,
      moduleName: dhcpServer,
    };
  },
  computed: {},
  methods: {
    tabEvent(item) {
      this.activeIndex = item.id;
      this.moduleName = item.componentNmae;
    }
  },
  created() {
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.even {
  // width: 400px;
  margin-left: 30px;
  .save:hover {
    background: rgba(96, 149, 214, 1);
  }
  button {
    margin-top: 18px;
    font-size: 14px;
  }
  p {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
  }
}
.subscription {
  padding: 20px 30px;
  .setListVn {
    float: left;
    padding-bottom: 20px;
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    li {
      float: left;
      padding: 0 12px;
      height: 34px;
      text-align: center;
      line-height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      margin-right: 14px;
      cursor: pointer;
    }
    .active {
      background: #3678c8;
      color: #fff;
      border: 1px solid #3678c8;
    }
    .active:hover {
      background: rgba(96, 149, 214, 1);
      border: 1px solid rgba(96, 149, 214, 1);
    }
    li:hover {
      background: #3678c8;
      color: #fff;
      border: 1px solid #3678c8;
    }
  }
}
.btns {
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .DHCPset {
    float: right;
    button {
      margin-left: 14px;
    }
    .close {
      background: rgba(239, 239, 239, 1);
      color: #333333;
      border: 1px solid rgba(209, 215, 224, 1);
    }
    button:hover {
      background: rgba(96, 149, 214, 1);
      border: 1px solid rgba(96, 149, 214, 1);
    }
    .close:hover {
      background: rgba(239, 239, 239, 1);
      color: #333333;
      border: 1px solid rgba(209, 215, 224, 1);
    }
  }
}
button {
  width: 100px;
  height: 34px;
  background: rgba(54, 120, 200, 1);
  border-radius: 7px;
  color: white;
  border: none;
  outline: none;
  cursor: pointer;
  img {
    width: 14px;
    height: 14px;
    position: relative;
    top: 1px;
  }
}
.add,
.remove {
  margin-left: 16px;
  width: 34px;
  height: 34px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  border: 1px solid rgba(209, 215, 224, 1);
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  top: 3px;
  img {
    width: 15px;
    height: 15px;
  }
}
.tit {
  font-size: 15px;
  font-family: arial, sans-serif;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  padding-bottom: 30px;
}
.open {
  font-size: 15px;
  font-family: arial, sans-serif;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  padding: 30px 0;
  span {
    padding-right: 23px;
    display: inline-block;
    width: 150px;
    text-align: right;
  }
}
.openEn{
  span{
    width: 267px;
  }
}
// .intranetList {
//   .intranetItem {
//     display: flex;
//   }
// }
</style>
<style lang="scss">
.LAN .even {
  .el-form-item__label {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .el-input,
  .el-select {
    width: 280px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  // .intranetList .intranetItem {
  //   .el-input,
  //   .el-select {
  //     width: 200px;
  //     height: 34px;
  //     .el-input__inner {
  //       height: 100%;
  //       border-radius: 7px;
  //     }
  //     .el-input__icon {
  //       line-height: normal;
  //     }
  //   }
  // }
}
</style>
