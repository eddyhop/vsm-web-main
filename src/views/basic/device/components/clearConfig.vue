<template>
  <div class="mask">
    <div class="first" v-show="show">
      <div class="msg">
        <span class="icon">
          <img src="@/assets/newPage/elastic_icon_error@2x.png" alt />
        </span>
        <span>{{$t('DeviceMan.hint5')}}</span>
      </div>
      <div class="submit">
        <button class="save" v-debounce="save">{{$t('DeviceMan.ok')}}</button>
        <button class="cancel" @click.prevent="show=false">{{$t('DeviceMan.cancel')}}</button>
      </div>
    </div>
    <div class="last" v-show="!show">
      <h4 class="title">
        <span>{{$t('DeviceMan.clear')}}</span>
        <i class="close" @click="$parent.clearShow = false"></i>
      </h4>
      <div class="twiceMsg">{{this.type ? $t('DeviceMan.hint4') : $t('DeviceMan.hint14')}}</div>
      <div class="twiceSubmit">
        <button class="twiceSave" @click="show = true">{{$t('DeviceMan.ok')}}</button>
        <button class="twiceCancel" @click="$parent.clearShow = false">{{$t('DeviceMan.cancel')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { clearUpConfiguration, sceneCheckTran } from "@/services";
export default {
  components: {},
  data() {
    return {
      show: false,
      info: {},
      type: true,
    };
  },
  computed: {},
  methods: {
    async save() {
      let params = {
        deviceId: this.info.id,
      };
      sceneCheckTran({
        deviceId: this.info.id,
        type: (this.info.deviceType == "vsr1000") || (this.info.deviceType == "Cloud-vsr1000") ? 1 : 0,
      }).then((res) => {
        if (res.result) {
          clearUpConfiguration(params).then((res) => {
            if (res.code === 10000) {
              this.$parent.clearShow = false;
              this.show = false;
              this.$message({
                type: "success",
                message: this.$t("DeviceMan.hint6"),
              });
              this.$parent.getAllList();
            } else {
              this.$parent.clearShow = false;
              this.show = false;
              this.$message({
                type: "warning",
                message: this.$t("DeviceMan.hint7"),
              });
            }
          });
        } else {
          this.$parent.clearShow = false;
          this.show = false;
          this.$message({
            type: "warning",
            message: this.$t("netWork.msg3"),
          });
        }
      });

      // if(this.type){
      //   let delConfig = await
      //   clearUpConfiguration(params).then(res=>{
      //     if (res.code === 10000) {
      //       this.$parent.clearShow = false;
      //       this.show = false
      //       this.$message({
      //         type: "success",
      //         message: this.$t('DeviceMan.hint6')
      //       });
      //     }else{
      //       this.$parent.clearShow = false;
      //       this.show = false
      //       this.$message({
      //         type: "warning",
      //         message: this.$t('DeviceMan.hint7')
      //       });
      //     }
      //   })
      //   let delTenant = await
      //   clearUpNameAndRelation(params).then(res=>{
      //     if (res.code === 10000) {
      //       this.$parent.clearShow = false;
      //       this.show = false
      //       this.$parent.Number = 1
      //       this.$parent.getAllList()
      //       this.$message({
      //         type: "success",
      //         message: this.$t('DeviceMan.hint6')
      //       });
      //     }else{
      //       this.$parent.clearShow = false;
      //       this.$message({
      //         type: "warning",
      //         message: this.$t('DeviceMan.hint7')
      //       });
      //     }
      //   })
      // }else{
      //   let delConfig = await
      //   clearUpConfiguration(params).then(res=>{
      //     if (res.code === 10000) {
      //       this.$parent.clearShow = false;
      //       this.show = false
      //       this.$message({
      //         type: "success",
      //         message: this.$t('DeviceMan.hint6')
      //       });
      //     }else{
      //       this.$parent.clearShow = false;
      //       this.show = false
      //       this.$message({
      //         type: "warning",
      //         message: this.$t('DeviceMan.hint7')
      //       });
      //     }
      //   })
      // }
    },
  },
  created() {
   // this.type = JSON.parse(sessionStorage.getItem("userData")).type == 1;
  },
  mounted() {},
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
    margin-left: 30px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.last {
  width: 404px;
  min-height: 215px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-bottom: 10px;
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
    text-align: left;
    padding: 42px;
  }
  .twiceSubmit {
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
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