<template>
  <div class="editQOS">
    <div :class="`context ${lang=='en'?'contextEn':''}`">
      <h4 class="title">
        <span>{{ruleForm.name}}{{this.$t("vsr1000.details")}}</span>
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
          <el-form-item :label="$t('vsr1000.name')" prop="name" class="formItem">
            <el-input v-model="ruleForm.name" placeholder disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.describe')" prop="description" class="formItem">
            <el-input v-model="ruleForm.description" placeholder disabled></el-input>
          </el-form-item>

          <div class="tabsCon">
            <el-tabs v-model="editableTabsValue" type="card" closable class="tabsList4">
              <el-tab-pane
                v-for="(item,index) in ruleForm.editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
              >
                <el-form-item
                  :label="$t('vsr1000.flowGroup')"
                  :prop="`editableTabs[${index}].content.streamTableId`"
                >
                  <el-select filterable v-model="item.content.streamTableId" :placeholder="$t('vsr1000.choose')" disabled>
                    <el-option
                      v-for="item in sgList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.strategyItem')"
                  :prop="`editableTabs[${index}].content.strategyPro`"
                >
                  <el-select filterable v-model="item.content.strategyPro" placeholder="policer" disabled>
                    <el-option label="路由域1" value="shanghai"></el-option>
                    <el-option label="路由域2" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="CIR(Kbps)"
                  :prop="`editableTabs[${index}].content.commitmentRate`"
                >
                  <el-input
                    v-model="item.content.commitmentRate"
                    @change="inpIndex(index)"
                    placeholder
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="CBS(Byte)"
                  :prop="`editableTabs[${index}].content.commitmentBurst`"
                >
                  <el-input
                    v-model="item.content.commitmentBurst"
                    @change="inpIndex(index)"
                    placeholder
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="PIR(Kbps)"
                  :prop="`editableTabs[${index}].content.peakRate`"
                >
                  <el-input v-model="item.content.peakRate" @change="inpIndex(index)" placeholder disabled></el-input>
                </el-form-item>
                <el-form-item
                  label="PBS(Byte)"
                  :prop="`editableTabs[${index}].content.peakBurst`"
                >
                  <el-input v-model="item.content.peakBurst" @change="inpIndex(index)" placeholder disabled></el-input>
                </el-form-item>
                <el-form-item
                  label="conform-action"
                  :prop="`editableTabs[${index}].content.conformAction`"
                >
                  <el-select filterable
                    v-model="item.content.conformAction"
                    @change="disDscp(item.content.conformAction,'dscp1',index)"
                    :placeholder="$t('vsr1000.choose')"
                    disabled
                  >
                    <el-option
                      v-for="item in actList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="DSCP" prop="item.content.conformActionDscp">
                  <el-select filterable
                    v-model="item.content.conformActionDscp"
                    :placeholder="$t('vsr1000.choose')"
                    disabled
                  >
                    <el-option
                      v-for="item in dscpList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="exceed-action"
                  :prop="`editableTabs[${index}].content.exceedAction`"
                >
                  <el-select filterable
                    v-model="item.content.exceedAction"
                    @change="disDscp(item.content.exceedAction,'dscp2',index)"
                    :placeholder="$t('vsr1000.choose')"
                    disabled
                  >
                    <el-option
                      v-for="item in actList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="DSCP" prop="item.content.exceedActionDscp">
                  <el-select filterable
                    v-model="item.content.exceedActionDscp"
                    :placeholder="$t('vsr1000.choose')"
                    disabled
                  >
                    <el-option
                      v-for="item in dscpList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="violate-action"
                  :prop="`editableTabs[${index}].content.violateAction`"
                >
                  <el-select filterable
                    v-model="item.content.violateAction"
                    @change="disDscp(item.content.violateAction,'dscp3',index)"
                    :placeholder="$t('vsr1000.choose')"
                    disabled
                  >
                    <el-option
                      v-for="item in actList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="DSCP" prop="item.content.violateActionDscp">
                  <el-select filterable
                    v-model="item.content.violateActionDscp"
                    :placeholder="$t('vsr1000.choose')"
                    disabled
                  >
                    <el-option
                      v-for="item in dscpList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
            <!-- <div id="addBtn">
              <el-button size="small" @click.prevent="addTab(editableTabsValue)">+</el-button>
            </div>-->
          </div>
          <!-- <div class="submit">
            <button
              class="save"
              type="primary"
              v-debounce.prevent="submitForm"
            >{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div>-->
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import Sortable from "sortablejs";
import {
  // editQos,
  // toAddQos,
  // isQosNamExit,
  qosIsNameExist,
  qosToAddOrEdit,
  qosSaveOrFlush
} from "@/services";
var changeCir = (rule, value, callback) => {
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error("请输入数字值"));
    } else {
      if (value < 0) {
        callback(new Error("请输入正增数"));
      } else {
        callback();
      }
    }
  }, 1000);
};
export default {
  props: {},
  components: {},
  data() {
    var changeCir = (rule, value, callback) => {
      let val = value * 1;
      if (!Number.isInteger(val)) {
        callback(new Error("请输入数字值"));
      } else if (val < 0) {
        callback(new Error("请输入正整数"));
      } else {
        callback();
      }
    };
    var changeCBS = (rule, value, callback) => {
      let val = value * 1;
      if (!Number.isInteger(val)) {
        callback(new Error("请输入数字值"));
      } else if (val < 0) {
        callback(new Error("请输入正整数"));
      } else {
        callback();
      }
    };
    var changePIR = (rule, value, callback) => {
      let val = value * 1;
      let cirVal =
        this.ruleForm.editableTabs[rule.fullField.replace(/[^0-9]/gi, "") * 1]
          .content.commitmentRate * 1;
      if (!Number.isInteger(val)) {
        callback(new Error("请输入数字值"));
      } else if (val < 0) {
        callback(new Error("请输入正整数"));
      } else if (val <= cirVal) {
        callback(new Error("PIR的值不能小于或等于CIR"));
      } else {
        //  console.log(rule,"dqwdjfhdrjkksjfwugh",rule.fullField.replace(/[^0-9]/ig,""))
        // console.log(this.ruleForm.editableTabs[this.index],"123123123")
        callback();
      }
    };
    var changePBS = (rule, value, callback) => {
      let val = value * 1;
      let cbsVal =
        this.ruleForm.editableTabs[rule.fullField.replace(/[^0-9]/gi, "") * 1]
          .content.commitmentBurst * 1;
      if (!Number.isInteger(val)) {
        callback(new Error("请输入数字值"));
      } else if (val < 0) {
        callback(new Error("请输入正整数"));
      } else if (val <= cbsVal) {
        callback(new Error("PBS的值不能小于或等于CBS"));
      } else {
        callback();
      }
    };
    var qosNameExit = (rule, value, callback) => {
      if (value) {
        qosIsNameExist({
          verifyId: this.ruleForm.id,
          verifyName: value,
          verifyScope: this.deviceId
        }).then(res => {
          if (!res.success) {
            callback(new Error("您输入的名称已存在"));
          } else {
            callback();
          }
        });
      }
    };
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      lang:"",
      actList: [],
      dscpList: [],
      sgList: [],
      ruleForm: {
        description: "",
        name: "",
        deviceId: "",
        id: "",
        editableTabs: [
          {
            title: "策略1",
            name: "1",
            content: {
              //cbs CB承诺burst
              // CBS CB promises burst
              commitmentBurst: null,
              // CIR承诺速率
              // CIR commitment rate
              commitmentRate: null,
              //conform-action绿灯动作
              // Diag-action green light action
              conformAction: "",
              //绿灯动作对应的dscp ,
              // DSCP corresponding to green light action,
              conformActionDscp: null,
              //黄灯动作对应的dscp ,
              // DSCP corresponding to yellow light action,
              exceedActionDscp: null,
              //红灯动作对应的dscp ,
              // DSCP corresponding to red light action,
              violateActionDscp: null,
              //exceed-action黄灯动作 ,
              // Exceed - Action Yellow light Action,
              exceedAction: "",
              id: "",
              //pbs PB峰值burs
              // PBS PB peak Burs
              peakBurst: null,
              //PIR峰值速率
              // PIR peak rate
              peakRate: null,
              //策略关联的qos的id ,
              // The qos ID of the policy association,
              qosId: "",
              //排序号
              // Order no.
              sortOrder: 0,
              // 策略项
              // strategy
              strategyPro: "",
              //所选流组 ,
              // Selected stream group,
              streamTableId: "",
              //violate-action红灯动作
              // Violate -action red light action
              violateAction: ""
            }
          }
        ]
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { validator: qosNameExit, trigger: "blur" }
        ]
      },
      editableTabsValue: "1",
      tabIndex: 1,
      custormRules: [
        { required: true, message: "请输入CIR", trigger: "blur" },
        { validator: changeCir, trigger: "blur" }
      ],
      cbsRules: [
        { required: true, message: "请输入CBS", trigger: "blur" },
        { validator: changeCBS, trigger: "blur" }
      ],
      pirRules: [
        { required: true, message: "请输入PIR", trigger: "blur" },
        { validator: changePIR, trigger: "blur" }
      ],
      pbsRules: [
        { required: true, message: "请输入PBS", trigger: "blur" },
        { validator: changePBS, trigger: "blur" }
      ],
      index: null
    };
  },
  computed: {},
  methods: {
    close() {
      this.$parent.detailsShow = false;
    },
    tabsDrop() {
      let el = document.querySelectorAll(".tabsList4 .el-tabs__nav")[0];
      // console.log(el);
      const _this = this;
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.ruleForm.editableTabs.splice(oldIndex, 1)[0];
          _this.ruleForm.editableTabs.splice(newIndex, 0, currRow);
        }
      });
    },
    async dataInit(row) {
      // console.log(row);
      // //数据初始化
      // Data initialization
      let deviceId = this.deviceId;
      let qosToAdd = await qosToAddOrEdit({ deviceId });
      if (qosToAdd.code === 10000) {
        this.actList = qosToAdd.result.action;
        this.dscpList = qosToAdd.result.dscp;
        this.sgList = qosToAdd.result.streamGroup;
      }
      this.ruleForm.description = row.description;
      this.ruleForm.name = row.name;
      this.ruleForm.id = row.id;
      this.tabIndex = row.qosPolicyList.length;
      this.editableTabsValue = "1";
      this.ruleForm.editableTabs = row.qosPolicyList.map((item, index) => {
        return {
          title: this.$t("vsr1000.qosremind[14]") + (index + 1),
          name: index + 1 + "",
          content: {
            //cbs CB承诺burst
            // CBS CB promises burst
            commitmentBurst: item.commitmentBurst,
            // CIR承诺速率
            // CIR commitment rate
            commitmentRate: item.commitmentRate,
            //conform-action绿灯动作
            // Diag-action green light action
            conformAction: item.conformAction,
            //绿灯动作对应的dscp ,
            // DSCP corresponding to green light action,
            conformActionDscp: item.conformActionDscp,
            //黄灯动作对应的dscp ,
            // DSCP corresponding to yellow light action,
            exceedActionDscp: item.exceedActionDscp,
            //红灯动作对应的dscp ,
            // DSCP corresponding to red light action,
            violateActionDscp: item.violateActionDscp,
            //exceed-action黄灯动作 ,
            // Exceed - Action Yellow light Action,
            exceedAction: item.exceedAction,
            id: item.id,
            //pbs PB峰值burs
            // PBS PB peak Burs
            peakBurst: item.peakBurst,
            //PIR峰值速率
            // PIR peak rate
            peakRate: item.peakRate,
            //策略关联的qos的id ,
            // The qos ID of the policy association,
            qosId: item.qosId,
            //排序号
            // Order no.
            sortOrder: index,
            // 策略项
            // strategy
            strategyPro: item.strategyPro,
            //所选流组 ,
            // Selected stream group,
            streamTableId: item.streamTableId,
            //violate-action红灯动作
            // Violate -action red light action
            violateAction: item.violateAction,
            dscpDisable1:
              this.actList.find(el => el.id === item.conformAction).name !==
              "Mark-and-Transmit",
            dscpDisable2:
              this.actList.find(el => el.id === item.exceedAction).name !==
              "Mark-and-Transmit",
            dscpDisable3:
              this.actList.find(el => el.id === item.violateAction).name !==
              "Mark-and-Transmit"
          }
        };
      });
      this.tabsDrop();
    },
    inpIndex(index) {
      //获取当前的策略项的下标
      // Gets the subscript of the current policy item
      this.index = index;
    },
    disDscp(id, type, index) {
      //dscp禁用
      // DSCP disable
      if (type === "dscp1") {
        this.ruleForm.editableTabs[index].content.dscpDisable1 =
          this.actList.find(item => item.id === id).name !==
          "Mark-and-Transmit";
      } else if (type === "dscp2") {
        this.ruleForm.editableTabs[index].content.dscpDisable2 =
          this.actList.find(item => item.id === id).name !==
          "Mark-and-Transmit";
      } else if (type === "dscp3") {
        this.ruleForm.editableTabs[index].content.dscpDisable3 =
          this.actList.find(item => item.id === id).name !==
          "Mark-and-Transmit";
      }
    }
  },
  created() {
    this.lang = sessionStorage.getItem("lang")
  },
  mounted() {
    // this.addBtnPosition()
    this.tabsDrop();
  }
};
</script>
<style scoped lang="scss">
.editQOS {
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
  // height: 654px;
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
.contextEn{
  width: 955px;
}
.event {
  padding: 30px 55px 30px 55px;
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
.demo-ruleForm {
  .formItem:first-of-type {
    margin-right: 80px;
  }
}
</style>
<style lang="scss">
.editQOS {
  .formItem .el-form-item__label-wrap {
    margin-left: 0 !important;
  }
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

    padding: 26px 0 0 20px;
    .el-input {
      width: 260px;
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
// .editQOS .tabsCon .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll {
//   padding: 0;
//   .el-tabs__nav {
//     width: 1100px;
//     overflow: auto;
//   }
// }
// .editQOS .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav {
//   height: auto;
//   line-height: 40px;
//   width: auto;
// }
// .editQOS .tabsCon .el-tabs__content .el-tab-pane {
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