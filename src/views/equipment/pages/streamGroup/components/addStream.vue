<template>
  <div class="addStream" v-show="isShow">
    <div class="context">
      <h4 class="title">
        <span>{{$t('vsr1000.add')}} {{$t('vsr1000.flowGroup')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          label-width="auto"
          class="demo-ruleForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item :label="$t('vsr1000.name')" prop="name">
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
              @tab-remove="removeTab"
              class="tabsList1"
            >
              <el-tab-pane
                v-for="(item,index) in ruleForm.editableTabs"
                :key="index"
                :label="item.title"
                :name="item.name"
              >
                <!-- {{item.content}} -->

                <el-form-item
                  :label="$t('vsr1000.sourceIP')"
                  :prop="`editableTabs[${index}].content.sourceIp`"
                  :rules="[{ required: true, message: $t('vsr1000.greRule[1]'), trigger: 'blur' },
                  {
                    pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                    message: $t('vsr1000.greRule[2]')
                  }]"
                >
                  <el-input
                    v-model="item.content.sourceIp"
                    @blur="zhuanBusourceIpChnage(item.content.sourceIp,item.content.sourceIpMask,index)"
                    placeholder
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.maskLength')"
                  :prop="`editableTabs[${index}].content.sourceIpMask`"
                  :rules="[{ required: true, message: $t('vsr1000.remind2[4]'), trigger: 'blur' },
                {type:'number',message:$t('vsr1000.remind2[10]')},
                {pattern:/^(?:[0-9]|[1-2][0-9]?|3[0-2])$/, message:$t('vsr1000.remind2[11]'),trigger: 'blur'},
                ]"
                >
                  <el-input
                    v-model.number="item.content.sourceIpMask"
                    @blur="busourceIpChnage(item.content.sourceIp,item.content.sourceIpMask,index)"
                    placeholder
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.destIP')"
                  :prop="`editableTabs[${index}].content.destinationIp`"
                  :rules="[{ required: true, message: $t('vsr1000.greRule[1]'), trigger: 'blur' },
                  {
                    pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                    message: $t('vsr1000.greRule[2]')
                  }]"
                >
                  <el-input
                    v-model="item.content.destinationIp"
                    @blur="zhuanDestinationIpChnage(item.content.destinationIp,item.content.destinationIpMask,index)"
                    placeholder
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.maskLength')"
                  :prop="`editableTabs[${index}].content.destinationIpMask`"
                  :rules="[{ required: true, message: $t('vsr1000.remind2[4]'), trigger: 'blur' },
                {type:'number',message:$t('vsr1000.remind2[10]')},
                {pattern:/^(?:[0-9]|[1-2][0-9]?|3[0-2])$/, message:$t('vsr1000.remind2[11]'),trigger: 'blur'},
                ]"
                >
                  <el-input
                    v-model.number="item.content.destinationIpMask"
                    @blur="destinationIpChnage(item.content.destinationIp,item.content.destinationIpMask,index)"
                    placeholder
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.apply')"
                  :prop="`editableTabs[${index}].content.appId`"
                  :rules="[{ required: true, message: $t('vsr1000.remind2[3]'), trigger: 'change' }]"
                >
                  <el-select filterable v-model="item.content.appId" :placeholder="$t('vsr1000.choose')">
                    <el-option
                      v-for="item in appList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
            <div id="addBtn">
              <el-button size="small" @click.prevent="addTab(editableTabsValue)">+</el-button>
            </div>
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
import Sortable from "sortablejs";
import {
  // addStream,
  // toAddStream,
  // isSgNamExit,
  streamToAddOrEdit,
  streamIsNameExist,
  streamSaveOrFlush
} from "@/services";
import { compare } from "@/utils/change";
export default {
  props: {
    isShow: {
      type: Boolean
    }
  },
  components: {},
  data() {
    var sgNameExit = (rule, value, callback) => {
      if (value) {
        streamIsNameExist({
          verifyName: value,
          verifyScope: JSON.parse(this.$route.query.devData).deviceId,
          verifyId: ""
        }).then(res => {
          if (!res.success) {
            callback(new Error(this.$t("vsr1000.greRule[7]")));
          } else {
            callback();
          }
        });
      }
    };
    return {
      ruleForm: {
        name: "",
        description: "",
        editableTabs: [
          {
            title: this.$t("vsr1000.stream") + "1",
            name: "1",
            content: {
              destinationIp: "",
              appId: "",
              id: "",
              sourceIpMask: null,
              destinationIpMask: null,
              sourceIp: "",
              streamGroupId: ""
            }
          }
        ]
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[0]"),
            trigger: "blur"
          },
          { validator: sgNameExit, trigger: "blur" }
        ]
      },
      editableTabsValue: "1",
      appList: [],
      tabIndex: 1
    };
  },
  computed: {},
  methods: {
    zhuanBusourceIpChnage(ip, code, index) {
      console.log(code);
      if (code != null) {
        let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.test(ip)) {
          if (code == 32) {
            return;
          } else {
            this.ruleForm.editableTabs[index].content.sourceIp = compare(
              ip,
              code
            );
          }
        }
      }
    },
    busourceIpChnage(ip, code, index) {
      if (ip.length) {
        let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.test(ip)) {
          if (code == 32) {
            return;
          } else {
            this.ruleForm.editableTabs[index].content.sourceIp = compare(
              ip,
              code
            );
          }
        }
      }
    },
    zhuanDestinationIpChnage(ip, code, index) {
      if (code != null) {
        let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.test(ip)) {
          if (code == 32) {
            return;
          } else {
            this.ruleForm.editableTabs[index].content.destinationIp = compare(
              ip,
              code
            );
          }
        }
      }
    },
    destinationIpChnage(ip, code, index) {
      if (ip.length) {
        let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.test(ip)) {
          if (code == 32) {
            return;
          } else {
            this.ruleForm.editableTabs[index].content.destinationIp = compare(
              ip,
              code
            );
          }
        }
      }
    },
    close() {
      this.$parent.isShow = false;
      this.ruleForm = {
        name: "",
        description: "",
        editableTabs: [
          {
            title: this.$t("vsr1000.stream") + "1",
            name: "1",
            content: {
              destinationIp: "",
              appId: "",
              id: "",
              sourceIpMask: null,
              destinationIpMask: null,
              sourceIp: "",
              streamGroupId: ""
            }
          }
        ]
      };
      this.tabIndex = 1;
      this.editableTabsValue = "1";
      this.$refs.form.resetFields();
    },
    submitForm(formName) {
      // console.log(this.$refs[formName]);
      let deviceId = JSON.parse(this.$route.query.devData).deviceId;
      let arr = [];
      this.ruleForm.editableTabs.forEach((item, index) => {
        arr.push({
          //目的地ip
          // Destination IP
          destinationIp: item.content.destinationIp,
          //选择应用
          // Choose to apply
          appId: item.content.appId,
          id: item.content.id,
          //源ip掩码
          // The source IP mask
          sourceIpMask: item.content.sourceIpMask + "",
          //目的ip掩码
          // Destination IP mask
          destinationIpMask: item.content.destinationIpMask + "",
          //源ip
          // The source IP
          sourceIp: item.content.sourceIp,
          //流关联的流组id
          // The stream group ID associated with the stream
          streamGroupId: item.content.streamGroupId,
          sortOrder: index
        });
      });
      let data = {
        description: this.ruleForm.description,
        deviceId,
        id: "",
        name: this.ruleForm.name,
        streamVoList: arr
      };
      // console.log(data);
      this.$refs[formName].validate(valid => {
        if (valid) {
          streamSaveOrFlush(data).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[0]")
              });
              this.ruleForm = {
                name: "",
                description: "",
                editableTabs: [
                  {
                    title: this.$t("vsr1000.stream") + "1",
                    name: "1",
                    content: {
                      destinationIp: "",
                      appId: "",
                      id: "",
                      sourceIpMask: null,
                      destinationIpMask: null,
                      sourceIp: "",
                      streamGroupId: ""
                    }
                  }
                ]
              };
              this.tabIndex = 1;
              this.editableTabsValue = "1";
              this.$refs[formName].resetFields();
              this.$parent.isShow = false;
              this.$parent.getStreamListInit({
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageNumber: this.$parent.lNumber,
                pageSize: this.$parent.Size,
                tenantId: JSON.parse(this.$route.query.devData).tenantId
              });
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
              this.ruleForm = {
                name: "",
                description: "",
                editableTabs: [
                  {
                    title: this.$t("vsr1000.stream") + "1",
                    name: "1",
                    content: {
                      destinationIp: "",
                      appId: "",
                      id: "",
                      sourceIpMask: null,
                      destinationIpMask: null,
                      sourceIp: "",
                      streamGroupId: ""
                    }
                  }
                ]
              };
              this.tabIndex = 1;
              this.editableTabsValue = "1";
              this.$refs[formName].resetFields();
              this.$parent.isShow = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addTab(targetName) {
      let newTabName = ++this.tabIndex + "";
      this.ruleForm.editableTabs.push({
        title: this.$t("vsr1000.stream") + this.tabIndex,
        name: newTabName,
        content: {
          destinationIp: "",
          appId: "",
          id: "",
          sourceIpMask: null,
          destinationIpMask: null,
          sourceIp: "",
          streamGroupId: ""
        }
      });
      this.editableTabsValue = newTabName;
    },
    removeTab(targetName) {
      let tabs = this.ruleForm.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      if (tabs.length > 1) {
        this.ruleForm.editableTabs = tabs.filter(
          tab => tab.name !== targetName
        );
      }
    },
    tabsDrop() {
      let el = document.querySelectorAll(".tabsList1 .el-tabs__nav")[0];
      // console.log(el);
      const _this = this;
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.ruleForm.editableTabs.splice(oldIndex, 1)[0];
          _this.ruleForm.editableTabs.splice(newIndex, 0, currRow);
        }
      });
    },
    filterSelect(data){
      let arr =[]
      let item = Object.entries(data)
      item.map(el=>{
        arr.push({id:el[0],name:el[1]})
      })
      return arr
    },
    async dataInit(params) {
      let tenantId = JSON.parse(this.$route.query.devData).tenantId;
      let ying = await streamToAddOrEdit({
        tenantId: tenantId ? tenantId : ""
      });
      // 后台太懒了  不给包数据
      // The background is too lazy to package the data
      this.appList = this.filterSelect(ying.result);
    }
  },
  created() {
    let lang = sessionStorage.getItem("lang")
  },
  mounted() {
    // this.tabsDrop();
  }
};
</script>
<style scoped lang="scss">
.addStream {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background:rgba(32,42,59,0.2);
  z-index: 100;
}
.context {
  width: 942px;
  min-height: 474px;
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
.event {
  padding: 30px 60px 20px 60px;
}
.tabsCon {
  position: relative;
  #addBtn {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 0;
    left: -38px;
    > button {
      width: 100%;
      height: 100%;
      line-height: 30px;
      border: 0;
      font-size: 34px;
      padding: 0;
    }
  }
}
.submit {
  width: 100%;
  padding-top: 30px;
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
  .save:hover {
    background: #6095d6;
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
}
</style>
<style lang="scss">
.addStream {
  .el-input {
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
  .el-form-item__label {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .el-textarea {
    width: 290px;
    height: 34px;
    .el-textarea__inner {
      height: 100%;
      border-radius: 7px;
    }
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
    padding-top: 26px;
    padding-left: 35px;
    .el-input {
      width: 260px;
    }
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
  }
}
</style>