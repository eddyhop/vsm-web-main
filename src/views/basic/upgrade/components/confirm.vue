<!-- 终止设备升级弹框 -->
<template>
  <div class="stop">
    <div class="cont">
      <h3>{{$t('Upgrade.hint7')}}</h3>
      <div class="fileName">
        <span v-for="(item,index) in options" :key="index">{{item.deviceName}}</span>
      </div>
      <div class="btn">
        <button class="save" v-debounce="save">{{$t('Upgrade.ok')}}</button>
        <button @click="close">{{$t('Upgrade.cancel')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { updateStopJob } from "@/services"
export default {
  components: {},
  data() {
    return {
       id:"",
       options:[]
    };
  },
  computed: {},
  watch: {},
  methods: {
      save(){
        this.$parent.submit('form')
      },
      close(){
        this.$parent.confirmShow = false
      }
  },
  created() {},
  mounted() {},
  beforeCreate() {}, 
  beforeMount() {}, 
  beforeUpdate() {}, 
  updated() {}, 
  beforeDestroy() {}, 
  destroyed() {}, 
  activated() {} 
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
// @import url(); Introduce common CSS classes
.btn{
    // position: absolute;
    bottom: 30px;
    // transform: translate(40%,0%);
    .save:hover{
      background: rgba(96, 149, 214, 1);
    }
    button{
        width:100px;
        height:34px;
        background:rgba(54,120,200,1);
        border-radius:2px;
        font-size:14px;
        font-family:arial, sans-serif;
        font-weight:400;
        color:rgba(255,255,255,1);
        border: none;
        margin-right: 18px;
    }
    button:nth-of-type(2){
        width:70px;
        height:34px;
        background:rgba(255,255,255,1);
        color:rgba(102,102,102,1);
        border-radius:2px;
        border:1px solid rgba(209,215,224,1);
    }
}
.fileName{
    width: 366px;
    font-size:14px;
    margin-top: 10px;
    margin-bottom: 10px;
    // text-align: center;
    min-height: 100px;
    span{
      display: inline-block;
      margin-right: 20px;
      margin-top: 10px;
    }
}
.cont{
    width:404px;
    min-height:215px;
    background: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -144%);
    border-radius: 7px;
    text-align: center;
    padding: 30px;
    position: relative;
    border:1px solid rgba(209,215,224,1);
    h3{
        font-size:16px;
        font-family:arial, sans-serif;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:22px;
    }
}
.stop {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9;
  // background:rgba(32,42,59,0.2);
}
</style>