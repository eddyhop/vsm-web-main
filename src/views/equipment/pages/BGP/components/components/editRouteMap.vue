<template>
  <!-- 编辑Route_Map -->
  <div class="editRouteMap">
    <div :class="lang=='en'? 'contentEn content' : 'content'">
      <h4 class="title">
        <span>{{$t('newModel.edit')}}Route_Map</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="lang=='en' ? 'auto' :'90px'"
          class="demo-ruleForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item :label="$t('vsr1000.name')" prop="name" style="paddingRight:20px">
            <el-input disabled v-model="ruleForm.name" placeholder></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.describe')" prop="description">
            <el-input v-model="ruleForm.description" placeholder></el-input>
          </el-form-item>
          <div class="tabsCon">
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              closable
              editable
              @edit="addTab"
              class="editRouteMApTabs"
            >
              <el-tab-pane
                v-for="(item,index) in ruleForm.formData"
                :key="item.name"
                :label="item.title"
                :name="item.name"
                class="addEl"
              >
                <el-form-item
                  :label="$t('newModel.action')"
                  :prop="'formData.'+index+'.action'"
                  :rules="[
                {required: true,message: $t('newModel.msg4'),trigger: 'change'}
                ]"
                >
                  <el-select filterable v-model="item.action">
                    <el-option label="permit" value="permit"></el-option>
                    <el-option label="deny" value="deny"></el-option>
                  </el-select>
                </el-form-item>
                <h4 class="actionName">{{$t('newModel.matching')}}</h4>
                <el-form-item
                  class="goDetail"
                  label="prefix list"
                  :prop="'formData.'+index+'.bgpIplistIdMatch'"
                >
                  <el-select filterable v-model="item.bgpIplistIdMatch">
                    <el-option :label="$t('vsr1000.noHave')" value></el-option>
                    <el-option
                      v-for="item in lplist"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <button @click="goBGP(true)">{{$t("newModel.jump")}}Prefix list</button>
                </el-form-item>
                <!-- <el-form-item label="as-path" :prop="'formData.'+index+'.asPathMatch'">
                  <el-input v-model="item.asPathMatch"></el-input>
                </el-form-item>-->
                <el-form-item
                  class="goDetail"
                  label="community"
                  :prop="'formData.'+index+'.communityMatch'"
                >
                  <el-select filterable v-model="item.communityMatch">
                    <el-option :label="$t('vsr1000.noHave')" value></el-option>
                    <el-option
                      v-for="item in communityList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <button @click="goBGP(false)">{{$t("newModel.jump")}}community</button>
                </el-form-item>
                <h4 class="actionName">{{$t('newModel.set')}}</h4>
                <el-form-item
                  :label="$t('newModel.NextAddress')"
                  :prop="'formData.'+index+'.nextHopIp'"
                  :rules="[{
                  pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                  message: $t('vsr1000.greRule[2]')
                  }]"
                >
                  <el-input v-model="item.nextHopIp"></el-input>
                </el-form-item>
                <!-- <el-form-item label="as-path" :prop="'formData.'+index+'.asPathSetting'">
                  <el-input v-model="item.asPathSetting"></el-input>
                </el-form-item>-->
                <el-form-item label="community " :prop="'formData.'+index+'.communitySetting'">
                  <el-input v-model="item.communitySetting"></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('newModel.LocalPreferences')"
                  :prop="'formData.'+index+'.localPreference'"
                  :rules="[numRule]"
                >
                  <el-input v-model="item.localPreference"></el-input>
                </el-form-item>
                <el-form-item label="Metric" :prop="'formData.'+index+'.metric'" :rules="[numRule]">
                  <el-input v-model="item.metric"></el-input>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="submit">
            <button
              class="save"
              type="primary"
              v-debounce.prevent="submitForm"
            >{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  bgpPolicySave,
  bgpIpListGetBgpIpListByVrfId,
  bgpCommunityGetBgpCommunityByVrfId,
  bgpPolicyDelBgpPolicySession,
  bgpPolicyNameExist,
} from "@/services";
import Sortable from "sortablejs";
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
    var nameRule = (rule, value, callback) => {
      if (value) {
        bgpPolicyNameExist({
          deviceId: this.deviceId,
          checkName: value,
          bgpPolicyId: this.ruleForm.id,
          // bgpVrfId: sessionStorage.getItem("bgpVrfId")
        }).then((res) => {
          if (res.code === 10000) {
            callback();
          } else {
            callback(new Error(this.$t("newModel.msg6")));
          }
        });
      }
    };
    return {
      devType: JSON.parse(this.$route.query.devData).deviceType,
      lang: sessionStorage.getItem("lang") || "en",
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      vsrDefault: {},
      ruleForm: {
        formData: [
          {
            title: "Route_Map1",
            name: "1",
            action: "", //动作
                        // action
            asPathMatch: "", //as-path匹配
                             // The as - path matching
            asPathSetting: "", //as-path动作
                               // The as - path
            bgpIplistIdMatch: "", //prefix list
            bgpPolicyId: "",
            communityMatch: "", //community匹配
                                // The community to match
            communitySetting: "", //community动作
                                  // The community action
            deviceId: this.deviceId,
            id: "",
            isChange: true,
            localPreference: "", //本地偏好
                                 // Local preferences
            metric: "", //Metric
            nextHopIp: "", //下一跳地址
                           // Next hop address
            priority: 0,
          },
        ],
        description: "",
        deviceId: this.deviceId,
        id: "",
        name: "",
        // bgpVrfId: ""
      },
      lplist: [],
      communityList: [],
      formDataArr: [],
      rules: {
        name: [
          {
            required: true,
            message: this.$t("newModel.msg3"),
            trigger: "blur",
          },
          {
            pattern: /^(?!\d+$)[\da-zA-Z]+$/,
            message: this.$t("newModel.msg5"),
          },
          { validator: nameRule, trigger: "blur" },
        ],
      },
      numRule: { validator: NumRule, trigger: "blur" },
      tabIndex: 1,
      editableTabsValue: "1",
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let arr = this.setParamsData().map((item) => {
            return {
              action: item.action, //动作
                                   // action
              asPathMatch: item.asPathMatch, //as-path匹配
                                             // The as - path matching
              asPathSetting: item.asPathSetting, //as-path动作
                                                 // The as - path
              bgpIplistIdMatch: item.bgpIplistIdMatch, //prefix list
              bgpPolicyId: item.bgpPolicyId,
              communityMatch: item.communityMatch, //community匹配
                                                   // The community to match
              communitySetting: item.communitySetting, //community动作
                                                       // The community action
              deviceId: this.deviceId,
              id: item.id,
              isChange: item.isChange,
              localPreference: item.localPreference, //本地偏好
                                                     // Local preferences
              metric: item.metric, //Metric
              nextHopIp: item.nextHopIp, //下一跳地址
                                         // Next hop address
              priority: item.priority,
              // bgpVrfId: sessionStorage.getItem("bgpVrfId")
            };
          });
          // if (this.devType == "vsr1000") {
          //   arr.push(this.vsrDefault);
          // }
          let params = {
            bgpPolicySessionVoList: arr,
            description: this.ruleForm.description,
            deviceId: this.ruleForm.deviceId,
            id: this.ruleForm.id,
            name: this.ruleForm.name,
            // bgpVrfId: this.ruleForm.bgpVrfId
          };
          bgpPolicySave(params).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.qosremind[0]"),
              });
              this.$parent.eisShow = false;
              this.$parent.dataInit({
                deviceId: this.deviceId,
                pageNumber: this.$parent.page,
                pageSize: this.$parent.pageSize,
                order: "desc",
                // bgpVrfId: sessionStorage.getItem("bgpVrfId")
              });
            } else {
              this.$message({
                type: "warning",
                message: res.message,
              });
              this.$parent.eisShow = false;
            }
          });
        }
      });
    },
    close() {
      this.$parent.eisShow = false;
    },
    //新增删除tbs
    // Add delete TBS
    //Add delete TBS
    addTab(targetName, action) {
      if (action === "add") {
        let newTabName = ++this.tabIndex + "";
        this.ruleForm.formData.push({
          title: "Route_Map" + this.tabIndex,
          name: newTabName,
          action: "", //动作
                      // action
          asPathMatch: "", //as-path匹配
                           // The as - path matching
          asPathSetting: "", //as-path动作
                             // The as - path
          bgpIplistIdMatch: "", //prefix list
          bgpPolicyId: "",
          communityMatch: "", //community匹配
                              // The community to match
          communitySetting: "", //community动作
                                // The community action
          deviceId: this.deviceId,
          id: "",
          isChange: true,
          localPreference: "", //本地偏好
                               // Local preferences
          metric: "", //Metric
          nextHopIp: "", //下一跳地址
                         // Next hop address
          priority: 0,
        });
        this.editableTabsValue = newTabName;
      }
      if (action === "remove") {
        let tabs = this.ruleForm.formData;
        let id = "";
        if (tabs.length > 1) {
          id = tabs.find((item) => item.name == targetName).id;
          let flag = 0;
          tabs.forEach((item) => {
            if (item.id.length) {
              flag++;
            }
          });
          if (id.length) {
            bgpPolicyDelBgpPolicySession({
              deviceId: this.deviceId,
              bgpPolicySessionId: id,
            }).then((res) => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]"),
                });
                this.$parent.dataInit({
                  deviceId: this.deviceId,
                  pageNumber: this.$parent.page,
                  pageSize: this.$parent.pageSize,
                  order: "desc",
                  // bgpVrfId: sessionStorage.getItem("bgpVrfId")
                });
              } else {
                this.$message({
                  type: "warning",
                  message: res.message,
                });
              }
            });
          }
          if (flag == 1 && id.length) {
            return;
          }
          this.ruleForm.formData = tabs.filter(
            (tab) => tab.name !== targetName
          );
        }
        this.ruleForm.formData = this.ruleForm.formData.map((item, index) => {
          return {
            title: "Route_Map" + (index + 1),
            name: index + 1 + "",
            action: item.action, //动作
                                 // action
            asPathMatch: item.asPathMatch, //as-path匹配
                                           // The as - path matching
            asPathSetting: item.asPathSetting, //as-path动作
                                               // The as - path
            bgpIplistIdMatch: item.bgpIplistIdMatch, //prefix list
            bgpPolicyId: item.bgpPolicyId,
            communityMatch: item.communityMatch, //community匹配
                                                 // The community to match
            communitySetting: item.communitySetting, //community动作
                                                     // The community action
            deviceId: this.deviceId,
            id: item.id,
            isChange: item.isChange,
            localPreference: item.localPreference * 1, //本地偏好
                                                       // Local preferences
            metric: item.metric * 1, //Metric
            nextHopIp: item.nextHopIp, //下一跳地址
                                       // Next hop address
            priority: item.priority,
          };
        });
        this.tabIndex = this.ruleForm.formData.length;
        this.editableTabsValue = this.tabIndex + "";
      }
    },
    //表格拖拽
    // Form drag
    //Form drag
    tabsDrop() {
      let el = document.querySelectorAll(".editRouteMApTabs .el-tabs__nav")[0];
      const _this = this;
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.ruleForm.formData.splice(oldIndex, 1)[0];
          _this.ruleForm.formData.splice(newIndex, 0, currRow);
        },
      });
    },
    //数据初始化
    // Data initialization
    //Data initialization
    dataInit(row, params) {
      bgpIpListGetBgpIpListByVrfId(params).then((res) => {
        if (res.code === 10000) {
          this.lplist = res.result;
        }
      });
      bgpCommunityGetBgpCommunityByVrfId(params).then((res) => {
        if (res.code === 10000) {
          this.communityList = res.result;
        }
      });

      let arr = row.bgpPolicySessionEntityList.map((item, index) => {
        return {
          title: "Route_Map" + (index + 1),
          name: index + 1 + "",
          action: item.action, //动作
                               // action
          asPathMatch: item.asPathMatch, //as-path匹配
                                         // The as - path matching
          asPathSetting: item.asPathSetting, //as-path动作
                                             // The as - path
          bgpIplistIdMatch: item.bgpIplistIdMatch, //prefix list
          bgpPolicyId: item.bgpPolicyId,
          communityMatch: item.communityMatch, //community匹配
                                               // The community to match
          communitySetting: item.communitySetting, //community动作
                                                   // The community action
          deviceId: this.deviceId,
          id: item.id,
          isChange: false,
          localPreference: item.localPreference, //本地偏好
                                                 // Local preferences
          metric: item.metric, //Metric
          nextHopIp: item.nextHopIp, //下一跳地址
                                     // Next hop address
          priority: item.priority,
        };
      });
      // if (this.devType == "vsr1000") {
      //   this.vsrDefault = arr.pop();
      // }
      this.tabIndex = arr.length;
      this.ruleForm.formData = arr;
      this.ruleForm.description = row.description;
      this.ruleForm.deviceId = row.deviceId;
      this.ruleForm.id = row.id;
      this.ruleForm.name = row.name;
      this.ruleForm.vrfId = row.vrfId;
    },
    //保存编辑数据
    // Save edit data
    //Save edit data
    saveEditData(row) {
      let arr = row.bgpPolicySessionEntityList.map((item, index) => {
        return {
          title: "Route_Map" + (index + 1),
          name: index + 1 + "",
          action: item.action, //动作
                               // action
          asPathMatch: item.asPathMatch, //as-path匹配
                                         // The as - path matching
          asPathSetting: item.asPathSetting, //as-path动作
                                             // The as - path
          bgpIplistIdMatch: item.bgpIplistIdMatch, //prefix list
          bgpPolicyId: item.bgpPolicyId,
          communityMatch: item.communityMatch, //community匹配
                                               // The community to match
          communitySetting: item.communitySetting, //community动作
                                                   // The community action
          deviceId: this.deviceId,
          id: item.id,
          isChange: false,
          localPreference: item.localPreference, //本地偏好
                                                 // Local preferences
          metric: item.metric, //Metric
          nextHopIp: item.nextHopIp, //下一跳地址
                                     // Next hop address
          priority: item.priority,
        };
      });
      this.formDataArr = arr;
    },
    //下发数据格式化数据
    // Issue data format data
    //Issue data format data
    setParamsData() {
      let data1 = this.ruleForm.formData;
      let data2 = this.formDataArr;
      let paramsArr = [];
      data1.forEach((item, index) => {
        let bgpItem = data2.find((el) => el.id == item.id);
        if (bgpItem) {
          if (this.isObjectValueEqual(item, bgpItem)) {
            item.isChange = true;
            paramsArr.push(item);
          } else {
            item.isChange = false;
            paramsArr.push(item);
          }
        } else {
          paramsArr.push(item);
        }
      });
      return paramsArr;
    },
    //判断下发数据是否修改
    // Determine whether the issued data is modified
    //Determine whether the issued data is modified
    isObjectValueEqual(val1, val2) {
      var aProps = Object.keys(val1);
      for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (val1[propName] !== val2[propName]) {
          return true;
        }
      }
      return false;
    },
    //跳转
    // jump
    //jump to
    goBGP(val) {
      if (val) {
        this.$parent.$parent.tabsIndex = 2;
        this.close();
      } else {
        this.$parent.$parent.tabsIndex = 3;
        this.close();
      }
    },
  },
  mounted() {
    this.tabsDrop();
  },
};
</script>
<style scoped lang="scss">
.editRouteMap {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.content {
  width: 950px;
  height: 590px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -295px;
  margin-left: -475px;
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
      background: url("../../../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.contentEn {
  width: 1010px;
  margin-left: -505px;
  .formList {
    padding: 30px 30px 0 30px;
  }
  .actionName {
    width: 130px;
  }
}
.formList {
  padding: 30px 60px 0 60px;
}
.submit {
  width: 100%;
  text-align: center;
  padding-top: 20px;
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
.goDetail {
  button {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    border: 0;
    outline: none;
    background: #f4f8fe;
    cursor: pointer;
  }
}
.actionName {
  width: 90px;
  font-size: 14px;
  padding-right: 12px;
  font-family: arial, sans-serif;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  text-align: right;
  padding-bottom: 14px;
}
.mate {
  display: flex;
}
</style>
<style lang="scss">
.editRouteMap {
  .el-input,
  .el-select {
    width: 288px;
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
    border: 0;
  }
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
  .el-tabs__content {
    background: #f4f8fe;
    overflow: auto;
    padding: 15px 15px 4px 15px;
    // .el-input {
    //   width: 260px;
    // }
    .el-form-item {
      margin-right: 15px;
    }
  }
  .el-tabs__item {
    padding: 0 16px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(49, 104, 172, 1);
    background: rgba(244, 248, 254, 1);
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
.editRouteMap .goDetail {
  .el-input,
  .el-select {
    width: 170px;
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