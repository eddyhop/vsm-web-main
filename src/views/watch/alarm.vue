<template>
  <div class="alarm devList">
    <alarmTop :m="change"></alarmTop>
    <alarmMiddle :alarm="alarmData" v-show="flag"></alarmMiddle>
    <alarmFooter v-show="flag"></alarmFooter>
    <alarmDefine v-show="!flag"></alarmDefine>
  </div>
</template>
<script>
import alarmTop from "./a-component/alarmTop";
import alarmMiddle from "./a-component/alarmMiddle";
import alarmFooter from "./a-component/alarmFooter";
import alarmDefine from "./a-component/alarmDefine";
import { getTypeInfoNum } from "@/services/index.js";
export default {
  data() {
    return {
      flag: true,
      alarmData: {
        infor: "",
        completion: ""
      }
    };
  },
  created() {
    this.getTypeInfoNums();
  },
  methods: {
    change(val) {
      this.flag = val;
    },
    // 获取告警信息展示数据
    // Get alarm information display data
    getTypeInfoNums() {
      let tenantId =
        JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId || "";
      let params = {
        tenantId: tenantId
      };
      getTypeInfoNum(params).then(res => {
        if (res.code === 10000) {
          this.alarmData.infor = res.result;
          this.alarmData.completion = res.result.completion.toFixed(2) + '%';
          this.alarmData.one = this.alarmData.infor.emergencyDiffNum.slice(0,1)
          this.alarmData.two = this.alarmData.infor.importantDiffNum.slice(0,1)
          this.alarmData.three = this.alarmData.infor.generalDiffNum.slice(0,1)
          this.alarmData.four = this.alarmData.infor.dealDiffNum.slice(0,1)
          // console.log(this.alarmData)
        }
      });
    }
  },
  components: {
    alarmTop,
    alarmMiddle,
    alarmFooter,
    alarmDefine
  }
};
</script>
<style lang="scss" scoped>
.alarm {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 20px;
  }
}
.devList::-webkit-scrollbar {
  width: 4px;
}
.devList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.devList::-webkit-scrollbar-track  {
     -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
     border-radius: 0;
     background: rgba(0, 0, 0, 0.1);
}
</style>