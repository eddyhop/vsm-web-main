<template>
  <!-- 新增Route_Map -->
  <div class="addRouteMAp">
    <div :class="lang=='en'? 'contentEn content' : 'content'">
      <h4 class="title">
        <span>{{$t('newModel.add')}}Route_Map</span>
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
            <el-input v-model="ruleForm.name" placeholder></el-input>
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
              class="addRouteMApTabs"
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
                <div class="mate">
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
                    <button class="goBGP" @click="goBGP(true)">{{$t("newModel.jump")}}Prefix list</button>
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
                    <button class="goBGP" @click="goBGP(false)">{{$t("newModel.jump")}}community</button>
                  </el-form-item>
                </div>
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
          // bgpVrfId: sessionStorage.getItem("bgpVrfId")
        }).then((res) => {
          if (res.code === 10000) {
            callback();
          } else {
            callback(new Error(this.$t('newModel.msg6')));
          }
        });
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      ruleForm: {
        formData: [
          {
            title: "Route_Map1",
            name: "1",
            action: "", //动作 action
                        // Action is the action
            asPathSetting: "", //as-path动作 as-path action
                               // As-path action
            asPathMatch: "", //as-path匹配 as-path matching
                             // As-path matches as-path matching
            bgpIplistIdMatch: "", //prefix list
            communityMatch: "", //community匹配 The community to match
                                // Community matches The Community to match
            communitySetting: "", //community动作 The community action
                                  // Community action The community action
            deviceId: this.deviceId,
            isChange: true,
            localPreference: "", //本地偏好 Local preferences
                                 // Local preferences Local Preferences
            nextHopIp: "", //下一跳地址 Next hop address
                           // Next hop Address
            priority: 0,
            metric: "", //Metric,
          },
        ],
        description: "",
        deviceId: this.deviceId,
        name: "",
        // bgpVrfId: sessionStorage.getItem("bgpVrfId")
      },
      lplist: [],
      communityList: [],
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
    //提交
    // submit
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let arr = this.ruleForm.formData.map((item) => {
            return {
              action: item.action, 
              asPathSetting: item.asPathSetting, 
              asPathMatch: item.asPathMatch, 
              bgpIplistIdMatch: item.bgpIplistIdMatch,
              communityMatch: item.communityMatch, 
              communitySetting: item.communitySetting,
              deviceId: this.deviceId,
              isChange: true,
              localPreference: item.localPreference, 
              nextHopIp: item.nextHopIp, 
              priority: 0,
              metric: item.metric, 
            };
          });
          let params = {
            bgpPolicySessionVoList: arr,
            description: this.ruleForm.description,
            deviceId: this.deviceId,
            name: this.ruleForm.name,
            // bgpVrfId: sessionStorage.getItem("bgpVrfId")
          };
          bgpPolicySave(params).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]"),
              });
              this.$parent.isShow = false;
              this.$refs[formName].resetFields();
              this.ruleForm = {
                formData: [
                  {
                    title: "Route_Map1",
                    name: "1",
                    action: "", 
                    asPathSetting: "", 
                    asPathMatch: "", 
                    bgpIplistIdMatch: "",
                    communityMatch: "",
                    communitySetting: "", 
                    deviceId: this.deviceId,
                    isChange: true,
                    localPreference: "", 
                    nextHopIp: "", 
                    priority: 0,
                    metric: "",
                  },
                ],
                description: "",
                deviceId: this.deviceId,
                name: "",
                // bgpVrfId: sessionStorage.getItem("bgpVrfId")
              };
              this.editableTabsValue = "1";
              this.tabIndex = 1;
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
              this.$refs[formName].resetFields();
              this.$parent.isShow = false;
              this.ruleForm = {
                formData: [
                  {
                    title: "Route_Map1",
                    name: "1",
                    action: "", 
                    asPathSetting: "", 
                    asPathMatch: "",
                    bgpIplistIdMatch: "", 
                    communityMatch: "", 
                    communitySetting: "",
                    deviceId: this.deviceId,
                    isChange: true,
                    localPreference: "", 
                    nextHopIp: "", 
                    priority: 0,
                    metric: "", 
                  },
                ],
                description: "",
                deviceId: this.deviceId,
                name: "",
                // bgpVrfId: sessionStorage.getItem("bgpVrfId")
              };
              this.editableTabsValue = "1";
              this.tabIndex = 1;
            }
          });
        }
      });
    },
    close() {
      this.$parent.isShow = false;
      this.$refs.form.resetFields();
      this.ruleForm = {
        formData: [
          {
            title: "Route_Map1",
            name: "1",
            action: "",
            asPathSetting: "", 
            asPathMatch: "",
            bgpIplistIdMatch: "", 
            communityMatch: "", 
            communitySetting: "", 
            deviceId: this.deviceId,
            isChange: true,
            localPreference: "", 
            nextHopIp: "", 
            priority: 0,
            metric: "", 
          },
        ],
        description: "",
        deviceId: this.deviceId,
        name: "",
        // bgpVrfId: sessionStorage.getItem("bgpVrfId")
      };
      this.editableTabsValue = "1";
      this.tabIndex = 1;
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
          action: "",
          asPathSetting: "", 
          asPathMatch: "", 
          bgpIplistIdMatch: "", 
          communityMatch: "",
          communitySetting: "", 
          deviceId: this.deviceId,
          isChange: true,
          localPreference: "", 
          nextHopIp: "",
          priority: 0,
          metric: "", 
        });
        this.editableTabsValue = newTabName;
      }
      if (action === "remove") {
        let tabs = this.ruleForm.formData;
        if (tabs.length > 1) {
          this.ruleForm.formData = tabs.filter(
            (tab) => tab.name !== targetName
          );
        }
        this.ruleForm.formData = this.ruleForm.formData.map((item, index) => {
          return {
            title: "Route_Map" + (index + 1),
            name: index + 1 + "",
            action: item.action, 
            asPathSetting: item.asPathSetting, 
            asPathMatch: item.asPathMatch, 
            bgpIplistIdMatch: item.bgpIplistIdMatch, 
            communityMatch: item.communityMatch, 
            communitySetting: item.communitySetting, 
            deviceId: item.deviceId,
            isChange: true,
            localPreference: item.localPreference, 
            nextHopIp: item.nextHopIp, 
            priority: 0,
            metric: item.metric,
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
      let el = document.querySelectorAll(".addRouteMApTabs .el-tabs__nav")[0];
      const _this = this;
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.ruleForm.formData.splice(oldIndex, 1)[0];
          _this.ruleForm.formData.splice(newIndex, 0, currRow);
        },
      });
    },
    dataInit(params) {
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
.addRouteMAp {
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
  margin-left:-505px;
  .formList {
    padding: 30px 30px 0 30px;
  }
  .actionName{
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
    background: #f4f8fe;
    outline: none;
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
.addRouteMAp {
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
.addRouteMAp .goDetail {
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