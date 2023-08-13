<template>
  <!-- BGP -->
  <div class="BGP">
    <div class="set">
      <div class="btns">
        <!-- <button class="async" @click="syncEvent">同步</button>
        <button class="clear" @click="remveData">删除</button>-->
        <button
          v-for="item in tabsList"
          :key="item.id"
          :class="{active:item.id==tabsIndex,btnEn:lang=='en'}"
          @click.prevent="tabEvent(item)"
        >{{item.titName}}</button>
      </div>
      <div class="select">
        <span class="alt">{{$t('newModel.asNum')}}</span>
        <div class="input_inner">
          <el-input
            :class="{activeErr:errorShow}"
            :disabled="isDisabled"
            v-model="asNum"
            :placeholder="$t('newModel.msg1')"
            @focus="AaNumChange"
            @blur="ruleAsNum(asNum)"
            v-on:input="change"
          ></el-input>
          <span class="error" v-show="errorShow">{{errorMsg}}</span>
        </div>
      </div>
    </div>
    <div class="eventList" v-show="tabsIndex==0">
      <div :class="lang=='en' ? 'formEn form' : 'form'">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="lang=='en' ? 'auto' : '100px'"
          class="demo-ruleForm"
          @submit.native.prevent
          :inline="true"
        >
          <!-- <div class="baseSet"> -->
          <el-form-item
            :label="$t('TenDomain.tenDomain')"
            prop="Tenant"
            :class="lang == 'en' ? 'baseFrom baseFromEn' : 'baseFrom'"
          >
            <el-select filterable v-model="ruleForm.Tenant" @change="saveTeant(ruleForm.Tenant)"
            :disabled="TenantList.length>0?false:true">
              <el-option
                v-for="item in TenantList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('newModel.RouterId')"
            prop="routerId"
            :class="lang == 'en' ? 'baseFrom baseFromEn' : 'baseFrom'"
          >
            <el-input v-model="ruleForm.routerId" @blur="saveBase(true)"></el-input>
          </el-form-item>
          <!-- </div> -->
          <!-- <div> -->
          <el-form-item :label="'Med '+ $t('newModel.compare')" prop="cmpMed">
            <el-switch
              v-model="ruleForm.cmpMed"
              @change="saveBase(false)"
              active-color="#3678C8"
              inactive-color="#D1D7E0"
            ></el-switch>
          </el-form-item>
          <div class="baseSave">
            <button class="async" @click="syncEvent">{{$t('Mobile.sync')}}</button>
            <button class="clear" @click="remveData">{{$t("TenDomain.del")}}</button>
          </div>
          <!-- </div> -->
        </el-form>
      </div>
      <div class="tabs">
        <div class="tabBtns">
          <!-- <button
            v-for="item in tabsList"
            :key="item.id"
            :class="{active:item.id==tabsIndex}"
            @click.prevent="tabEvent(item)"
          >{{item.titName}}</button>-->
          <button
            @click="baseTab(false)"
            :class="{active:!baseShow,btnEn:lang=='en'}"
          >BGP{{$t('newModel.neighbor')}}</button>
          <button
            @click="baseTab(true)"
            :class="{active:baseShow,btnEn:lang=='en'}"
          >{{$t('newModel.networkSegment')}}</button>
        </div>
        <div class="submit">
          <button
            :class="lang=='en' ? 'save saveEn' : 'save'"
            @click="bgpSubmit"
            v-show="!baseShow"
          >{{$t('newModel.save')}}</button>
          <!-- <button class="add" v-show="tabsIndex>1" @click.prevent="addEvent">
            <img src="@/assets/newPage/icon_add@2x.png" alt />
            新增
          </button>
          <button class="close" v-show="tabsIndex>1" @click.prevent="removeEvent">删除</button>-->
        </div>
      </div>
      <div class="tabCon">
        <BGPNeighbor ref="BGPNeighbor" v-show="!baseShow" />
        <netWorkIssue ref="netWorkIssue" v-show="baseShow" />
      </div>
    </div>
    <RouteMap ref="RouteMap" v-if="tabsIndex==1" />
    <prefixList ref="prefixList" v-if="tabsIndex==2" />
    <Community ref="Community" v-if="tabsIndex==3" />
  </div>
