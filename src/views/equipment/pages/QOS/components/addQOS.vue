<template>
  <div class="addQOS" v-show="isShow">
    <div :class="`context ${lang=='en'?'contextEn':''}`">
      <h4 class="title">
        <span>{{$t('vsr1000.add')}} QOS</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        111111111111111
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          label-width="auto"
          class="demo-ruleForm qos-table"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item :label="$t('vsr1000.name')" prop="name" class="formItem">
            <el-input v-model="ruleForm.name" placeholder></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.describe')" prop="description" class="formItem">
            <el-input v-model="ruleForm.description" placeholder></el-input>
          </el-form-item>

          <div class="tabsCon">
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              closable
              @tab-remove="removeTab"
              class="tabsList3"
            >
              <el-tab-pane
                v-for="(item,index) in ruleForm.editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
              >
                <el-form-item
                  :label="$t('vsr1000.flowGroup')"
                  :prop="`editableTabs[${index}].content.streamTableId`"
                  :rules="[{ required: true, message: $t('vsr1000.qosremind[7]'), trigger: 'change' }]"
                >
                  <el-select filterable
                    v-model="item.content.streamTableId"
                    :placeholder="$t('vsr1000.choose')"
                  >
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
                    <el-option :label="$t('vsr1000.qosremind[8]')" value="shanghai"></el-option>
                    <el-option :label="$t('vsr1000.qosremind[9]')" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="CIR(Kbps)"
                  :prop="`editableTabs[${index}].content.commitmentRate`"
                  :rules="custormRules"
                >
                  <el-input
                    v-model="item.content.commitmentRate"
                    placeholder
                    @change="inpIndex(index)"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="CBS(Byte)"
                  :prop="`editableTabs[${index}].content.commitmentBurst`"
                  :rules="cbsRules"
                >
                  <el-input
                    v-model="item.content.commitmentBurst"
                    placeholder
                    @change="inpIndex(index)"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="PIR(Kbps)"
                  :prop="`editableTabs[${index}].content.peakRate`"
                  :rules="pirRules"
                >
                  <el-input v-model="item.content.peakRate" placeholder @change="inpIndex(index)"></el-input>
                </el-form-item>
                <el-form-item
                  label="PBS(Byte)"
                  :prop="`editableTabs[${index}].content.peakBurst`"
                  :rules="pbsRules"
                >
                  <el-input v-model="item.content.peakBurst" placeholder @change="inpIndex(index)"></el-input>
                </el-form-item>
                <el-form-item
                  label="conform-action"
                  :prop="`editableTabs[${index}].content.conformAction`"
                  :rules="[{ required: true, message: $t('vsr1000.qosremind[7]'), trigger: 'change' }]"
                >
                  <el-select filterable
                    v-model="item.content.conformAction"
                    @change="disDscp(item.content.conformAction,'dscp1',index)"
                    :placeholder="$t('vsr1000.choose')"
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
                    :disabled="item.content.dscpDisable1"
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
                  :rules="[{ required: true, message: $t('vsr1000.qosremind[7]'), trigger: 'change' }]"
                >
                  <el-select filterable
                    v-model="item.content.exceedAction"
                    @change="disDscp(item.content.exceedAction,'dscp2',index)"
                    :placeholder="$t('vsr1000.choose')"
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
                    :disabled="item.content.dscpDisable2"
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
                  :rules="[{ required: true, message: $t('vsr1000.qosremind[7]'), trigger: 'change' }]"
                >
                  <el-select filterable
                    v-model="item.content.violateAction"
                    @change="disDscp(item.content.violateAction,'dscp3',index)"
                    :placeholder="$t('vsr1000.choose')"
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
                    :disabled="item.content.dscpDisable3"
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
  // addQos,
  // toAddQos,
  // isQosNamExit,
  qosIsNameExist,
  qosToAddOrEdit,
  qosSaveOrFlush
} from "@/services";
export default {
  props: {
    isShow: {
      type: Boolean
    }
  },
  components: {},
  data() {
    var changeCir = (rule, value, callback) => {
      let val = value * 1;
      let pirVal = this.ruleForm.editableTabs[this.index].content.peakRate * 1;
      if (!Number.isInteger(val)) {
        callback(new Error(this.$t("vsr1000.qosremind[10]")));
      } else if (val < 0) {
        callback(new Error(this.$t("vsr1000.qosremind[11]")));
      } else if (val > 2147483647){
        callback(new Error(this.$t("vsr1000.qosremind[17]")))
      } else {
        callback();
      }
      
    };
    var changeCBS = (rule, value, callback) => {
      let val = value * 1;
      let pbsVal = this.ruleForm.editableTabs[this.index].content.peakBurst * 1;
      if (!Number.isInteger(val)) {
        callback(new Error(this.$t("vsr1000.qosremind[10]")));
      } else if (val < 0) {
        callback(new Error(this.$t("vsr1000.qosremind[11]")));
      } else if (val > 2147483647){
        callback(new Error(this.$t("vsr1000.qosremind[17]")))
      } else {
        callback();
      }
    };
    var changePIR = (rule, value, callback) => {
      let val = value * 1;
      let cirVal =
        this.ruleForm.editableTabs[this.index].content.commitmentRate * 1;
      let pirVal = this.ruleForm.editableTabs[this.index].content.peakRate * 1;
      if (!Number.isInteger(val)) {
        callback(new Error(this.$t("vsr1000.qosremind[10]")));
      } else if (val < 0) {
        callback(new Error(this.$t("vsr1000.qosremind[11]")));
      } else if (pirVal <= cirVal) {
        callback(new Error(this.$t("vsr1000.qosremind[12]")));
      } else if (val > 2147483647){
        callback(new Error(this.$t("vsr1000.qosremind[17]")))
      } else {
        callback();
      }
    };
    var changePBS = (rule, value, callback) => {
      let val = value * 1;
      let cbsVal =
        this.ruleForm.editableTabs[this.index].content.commitmentBurst * 1;
      let pbsValue =
        this.ruleForm.editableTabs[this.index].content.peakBurst * 1;

      if (!Number.isInteger(val)) {
        callback(new Error(this.$t("vsr1000.qosremind[10]")));
      } else if (val < 0) {
        callback(new Error(this.$t("vsr1000.qosremind[11]")));
      } else if (pbsValue <= cbsVal) {
        callback(new Error(this.$t("vsr1000.qosremind[16]")));
      } else if (val > 2147483647){
        callback(new Error(this.$t("vsr1000.qosremind[17]")))
      } else {
        callback();
      }
    };
    var qosNameExit = (rule, value, callback) => {
      if (value) {
        qosIsNameExist({
          verifyId: "",
          verifyName: value,
          verifyScope: this.deviceId
        }).then(res => {
          if (!res.success) {
            callback(new Error(this.$t("vsr1000.qosremind[13]")));
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
            title: this.$t("vsr1000.qosremind[14]") + "1",
            name: "1",
            content: {
              //cbs CB承诺burst CB commitment into
              // CBS CB committed to burst CB commitment into
              commitmentBurst: null,
              // CIR承诺速率 CIR commitment rate
              // CIR commitment rate CIR commitment rate
              commitmentRate: null,
              //conform-action绿灯动作 Diag-action green light action
              // 1) Diag-Action Green light Action
              conformAction: 0,
              //绿灯动作对应的dscp , DSCP corresponding to green light action,
              // The corresponding DSCP and DSCP corresponding to the green light action are corresponding to the green light action,
              conformActionDscp: null,
              //黄灯动作对应的dscp ,
              // DSCP corresponding to yellow light action,
              exceedActionDscp: null,
              //红灯动作对应的dscp ,
              // DSCP corresponding to red light action,
              violateActionDscp: null,
              //exceed-action黄灯动作 ,
              // Exceed - Action Yellow light Action,
              exceedAction: 0,
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
              violateAction: 0,
              //dscp禁用
              // DSCP disable
              dscpDisable1: true,
              dscpDisable2: true,
              dscpDisable3: true
            }
          }
        ]
      },
      dropInit: "",
      rules: {
        name: [
          {
            required: true,
            message: this.$t("vsr1000.qosremind[15]"),
            trigger: "blur"
          },
          { validator: qosNameExit, trigger: "blur" }
        ]
      },
      editableTabsValue: "1",
      tabIndex: 1,
      custormRules: [
        {
          required: true,
          message: this.$t("vsr1000.qosremind[15]"),
          trigger: "blur"
        },
        { validator: changeCir, trigger: "blur" }
      ],
      cbsRules: [
        {
          required: true,
          message: this.$t("vsr1000.qosremind[15]"),
          trigger: "blur"
        },
        { validator: changeCBS, trigger: "blur" }
      ],
      pirRules: [
        {
          required: true,
          message: this.$t("vsr1000.qosremind[15]"),
          trigger: "blur"
        },
        { validator: changePIR, trigger: "blur" }
      ],
      pbsRules: [
        {
          required: true,
          message: this.$t("vsr1000.qosremind[15]"),
          trigger: "blur"
        },
        { validator: changePBS, trigger: "blur" }
      ],
      index: null
    };
  },
  computed: {},
  methods: {
    close() {
      this.ruleForm = {
        description: "",
        name: "",
        deviceId: "",
        id: "",
        editableTabs: [
          {
            title: this.$t("vsr1000.qosremind[14]") + "1",
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
              conformAction: 0,
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
              exceedAction: 0,
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
              violateAction: 0,
              //dscp禁用
              // DSCP disable
              dscpDisable1: true,
              dscpDisable2: true,
              dscpDisable3: true
            }
          }
        ]
      };
      this.tabIndex = 1;
      this.editableTabsValue = "1";
      this.$parent.isShow = false;
      this.$refs.form.clearValidate();
    },
    submitForm(formName) {
      // console.log(this.$refs[formName]);
      let arr = [];
      this.ruleForm.editableTabs.forEach((item, index) => {
        arr.push({
          //cbs CB承诺burst
          // CBS CB promises burst
          commitmentBurst: item.content.commitmentBurst,
          // CIR承诺速率
          // CIR commitment rate
          commitmentRate: item.content.commitmentRate,
          //conform-action绿灯动作
          // Diag-action green light action
          conformAction: item.content.conformAction,
          //绿灯动作对应的dscp ,
          // DSCP corresponding to green light action,
          conformActionDscp: item.content.conformActionDscp,
          //黄灯动作对应的dscp ,
          // DSCP corresponding to yellow light action,
          exceedActionDscp: item.content.exceedActionDscp,
          //红灯动作对应的dscp ,
          // DSCP corresponding to red light action,
          violateActionDscp: item.content.violateActionDscp,
          //exceed-action黄灯动作 ,
          // Exceed - Action Yellow light Action,
          exceedAction: item.content.exceedAction,
          id: "",
          //pbs PB峰值burs
          // PBS PB peak Burs
          peakBurst: item.content.peakBurst,
          //PIR峰值速率
          // PIR peak rate
          peakRate: item.content.peakRate,
          //策略关联的qos的id ,
          // The qos ID of the policy association,
          qosId: "",
          //排序号
          // Order no.
          sortOrder: index,
          // 策略项
          // strategy
          strategyPro: "",
          //所选流组 ,
          // Selected stream group,
          streamTableId: item.content.streamTableId,
          //violate-action红灯动作
          // Violate -action red light action
          violateAction: item.content.violateAction
        });
      });
      let data = {
        description: this.ruleForm.description,
        deviceId: this.deviceId,
        id: "",
        name: this.ruleForm.name,
        qosPolicyVoList: arr
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          qosSaveOrFlush(data).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.qosremind[0]")
              });
              this.ruleForm = {
                description: "",
                name: "",
                deviceId: "",
                id: "",
                editableTabs: [
                  {
                    title: this.$t("vsr1000.qosremind[14]") + "1",
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
                      conformAction: 0,
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
                      exceedAction: 0,
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
                      violateAction: 0,
                      //dscp禁用
                      // DSCP disable
                      dscpDisable1: true,
                      dscpDisable2: true,
                      dscpDisable3: true
                    }
                  }
                ]
              };
              this.tabIndex = 1;
              this.editableTabsValue = "1";
              this.$parent.isShow = false;
              this.$parent.getQosInit({
                deviceId:this.deviceId,
                page: this.$parent.lNumber,
                pageSize: this.$parent.Size
              });
              this.$refs[formName].resetFields();
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
              this.ruleForm = {
                description: "",
                name: "",
                deviceId: "",
                id: "",
                editableTabs: [
                  {
                    title: this.$t("vsr1000.qosremind[14]") + "1",
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
                      conformAction: 0,
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
                      exceedAction: 0,
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
                      violateAction: 0,
                      //dscp禁用
                      // DSCP disable
                      dscpDisable1: true,
                      dscpDisable2: true,
                      dscpDisable3: true
                    }
                  }
                ]
              };
              this.tabIndex = 1;
              this.editableTabsValue = "1";
              this.$parent.isShow = false;

              this.$refs[formName].resetFields();
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
        title: this.$t("vsr1000.qosremind[14]") + this.tabIndex,
        name: newTabName,
        content: {
          //cbs CB承诺burst
          // CBS CB promises burst
          commitmentBurst: null,
          // CIR承诺速率
          // CIR commitment rate
          commitmentRate: null,
          //conform-action绿灯动作
          // Diag-action green light action
          conformAction: this.dropInit,
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
          exceedAction: this.dropInit,
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
          // sortOrder: 0,
          // 策略项
          // strategy
          strategyPro: "",
          //所选流组 ,
          // Selected stream group,
          streamTableId: "",
          //violate-action红灯动作
          // Violate -action red light action
          violateAction: this.dropInit,
          //dscp禁用
          // DSCP disable
          dscpDisable1: true,
          dscpDisable2: true,
          dscpDisable3: true
        }
      });
      this.editableTabsValue = newTabName;
    },
    removeTab(targetName) {
      // console.log(targetName);
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
      let el = document.querySelectorAll(".tabsList3 .el-tabs__nav")[0];
      // console.log(el)
      const _this = this;
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.ruleForm.editableTabs.splice(oldIndex, 1)[0];
          _this.ruleForm.editableTabs.splice(newIndex, 0, currRow);
        }
      });
    },
    dataInit() {
      let deviceId = this.deviceId;
      // console.log(123123123);
      qosToAddOrEdit({ deviceId }).then(res => {
        if (res.code === 10000) {
          this.actList = res.result.action;
          this.dscpList = res.result.dscp;
          this.sgList = res.result.streamGroup;
          this.dropInit = res.result.action.find(
            item => item.name === "drop"
          ).id;
          this.ruleForm.editableTabs[0].content.conformAction = this.dropInit;
          this.ruleForm.editableTabs[0].content.exceedAction = this.dropInit;
          this.ruleForm.editableTabs[0].content.violateAction = this.dropInit;
        }
      });
    },
    inpIndex(index) {
      // console.log(this.editableTabsValue, "123");
      //获取当前的策略项的下标
      // Gets the subscript of the current policy item
      this.index = index;
    },
    disDscp(id, type, index) {
      //dscp禁用
      // DSCP disable
      if (type === "dscp1") {
        this.ruleForm.editableTabs[index].content.conformActionDscp = null
        this.ruleForm.editableTabs[index].content.dscpDisable1 =
          this.actList.find(item => item.id === id).name !==
          "Mark-and-Transmit";
      } else if (type === "dscp2") {
        this.ruleForm.editableTabs[index].content.exceedActionDscp = null
        this.ruleForm.editableTabs[index].content.dscpDisable2 =
          this.actList.find(item => item.id === id).name !==
          "Mark-and-Transmit";
      } else if (type === "dscp3") {
        this.ruleForm.editableTabs[index].content.violateActionDscp = null
        this.ruleForm.editableTabs[index].content.dscpDisable3 =
          this.actList.find(item => item.id === id).name !==
          "Mark-and-Transmit";
      }
    }
  },
  created() {
    // this.dataInit();
    this.lang = sessionStorage.getItem("lang")
  },
  mounted() {
    // this.addBtnPosition()
    this.tabsDrop();
  }
};
</script>
<style scoped lang="scss">
.addQOS {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background:rgba(32,42,59,0.2);
  z-index: 100;
}
.context {
  width: 960px;
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
  padding: 30px 50px 30px 50px;
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
.addQOS {
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
.qos-table{
  .el-form-item{
    margin-top: 10px !important;
  }
}
</style>
