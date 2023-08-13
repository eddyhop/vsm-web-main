<template>
  <!-- 编辑IPList -->
  <div class="editIpList">
    <div :class="lang=='en'? 'contentEn content' : 'content'">
      <h4 class="title">
        <span>{{$t('newModel.edit')}}IPlist</span>
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
          <div class="tabsCon">
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              closable
              editable
              @edit="addTab"
              class="editIpListTabs"
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
                  <el-tooltip placement="top" :disabled="nameShow" :content="$t('newModel.msg24')">
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
import {
  bgpIpListSave,
  bgpIpListDelBgpIpListSession,
  bgpIpListNameExist,
} from "@/services";
import Sortable from "sortablejs";
export default {
  data() {
    var IprProRule = (rule, value, callback) => {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val >= 1 && val <= 32) {
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
          bgpIpListId: this.ruleForm.id,
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
            any: false,
            bgpIplistId: "",
            deviceId: "",
            ge: "",
            id: "",
            ip: "",
            code: "",
            isChange: true,
            le: "",
            priority: 0,
            isDisabled: false,
          },
        ],
        description: "",
        deviceId: "",
        id: "",
        name: "",
        // bgpVrfId: ""
      },
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
          let arr = this.setParamsData().map((item) => {
            return {
              action: item.action,
              any: item.any,
              bgpIplistId: item.bgpIplistId,
              deviceId: item.deviceId,
              ge: item.ge,
              id: item.id,
              ip: item.any
                ? "any"
                : item.ip.length && item.code
                ? item.ip + "/" + item.code
                : "",
              isChange: item.isChange,
              le: item.le,
              priority: item.priority,
            };
          });
          let params = {
            bgpIpListSessionVoList: arr,
            description: this.ruleForm.description,
            deviceId: this.deviceId,
            name: this.ruleForm.name,
            id: this.ruleForm.id,
            // bgpVrfId: sessionStorage.getItem("bgpVrfId")
          };
          bgpIpListSave(params).then((res) => {
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
    addTab(targetName, action) {
      if (action === "add") {
        let newTabName = ++this.tabIndex + "";
        this.ruleForm.formData.push({
          title: "IP" + this.tabIndex,
          name: newTabName,
          action: "",
          any: false,
          bgpIplistId: "",
          deviceId: "",
          ge: "",
          id: "",
          ip: "",
          code: "",
          isChange: true,
          le: "",
          priority: 0,
          isDisabled: false,
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
            bgpIpListDelBgpIpListSession({
              deviceId: this.deviceId,
              bgpIpListSessionId: id,
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
            title: "IP" + (index + 1),
            name: index + 1 + "",
            action: item.action,
            any: item.any,
            bgpIplistId: item.bgpIplistId,
            deviceId: item.deviceId,
            ge: item.ge,
            id: item.id,
            ip: item.ip,
            code: item.code,
            isChange: item.isChange,
            le: item.le,
            priority: item.priority,
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
      let el = document.querySelectorAll(".editIpListTabs .el-tabs__nav")[0];
      const _this = this;
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.ruleForm.formData.splice(oldIndex, 1)[0];
          _this.ruleForm.formData.splice(newIndex, 0, currRow);
        },
      });
    },
    dataInit(row) {
      let arr = row.bgpIpListSessionVoList.map((item, index) => {
        return {
          title: "IP" + (index + 1),
          name: index + 1 + "",
          action: item.action,
          any: item.any,
          bgpIplistId: item.bgpIplistId,
          deviceId: item.deviceId,
          ge: item.ge,
          id: item.id,
          ip: item.ip.split("/")[0],
          code: item.ip.split("/")[1],
          isChange: item.isChange,
          le: item.le,
          priority: item.priority,
          isChange: false,
          isDisabled: item.any ? true : false,
        };
      });
      this.ruleForm.formData = arr;
      this.tabIndex = arr.length;
      this.ruleForm.description = row.description;
      this.ruleForm.deviceId = row.deviceId;
      this.ruleForm.id = row.id;
      this.ruleForm.name = row.name;
      // this.ruleForm.bgpVrfId = row.bgpVrfId;
    },
    //保存编辑数据
    // Save edit data
    //Save edit data
    saveEditData(row) {
      let arr = row.bgpIpListSessionVoList.map((item, index) => {
        return {
          title: "IP" + (index + 1),
          name: index + 1 + "",
          action: item.action,
          any: item.any,
          bgpIplistId: item.bgpIplistId,
          deviceId: item.deviceId,
          ge: item.ge,
          id: item.id,
          ip: item.ip == "" ? "" : item.ip.split("/")[0],
          code: item.ip == "" ? "" : item.ip.split("/")[1],
          isChange: item.isChange,
          le: item.le,
          priority: item.priority,
          isChange: false,
          isDisabled: item.any ? true : false,
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
    //是否禁用
    // Whether to disable
    //Whether to disable
    disableInp(falg, index) {
      if (falg) {
        this.ruleForm.formData[index].isDisabled = true;
        this.ruleForm.formData[index].ip = "";
        this.ruleForm.formData[index].ge = "";
        this.ruleForm.formData[index].le = "";
      } else {
        this.ruleForm.formData[index].isDisabled = false;
        this.ruleForm.formData[index].ip = "";
        this.ruleForm.formData[index].ge = "";
        this.ruleForm.formData[index].le = "";
      }
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
.editIpList {
  width: 100%;
  height: 100%;
  position: absolute;
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
.editIpList {
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