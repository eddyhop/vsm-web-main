<template>
  <div class="addACL" v-show="isShow">
    <div class="context">
      <h4 class="title">
        <span>{{$t('vsr1000.add')}} ACL-IPV4</span>
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
          <el-form-item :label="$t('vsr1000.name')" prop="aclSessionName">
            <el-input v-model="ruleForm.aclSessionName" placeholder></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.describe')" prop="descr">
            <el-input v-model="ruleForm.descr" placeholder></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr100.static.port2')" prop="port">
            <el-select filterable v-model="ruleForm.port" :placeholder="$t('vsr1000.choose')">
              <el-option
                v-for="item in ruleForm.portOperation"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item :label="$t('vsr100.acl.direction')" prop="descr">
            <el-select filterable v-model="ruleForm.direction" :placeholder="$t('vsr1000.choose')">
              <el-option :label="$t('vsr100.acl.out')" value="2"></el-option>
              <el-option :label="$t('vsr100.acl.in')" value="1"></el-option>
              <el-option :label="$t('vsr1000.choose')" value="0"></el-option>
            </el-select>
          </el-form-item> -->
          <div class="tabsCon">
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              closable
              @tab-remove="removeTab"
              class="tabsList5"
            >
              <el-tab-pane
                v-for="(item,index) in ruleForm.editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
              >
                <el-form-item
                  :label="$t('vsr1000.action')"
                  :prop="`editableTabs[${index}].content.action`"
                  :rules="[{ required: true, message: $t('vsr1000.aclremind[7]'), trigger: 'change' }]"
                >
                  <el-select filterable v-model="item.content.action" :placeholder="$t('vsr1000.choose')">
                    <el-option
                      v-for="item in ActItem"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.apply')"
                  :prop="`editableTabs[${index}].content.appName`"
                >
                  <el-select filterable v-model="item.content.appName" :placeholder="$t('vsr1000.choose')">
                    <el-option label="any" value></el-option>
                    <el-option
                      v-for="item in AppNames"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.source1')"
                  :prop="`editableTabs[${index}].content.sourceIp`"
                  :rules="[
               
                  {
                    pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                    message:  $t('vsr1000.aclremind[11]')
                  }]"
                >
                  <el-input
                    v-model="item.content.sourceIp"
                    @blur="SourceIpChange(item.content.sourceIp,item.content.sourceMask,index)"
                    placeholder
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.maskLength')"
                  :prop="`editableTabs[${index}].content.sourceMask`"
                  :rules="[
                {pattern:/^(?:[0-9]|[1-2][0-9]?|3[0-2])$/, message: $t('vsr1000.aclremind[10]'),trigger: 'blur'},
                isIpExist
                ]"
                >
                  <el-input
                    v-model="item.content.sourceMask"
                    @blur="zhuanSourceIp(item.content.sourceIp,item.content.sourceMask,index)"
                    placeholder
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.dest1')"
                  :prop="`editableTabs[${index}].content.aimIp`"
                  :rules="[
                  {
                    pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                    message:  $t('vsr1000.aclremind[11]')
                  }]"
                >
                  <el-input
                    v-model="item.content.aimIp"
                    @blur="aimIpChange(item.content.aimIp,item.content.aimMask,index)"
                    placeholder
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.maskLength')"
                  :prop="`editableTabs[${index}].content.aimMask`"
                  :rules="[
                {pattern:/^(?:[0-9]|[1-2][0-9]?|3[0-2])$/, message: $t('vsr1000.aclremind[10]'),trigger: 'blur'},
                sourIsIpExist
                ]"
                >
                  <el-input
                    v-model="item.content.aimMask"
                    @blur="zhuanAimIp(item.content.aimIp,item.content.aimMask,index)"
                    placeholder
                  ></el-input>
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
  addAcl,
  // getActItem,
  getAppNames,
  getACLName,
  getDict,
} from "@/services";
import { compare } from "@/utils/change";
export default {
  props: {
    isShow: {
      type: Boolean,
    },
  },
  components: {},
  data() {
    var getACLNameRule = (rule, value, callback) => {
      if (value) {
        getACLName({
          verifyName: value,
          verifyScope: this.deviceId,
        }).then((res) => {
          if (res.code == 10000) {
            callback();
          } else {
            callback(new Error(this.$t("vsr1000.aclremind[12]")));
          }
        });
      }
    };
    var isIpExist = (rule, value, callback) => {
      if (value || value == 0) {
        if (
          this.ruleForm.editableTabs[this.editableTabsValue * 1 - 1].content
            .sourceIp.length
        ) {
          callback();
        } else {
          callback(new Error(this.$t("vsr1000.msg3")));
        }
      } else {
        if (
          this.ruleForm.editableTabs[this.editableTabsValue * 1 - 1].content
            .sourceIp.length
        ) {
          callback(new Error(this.$t("vsr100.acl.remind[14]")));
        } else {
          callback();
        }
      }
    };
    var sourIsIpExist = (rule, value, callback) => {
      if (value || value == 0) {
        if (
          this.ruleForm.editableTabs[this.editableTabsValue * 1 - 1].content
            .aimIp.length
        ) {
          callback();
        } else {
          callback(new Error(this.$t("vsr1000.msg3")));
        }
      } else {
        if (
          this.ruleForm.editableTabs[this.editableTabsValue * 1 - 1].content
            .aimIp.length
        ) {
          callback(new Error(this.$t("vsr100.acl.remind[14]")));
        } else {
          callback();
        }
      }
    };
    return {
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      ruleForm: {
        aclSessionName: "",
        descr: "",
        portOperation: [], //接口list   interface to the list
                           // List interface to the List
        port: "", //接口  port
                  // Interface port
        direction: "0", //方向  direction
                        // The direction of direction
        editableTabs: [
          {
            title: this.$t("vsr1000.aclremind[14]") + "1",
            name: "1",
            content: {
              //动作
              // action
              // action
              action: "",
              //目的地ip
              // Destination IP
              // Destination IP
              aimIp: "",
              //目的地掩码
              // Destination mask
              // Destination mask
              aimMask: null,
              //选择的应用
              // Application of choice
              // Selected applications
              appName: "",
              //源ip
              // The source IP
              //source IP
              sourceIp: "",
              //源掩码
              // Source mask
              // source mask
              sourceMask: null,
            },
          },
        ],
      },
      rules: {
        aclSessionName: [
          {
            required: true,
            message: this.$t("vsr1000.aclremind[8]"),
            trigger: "blur",
          },
          { validator: getACLNameRule, trigger: "blur" },
        ],
        port: [{ required: true, message: "请选择接口", trigger: "change" }],
        // aclSessionName: [
        //   { required: true, message: this.$t('vsr1000.aclremind[8]'), trigger: "change" },
        // ],
      },
      isIpExist: { validator: isIpExist, trigger: "blur" },
      sourIsIpExist: { validator: sourIsIpExist, trigger: "blur" },
      editableTabsValue: "1",
      ActItem: [],
      AppNames: [],
      tabIndex: 1,
    };
  },
  computed: {},
  methods: {
    //输入掩码源ip转换
    // Input mask source IP conversion
    // Input mask source IP conversion
    zhuanSourceIp(ip, code, index) {
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
    //输入源ip转换
    // Input source IP conversion
    // Input source IP conversion
    SourceIpChange(ip, code, index) {
      if (code != "") {
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
    //输入掩码目的地ip转换
    // Input mask destination IP conversion
    // Input mask destination IP conversion
    zhuanAimIp(ip, code, index) {
      if (ip.length) {
        let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.test(ip)) {
          if (code == 32) {
            return;
          } else {
            this.ruleForm.editableTabs[index].content.aimIp = compare(ip, code);
          }
        }
      }
    },
    //输入目的地ip转换
    // Enter the destination IP conversion
    // Input destination IP conversion
    aimIpChange(ip, code, index) {
      if (code != "") {
        let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.test(ip)) {
          if (code == 32) {
            return;
          } else {
            this.ruleForm.editableTabs[index].content.aimIp = compare(ip, code);
          }
        }
      }
    },
    close() {
      this.$parent.isShow = false;
      // console.log("123")
      this.ruleForm = {
        aclSessionName: "",
        descr: "",
        editableTabs: [
          {
            title: this.$t("vsr1000.aclremind[14]") + "1",
            name: "1",
            content: {
              action: "",

              aimIp: "",

              aimMask: null,

              appName: "",

              sourceIp: "",

              sourceMask: null,
            },
          },
        ],
      };
      this.editableTabsValue = "1";
      this.tabIndex = 1;
      this.$refs.form.resetFields();
    },
    submitForm(formName) {
      // console.log(this.$refs[formName]);
      let deviceId = this.deviceId;
      let arr = [];
      this.ruleForm.editableTabs.forEach((item, index) => {
        arr.push({
          action: item.content.action,
          destinationIp: item.content.aimIp,
          destinationIpMask: item.content.aimMask,
          appId: item.content.appName,
          sourceIp: item.content.sourceIp,
          sourceIpMask: item.content.sourceMask,
          sortOrder: index,
        });
      });
      let type = "";
      this.ruleForm.portOperation.map((item) => {
        if (item.id == this.ruleForm.port) {
          type = item.type;
        }
      });
      let data = {
        name: this.ruleForm.aclSessionName,
        description: this.ruleForm.descr,
        devAclStreamVoList: arr,
        deviceId,
        direction: this.ruleForm.direction,
        portType: type,
        portId: this.ruleForm.port,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)),
        type: 0,
      };
      // console.log(this.editableTabs);
      // console.log(data);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addAcl(data).then((res) => {
            // console.log(res);
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.aclremind[0]"),
              });
              this.ruleForm = {
                aclSessionName: "",
                descr: "",
                editableTabs: [
                  {
                    title: this.$t("vsr1000.aclremind[14]") + "1",
                    name: "1",
                    content: {
                      action: "",

                      aimIp: "",

                      aimMask: null,

                      appName: "",

                      sourceIp: "",

                      sourceMask: null,
                    },
                  },
                ],
              };
              this.tabIndex = 1;
              this.editableTabsValue = "1";
              this.$refs[formName].resetFields();
              this.$parent.isShow = false;
              this.$parent.getAclListInit({
                deviceId,
                page: this.$parent.lNumber,
                pageSize: this.$parent.Size,
                type: 0,
              });
            } else {
              this.$message({
                type: "warning",
                message: res.message,
              });
              this.ruleForm = {
                aclSessionName: "",
                descr: "",
                editableTabs: [
                  {
                    title: this.$t("vsr1000.aclremind[14]") + "1",
                    name: "1",
                    content: {
                      action: "",

                      aimIp: "",

                      aimMask: null,

                      appName: "",

                      sourceIp: "",

                      sourceMask: null,
                    },
                  },
                ],
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
        title: this.$t("vsr1000.aclremind[14]") + this.tabIndex,
        name: newTabName,
        content: {
          action: "",

          aimIp: "",

          aimMask: null,

          appName: "",

          sourceIp: "",

          sourceMask: null,
        },
      });
      this.editableTabsValue = newTabName;
      // this.addBtnPosition()
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
          (tab) => tab.name !== targetName
        );
      }
      // this.addBtnPosition()
    },
    tabsDrop() {
      let el = document.querySelectorAll(".tabsList5 .el-tabs__nav")[0];
      const _this = this;
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.ruleForm.editableTabs.splice(oldIndex, 1)[0];
          _this.ruleForm.editableTabs.splice(newIndex, 0, currRow);
        },
      });
    },
    async selectList() {
      // let data = await getDict({ groupCode: "acl", typeCode: "act" });
      let data2 = await getAppNames({
        tenantId: JSON.parse(this.$route.query.devData).tenantId,
        deviceId: this.deviceId,
      });
      this.ActItem = data2.result.actOperation;
      this.AppNames = data2.result.appOperation;
      this.ruleForm.portOperation = data2.result.portOperation;
    },
  },
  created() {},
  mounted() {
    // this.addBtnPosition()
    this.tabsDrop();
  },
};
</script>
<style scoped lang="scss">
.addACL {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.context {
  width: 942px;
  // height: 683px;
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
  padding: 30px 60px 30px 60px;
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
.tabsCon {
  width: auto;
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
</style>
<style lang="scss">
.addACL {
  .el-input {
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
  .el-form-item__label {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .el-textarea {
    width: 300px;
    height: 34px;
    .el-textarea__inner {
      height: 100%;
      border-radius: 7px;
    }
  }
  .el-tabs__header {
    margin-bottom: 0;
    border: 0;
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
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: 0;
  }
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
  .el-tabs__content {
    background: #f4f8fe;
    padding-top: 26px;
    padding-left: 40px;
    .el-input {
      width: 260px;
    }
    .el-form-item {
      margin-right: 18px;
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
    border: 1px solid rgba(213, 219, 227, 1);
  }

  .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
    border-left: 1px solid rgba(213, 219, 227, 1);
  }
}
// .addACL .tabsCon .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll {
//   padding: 0;
// }
// .addACL .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav {
//   height: auto;
//   line-height: 40px;
//   width: auto;
// }
// .addACL .tabsCon .el-tabs__content .el-tab-pane {
//   width: 1100px;
//   height: auto;
//   background: rgba(250, 250, 250, 1);
//   padding: 40px 0 40px 74px;
//   display: flex;
//   flex-wrap: wrap;
//   .el-input {
//     width: 320px;
//     height: 40px;
//   }
// }
</style>