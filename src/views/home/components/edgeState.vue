<template>
  <div class="content">
    <div class="top">
      <p>{{$t('Home.deviceState')}}</p>
    </div>
    <div class="footer">
      <div class="left">
        <div clsss="font">{{$t('DeviceMan.online')}}</div>
        <div class="num" >&nbsp;&nbsp;&nbsp;{{data.connection || 0}}</div>
      </div>
      <div class="right">
        <div clsss="font">{{$t('DeviceMan.offline')}}</div>
        <div class="num" >&nbsp;&nbsp;&nbsp;{{data.down || 0}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data:{
      required: true,
      default: {},
    }
  },
};
</script>
<style scoped lang="scss">
.content {
  width: calc(33.4% - 40px);
  height: 120px;
  padding: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  background: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  .top {
    p {
      font-size: 16px;
      color: rgb(128, 125, 125);
      line-height: 30px;
    }
    p::before {
      display: inline-block;
      content: "";
      width: 2px;
      height: 16px;
      background: rgba(54, 120, 200, 1);
      margin-right: 6px;
    }
  }
  .middle {
    display: flex;
    align-items: center;
    padding-left: 34px;
    img {
      width: 30px;
      height: 30px;
      margin-right: 16px;
    }
    span {
      font-size: 28px;
      color: rgba(54, 120, 200, 1);
      line-height: 40px;
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 20px;
    font-size: 14px;
    .left {
      display: flex;
      align-items: center;
      .font {
        color: rgba(51, 51, 51, 1);
      }
      img {
        width: 6px;
        height: 11px;
        margin-left: 4px;
      }
      .num {
        font-size: 20px;
        font-weight: bolder;
        color: #505FF6;
        line-height: 30px;
        padding-left: 10px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      .font {
        margin-right: 4px;
        font-size: 14px;
        color: rgba(51, 51, 51, 1);
      }
      .num {
        font-size: 20px;
        font-weight: bolder;
        color: #ef3a3a;
        line-height: 30px;
        padding-left: 10px;
      }
    }
  }
}
</style>