<template>
  <!-- BGP邻居 -->
  <div :class="lang=='en' ? 'BGPNeighbor BGPNeighborEn':'BGPNeighbor'">
    <el-form
      :model="ruleForm"
      ref="form"
      :label-width="lang=='en'?'auto':'130px'"
      class="demo-ruleForm"
      @submit.native.prevent
      :inline="true"
    >
      <div class="tabsCon">
        <el-tabs
          v-model="editableTabsValue"
          type="card"
          closable
          editable
          @edit="addTab"
          @tab-click="tabClick"
          class="tabsListBGP"
        >
          <el-tab-pane
            v-for="(item,index) in ruleForm.formData"
            :key="item.name"
            :label="item.title"
            :name="item.name"
            class="addEl"
          >
            <el-form-item
              :label="$t('newModel.ToAddress')"
              :prop="'formData.'+index+'.remoteIp'"
              :rules="[
              {required: true,message: $t('newModel.msg3'),trigger: 'change'},
              {required: true,message: $t('newModel.msg3'),trigger: 'blur'},
              {
              pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
              message: $t('vsr1000.greRule[2]')
              }
              
              ]"
            >
              <el-select filterable
                v-if="devType == 'vsr1000' || devType == 'Cloud-vsr1000'"
                v-model="item.remoteIp"
                @change="remoteIpChange(item.remoteIp,item)"
              >
                <el-option
                  v-for="item in remoteIpArr"
                  :key="item.remoteIp"
                  :label="item.name"
                  :value="item.remoteIp"
                ></el-option>
              </el-select>
              <el-input v-else v-model="item.remoteIp"></el-input>
            </el-form-item>
            <el-form-item :label="$t('TenDomain.description')" :prop="'formData.'+index+'.des'">
              <el-input v-model="item.des"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('newModel.ToASnumber')"
              :prop="'formData.'+index+'.remoteAs'"
              :rules="[
              {required: true,message: $t('newModel.msg3'),trigger: 'blur'},
              { type: 'number', message: $t('newModel.msg7') },
              ASrule
              ]"
            >
              <el-input v-model.number="item.remoteAs"></el-input>
            </el-form-item>
            <el-form-item
              label="update source"
              :prop="'formData.'+index+'.updateSource'"
              :rules="[
              {
              pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
              message: $t('vsr1000.greRule[2]')
              }
              ]"
            >
              <el-input v-model="item.updateSource"></el-input>
            </el-form-item>
            <el-form-item
              class="inRouter"
              :label="$t('newModel.in')+'Route_Map'"
              :prop="'formData.'+index+'.inBgpPolicyId'"
            >
              <el-select filterable v-model="item.inBgpPolicyId">
                <el-option :label="$t('vsr1000.noHave')" value></el-option>
                <el-option v-for="el in routeMapList" :key="el.id" :label="el.name" :value="el.id"></el-option>
              </el-select>
              <button class="goBgp" @click.prevent="goRouteMap">{{$t('newModel.jumpTo')}}</button>
            </el-form-item>
            <el-form-item
              class="outRouter"
              :label="$t('newModel.out')+'Route_Map'"
              :prop="'formData.'+index+'.outBgpPolicyId'"
            >
              <el-select filterable
                v-model="item.outBgpPolicyId"
                @change="outBgpPolicyIdChnage(item.outBgpPolicyId,item)"
              >
                <el-option :label="$t('vsr1000.noHave')" value></el-option>
                <el-option v-for="el in routeMapList" :key="el.id" :label="el.name" :value="el.id"></el-option>
              </el-select>
              <button class="goBgp" @click.prevent="goRouteMap">{{$t('newModel.jumpTo')}}</button>
            </el-form-item>
            <el-form-item
              :label="$t('newModel.Reconnection')+' (s)'"
              :prop="'formData.'+index+'.reconnTime'"
              :rules="[numRule]"
            >
              <el-input v-model.number="item.reconnTime"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('newModel.HeartInterval')+' (s)'"
              :prop="'formData.'+index+'.keepAliveTime'"
              :rules="[numRule]"
            >
              <el-input v-model.number="item.keepAliveTime"></el-input>
            </el-form-item>
            <el-form-item label="next-hop-self" :prop="'formData.'+index+'.nextHopSelf'">
              <el-checkbox v-model="item.nextHopSelf"></el-checkbox>
            </el-form-item>
            <el-form-item
              :label="'EBGP'+$t('newModel.multihop')"
              :prop="'formData.'+index+'.emultihop'"
              :rules="hopRule"
            >
              <el-input v-model="item.emultihop"></el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form>
  </div>
