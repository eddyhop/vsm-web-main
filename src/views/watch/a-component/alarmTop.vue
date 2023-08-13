<template>
  <div class="content">
    <div class="top">
      <span>{{$t('Alarm.monitoring')}}</span>
      <span>
        <img src="@/assets/icon_right.png" alt />
      </span>
      <span>{{$t('Alarm.alarmMan')}}</span>
    </div>
    <div :class="`main ${lang == 'en' ? 'mainEn' : ''}`">
      <button :class="{'bg':index===1}" @click="choose(1)">{{$t('Alarm.alarmDetails')}}</button>
      <button :class="{'bg':index===2}" @click="choose(2)">{{$t('Alarm.eventDefinition')}}</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      index: 1,
      lang:"",
    };
  },
  methods: {
    choose(i) {
      this.index = i;
      i === 2 ? this.m(false) : this.m(true);
    }
  },
  props: ["m"],
  created(){
    this.lang = sessionStorage.getItem("lang")
  }
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  background: #ffffff;
  padding: 20px 0 20px 30px;
  font-family: arial, sans-serif;
  font-weight: 400;
  .top {
    span:nth-child(1) {
      font-size: 16px;
      color: rgba(51, 51, 51, 1);
      line-height: 22px;
    }
    span:nth-child(2) {
      display: inline-block;
      width: 6px;
      height: 10px;
      margin: 0 4px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    span:nth-child(3) {
      font-size: 14px;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
    }
  }
  .main {
    margin-top: 21px;
    button {
      width: 106px;
      height: 34px;
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      background: #fff;
      border-radius: 7px;
      margin-right: 18px;
      box-sizing: border-box;
      border: 1px solid #d1d7e0;
      outline: none;
      white-space: nowrap;
      padding:0px;
      &:hover{
      background:#3678c8;
      color:#fff;
      border:none;
    }
    }
    .bg{
        background: #3678c8;
        color: #fff;
        border:none;
        &:hover{
        background:#6095D6;
        border:none;
       }
    }
  }
  .mainEn{
    button{
      width: 120px;
    }
  }
}
</style>