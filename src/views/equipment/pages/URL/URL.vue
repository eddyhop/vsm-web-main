<template>
  <!-- URL -->
  <div class="URL">
    <div class="content">
      <div class="open">
        <span>{{$t('newModel.port.open')}}</span>
        <el-switch v-model="value" active-color="#3678C8" inactive-color="#D1D7E0"></el-switch>
      </div>
      <div class="roll">
        <span>{{$t('newModel.url.BlackWwhite')}}</span>
        <el-radio-group v-model="radio">
          <el-radio class="radio" :label="1">{{$t('newModel.url.blacklist')}}</el-radio>
          <el-radio class="radio" :label="0">{{$t('newModel.url.whiteList')}}</el-radio>
        </el-radio-group>
      </div>
      <div class="ipAdress">
        <el-input type="textarea" :placeholder="$t('newModel.url.msg1')" v-model="IpAddress"></el-input>
        <!-- <el-input v-show="radio==0" type="textarea" placeholder="输入域名或IP地址，以「,」逗号。" v-model="whiteIpAddress"></el-input> -->
      </div>
      <div class="submit">
        <button @click.prevent="submitForm">{{$t('vsr1000.save')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  urlfilterGet,
  urlfilterClose,
  urlfilterSetUrlFilter,
  browserecordOpenBrowserRecord,
  urlfilterCheck
} from "@/services";
import plug from "@/utils/plug";
export default {
  data() {
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      value: false,
      radio: 0,
      IpAddress:"",
      // whiteIpAddress: "",
      // blackIpAddress: "",
      id: ""
    };
  },
  methods: {
    //提交保存
    // Submit to save
    submitForm() {
      plug.debounce(this.whiteOrBlack(), 500);
    },
    //数据初始化
    // Data initialization
    dataInit(params) {
      urlfilterGet(params).then(res => {
        if (res.code === 10000) {
          this.value = res.result.enable ? true : false;
          this.radio = res.result.whiteOrBlack;
          this.id = res.result.id;
          this.IpAddress = res.result.urlList
          // this.whiteIpAddress =
          //   res.result.whiteOrBlack == 0 ? res.result.urlList : "";
          // this.blackIpAddress =
          //   res.result.whiteOrBlack == 1 ? res.result.urlList : "";
        }
      });
    },
    //白名单黑名单判断
    // Whitelist blacklist judgment
    whiteOrBlack() {
      if (this.value) {
        urlfilterCheck({
          // urlList: this.radio == 1 ? this.blackIpAddress : this.whiteIpAddress,
          urlList: this.IpAddress
        }).then(res => {
          if (res.success) {
            let URL = this.IpAddress
              // this.radio == 1 ? this.blackIpAddress : this.whiteIpAddress;
            if (URL.length) {
              let params = {
                id: this.id,
                enable: 1,
                devId: this.deviceId,
                whiteOrBlack: this.radio,
                urlList: URL
              };
              if (!params.id) {
                delete params.id;
              }
              //现开启上网审计再开启URL
              // Now open online audit and then open THE URL
              browserecordOpenBrowserRecord({
                enable: 1,
                devId: this.deviceId
              }).then(res => {
                if (res.code === 10000) {
                  urlfilterSetUrlFilter(params).then(res => {
                    if (res.code === 10000) {
                      this.$message({
                        type: "success",
                        message: this.$t("vsr1000.qosremind[0]")
                      });
                      this.dataInit({
                        devId: this.deviceId
                      });
                    }
                  });
                }
              });
            } else {
              this.$message({
                type: "warning",
                message: this.$t('newModel.url.msg2')
              });
            }
          } else {
            this.$message({
              type: "warning",
              message: this.$t('newModel.url.msg3')
            });
          }
        });
      } else {
        urlfilterClose({
          id: this.id,
          // urlList: this.radio == 1 ? this.blackIpAddress : this.whiteIpAddress,
          urlList: this.IpAddress
        }).then(res => {
          this.$message({
            type: "success",
            message: this.$t("vsr1000.qosremind[0]")
          });
          this.dataInit({ devId: this.deviceId });
        });
      }
    }
  },
  created() {
    this.dataInit({ devId: this.deviceId });
  }
};
</script>
<style scoped lang="scss">
.URL {
  padding: 30px;
}
.content {
  padding-left: 39px;
  .open {
    span {
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      margin-right: 10px;
    }
  }
}
.roll {
  padding: 23px 0;
  span {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-right: 34px;
  }
  .radio {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
}
.ipAdress {
  width: 495px;
  height: 238px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  border: 1px solid rgba(209, 215, 224, 1);
}
.submit {
  padding-top: 30px;
  button {
    width: 100px;
    height: 34px;
    background: #3678c8;
    border-radius: 7px;
    border: 0;
    outline: none;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: #fff;
    margin-right: 15px;
    cursor: pointer;
  }
  button:hover {
    background: #6095d6;
  }
}
</style>
<style lang="scss">
.URL {
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #3678c8;
    background: #3678c8;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: rgba(51, 51, 51, 1);
  }
  .el-textarea {
    width: 100%;
    height: 100%;
    .el-textarea__inner {
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
}
</style>