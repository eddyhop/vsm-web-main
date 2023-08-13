<template>
  <div class="addStatic">
    <div class="context">
      <div class="title">
        {{$t('vsr100.static.addStaticRoute')}}
        <span class="close" @click="close"></span>
      </div>
      <div class="item" :style="lang=='en'?'':'marginLeft:70px'">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="auto"
          :inline="true"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item :label="$t('vsr100.static.name')" prop="interName">
            <div class="item-ipt">
              <el-input
                v-model="form.name"
                @blur="zhuan"
                :placeholder="$t('vsr100.static.name')"
                size="small"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item :label="$t('vsr100.static.description')" prop="desc">
            <div class="item-ipt">
              <el-input
                v-model="form.description"
                @blur="zhuan"
                :placeholder="$t('vsr100.static.description')"
                size="small"
              ></el-input>
            </div>
          </el-form-item>
          
          <el-form-item :label="$t('vsr100.static.destinationIPAddress')" prop="ip">
            <div class="item-ipt">
              <el-input
                v-model="form.ip"
                @blur="zhuan"
                :placeholder="$t('vsr100.static.destinationIPAddress')"
                size="small"
              ></el-input>
            </div>
          </el-form-item>
          
          <el-form-item :label="$t('vsr100.static.nextHop')" prop="nextHopIp">
            <div class="item-ipt">
              <el-input v-model="form.nextHopIp" size="small"></el-input>
            </div>
          </el-form-item>
          <el-form-item :label="$t('vsr100.static.distance')" prop="dis">
            <div class="item-ipt">
              <el-input v-model.number="form.dis" size="small"></el-input>
            </div>
          </el-form-item>
          <!-- <el-form-item :label="$t('vsr100.static.tag')" prop="title">
            <div class="item-ipt">
              <el-input v-model.number="form.title" placeholder="0-65535" size="small"></el-input>
            </div>
          </el-form-item>
          <el-form-item :label="$t('vsr100.static.port2')" prop="api">
            <div class="item-ipt">
              <el-select filterable v-model="form.api" :placeholder="$t('vsr100.static.choose')">
                <el-option v-for="(item,index) in apiArr" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </div>
          </el-form-item> -->
          <div class="contr">
            <button type="primary" v-debounce="save" class="save">{{$t('vsr100.static.save')}}</button>
            <button @click.prevent="close" class="cancel">{{$t('vsr100.static.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  setLStatic,
  findByRepeatIp,
  getDict,
  getFindStaticOutInter
} from "@/services";
import { compare } from "@/utils/change";
export default {
  data() {
    let nextHoopIpRule = (rule, value, callback) => {
      if (value) {
        let params = {
          deviceId: this.deviceId,
          ip: value
        };
        findByRepeatIp(params).then(res => {
          if (res.result) {
            callback();
          } else {
            callback(new Error(this.$t("vsr100.static.remind[13]")));
          }
        });
      }
    };
    var NumRule = (rule, value, callback) => {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val >= 0 && val <= 65535) {
            callback();
          } else {
            callback(new Error(this.$t('newLang100.static.title3')));
          }
        } else {
          callback(new Error(this.$t("vsr100.static.remind[6]")));
        }
      } else {
        callback();
      }
    };
    // let ipRuleChange = (rule, value, callback) => {
    //   if (value) {
    //     if (value == "0.0.0.0/0") {
    //       callback(new Error("已存在此IP"));
    // Callback (new Error(" This IP already exists ");
    //     } else {
    //       callback();
    //     }
    //   }
    // };
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      lang: sessionStorage.getItem("lang") || "en",
      form: {
        ip: "",
        dis: "",
        nextHopIp: "",
        title: "",
        api: ""
      },
      apiArr: [],
      rules: {
        ip: [
          {
            required: true,
            message: this.$t("vsr100.static.remind[5]"),
            trigger: "blur"
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/,
            message: this.$t("vsr100.static.remind[8]")
          },
          // {
          //   validator: ipRuleChange,
          //   trigger: "blur"
          // },
        ],
        nextHopIp: [
          {
            required: true,
            message: this.$t("vsr100.static.remind[5]"),
            trigger: "blur"
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr100.static.remind[9]")
          },
          { validator: nextHoopIpRule, trigger: "blur" }
        ],
        dis: [
          // { type: "number", message: this.$t("vsr100.static.remind[6]") },
          { validator: NumRule, trigger: "blur" }
        ],
        title: [
          // {
          //   required: true,
          //   message: this.$t("vsr100.static.remind[5]"),
          //   trigger: "blur"
          // },
          {
            pattern: /^([0-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/,
            message: this.$t("vsr100.static.remind[10]")
          }
        ],
        api: [
          {
            required: true,
            message: this.$t("vsr100.static.choose"),
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    close() {
      this.$parent.addShow = false;
      this.$refs.form.resetFields();
    },
    zhuan() {
      if (this.form.ip.length) {
        let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/;
        if (reg.test(this.form.ip)) {
          let ip = this.form.ip.split("/")[0];
          let code = this.form.ip.split("/")[1];
          if (code == 32) {
            return;
          } else {
            this.form.ip = compare(ip, code) + "/" + code;
          }
        }
      }
    },
    save(formName) {
      let params = {
        ip: this.form.ip,
        distance: Number(this.form.dis),
        deviceId: this.$parent.mid,
        nextHopIp: this.form.nextHopIp,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)) + "",
        tag: this.form.title,
        interName: this.form.api
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          setLStatic(params).then(res => {
            // console.log(res)
            if (res.code == 10000) {
              this.$message({
                message: this.$t("vsr100.static.remind[11]"),
                type: "success"
              });
              this.close();
              this.$parent.getList();
            } else {
              this.$message.error(this.$t("vsr100.static.remind[12]"));
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created() {
    // getDict({groupCode:"stc_rou",typeCode:"interface"}).then(res=>{
    //   this.apiArr = res.result
    // })
    getFindStaticOutInter({ devId: this.deviceId, }).then(
      res => {
        if (res.code === 10000) {
          this.apiArr = res.result;
        }
      }
    );
  }
};
</script>
<style lang="scss" scoped>
.item-ipt {
  width: 320px;
}
.item {
  margin-top: 10px;
  padding: 10px;
  .contr {
    // margin-left: 80px;
    text-align: center;
    margin-bottom: 28px;
  }
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
.context {
  width: 530px;
  // height: 387px;
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
    span {
      display: inline-block;
      width: 14px;
      height: 14px;
      background-image: url("../../../../../assets/icon_close.png");
      background-size: 14px 14px;
    }
  }
}
.addStatic {
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
.addStatic {
  .el-select {
    width: 100%;
    height: 32px;
    .el-input {
      height: 100%;
      .el-input__inner {
        height: 100%;
      }
      .el-input__icon {
        line-height: normal;
      }
    }
  }
}
</style>