</template>
<script>
import {
  bgpNeighborGet,
  bgpNeighborSave,
  bgpNeighborDel,
  bgpPolicyGetBgpPolicyByVrfId,
  bgpPolicyDeleteCheck,
  bgpPolicyGetAddress,
} from "@/services";
// import Sortable from "sortablejs";
export default {
  data() {
    var ASPortrule = (rule, value, callback) => {
      if (1 <= value && value <= 2147483646) {
        callback();
      } else {
        callback(new Error(this.$t("newModel.msg16")));
      }
    };
    var NumRule = (rule, value, callback) => {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val > 1 && val <= 65535) {
            callback();
          } else {
            callback(new Error(this.$t("newModel.msg16")));
          }
        } else {
          callback(new Error(this.$t("newModel.msg7")));
        }
      } else {
        callback();
      }
    };
    var hopRule = (rule, value, callback) => {
      let val = value * 1;
      let reg = /^[0-9]*$/;
      if (reg.test(val)) {
        if (val > 0 && val <= 4294967296) {
          callback();
        } else {
          callback(new Error(this.$t("newModel.msg15")));
        }
      } else {
        callback(new Error(this.$t("newModel.msg7")));
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      devType: JSON.parse(this.$route.query.devData).deviceType,
      ruleForm: {
        formData: [
          {
            title: `BGP${this.$t("newModel.neighbor")}1`,
            name: "1",
            bgpVrfId: this.$parent.bgpVrfId,
            des: "",
            id: "",
            inBgpPolicyId: "",
            inBgpPolicyName: "",
            outBgpPolicyId: "",
            outBgpPolicyIdDefault: "",
            outBgpPolicyName: "",
            outBgpPolicyNameDefault: "",
            remoteAs: null,
            remoteIp: "",
            updateSource: "",
            reconnTime: "",
            keepAliveTime: "",
            nextHopSelf: false,
            emultihop: 1,
          },
        ],
      },
      remoteIpArr: [],
      formDataArr: [],
      rules: {},
      routeMapList: [],
      ASrule: { validator: ASPortrule, trigger: "blur" },
      numRule: { validator: NumRule, trigger: "blur" },
      hopRule: [{ validator: hopRule, trigger: "blur" }],
      tabIndex: 1,
      editableTabsValue: "1",
    };
  },
  methods: {
    //新增删除tbs
    // Add delete TBS
    // Add delete TBS
    addTab(targetName, action) {
      if (action === "add") {
        let newTabName = ++this.tabIndex + "";
        this.ruleForm.formData.push({
          title: `BGP${this.$t("newModel.neighbor")}` + this.tabIndex,
          name: newTabName,
          bgpVrfId: this.$parent.bgpVrfId,
          des: "",
          id: "",
          inBgpPolicyId: "",
          inBgpPolicyName: "",
          outBgpPolicyId: "",
          outBgpPolicyIdDefault: "",
          outBgpPolicyName: "",
          outBgpPolicyNameDefault: "",
          remoteAs: null,
          remoteIp: "",
          updateSource: "",
          sendId: "",
          reconnTime: "",
          keepAliveTime: "",
          nextHopSelf: false,
          emultihop: 1,
        });
        this.editableTabsValue = newTabName;
      }
      if (action === "remove") {
        let tabs = this.ruleForm.formData;
        let id = "";
        if (tabs.length > 1) {
          id = tabs.find((item) => item.name == targetName).id;
          this.ruleForm.formData = tabs.filter(
            (tab) => tab.name !== targetName
          );
          this.ruleForm.formData = this.ruleForm.formData.map((item, index) => {
            return {
              title: `BGP${this.$t("newModel.neighbor")}` + (index + 1),
              name: index + 1 + "",
              bgpVrfId: item.bgpVrfId,
              des: item.des,
              id: item.id,
              inBgpPolicyId: item.inBgpPolicyId,
              inBgpPolicyName: item.inBgpPolicyName,
              outBgpPolicyId: item.outBgpPolicyId,
              outBgpPolicyIdDefault: item.outBgpPolicyIdDefault,
              outBgpPolicyName: item.outBgpPolicyName,
              outBgpPolicyNameDefault: item.outBgpPolicyNameDefault,
              remoteAs: item.remoteAs,
              remoteIp: item.remoteIp,
              updateSource: item.updateSource,
              sendId: item.sendId,
              reconnTime: item.reconnTime,
              keepAliveTime: item.keepAliveTime,
              nextHopSelf: item.nextHopSelf,
              emultihop: item.emultihop,
            };
          });
        }
        // else if (tabs.length == 1) {
        //   id = tabs.find((item) => item.name == targetName).id;
        //   this.ruleForm.formData = [
        //     {
        //       title: `BGP${this.$t("newModel.neighbor")}1`,
        //       name: "1",
        //       bgpVrfId: this.$parent.bgpVrfId,
        //       des: "",
        //       id: "",
        //       inBgpPolicyId: "",
        //       inBgpPolicyName: "",
        //       outBgpPolicyId: "",
        //       outBgpPolicyName: "",
        //       remoteAs: null,
        //       remoteIp: "",
        //       updateSource: "",
        //       reconnTime: "",
        //       keepAliveTime: "",
        //       nextHopSelf: false,
        //       emultihop: 1,
        //     },
        //   ];
        // }

        this.tabIndex = this.ruleForm.formData.length;
        this.editableTabsValue = this.tabIndex + "";
        if (id.length) {
          bgpNeighborDel({ id }).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]"),
              });
            }
          });
        }
      }
    },
    //提交
    // submit
    // submit
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = [];
          if (this.devType == "vsr1000" || this.devType == "Cloud-vsr1000") {
            params = this.ruleForm.formData.map((item) => {
              return {
                bgpVrfId: item.bgpVrfId,
                des: item.des,
                id: item.id,
                inBgpPolicyId: item.inBgpPolicyId,
                inBgpPolicyName: item.inBgpPolicyId
                  ? this.routeMapList.find((el) => el.id === item.inBgpPolicyId)
                      .name
                  : "",
                outBgpPolicyId: item.outBgpPolicyIdDefault
                  ? item.outBgpPolicyIdDefault
                  : item.outBgpPolicyId,
                outBgpPolicyName: item.outBgpPolicyIdDefault
                  ? item.outBgpPolicyNameDefault
                  : item.outBgpPolicyId
                  ? this.routeMapList.find(
                      (el) => el.id === item.outBgpPolicyId
                    ).name
                  : "",
                remoteAs: item.remoteAs,
                remoteIp: item.remoteIp,
                updateSource: item.updateSource,
                sendId: item.sendId,
                reconnTime: item.reconnTime,
                keepAliveTime: item.keepAliveTime,
                nextHopSelf: item.nextHopSelf,
                emultihop: item.emultihop ? item.emultihop : 1,
              };
            });
          } else {
            params = this.ruleForm.formData.map((item) => {
              return {
                bgpVrfId: item.bgpVrfId,
                des: item.des,
                id: item.id,
                inBgpPolicyId: item.inBgpPolicyId,
                inBgpPolicyName: item.inBgpPolicyId
                  ? this.routeMapList.find((el) => el.id === item.inBgpPolicyId)
                      .name
                  : "",
                outBgpPolicyId: item.outBgpPolicyId,
                outBgpPolicyName: item.outBgpPolicyId
                  ? this.routeMapList.find(
                      (el) => el.id === item.outBgpPolicyId
                    ).name
                  : "",
                remoteAs: item.remoteAs,
                remoteIp: item.remoteIp,
                updateSource: item.updateSource,
                sendId: item.sendId,
                reconnTime: item.reconnTime,
                keepAliveTime: item.keepAliveTime,
                nextHopSelf: item.nextHopSelf,
                emultihop: item.emultihop ? item.emultihop : 1,
              };
            });
          }

          params.forEach((item) => {
            if (!item.id.length) {
              delete item.id;
            }
            if (!item.sendId) {
              delete item.sendId;
            }
          });
          // console.log(params)
          // if (params.length) {
          bgpNeighborSave(params).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]"),
              });
              this.dataInit();
            }
          });
          // }
        }
      });
    },
    // //下发数据封装
    // Release data encapsulation
    // setParamsData() {
    //   let data1 = this.ruleForm.formData;
    //   let data2 = this.formDataArr;
    //   // console.log(data1)
    //   // console.log(data2)
    //   let paramsArr = [];
    //   data1.forEach((item, index) => {
    //     let bgpItem = data2.find((el) => el.id == item.id);
    //     if (bgpItem) {
    //       if (this.isObjectValueEqual(item, bgpItem)) {
    //         paramsArr.push(item);
    //       } else {
    //         paramsArr = [...paramsArr];
    //       }
    //     } else {
    //       paramsArr.push(item);
    //     }
    //   });
    //   return paramsArr;
    // },
    // //判断下发数据是否修改
    // Determine whether the issued data is modified
    // isObjectValueEqual(val1, val2) {
    //   var aProps = Object.keys(val1);
    //   for (var i = 0; i < aProps.length; i++) {
    //     var propName = aProps[i];
    //     if (val1[propName] !== val2[propName]) {
    //       return true;
    //     }
    //   }
    //   return false;
    // },
    //数据初始化
    // Data initialization
    // Data initialization
    dataInit() {
      bgpNeighborGet({
        bgpVrfId: this.$parent.bgpVrfId,
      }).then((res) => {
        if (res.code === 10000 && res.result.length) {
          let dataArr = [];
          if (this.devType == "vsr1000" || this.devType == "Cloud-vsr1000") {
            res.result.map((item, index) => {
              dataArr.push({
                title: `BGP${this.$t("newModel.neighbor")}` + (index + 1),
                name: index + 1 + "",
                bgpVrfId: item.bgpVrfId,
                des: item.des,
                id: item.id,
                inBgpPolicyId: item.inBgpPolicyId,
                inBgpPolicyName: item.inBgpPolicyName,
                outBgpPolicyId: this.isDefaultData(item)[0],
                outBgpPolicyIdDefault: this.isDefaultData(item)[2],
                outBgpPolicyNameDefault: this.isDefaultData(item)[3],
                outBgpPolicyName: this.isDefaultData(item)[1],
                remoteAs: item.remoteAs,
                remoteIp: item.remoteIp,
                updateSource: item.updateSource,
                sendId: item.sendId,
                reconnTime: item.reconnTime,
                keepAliveTime: item.keepAliveTime,
                nextHopSelf: item.nextHopSelf,
                emultihop: item.emultihop,
              });
            });
          } else {
            res.result.map((item, index) => {
              dataArr.push({
                title: `BGP${this.$t("newModel.neighbor")}` + (index + 1),
                name: index + 1 + "",
                bgpVrfId: item.bgpVrfId,
                des: item.des,
                id: item.id,
                inBgpPolicyId: item.inBgpPolicyId,
                inBgpPolicyName: item.inBgpPolicyName,
                outBgpPolicyId: item.outBgpPolicyId,
                outBgpPolicyName: item.outBgpPolicyName,
                remoteAs: item.remoteAs,
                remoteIp: item.remoteIp,
                updateSource: item.updateSource,
                sendId: item.sendId,
                reconnTime: item.reconnTime,
                keepAliveTime: item.keepAliveTime,
                nextHopSelf: item.nextHopSelf,
                emultihop: item.emultihop,
              });
            });
          }

          this.formDataArr = JSON.parse(JSON.stringify(dataArr));
          this.ruleForm.formData = dataArr;
          this.tabIndex = dataArr.length;
        } else {
          this.ruleForm = {
            formData: [
              {
                title: `BGP${this.$t("newModel.neighbor")}1`,
                name: "1",
                bgpVrfId: this.$parent.bgpVrfId,
                des: "",
                id: "",
                inBgpPolicyId: "",
                inBgpPolicyName: "",
                outBgpPolicyId: "",
                outBgpPolicyIdDefault: "",
                outBgpPolicyName: "",
                outBgpPolicyNameDefault: "",
                remoteAs: null,
                remoteIp: "",
                updateSource: "",
                reconnTime: "",
                keepAliveTime: "",
                nextHopSelf: false,
                emultihop: 1,
              },
            ],
          };
          this.tabIndex = this.ruleForm.formData.length;
          this.editableTabsValue = this.tabIndex + "";
        }
      });
      bgpPolicyGetBgpPolicyByVrfId({
        deviceId: this.$parent.deviceId,
        bgpVrfId: this.$parent.bgpVrfId,
      }).then((res) => {
        if (res.code === 10000) {
          this.routeMapList = res.result == null ? [] : res.result;
        }
      });
      if (this.devType == "vsr1000" || this.devType == "Cloud-vsr1000") {
        bgpPolicyGetAddress({ deviceId: this.$parent.deviceId ,neighborId:this.ruleForm.formData[0].id}).then((res) => {
          if (res.code === 10000) {
            this.remoteIpArr = res.result;
          }
        });
      }
    },
    //跳转BGProuteMap
    // Jump BGProuteMap
    //Jump BGProuteMap
    goRouteMap() {
      this.$parent.tabsIndex = 1;
    },
    //对端地址切换
    // Switch to end address
    //Switch to end address
    remoteIpChange(val, item) {
      item.outBgpPolicyIdDefault = this.remoteIpArr.find(
        (el) => el.remoteIp == val
      ).outBgpPolicyId;
      item.outBgpPolicyNameDefault = this.remoteIpArr.find(
        (el) => el.remoteIp == val
      ).outBgpPolicyName;
      item.outBgpPolicyId = "";
    },
    //出项routerMap切换
    // Output item routerMap toggle
    //Output item routerMap toggle
    outBgpPolicyIdChnage(val, item) {
      item.outBgpPolicyIdDefault = "";
      item.outBgpPolicyNameDefault = "";
    },
    //判断是否为默认数据
    // Determines whether the data is the default
    //Determines whether the data is the default
    isDefaultData(item) {
      let reg = /^[0-9]*$/;
      if (reg.test(item.outBgpPolicyName)) {
        return ["", "", item.outBgpPolicyId, item.outBgpPolicyName];
      } else {
        return [item.outBgpPolicyId, item.outBgpPolicyName, "", ""];
      }
    },
    //tab标签切换触发事件
    // TAB TAB toggle triggers events
    tabClick(val) {
      // console.log(val.name,'123213')
      if (this.devType == "vsr1000" || this.devType == "Cloud-vsr1000") {
        bgpPolicyGetAddress({ deviceId: this.$parent.deviceId ,neighborId:this.ruleForm.formData.find(item.name==val.name).id}).then((res) => {
          if (res.code === 10000) {
            this.remoteIpArr = res.result;
          }
        });
      }
    }
  },
  mounted() {
    // this.tabsDrop();
  },
  created() {
    // this.dataInit();
  },
};
</script>
<style scoped lang="scss">
.BGPNeighbor {
  width: 100%;
  height: 100%;
}
.inRouter,
.outRouter {
  button {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    border: 0;
    outline: none;
    background: #fff;
    cursor: pointer;
  }
}
.tabsCon {
  width: 100%;
  height: 100%;
  .tabsListBGP {
    width: 100%;
    height: 100%;
  }
}
</style>
<style lang="scss">
.BGPNeighbor {
  .el-form {
    width: 100%;
    height: 100%;
  }
  .el-input,
  .el-select {
    width: 360px;
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
  .el-tabs__header {
    margin-bottom: 0;
    .el-tabs__nav-prev,
    .el-tabs__nav-next {
      width: 20px;
      height: 100%;
      z-index: 100;
      line-height: 30px;
      text-align: center;
    }
  }
  .el-tabs--card > .el-tabs__header {
    // border: 0;
  }
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
  .el-tabs__content {
    background: #fff;
    // overflow: auto;
    padding: 30px;
    border: 1px solid rgba(209, 215, 224, 1);
    border-top: 0;
    width: 100%;
    height: calc(100% - 31px);
    // .el-input {
    //   width: 260px;
    // }
    .el-form-item {
      // margin-right: 15px;
      width: 50%;
    }
  }
  .el-tabs__content::-webkit-scrollbar {
    width: 4px;
  }
  .el-tabs__content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .el-tabs__content::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .el-tabs__item {
    padding: 0 16px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(49, 104, 172, 1);
    background: #fff;
    border-radius: 7px 2px 0px 0px;
    border-bottom: 0;
    position: relative;
    top: 1px;
  }
  .el-tabs__new-tab {
    margin: 0;
    border: 0;
    width: 26px;
    height: 26px;
    font-size: 26px;
    color: #3678c8;
  }
}
.BGPNeighbor {
  .inRouter,
  .outRouter {
    .el-input,
    .el-select {
      width: 230px;
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
}
.BGPNeighborEn {
  .el-input,
  .el-select {
    width: 290px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .inRouter,
  .outRouter {
    .el-input,
    .el-select {
      width: 160px;
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
}
</style>