</template>
<script>
import {
  bgpVrfGetTenants,
  bgpBasisGet,
  bgpVrfGetBgpVrf,
  bgpBasisSet,
  bgpVrfSync,
  bgpVrfAddOrEdit,
  // bgpVrfDeleteConfiguration,
  // bgpVrfCheckDelete,
  bgpVrfDel,
  bgpVrfCheckAsNumber,
} from "@/services";
import plug from "@/utils/plug";
import BGPNeighbor from "./components/BGPNeighbor";
import netWorkIssue from "./components/netWorkIssue";
import RouteMap from "./components/RouteMap";
import prefixList from "./components/prefixList";
import Community from "./components/Community";
export default {
  data() {
    var NumRule = (rule, value, callback) => {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val >= 0 && val <= 65535) {
            callback();
          } else {
            callback(new Error(this.$t("newModel.msg8")));
          }
        } else {
          callback(new Error(this.$t("newModel.msg7")));
        }
      } else {
        callback();
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      type: '',
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      devType : JSON.parse(this.$route.query.devData).deviceType,
      bgpVrfId: "",
      ruleForm: {
        Tenant: "",
        routerId: "",
        id: "",
        cmpMed: false,
      },
      rules: {
        // asNum: [{ validator: NumRule, trigger: "blur" }],
        routerId: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[4]"),
            trigger: "blur",
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]"),
          },
        ],
      },
      tabsIndex: 0,
      tabsList: [
        {
          id: 0,
          titName: "BGP " + this.$t("TenDomain.tenDomain"),
        },
        // {
        //   id: 1,
        //   titName: "网段发布"
        // TitName: "Segment publishing"
        // },
        {
          id: 1,
          titName: "Route_Map",
        },
        {
          id: 2,
          titName: "Prefix List",
        },
        {
          id: 3,
          titName: "Community",
        },
      ],
      TenantList: [],
      asNum: "",
      baseId: "",
      asNumDob: "",
      // indexToSend: null,
      // vrfBaseId: "",
      name: "",
      errorShow: false,
      errorMsg: "",
      isDisabled: false,
      baseShow: false,
    };
  },
  components: {
    BGPNeighbor,
    netWorkIssue,
    RouteMap,
    prefixList,
    Community,
  },
  methods: {
    //邻居与网段发布切换获取数据
    // Neighbor and network segment publish switch to get data
    //Neighbor and network segment publish switch to get data
    baseTab(flag) {
      this.baseShow = flag;
      if (!flag) {
        this.$refs.BGPNeighbor.dataInit();
      } else {
        this.$refs.netWorkIssue.dataInit();
      }
    },
    //校验asNum
    // Check asNum
    // check asNum
    ruleAsNum(value) {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val > 0 && val < 2147483647) {
            this.errorShow = false;
            if (!this.isDisabled && this.asNum != this.asNumDob) {
              var show13 = localStorage.getItem("show13");
              if(show13 == 'true') {
                this.setVrf();
              }else{
                this.$confirm(this.$t("newModel.msg21")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='sessionStorage.setItem(\"checkedValue13\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
                  confirmButtonText: this.$t("vsr1000.OK"),
                  cancelButtonText: this.$t("vsr1000.cancel"),
                  dangerouslyUseHTMLString: true,
                  type: "warning",
                })
                .then(() => {
                  this.setVrf();
                  localStorage.setItem("show13",localStorage.getItem("checkedValue13"));
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: this.$t("vsr1000.qosremind[2]"),
                  });
                  // this.asNum = "";
                });
              }
            }
          } else {
            this.errorShow = true;
            this.errorMsg = this.$t("newModel.msg16");
          }
        } else {
          this.errorShow = true;
          this.errorMsg = this.$t("newModel.msg7");
        }
      } else {
        this.errorShow = true;
        this.errorMsg = this.$t("vsr1000.remind2[4]");
      }
    },
    //添加asnum
    // Add asnum
    // add asnum
    setVrf() {
      bgpVrfCheckAsNumber({
        userType: this.type,
        deviceId: this.deviceId,
        language: sessionStorage.getItem("User-Language") || "zh-CN",//获取vsm默认语言
      }).then((res) => {
        if (res.success) {
          bgpBasisSet({
            asNum: this.asNum,
            deviceId: this.deviceId,
            id: this.baseId,
          }).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]"),
              });
              this.dataInit();
            } else {
              this.$message({
                type: "warning",
                message: res.message,
              });
              this.asNum = "";
            }
          });
        } else {
          this.isDisabled = true;
        }
      });
      // let params = {
      //   name: sessionStorage.getItem("deviceId") + this.ruleForm.Tenant,
      //   deviceId: sessionStorage.getItem("deviceId"),
      //   vrfId: this.ruleForm.Tenant,
      //   asNumber: this.asNum
      // };
      // bgpVrfAddOrEdit(params).then(res => {
      //   if (res.code === 10000) {
      //     this.isDisabled = true;
      //     this.$message({
      //       type: "success",
      //       message: this.$t("vsr1000.remind2[5]")
      //     });
      //   }
      // });
    },
    //判断当前的asNum是否绑定
    // Determines whether the current asNum is bound
    // Determines whether the current asNum is bound
    AaNumChange() {
      bgpVrfCheckAsNumber({
        userType: this.type,
        deviceId: this.deviceId,
        language: sessionStorage.getItem("User-Language") || "zh-CN",//获取vsm默认语言
      }).then((res) => {
        if (res.code == 10000) {
          this.isDisabled = false;
        } else {
          this.isDisabled = true;
          this.$message({
            type: "warning",
            message: res.message,
          });
        }
      });
    },
    //tab切换
    // The TAB to switch
    // TAB to switch
    tabEvent(item) {
      this.tabsIndex = item.id;
      if (this.tabsIndex === 0) {
        this.$refs.BGPNeighbor.dataInit();
      }
    },
    //基础数据初始化
    // Basic data initialization
    // Base data initialization
    async dataInit() {
      let baseData = await bgpBasisGet({
        deviceId: this.deviceId,
      });
      let VrfData = await bgpVrfGetBgpVrf({
        deviceId: this.deviceId,
        vrfId: this.ruleForm.Tenant,
        deviceType:this.devType == "vsr1000" ? "0001" : this.devType == "vsr100" ? "0002" : this.devType == "Cloud-vsr1000" ? "000106" : "000206"
      });
      this.asNum = baseData.result.asNum;
      this.asNumDob = baseData.result.asNum;
      this.baseId = baseData.result.id;
      this.name = VrfData.result.name;
      this.ruleForm.routerId =
        VrfData.result.routerId == null ? "" : VrfData.result.routerId;
      this.ruleForm.cmpMed = VrfData.result.cmpMed;
      this.bgpVrfId = VrfData.result.id;
      this.$refs.BGPNeighbor.dataInit();
    },
    //租户路由域获取
    // Tenant routing domain acquisition
    // Tenant routing domain acquisition
    async getTenantsList() {
      let Tenants = await bgpVrfGetTenants({
        userType: this.type,
        tenantId:sessionStorage.getItem("tenantValue"),
        deviceType: JSON.parse(this.$route.query.devData).deviceType,
        deviceId: this.deviceId,
      });
      this.TenantList = Tenants.result;
      if (this.type == 1) {
        this.ruleForm.Tenant = this.TenantList.find(
          (item) => item.name == "default"
        ).id;
      } else {
        this.ruleForm.Tenant = this.TenantList[0].id;
      }

      // sessionStorage.setItem("vrfId", this.Tenant);

      // if (VrfData.result.asNumber != null && VrfData.result.asNumber != 0) {
      //   this.asNum = VrfData.result.asNumber;
      //   this.isDisabled = true;
      // }
      // this.indexToSend = VrfData.result.indexToSend;
      // this.vrfBaseId = VrfData.result.id;

      // sessionStorage.setItem("bgpVrfId", VrfData.result.id);
      this.dataInit();
    },
    //基础提交
    // Basis to submit
    // Basic submission
    saveBase(val) {
      let params = {
        vrfId: this.ruleForm.Tenant,
        deviceId: this.deviceId,
        // indexToSend: this.indexToSend,
        name: this.name,
        id: this.bgpVrfId,
        cmpMed: this.ruleForm.cmpMed,
        routerId: this.ruleForm.routerId,
      };
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (val) {
            if (this.ruleForm.routerId.length) {
              bgpVrfAddOrEdit(params).then((res) => {
                if (res.code === 10000) {
                  this.$message({
                    type: "success",
                    message: this.$t("vsr1000.remind2[5]"),
                  });
                }
              });
            }
          } else {
            bgpVrfAddOrEdit(params).then((res) => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[5]"),
                });
              }
            });
          }
        }
      });
    },
    // submitForm(formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       let params = {
    //         asNum: this.asNum,
    //         deviceId: sessionStorage.getItem("deviceId"),
    //         id: this.ruleForm.id,
    //         routerId: this.ruleForm.routerId,
    //         bgpVrfId: sessionStorage.getItem("bgpVrfId"),
    //         cmpMed: this.ruleForm.cmpMed
    //       };
    //       if (!this.ruleForm.id) {
    //         delete params.id;
    //       }
    //       bgpBasisSet(params).then(res => {
    //         if (res.code === 10000) {
    //           this.$message({
    //             type: "success",
    //             message: this.$t("vsr1000.remind2[5]")
    //           });
    //           this.dataInit();
    //         }
    //       });
    //     }
    //   });
    // },
    //同步
    // synchronous
    // synchronize
    syncEvent() {
      if (this.asNum != 0 && this.asNum && this.ruleForm.routerId) {
        let _this = this;
        plug.debounce(Sync(), 2000);
        function Sync() {
          bgpVrfSync({
            bgpVrfId: _this.bgpVrfId,
          }).then((res) => {
            if (res.code === 10000) {
              _this.$message({
                message: _this.$t("timeSet.hint2"),
                type: "success",
              });
              bgpVrfCheckAsNumber({
                userType: this.type,
                deviceId: _this.deviceId,
                language: sessionStorage.getItem("User-Language") || "zh-CN",//获取vsm默认语言
              }).then((res) => {
                if (res.code == 10000) {
                  _this.isDisabled = false;
                } else {
                  _this.isDisabled = true;
                }
              });
            } else {
              _this.$message({
                message: _this.$t("timeSet.hint2"),
                type: "warning",
              });
            }
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: this.$t("newModel.msg22"),
        });
      }
    },
    //BGP邻居与网段发布提交提交
    // BGP neighbors and network segment publish submit submit
    //BGP neighbors and network segment publish submit submit
    bgpSubmit() {
      if (!this.baseShow) {
        plug.debounce(this.$refs.BGPNeighbor.submitForm(), 2000);
      } 
      // else {
      //   plug.debounce(this.$refs.netWorkIssue.submitForm(), 2000);
      // }
    },
    
    //保存租户路由域id
    // Save the tenant routing domain ID
    // Save the tenant routing domain ID
    async saveTeant(val) {
      if (this.asNum) {
        this.setVrf();
        // sessionStorage.setItem("vrfId", val);
        let VrfData = await bgpVrfGetBgpVrf({
          deviceId: this.deviceId,
          vrfId: val,
          deviceType:this.devType == "vsr1000" ? "0001" : this.devType == "vsr100" ? "0002" : this.devType == "Cloud-vsr1000" ? "000106" : "000206"
        });
        // this.indexToSend = VrfData.result.indexToSend;
        this.bgpVrfId = VrfData.result.id;
        // sessionStorage.setItem("bgpVrfId", VrfData.result.id);
        this.dataInit();
      }
      if (this.tabsIndex === 0) {
        this.$refs.BGPNeighbor.dataInit();
      } else if (this.tabsIndex === 1) {
        this.$refs.netWorkIssue.dataInit();
      }
    },
    //删除配置
    // Delete the configuration
    // Delete configuration
    remveData() {
      var show14 = localStorage.getItem("show14");
              if(show14 == 'true') {
                let params = {
                  deviceId: this.deviceId,
                  bgpVrfId: this.bgpVrfId,
                };
                bgpVrfDel(params).then((res) => {
                  if (res.code === 10000) {
                    this.$message({
                      type: "success",
                      message: this.$t("vsr1000.remind2[2]"),
                    });

                    this.dataInit();
                    this.$refs.BGPNeighbor.dataInit();
                    this.$refs.netWorkIssue.dataInit();
                    bgpVrfCheckAsNumber({
                      userType: this.type,
                      deviceId: this.deviceId,
                      language: sessionStorage.getItem("User-Language") || "zh-CN",//获取vsm默认语言
                    }).then((res) => {
                      if (res.code == 10000) {
                        this.isDisabled = false;
                      } else {
                        this.isDisabled = true;
                      }
                    });
                  }else{
                    this.$message({
                      type: "warning",
                      message: res.message,
                    });
                  }
                });
              }else{

              
        this.$confirm(this.$t("vsr1000.qosremind[1]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue14\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning",
        })
        .then(() => {
          // let val = this.TenantList.find(item => item.id == this.ruleForm.Tenant)
          //   .name;
          let params = {
            deviceId: this.deviceId,
            bgpVrfId: this.bgpVrfId,
          };
          bgpVrfDel(params).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]"),
              });

              this.dataInit();
              this.$refs.BGPNeighbor.dataInit();
              this.$refs.netWorkIssue.dataInit();
              bgpVrfCheckAsNumber({
                userType: this.type,
                deviceId: this.deviceId,
                language: sessionStorage.getItem("User-Language") || "zh-CN",//获取vsm默认语言
              }).then((res) => {
                if (res.code == 10000) {
                  this.isDisabled = false;
                } else {
                  this.isDisabled = true;
                }
              });
              localStorage.setItem("show14",localStorage.getItem("checkedValue14"));
            }else{
              this.$message({
                type: "warning",
                message: res.message,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("vsr1000.qosremind[2]"),
          });
        });
        }
    },
    //判断AS号是否正在输入
    change() {
      if(this.asNum>=1){
        //如果长度大于等于1则不提示请输入
        this.errorShow = false;
      }else{
        this.errorShow = true;
      }
    }
  },
  created() {
    this.getTenantsList();
  },
  mounted() {},
};
</script>
<style scoped lang="scss">
.BGP {
  width: 100%;
  height: 100%;
  padding: 20px 30px 30px 30px;
}
.set {
  zoom: 1;
  padding-bottom: 20px;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .select {
    float: left;
    .alt:before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
    span {
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      padding-right: 10px;
    }
    .input_inner {
      display: inline-block;
      position: relative;
      .error {
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
      }
    }
  }
  .btns {
    // float: right;
    // button {
    //   width: 100px;
    //   height: 34px;
    //   background: rgba(54, 120, 200, 1);
    //   border-radius: 7px;
    //   border: 0;
    //   outline: none;
    //   cursor: pointer;
    //   color: #fff;
    // }
    // .async:hover {
    //   background: #6095d6;
    // }
    // .clear {
    //   width: 100px;
    //   height: 34px;
    //   background: rgba(239, 239, 239, 1);
    //   border-radius: 7px;
    //   border: 1px solid rgba(209, 215, 224, 1);
    //   color: rgba(51, 51, 51, 1);
    //   margin-left: 14px;
    // }
    float: left;
    button {
      float: left;
      width: 120px;
      height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      outline: none;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      cursor: pointer;
      margin-right: 14px;
    }
    .btnEn {
      height: 40px;
      width: 125px;
    }
    .active {
      background: #3678c8;
      color: #fff;
      border: 0;
    }
    .active:hover {
      background: #6095d6;
    }
  }
}
.eventList {
  width: 100%;
  height: calc(100% - 54px);
  border-radius: 7px;
  border: 1px solid rgba(209, 215, 224, 1);
  overflow: auto;
}
.eventList::-webkit-scrollbar {
  width: 4px;
}
.eventList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.eventList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.form {
  width: 100%;
  padding: 20px 20px 0 0;
  border-bottom: 1px solid rgba(209, 215, 224, 1);
}
.formEn {
  padding: 20px 20px 0 20px;
}
.tabs {
  zoom: 1;
  padding: 20px;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .tabBtns {
    float: left;
    button {
      width: 90px;
      height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      outline: none;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      cursor: pointer;
      margin-right: 14px;
    }
    .btnEn {
      height: 40px;
    }
    .active {
      background: #3678c8;
      color: #fff;
      border: 0;
    }
    .active:hover {
      background: #6095d6;
    }
  }
  .submit {
    float: right;
    .save {
      width: 90px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border: 0;
      border-radius: 7px;
      color: #fff;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      outline: none;
      cursor: pointer;
    }
    .saveEn {
      height: 40px;
    }
    .save:hover {
      background: #6095d6;
    }
    .add,
    .close {
      width: 100px;
      height: 34px;
      font-family: arial, sans-serif;
      font-weight: 400;
      border: 0;
      outline: none;
      cursor: pointer;
      margin-left: 14px;
      img {
        width: 14px;
        height: 14px;
        position: relative;
        top: 1px;
      }
    }
    .add {
      background: #3678c8;
      color: #fff;
    }
    .add:hover {
      background: #6095d6;
    }
    .close {
      background: rgba(239, 239, 239, 1);
      color: #333333;
    }
  }
}
.tabCon {
  width: 100%;
  // height: calc(100% - 152px);
  padding: 0 20px 20px 20px;
  overflow: auto;
}
.tabCon::-webkit-scrollbar {
  width: 4px;
}
.tabCon::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.tabCon::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.baseSave {
  float: right;
  button {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: 0;
    outline: none;
    cursor: pointer;
    color: #fff;
  }
  .async:hover {
    background: #6095d6;
  }
  .clear {
    width: 100px;
    height: 34px;
    background: rgba(239, 239, 239, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    color: rgba(51, 51, 51, 1);
    margin-left: 14px;
  }
}
.baseSet {
  display: flex;
  justify-content: space-between;
}
</style>
<style lang="scss">
.BGP .set .select {
  .el-input,
  .el-select {
    // width: 322px;
    width: 300px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .activeErr {
    .el-input__inner {
      border-color: #f56c6c;
    }
  }
}
.BGP .form {
  .el-input,
  .el-select {
    // width: 322px;
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
}
.BGP .baseFrom {
  .el-input,
  .el-select {
    // width: 322px;
    width: 208px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
}
.BGP .baseFromEn {
  margin-right: 0;
  .el-input,
  .el-select {
    // width: 322px;
    width: 352px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
}
</style>