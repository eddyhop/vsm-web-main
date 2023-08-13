<template>
  <!-- 删除收藏夹 -->
  <div class="delFavorite">
    <div class="content">
      <h4 class="tit">{{$t("vsr1000.msg1")}}</h4>
      <div class="alt">{{msg}}</div>
      <div class="submit">
        <button class="save" @click="submitEvent">{{$t("DeviceMan.ok")}}</button>
        <button class="close" @click="close">{{$t("DeviceMan.cancel")}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { favoriteDel, favoriteCount } from "@/services";
export default {
  data() {
    return {
      favoriteId: "",
      msg: "",
      lang: sessionStorage.getItem("lang") || "en",
    };
  },
  methods: {
    //取消
    // cancel
    close() {
      this.$parent.delShow = false;
    },
    //提交
    // submit
    submitEvent() {
      //删除整个分组
      // Delete the entire group
      favoriteDel({ favoriteId: this.favoriteId }).then((res) => {
        if (res.code == 10000) {
          this.$message({
            message: this.$t("Monit.hint7"),
            type: "success",
          });
          this.$parent.delShow = false;
          let params = {
            userId: JSON.parse(sessionStorage.getItem("userData")).userId,
            position: this.$parent.$parent.type,
            deviceId: JSON.parse(this.$route.query.devData).deviceId,
          };
          this.$parent.dataInit(params);
        }
      });
    },
    //获取图表与设备的个数
    // Gets the number of graphs and devices
    dataInit() {
      favoriteCount({ favoriteId: this.favoriteId }).then((res) => {
        if (res.code === 10000) {
          this.msg = this.$t("vsr1000.msg2").replace(
            /\d/g,
            getReplacementString
          );
          function getReplacementString(input) {
            if (input == 4) {
              return res.result.device;
            } else {
              return res.result.chart;
            }
          }
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.delFavorite {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 1000;
  .content {
    width: 409px;
    height: 187px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
}
.tit {
  font-size: 16px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  padding-top: 31px;
}
.alt {
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  padding: 20px 20px 30px;
}
.submit {
  button {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    outline: none;
    border: none;
    color: #fff;
    margin-right: 18px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    cursor: pointer;
  }
  .save:hover {
    background: #6095d6;
  }
  .close {
    width: 70px;
    background: rgba(255, 255, 255, 1);
    color: rgba(102, 102, 102, 1);
    border: 1px solid rgba(209, 215, 224, 1);
  }
}
</style>