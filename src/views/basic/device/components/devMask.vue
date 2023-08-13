<template>
  <div class="mask">
    <div class="first" v-show="show">
      <div class="msg">
        <span class="icon">
          <img src="@/assets/newPage/elastic_icon_error@2x.png" alt />
        </span>
        <span>{{$t('Configuration.remind[1]')}} {{$t('Configuration.remind[2]')}}?</span>
      </div>
      <div class="submit">
        <button class="cancel" @click.prevent="close">{{$t('DeviceMan.cancel')}}</button>
        <button class="save" @click.prevent="save">{{$t('Configuration.reset')}}</button>
      </div>
    </div>
    <div class="last" v-show="!show">
      <h4 class="title">
        <span>{{showMsg}}</span>
        <i class="close" @click.prevent="$parent.isShow = false"></i>
      </h4>
      <div class="twiceMsg">{{showMsg}}{{$t('Configuration.remind[0]')}}</div>
      <div class="twiceSubmit">
        <button class="twiceSave" @click.prevent="show = true">{{$t('DeviceMan.save')}}</button>
        <button
          class="twiceCancel"
          @click.prevent="$parent.isShow = false"
        >{{$t('DeviceMan.cancel')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { deviceReset, deviceForceSync } from "@/services";
export default {
  props: {
    showMsg: {
      type: String
    }
  },
  components: {},
  data() {
    return {
      show: false
    };
  },
  computed: {},
  methods: {
    close() {
      this.show = false;
      this.$parent.isShow = false;
    },
    save() {
      // if (this.showMsg === this.$t('Configuration.reset')) {
      deviceReset({
        deviceId: sessionStorage.getItem("deviceId")
      }).then(res => {
        if (res.code === 10000) {
          this.$parent.isShow = false;
          this.show = false;
          this.$message({
            type: "success",
            message: this.$t("vsr1000.restart")
          });
        } else {
          this.$parent.isShow = false;
          this.show = false;
          this.$message({
            type: "warning",
            message: this.$t("vsr1000.restartF")
          });
        }
      });
      // } else if (this.showMsg === this.$t("Configuration.forcedSynchronizing")) {
      //   deviceForceSync({ deviceId: sessionStorage.getItem("deviceId") }).then(
      //     res => {
      //       if (res.code === 10000) {
      //         this.$parent.isShow = false;
      //         this.show = false;
      //         this.$message({
      //           type: "success",
      //           message: this.$t("vsr1000.restartQ")
      //         });
      //       } else {
      //         this.$parent.isShow = false;
      //         this.show = false;
      //         this.$message({
      //           type: "warning",
      //           message: this.$t("vsr1000.restartQF")
      //         });
      //       }
      //     }
      //   );
      // }
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.first {
  width: 404px;
  height: 215px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-top: 55px;
  .msg {
    font-size: 16px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(186, 39, 39, 1);
    line-height: 22px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 62px;
  }
  .icon {
    width: 34px;
    height: 34px;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.last {
  width: 404px;
  height: 215px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  //   padding-top: 55px;
  .title {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    i {
      width: 14px;
      height: 14px;
      background: url("../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
  .twiceMsg {
    width: 100%;
    text-align: center;
    padding: 42px 0 40px 0;
  }
  .twiceSubmit {
    width: 100%;
    text-align: center;
    .twiceSave {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      outline: none;
      border: 0;
      cursor: pointer;
      margin-left: 18px;
    }
    .twiceCancel {
      width: 70px;
      height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      margin-left: 18px;
    }
    .twiceSave:hover {
      background: #6095d6;
    }
  }
}
.submit {
  width: 100%;
  text-align: center;
  .cancel {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    outline: none;
    border: 0;
    cursor: pointer;
    margin-left: 18px;
  }
  .save {
    width: 70px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    margin-left: 18px;
  }
  .cancel:hover {
    background: #6095d6;
  }
}
</style>