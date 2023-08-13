<template>
  <!-- 新增IPList -->
  <div class="addIpList">
    <div :class="lang=='en'? 'contentEn content' : 'content'">
      <h4 class="title">
        <span>{{$t('newModel.add')}}IPlist</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="lang=='en'? '90px' : '70px'"
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
          <!-- <div>IPlist的子项顺序的切换会影响下发的</div> -->
          <div class="tabsCon">
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              closable
              editable
              @edit="addTab"
              class="addIpListTabs"
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
                <el-form-item class="goDetail" :prop="'formData.'+index+'.any'">
                  <div class="open">
                    <el-checkbox v-model="item.any" @change="disableInp(item.any,index)"></el-checkbox>
                    <span>any</span>
                  </div>
                </el-form-item>
                <el-form-item
                  :label="$t('newModel.IPAddress')"
                  :prop="'formData.'+index+'.ip'"
                  :rules="[{
                  pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                  message: $t('vsr1000.greRule[2]')
                  }
                  ]"
                >
                  <el-input class="ipAddress" v-model="item.ip" :disabled="item.isDisabled"></el-input>
                  <span style="padding:0 15px">/</span>
                  <el-form-item
                    :prop="'formData.'+index+'.code'"
                    class="codeRule"
                    :rules="[codeRule]"
                  >
                    <el-input
                      v-model="item.code"
                      :disabled="item.isDisabled"
                      class="code"
                      @blur="ipRuleChange(item.ip,item.code,index)"
                    ></el-input>
                  </el-form-item>
                </el-form-item>
                <el-form-item label="ge" :prop="'formData.'+index+'.ge'" :rules="[geRule]">
                  <el-input v-model="item.ge" :disabled="item.isDisabled"></el-input>
                </el-form-item>
                <el-form-item label="le" :prop="'formData.'+index+'.le'" :rules="[leRule]">
                  <el-input v-model="item.le" :disabled="item.isDisabled"></el-input>
                </el-form-item>
                <div class="msg" @mouseover="nameHint">
                  <el-tooltip
                    placement="top"
                    :disabled="nameShow"
                    :content="$t('newModel.msg24')"
                  >
                    <div ref="msg">{{$t('newModel.msg24')}}</div>
                  </el-tooltip>
                </div>
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
import { bgpIpListSave, bgpIpListNameExist } from "@/services";
import Sortable from "sortablejs";
import { compare } from "@/utils/change";
export default {
  data() {
    var IprProRule = (rule, value, callback) => {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val >= 0 && val <= 32) {
            callback();
          } else {
            callback(new Error(this.$t("newModel.msg9")));
          }
        } else {
          callback(new Error(this.$t("newModel.msg7")));
        }
      } else {
        callback();
      }
    };
    var GeRule = (rule, value, callback) => {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val <= 32) {
            if (
              val > this.ruleForm.formData[this.editableTabsValue * 1 - 1].code
            ) {
              callback();
            } else {
              callback(new Error(this.$t("newModel.msg10")));
            }
          } else {
            callback(new Error(this.$t("newModel.msg11")));
          }
        } else {
          callback(new Error(this.$t("newModel.msg7")));
        }
      } else {
        callback();
      }
    };
    var LeRule = (rule, value, callback) => {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val <= 32) {
            if (
              val < this.ruleForm.formData[this.editableTabsValue * 1 - 1].ge
            ) {
              callback(new Error(this.$t("newModel.msg12")));
            } else if (
              val <= this.ruleForm.formData[this.editableTabsValue * 1 - 1].code
            ) {
              callback(new Error(this.$t("newModel.msg13")));
            } else {
              callback();
            }
          } else {
            callback(new Error(this.$t("newModel.msg14")));
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
        bgpIpListNameExist({
          deviceId: this.deviceId,
          checkName: value,
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
      lang: sessionStorage.getItem("lang") || "en",
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      ruleForm: {
        formData: [
          {
            title: "IP1",
            name: "1",
            action: "",
            ip: "",
            code: "",
            ge: "",
            le: "",
            deviceId: this.deviceId,
            priority: 0,
            isChange: true,
            any: false,
            isDisabled: false,
          },
        ],
        name: "",
        errorMessage: "",
        // bgpVrfId: sessionStorage.getItem("bgpVrfId"),
        deviceId: this.deviceId,
        description: "",
      },
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
      codeRule: { validator: IprProRule, trigger: "blur" },
      geRule: { validator: GeRule, trigger: "blur" },
      leRule: { validator: LeRule, trigger: "blur" },
      tabIndex: 1,
      editableTabsValue: "1",
      nameShow: false,
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let arr = this.ruleForm.formData.map((item) => {
            return {
              action: item.action,
              deviceId: this.deviceId,
              ge: item.ge,
              ip: item.any
                ? "any"
                : item.ip.length && item.code
                ? item.ip + "/" + item.code
                : "",
              isChange: true,
              le: item.le,
              priority: 0,
              any: item.any,
            };
          });
          let params = {
            bgpIpListSessionVoList: arr,
            description: this.ruleForm.description,
            deviceId: this.deviceId,
            name: this.ruleForm.name,
            // bgpVrfId: sessionStorage.getItem("bgpVrfId")
          };
          bgpIpListSave(params).then((res) => {
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
                    title: "IP1",
                    name: "1",
                    action: "",
                    ip: "",
                    code: "",
                    ge: "",
                    le: "",
                    deviceId: this.deviceId,
                    priority: 0,
                    isChange: true,
                    any: false,
                    isDisabled: false,
                  },
                ],
                name: "",
                // bgpVrfId: sessionStorage.getItem("bgpVrfId"),
                deviceId: this.deviceId,
                description: "",
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
                    title: "IP1",
                    name: "1",
                    action: "",
                    ip: "",
                    code: "",
                    ge: "",
                    le: "",
                    deviceId: this.deviceId,
                    priority: 0,
                    isChange: true,
                    any: false,
                    isDisabled: false,
                  },
                ],
                name: "",
                // bgpVrfId: sessionStorage.getItem("bgpVrfId"),
                deviceId: this.deviceId,
                description: "",
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
            title: "IP1",
            name: "1",
            action: "",
            ip: "",
            code: "",
            ge: "",
            le: "",
            deviceId: this.deviceId,
            priority: 0,
            isChange: true,
            any: false,
            isDisabled: false,
          },
        ],
        name: "",
        // bgpVrfId: sessionStorage.getItem("bgpVrfId"),
        deviceId: this.deviceId,
        description: "",
      };
      this.editableTabsValue = "1";
      this.tabIndex = 1;
    },
    addTab(targetName, action) {
      if (action === "add") {
        let newTabName = ++this.tabIndex + "";
        this.ruleForm.formData.push({
          title: "IP" + this.tabIndex,
          name: newTabName,
          action: "",
          ip: "",
          code: "",
          ge: "",
          le: "",
          deviceId: this.deviceId,
          priority: 0,
          isChange: true,
          any: false,
          isDisabled: false,
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
            title: "IP" + (index + 1),
            name: index + 1 + "",
            action: item.action,
            ip: item.ip,
            code: item.code,
            ge: item.ge,
            le: item.le,
            deviceId: this.deviceId,
            priority: item.priority,
            isChange: item.isChange,
            any: item.any,
            isDisabled: item.isDisabled,
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
      let el = document.querySelectorAll(".addIpListTabs .el-tabs__nav")[0];
      const _this = this;
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.ruleForm.formData.splice(oldIndex, 1)[0];
          _this.ruleForm.formData.splice(newIndex, 0, currRow);
        },
      });
    },
    //是否禁用
    // Whether to disable
    //Whether to disable
    disableInp(falg, index) {
      if (falg) {
        this.ruleForm.formData[index].isDisabled = true;
        this.ruleForm.formData[index].ip = "";
        this.ruleForm.formData[index].ge = "";
        this.ruleForm.formData[index].le = "";
        this.ruleForm.formData[index].code = "";
      } else {
        this.ruleForm.formData[index].isDisabled = false;
        this.ruleForm.formData[index].ip = "";
        this.ruleForm.formData[index].ge = "";
        this.ruleForm.formData[index].le = "";
        this.ruleForm.formData[index].code = "";
      }
    },
    //ip掩码转换
    // IP mask conversion
    //IP mask conversion
    ipRuleChange(val, code, index) {
      this.ruleForm.formData[index].ip = compare(val, code);
    },
    //名字超过提示
    // Name above prompt
    //Name above prompt
    nameHint() {
      let W = this.$refs.msg[0].offsetWidth;
      if (W >= 300) {
        this.nameShow = false;
      } else {
        this.nameShow = true;
      }
    },
  },
  mounted() {
    this.tabsDrop();
  },
};
</script>
<style scoped lang="scss">
.addIpList {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.content {
  width: 726px;
  height: 474px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -237px;
  margin-left: -363px;
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
  width: 762px;
  margin-left: -381px;
}
.formList {
  padding: 30px 30px 0 30px;
}
.submit {
  width: 100%;
  text-align: center;
  padding-top: 30px;
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
.open {
  padding-left: 70px;
  span {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-left: 10px;
  }
}
.msg {
  padding-left: 30px;
  display: inline-block;
  > div {
    max-width: 300px;
    line-height: 34px;
    // display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
<style lang="scss">
.addIpList {
  .el-input,
  .el-select {
    width: 240px;
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
    padding: 15px 0 4px 15px;
    // .el-input {
    //   width: 260px;
    // }
    .el-form-item {
      // margin-right: 15px;
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
  .ipAddress {
    width: 170px;
  }
  .code {
    width: 34px;
    height: 34px;
    .el-input__inner {
      padding: 0;
      text-align: center;
    }
  }
  .codeRule {
    .el-form-item__error {
      width: 200px;
      left: -200px;
    }
  }
}
</style>