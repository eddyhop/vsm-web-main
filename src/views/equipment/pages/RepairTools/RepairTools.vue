<template>
  <!-- 修复工具 -->
  <div class="RepairTools">
    <ul class="setList">
      <li v-show="devType=='vsr100'">
        <div>
          <img src="@/assets/newPage/Basics_equipment_repair_router@2x.png" alt />
        </div>
        <button @click.prevent="sendReairMsg(1)" :class="lang=='en'?'enlang':''">{{$t('newLang100.RepairTools.title1')}}</button>
      </li>
      <li>
        <div>
          <img src="@/assets/newPage/Basics_equipment_repair_network@2x.png" alt />
        </div>
        <button @click.prevent="sendReairMsg(2)" :class="lang=='en'?'enlang':''">{{$t('newLang100.RepairTools.title2')}}</button>
      </li>
      <li>
        <div>
          <img src="@/assets/newPage/Basics_equipment_repair_ipsec@2x.png" alt />
        </div>
        <button @click.prevent="sendReairMsg(3)" :class="lang=='en'?'enlang':''">{{$t('newLang100.RepairTools.title3')}}</button>
      </li>
      <li>
        <div>
          <img src="@/assets/newPage/Basics_equipment_repair_agent@2x.png" alt />
        </div>
        <button @click.prevent="sendReairMsg(4)" :class="lang=='en'?'enlang':''">{{$t('newLang100.RepairTools.title4')}}</button>
      </li>
    </ul>
  </div>
</template>
<script>
import { repairtoolsSendReairMessage } from "@/services";
import plug from "@/utils/plug";
export default {
  data() {
    return {
      msg: "",
      lang: sessionStorage.getItem('lang'),
      devType:JSON.parse(this.$route.query.devData).deviceType
    };
  },
  methods: {
    sendReairMsg(val) {
      plug.debounce(this.sendEvent(val), 500);
    },
    //下发修复命令
    // Issue repair orders
    sendEvent(val) {
      repairtoolsSendReairMessage({
        devSerNum: JSON.parse(this.$route.query.devData).vsrSeries,
        type: val
      }).then(res => {
        if (res.code === 10000) {
          switch (val) {
            case 1:
              this.msg = this.$t('newLang100.RepairTools.remind1');
              break;
            case 2:
              this.msg = this.$t('newLang100.RepairTools.remind2');
              break;
            case 3:
              this.msg = this.$t('newLang100.RepairTools.remind3');
              break;
            case 4:
              this.msg = this.$t('newLang100.RepairTools.remind4');
              break;
            default:
              break;
          }
          this.$message({
            message: this.msg,
            type: "success"
          });
        } else {
          this.$message({
            type: "warning",
            message: res.message
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.RepairTools {
  padding: 125px 125px;
}
.setList {
  display: flex;
  justify-content: space-between;
  li {
    width: 200px;
    height: 220px;
    background: rgba(249, 252, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(216, 221, 228, 1);
    margin-right: 30px;
    text-align: center;
    div {
      margin: 0 auto;
      width: 86px;
      height: 82px;
      margin-top: 50px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .enlang{
      height: 45px;
    }
    button {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      border: 0;
      outline: none;
      margin-top: 71px;
      text-align: center;
      cursor: pointer;
      
      // display: flex;
      // justify-content: center;
    }
    button:hover {
      background: rgba(96, 149, 214, 1);
    }
  }
  li:last-of-type {
    margin-right: 0;
  }
}
</style>