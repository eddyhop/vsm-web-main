<template>
  <div class="addSTATIC">
    <div :class="`context ${lang=='en'?'contextEn':''}`">
      <h4 class="title">
        <span>{{$t('vsr1000.addSR')}} </span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="`${lang=='en'?'190px':'100px'}`"
          class="demo-ruleForm"
          @submit.native.prevent
        >

          <el-form-item :label="$t('vsr1000.name')" prop="interName">
            <el-input v-model="ruleForm.interName"  :placeholder="$t('vsr1000.name')" ></el-input>
          </el-form-item>

          <el-form-item :label="$t('vsr1000.describe')" prop="des">
            <el-input v-model="ruleForm.des"  :placeholder="$t('vsr1000.describe')" ></el-input>
          </el-form-item>

          <el-form-item :label="$t('vsr1000.destinationNetwork')" prop="ip">
            <el-input v-model="ruleForm.ip" @blur="zhuan" :placeholder="$t('vsr1000.destinationNetwork')"></el-input>
          </el-form-item>

          <el-form-item :label="$t('vsr1000.nextHop')" prop="nextHopIp">
            <el-input v-model="ruleForm.nextHopIp" :placeholder="$t('vsr1000.nextHop')"></el-input>
          </el-form-item>

          <el-form-item :label="$t('vsr1000.distance')" prop="dis">
            <el-input v-model="ruleForm.dis"  :placeholder="$t('vsr1000.distance')"></el-input>
          </el-form-item>

          <div class="submit">
            <button class="save" v-debounce.prevent="submitForm">{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  addStatic,
  nameExistStatic,
  getStaticRentUser,
  getLogicOutPortList,
  deviceSimpleIPV6ToFullIPV6, //简写转全写
                              // So let me write it all out
  deviceFullIPV6ToSimpleIPV6, //全写转简写
                              // Let me write it all
  staticCheckDestIp,
  checkRepeatIp, //ip地址重复性校验
                 // IP address repeatability check
  checkRepeatNextIp,  //下一跳重复性校验
} from "@/services";
import { compare, compareIPV6 } from "@/utils/change";
export default {
  props: {},
  components: {},
  data() {

    var checkName = (rule,value,callback) => {
      if(value){
        nameExistStatic({checkName:value,deviceId:this.deviceId}).then(res=>{
          if(res.code==10000){
            callback()
          }else{
            callback(new Error(this.$t('vsr1000.remind[6]')))
          }
        })
      }
    }
    let ipRule = (rule, value, callback) => {
      if (value) {
        if (this.type === 0) {
          let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/;
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error(this.$t("vsr1000.remind2[7]")));
          }
        } else if (this.type === 1) {
          let reg = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*([/])(?:[1-9][0-9]*)$/;
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error(this.$t("vsr1000.remind2[7]")));
          }
        }
      }
    };
    let ipRepeatRule = (rule, value, callback) => {
      if (value) {
        if (this.ruleForm.ip) {
          checkRepeatIp({
            deviceId: JSON.parse(this.$route.query.devData).deviceId,
            ip: value,
            nextHopIp: value,
            tenantId: JSON.parse(this.$route.query.devData).tenantId
          }).then(res => {
            if (res.code == 10000) {
              callback();
            } else {
              callback(new Error(this.$t("vsr1000.greRule[5]")));
            }
          });
        }
      }
    };
    let nextIpcheck = (rule, value, callback) => {
      if (value) {
          checkRepeatNextIp({
            deviceId: JSON.parse(this.$route.query.devData).deviceId,
            nextHopIp: value,
            tenantId: JSON.parse(this.$route.query.devData).tenantId
          }).then(res => {
            if (res.code == 10000) {
              callback();
            } else {
              callback(new Error(this.$t("vsr1000.greRule[5]")));
            }
          });
      }
    };
    let destIpRule = (rule, value, callback) => {
      if (value) {
        if (this.type === 1) {
          staticCheckDestIp({ destIp: value }).then(res => {
            if (!res.success) {
              callback(new Error(this.$t("vsr1000.remind2[8]")));
              console.log("true");
            } else {
              console.log("false");
              callback();
            }
          });
        } else {
          callback();
        }
      }
    };
    let nextHopIpRule = (rule, value, callback) => {
      if (value) {
        if (this.type === 0) {
          let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error(this.$t("vsr100.static.remind[9]")));
          }
        } else if (this.type === 1) {
          let reg = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error(this.$t("vsr1000.greRule[2]")));
          }
        }
      }
    };
    var NumRule = (rule, value, callback) => {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        console.log(val)
        if (reg.test(val)) {
          if (val >= 0 && val <= 245) {
            callback();
          } else {
            callback(new Error(this.$t("newLang100.static.title4")));
          }
        } else {
          callback(new Error(this.$t("newLang100.static.title4")));
        }
      } else {
        callback();
      }
    };
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      lang: "",
      ruleForm: {
        ip: "",
        nextHopIp: "",
        dis: "",
        outName: "any"
      },
      vrfNameMsg: "",
      type: 0,
      page: 1,
      pageSize: 5,
      page2: 1,
      loading: false,
      loading2: false,
      rules: {
        interName: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[0]"),
            trigger: "blur"
          },{ validator: checkName, trigger: "blur"}
        ],
        ip: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[14]"),
            trigger: "blur"
          },
           {
             validator: ipRepeatRule,
            trigger: "blur"
           },
          {
            validator: ipRule,
            trigger: "blur"
          }
        ],
        dis: [
          {
            validator: NumRule,
            trigger: "blur"
          }
        ],
        nextHopIp: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[12]"),
            trigger: "blur"
          },
          { validator: nextHopIpRule, trigger: "blur" }
        ]
      }
    };
  },
  computed: {},
  methods: {
    close() {
      this.ruleForm.outName = "any";
      this.vrfNameMsg = "";
      this.$refs.form.resetFields();
      this.$parent.isShow = false;
    },
    submitForm(formName) {
      let deviceId = JSON.parse(this.$route.query.devData).deviceId;
      let data = {
        //管理距离
        // Management of distance
        interName: this.ruleForm.interName,
        des : this.ruleForm.des ,
        distance: this.ruleForm.dis,
        ip: this.ruleForm.ip,
        deviceId,
        nextHopIp: this.ruleForm.nextHopIp,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)),
        tenantId: JSON.parse(this.$route.query.devData).tenantId,
        type:0
      };
      // console.log(this.$refs[formName].validate(),data);
      this.$refs[formName].validate(valid => {
        // console.log(valid);
        if (valid) {
          addStatic(data).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[0]")
              });
              this.vrfNameMsg = "";
              this.$refs[formName].resetFields();
              this.$parent.getStaticListInit({
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageNumber:
                  this.$parent.index === 0
                    ? this.$parent.lNumber
                    : this.$parent.pageSize,
                pageSize:
                  this.$parent.index === 0
                    ? this.$parent.lSize
                    : this.$parent.sizeIpv6,
                type: this.$parent.index,
                routeType: 0
              });
              this.$refs[formName].resetFields();
              this.ruleForm.outName = "any";
              this.$parent.isShow = false;
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
              this.vrfNameMsg = "";
              this.$refs[formName].resetFields();
              this.ruleForm.outName = "any";
              this.$parent.isShow = false;
            }
            // console.log(res);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    zhuan() {
      if (this.type === 0) {
        let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/;
        if (reg.test(this.ruleForm.ip)) {
          let ip = this.ruleForm.ip.split("/")[0];
          let code = this.ruleForm.ip.split("/")[1];
          if (code == 32) {
            return;
          } else {
            this.ruleForm.ip = compare(ip, code) + "/" + code;
          }
        }
      } else {
        let reg = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*([/])(?:[1-9][0-9]*)$/;
        if (reg.test(this.ruleForm.ip)) {
          deviceSimpleIPV6ToFullIPV6({ ipv6: this.ruleForm.ip }).then(res => {
            if (res.code === 10000) {
              let ip = res.result;
              let code = this.ruleForm.ip.split("/")[1];
              if (code == 32) {
                return;
              } else {
                deviceFullIPV6ToSimpleIPV6({
                  ipv6: compareIPV6(ip, code) + "/" + code
                }).then(res => {
                  if (res.code === 10000) {
                    this.ruleForm.ip = res.result + "/" + code;
                  }
                });
              }
            }
          });
        }
      }
    },
    //获焦获取出接口列表数据
    // Get focus to get interface list data
    searchData() {
      let params = {
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        name: "",
        page: this.page,
        pageSize: this.pageSize,
        rentAreaId: this.ruleForm.vrfName
      };
      this.getOutPorts(params);
    },
    //获焦获取租户路由域列表数据
    // Get the tenant routing domain list data in focus
    searchData2() {
      let params = {
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        name: "",
        page: this.page,
        pageSize: this.pageSize
      };
      this.getVrfName(params);
    },
    //搜索获取出接口列表数据
    // The search retrieves the interface list data
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          getLogicOutPortList({
            deviceId: JSON.parse(this.$route.query.devData).deviceId,
            name: query,
            // page: 1,
            // pageSize: this.pageSize,
            rentAreaId: this.ruleForm.vrfName
          }).then(res => {
            if (res.code === 10000) {
              this.loading = false;
              this.ruleForm.outNameArr = res.result;
            }
          });
        }, 200);
      }
    },
    //搜索获取租户路由域列表数据
    // The search gets the tenant routing domain list data
    remoteMethod2(query) {
      if (query !== "") {
        this.loading2 = true;
        setTimeout(() => {
          getStaticRentUser({
            deviceId: JSON.parse(this.$route.query.devData).deviceId,
            name: query
            // page: 1,
            // pageSize: this.pageSize,
          }).then(res => {
            if (res.code === 10000) {
              this.loading2 = false;
              this.ruleForm.vrfNameArr = res.result;
            }
          });
        }, 200);
      }
    },
    //上拉加载出接口列表
    // Pull up and load the list of interfaces
    load() {
      getLogicOutPortList({
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        name: this.ruleForm.outName,
        page: this.page++,
        pageSize: this.pageSize,
        rentAreaId: this.ruleForm.vrfName
      }).then(res => {
        if (res.code === 10000 && res.result.length) {
          this.ruleForm.outNameArr = this.ruleForm.outNameArr.concat(
            res.result
          );
        }
      });
    },
    //上拉加载租户路由域列表
    // Pull up and load the tenant routing domain list
    load2() {
      getStaticRentUser({
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        name: this.ruleForm.vrfName,
        page: this.page2++,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code === 200 && res.result.length) {
          this.ruleForm.vrfNameArr = this.ruleForm.vrfNameArr.concat(
            res.result
          );
        }
      });
    },
    //数据初始化
    // Data initialization
    dataInit(type) {
      this.type = type;
    },
    //出接口列表获取
    // Get out of the interface list
    getOutPorts(params) {
      getLogicOutPortList(params).then(res => {
        if (res.code === 10000) {
          this.ruleForm.outNameArr = res.result;
        }
      });
    },
    //租户路由域列表获取
    // Tenant routing domain list fetch
    async getVrfName(params) {
      let data = await getStaticRentUser(params);
      if (data.code === 10000) {
        this.ruleForm.vrfNameArr = data.result;
      } else if (data.code === 500) {
        this.ruleForm.vrfNameArr = [];
        this.vrfNameMsg = data.message;
      }
    }
  },
  created() {
    this.lang = sessionStorage.getItem("lang");
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.addSTATIC {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.context {
  width: 462px;
  // height: 392px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
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
      background: url("../../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.contextEn {
  width: 560px;
}
.event {
  padding: 30px 30px 30px 10px;
}
.submit {
  width: 100%;
  text-align: center;
  .save {
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
  .cancel {
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
  .save:hover {
    background: #6095d6;
  }
}
.serverData {
  max-height: 257px;
  width: 100%;
}
</style>
<style lang="scss">
.addSTATIC .el-select {
  // width: 100%;
}
.addSTATIC {
  .el-input {
    width: 322px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .el-form-item__label {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
}
</style>
