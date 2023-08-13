<template>
  <div class="editIvpn">
    <div class="context">
      <div class="title">
        VPN{{isEdit ? $t('vsr100.vpn.edit'):$t('vsr1000.info')}}
        <span class="close" @click="close"></span>
      </div>
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="auto"
        :disabled="!isEdit"
        :inline="true"
        class="demo-ruleForm"
        @submit.native.prevent
      >
        <el-form-item :label="$t('vsr100.vpn.name')">
          <!-- <el-input v-model="form.name" size="small"></el-input> -->
          <div style="text-align:left">{{form.name}}</div>
        </el-form-item>
        <el-form-item :label="$t('vsr100.vpn.tunnelIP')" prop="sdip">
          <el-input v-model="form.sdip" size="small"></el-input>
        </el-form-item>
        <el-form-item label="MSS" prop="mss">
          <el-input v-model.number="form.mss" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="'SERVER'+$t('vsr100.vpn.name')" prop="value">
          <div class="a">
            <el-select filterable
              v-model="form.value"
              remote
              reserve-keyword
              :placeholder="$t('vsr100.vpn.keyWord')"
              :remote-method="remoteMethod"
              @focus="inGet"
              :loading="loading"
              size="small"
            >
              <div
                class="serveList"
                v-infinite-scroll="lazyLoad"
                infinite-scroll-delay="500"
                infinite-scroll-immediate="false"
              >
                <el-option
                  v-for="(item,index) in options"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </div>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item :label="$t('vsr100.vpn.IPSite')" prop="ip">
          <el-input v-model="form.ip" size="small"></el-input>
        </el-form-item>
        <el-form-item label="MTU" prop="mtu">
          <el-input v-model.number="form.mtu" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="$t('vsr100.vpn.limit')" prop="kbps">
          <el-input v-model.number="form.kbps" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="$t('vsr100.vpn.describe')">
          <el-input v-model="form.ms" size="small"></el-input>
        </el-form-item>
        <div class="control">
          <button v-debounce="save" class="edit">{{$t('vsr100.vpn.save')}}</button>
          <button @click.prevent="close" class="cancel">{{$t('vsr100.vpn.cancel')}}</button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { setVpn, getVpnName, getRentListMachine } from "@/services";
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("vsr100.vpn.remind[12]")));
      } else {
        getVpnName({ name: value }).then(res => {
          if (this.confirm === value) {
            callback();
          } else if (res.result == false) {
            callback(new Error(this.$t("vsr100.vpn.remind[13]")));
          } else {
            callback();
          }
        });
      }
    };
    var checkMtu = (rule, value, callback) => {
      let mtu = Number(value);
      if (mtu) {
        if (mtu < 500 || mtu > 1500) {
          callback(new Error(this.$t("vsr100.vpn.remind[14]")));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var checkMss = (rule, value, callback) => {
      let mtu = Number(value);
      if (mtu) {
        if (mtu < 500 || mtu > 1500) {
          callback(new Error(this.$t("vsr100.vpn.remind[14]")));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      isEdit: false,
      rentAreaId: "",
      confirm: "",
      options: [],
      loading: false,
      page: 1,
      pageSize: 10,
      rowServe: "",
      rowServeName: "",
      form: {
        name: "",
        sdip: "",
        mss: 1300,
        ip: "",
        mtu: 1300,
        kbps: "",
        ms: "",
        mid: "",
        leftIp: "",
        value: ""
      },
      rules: {
        value: [
          {
            required: true,
            message: this.$t("vsr100.vpn.remind[10]"),
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: this.$t("vsr100.vpn.remind[12]"),
            trigger: "blur"
          }
        ],
        ip: [
          {
            required: true,
            message: this.$t("vsr100.vpn.remind[12]"),
            trigger: "blur"
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr100.vpn.remind[6]")
          }
        ],
        sdip: [
          {
            required: true,
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr100.vpn.remind[6]")
          }
        ],
        mtu: [
          { type: "number", message: this.$t("vsr100.vpn.remind[7]") },
          { validator: checkMtu }
        ],
        mss: [
          { type: "number", message: this.$t("vsr100.vpn.remind[9]") },
          { validator: checkMss }
        ],
        kbps: [{ type: "number", message: this.$t("vsr100.vpn.remind[8]") }]
      }
    };
  },
  created() {
    // getRentListMachine({
    // }).then(res => {
    //   this.options = res.result;
    // });
  },
  methods: {
    lazyLoad() {
      //   this.loaDing = true;
      getRentListMachine({
        deviceId: this.deviceId,
        name: this.value,
        page: this.page++,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code === 10000 && res.result.length) {
          //   this.loaDing = false;
          // this.options = this.options.concat(res.result);
          this.options = this.options.concat(res.result);
        } else {
        }
      });
    },
    inGet() {
      let params = {
        deviceId: this.form.mid,
        name: "",
        page: 1,
        pageSize: this.pageSize
      };
      this.options = [];
      getRentListMachine(params).then(res => {
        this.options = res.result;
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          getRentListMachine({ name: query, deviceId: this.form.mid }).then(
            res => {
              this.options = res.result;
            }
          );
        }, 500);
      } else {
        this.options = [];
      }
    },
    save(formName) {
      let params = {
        serverId:
          this.form.value === this.rowServeName
            ? this.rowServe
            : this.form.value,
        description: this.form.ms,
        ip: this.form.ip,
        deviceId: this.form.mid,
        mss: Number(this.form.mss),
        mtu: Number(this.form.mtu),
        name: this.form.name,
        limitRate: Number(this.form.kbps),
        tunnelIp: this.form.sdip,
        id: this.form.id,
        leftIp: this.form.leftIp,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          setVpn(params).then(res => {
            this.close();
            this.$parent.getList();
            if (res.code == 10000) {
              this.$message({
                message: this.$t("vsr100.vpn.remind[11]"),
                type: "success"
              });
              this.page = 1;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    close() {
      this.$parent.editShow = false;
      this.$refs.form.resetFields();
      this.value = "";
      this.page = 1;
    }
  }
};
</script>
<style lang="scss" scoped>
.control {
  // width: 100%;
  margin-left: 120px;
  button {
    color: white;
    border: none;
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
  }
  .save:hover {
    background: rgba(96, 149, 214, 1);
  }
  .cancel {
    margin-left: 18px;
    background: rgba(255, 255, 255, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    border: 1px solid rgba(209, 215, 224, 1);
  }
}
.a {
  // margin-left: 15px;
  > div {
    width: 315px;
  }
  .serveList {
    max-height: 257px;
    width: 100%;
  }
}
.text {
  margin-top: -40px;
  margin-left: -26px;
  // width:900px;
  div {
    width: 315px;
  }
}
.item {
  width: 100%;
  // display: flex;
  // padding: 30px;
  margin-left: 15px;
  // text-align: center;
  // div{
  //     flex: 1;
  // }
}
.context {
  width: 500px;
  //   height:602px;
  padding-bottom: 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    width: 100%;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    padding: 15px;
    margin-bottom: 20px;
    span {
      display: inline-block;
      width: 14px;
      height: 14px;
      background-image: url("../../../../../assets/icon_close.png");
      background-size: 14px 14px;
    }
  }
}
.editIvpn {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
</style>
<style lang="scss">
.editIvpn {
  .context {
    .el-input__inner {
      width: 315px;
    }
    form {
      margin-left: 15px;
    }
  }
}
</style>