<template>
  <!-- 编辑Community -->
  <div class="editCommunity">
    <div class="content">
      <h4 class="title">
        <span>{{$t('newModel.edit')}}Community</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          label-width="60px"
          class="demo-ruleForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item :label="$t('vsr1000.name')" prop="name" style="paddingRight:20px">
            <el-input v-model="ruleForm.name" placeholder></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.describe')" prop="description" label-width="80px">
            <el-input v-model="ruleForm.description" placeholder></el-input>
          </el-form-item>
          <el-form-item :label="$t('newModel.type')" prop="type">
            <el-select filterable v-model="ruleForm.type">
              <el-option label="expanded" value="expanded"></el-option>
              <el-option label="standard" value="standard"></el-option>
            </el-select>
          </el-form-item>
          <div class="tabsCon">
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              closable
              editable
              @edit="addTab"
              class="editCommunityTabs"
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
                  :rules="[{ required: true, message: $t('newModel.msg4'), trigger: 'change' }]"
                >
                  <el-select filterable v-model="item.action">
                    <el-option label="permit" value="permit"></el-option>
                    <el-option label="deny" value="deny"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="$t('newModel.value')"
                  :prop="'formData.'+index+'.value'"
                  :rules="!item.dis ? [valueRule] : []"
                >
                  <el-input v-model="item.value" v-if="item.inpShow" :disabled="item.dis"></el-input>
                  <div v-else>
                    <el-form-item
                      :prop="'formData.'+index+'.nValue1'"
                      :rules="[nValue1Rule]"
                      class="value1"
                    >
                      <el-input class="valForN" v-model="item.nValue1"></el-input>
                    </el-form-item>
                    <span style="padding:0 15px">:</span>
                    <el-form-item
                      :prop="'formData.'+index+'.nValue2'"
                      :rules="[nValue2Rule]"
                      class="value2"
                    >
                      <el-input class="valForN" v-model="item.nValue2"></el-input>
                    </el-form-item>
                  </div>
                </el-form-item>
                <el-form-item
                  :label="$t('newModel.format')"
                  :prop="'formData.'+index+'.setting'"
                  :rules="[{ required: true, message: $t('newModel.msg4'), trigger: 'change' }]"
                >
                  <el-select filterable v-model="item.setting" @change="setChange(item.setting,index)">
                    <el-option
                      v-for="item in rangrList"
                      :key="item.num"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
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
  bgpCommunityGetCommunitySetting,
  bgpCommunitySave,
  bgpCommunityDelBgpCommunitySession,
  bgpCommunityNameExist,
} from "@/services";
export default {
  data() {
    var portRules = (rule, value, callback) => {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val >= 1 && val <= 65535) {
            callback();
          } else {
            callback(new Error(this.$t("newModel.msg16")));
          }
        } else {
          callback(new Error(this.$t("newModel.msg7")));
        }
      }
    };
    var valuesRule = (rule, value, callback) => {
      // console.log(this.ruleForm.formData[this.editableTabsValue * 1 - 1].dis)
      // if (this.ruleForm.formData[this.editableTabsValue * 1 - 1].dis) {
      //   callback();
      // } else {
      let val = value * 1;
      let reg = /^[0-9]*$/;
      if (reg.test(val)) {
        if (val >= 0 && val <= 4294967296) {
          callback();
        } else {
          callback(new Error(this.$t("newModel.msg15")));
        }
      } else {
        callback(new Error(this.$t("newModel.msg7")));
      }
      // }
    };
    var nameRule = (rule, value, callback) => {
      if (value) {
        bgpCommunityNameExist({
          deviceId: this.deviceId,
          checkName: value,
          bgpCommunityId: this.ruleForm.id,
          // bgpVrfId: sessionStorage.getItem("bgpVrfId")
        }).then((res) => {
          if (res.code === 10000) {
            callback();
          } else {
            callback(this.$t("newModel.msg6"));
          }
        });
      }
    };
    return {
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      ruleForm: {
        formData: [
          {
            title: "COM1",
            name: "1",
            action: "",
            deviceId: this.deviceId,
            setting: "",
            id: "",
            bgpCommunityId: "",
            value: "",
            nValue1: "",
            nValue2: "",
            inpShow: true,
            dis: true,
          },
        ],
        description: "",
        deviceId: this.deviceId,
        name: "",
        id: "",
        type: "",
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
        type: [
          {
            required: true,
            message: this.$t("newModel.msg4"),
            trigger: "change",
          },
        ],
      },
      valueRule: { validator: valuesRule, trigger: "blur" },
      nValue1Rule: { validator: portRules, trigger: "blur" },
      nValue2Rule: { validator: portRules, trigger: "blur" },
      tabIndex: 1,
      rangrList: [],
      editableTabsValue: "1",
    };
  },
  methods: {
    //submit
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let arr = this.setParamsData().map((item) => {
            return {
              action: item.action,
              bgpCommunityId: item.bgpCommunityId,
              deviceId: item.deviceId,
              id: item.id,
              setting: item.setting,
              value: item.inpShow
                ? item.value + ""
                : item.nValue1 + ":" + item.nValue2,
            };
          });
          let params = {
            bgpCommunitySessionVoList: arr,
            description: this.ruleForm.description,
            deviceId: this.ruleForm.deviceId,
            id: this.ruleForm.id,
            name: this.ruleForm.name,
            type: this.ruleForm.type,
            // bgpVrfId: this.ruleForm.bgpVrfId
          };
          bgpCommunitySave(params).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]"),
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
          title: "COM" + this.tabIndex,
          name: newTabName,
          action: "",
          deviceId: this.deviceId,
          setting: "",
          id: "",
          bgpCommunityId: "",
          value: "",
          nValue1: "",
          nValue2: "",
          inpShow: true,
          dis: true,
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
            bgpCommunityDelBgpCommunitySession({
              deviceId: this.deviceId,
              bgpCommunitySessionId: id,
            }).then((res) => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.qosremind[5]"),
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
            title: "COM" + (index + 1),
            name: index + 1 + "",
            action: item.action,
            deviceId: this.deviceId,
            setting: item.setting,
            id: item.id,
            bgpCommunityId: item.bgpCommunityId,
            value: item.value,
            nValue1: item.nValue1,
            nValue2: item.nValue2,
            inpShow: item.inpShow,
            dis: item.dis,
          };
        });
        this.tabIndex = this.ruleForm.formData.length;
        this.editableTabsValue = this.tabIndex + "";
      }
    },
    //编辑数据获取
    // Edit data acquisition
    //Edit data acquisition
    dataInit(row) {
      bgpCommunityGetCommunitySetting().then((res) => {
        if (res.code === 10000) {
          this.rangrList = res.result;
        }
      });
      let arr = row.bgpCommunitySessionVoList.map((item, index) => {
        return {
          title: "COM" + (index + 1),
          name: index + 1 + "",
          action: item.action,
          bgpCommunityId: item.bgpCommunityId,
          deviceId: item.deviceId,
          id: item.id,
          setting: item.setting,
          value: item.setting == "AA:NN" ? "" : item.value,
          nValue1: item.setting == "AA:NN" ? item.value.split(":")[0] : "",
          nValue2: item.setting == "AA:NN" ? item.value.split(":")[1] : "",
          inpShow: item.setting == "AA:NN" ? false : true,
          dis: item.setting == "NNNN" ? false : true,
        };
      });
      this.ruleForm.formData = arr;
      this.tabIndex = arr.length;
      this.ruleForm.description = row.description;
      this.ruleForm.deviceId = row.deviceId;
      this.ruleForm.id = row.id;
      this.ruleForm.name = row.name;
      this.ruleForm.type = row.type;
      // this.ruleForm.bgpVrfId = row.bgpVrfId;
    },
    //保存编辑数据
    // Save edit data
    //Save edit data
    saveEditData(row) {
      let arr = row.bgpCommunitySessionVoList.map((item, index) => {
        return {
          title: "COM" + (index + 1),
          name: index + 1 + "",
          action: item.action,
          bgpCommunityId: item.bgpCommunityId,
          deviceId: item.deviceId,
          id: item.id,
          setting: item.setting,
          value: item.value,
          value: item.setting == "AA:NN" ? "" : item.value,
          nValue1: item.setting == "AA:NN" ? item.value.split(":")[0] : "",
          nValue2: item.setting == "AA:NN" ? item.value.split(":")[1] : "",
          inpShow: item.setting == "AA:NN" ? false : true,
          dis: item.setting == "NNNN" ? false : true,
        };
      });
      this.formDataArr = arr;
    },
    //下发数据封装
    // Release data encapsulation
    //Release data encapsulation
    setParamsData() {
      let data1 = this.ruleForm.formData;
      let data2 = this.formDataArr;
      let paramsArr = [];
      data1.forEach((item, index) => {
        let bgpItem = data2.find((el) => el.id == item.id);
        if (bgpItem) {
          if (this.isObjectValueEqual(item, bgpItem)) {
            paramsArr.push(item);
          } else {
            paramsArr = [...paramsArr];
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
    //格式改变
    // Format change
    //Format change
    setChange(val, index) {
      if (val == "AA:NN") {
        this.ruleForm.formData[index].inpShow = false;
      } else if (val == "NNNN") {
        this.ruleForm.formData[index].inpShow = true;
        this.ruleForm.formData[index].dis = false;
        this.ruleForm.formData[index].value = "";
      } else {
        this.ruleForm.formData[index].inpShow = true;
        this.ruleForm.formData[index].dis = true;
        this.ruleForm.formData[index].value = val;
      }
    },
  },
  mounted() {},
};
</script>
<style scoped lang="scss">
.editCommunity {
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
  height: 469px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -234.5px;
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
</style>
<style lang="scss">
.editCommunity {
  .el-input,
  .el-select {
    width: 250px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .valForN {
    width: 100px;
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
  .value1,
  .value2 {
    .el-form-item__error {
      white-space: nowrap;
    }
  }
}
</style>