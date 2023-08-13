<template>
  <div class="addACL" v-show="isShow">
    <div class="context">
      <h4 class="title">
        <span>{{$t('vsr1000.add')}} ACL-IPV6</span>
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
            <el-input type="textarea" v-model="ruleForm.descr" placeholder></el-input>
          </el-form-item>

          <div class="tabsCon">
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              closable
              @tab-remove="removeTab"
              class="tabsList99"
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
                      :label="item.dictValue"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.apply')"
                  :prop="`editableTabs[${index}].content.appName`"
                  :rules="[{ required: true, message:  $t('vsr1000.aclremind[7]'), trigger: 'change' }]"
                >
                  <el-select filterable v-model="item.content.appName" :placeholder="$t('vsr1000.choose')">
                    <el-option
                      v-for="item in AppNames"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.source')+'IPV6'"
                  :prop="`editableTabs[${index}].content.sourceIp`"
                  :rules="[
                  { required: true, message:  $t('vsr1000.aclremind[8]'), trigger: 'blur' },
                  {
                    pattern: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
                    message: $t('vsr1000.aclremind[11]')
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
                  :rules="[{ required: true, message:  $t('vsr1000.aclremind[8]'), trigger: 'blur' },
                {type:'number',message: $t('vsr1000.aclremind[9]')},
                {pattern:/^(?:[0-9]|[1-2][0-9]?|3[0-2])$/, message: $t('vsr1000.aclremind[10]'),trigger: 'blur'},
                ]"
                >
                  <el-input
                    v-model.number="item.content.sourceMask"
                    @blur="zhuanSourceIp(item.content.sourceIp,item.content.sourceMask,index)"
                    placeholder
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.dest')+'IPV6'"
                  :prop="`editableTabs[${index}].content.aimIp`"
                  :rules="[
                  { required: true, message:  $t('vsr1000.aclremind[8]'), trigger: 'blur' },
                  {
                    pattern: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
                    message: $t('vsr1000.aclremind[11]')
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
                  :rules="[{ required: true, message:  $t('vsr1000.aclremind[8]'), trigger: 'blur' },
                {type:'number',message: $t('vsr1000.aclremind[9]')},
                {pattern:/^(?:[0-9]|[1-2][0-9]?|3[0-2])$/, message: $t('vsr1000.aclremind[10]'),trigger: 'blur'},
                ]"
                >
                  <el-input
                    v-model.number="item.content.aimMask"
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
  aclVsrSimpleIPV6ToFullIPV6, //简写转全写
                              // So let me write it all out
  deviceFullIPV6ToSimpleIPV6 //全写转简写
                             // Let me write it all
} from "@/services";
import { compareIPV6 } from "@/utils/ipv6Change";
export default {
  props: {
    isShow: {
      type: Boolean
    }
  },
  components: {},
  data() {
    var getACLNameRule = (rule, value, callback) => {
      if (value) {
        getACLName({
          name: value,
          deviceId: this.deviceId
        }).then(res => {
          if (res.result) {
            callback();
          } else {
            callback(new Error(this.$t("vsr1000.aclremind[12]")));
          }
        });
      }
    };
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      ruleForm: {
        aclSessionName: "",
        descr: "",
        editableTabs: [
          {
            title: this.$t("vsr1000.aclremind[14]") + "1",
            name: "1",
            content: {
              //动作
              // action
              action: "",
              //目的地ip
              // Destination IP
              aimIp: "",
              //目的地掩码
              // Destination mask
              aimMask: "",
              //选择的应用
              // Application of choice
              appName: "",
              //源ip
              // The source IP
              sourceIp: "",
              //源掩码
              // Source mask
              sourceMask: ""
            }
          }
        ]
      },
      rules: {
        aclSessionName: [
          {
            required: true,
            message: this.$t("vsr1000.aclremind[8]"),
            trigger: "blur"
          },
          { validator: getACLNameRule, trigger: "blur" }
        ]
      },
      editableTabsValue: "1",
      ActItem: [],
      AppNames: [],
      tabIndex: 1
    };
  },
  computed: {},
  methods: {
    //输入掩码源ip转换
    // Input mask source IP conversion
    zhuanSourceIp(ip, code, index) {
      if (ip.length) {
        let reg = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
        if (reg.test(ip)) {
          aclVsrSimpleIPV6ToFullIPV6({ ip: ip + "/" + code }).then(res => {
            if (res.code === 10000) {
              let ip = res.result;
              if (code == 32) {
                return;
              } else {
                console.log(ip, code)
                deviceFullIPV6ToSimpleIPV6({
                  ipv6: compareIPV6(ip, code) + "/" + code
                }).then(res => {
                  if (res.code === 10000) {
                    this.ruleForm.editableTabs[index].content.sourceIp =
                      res.result;
                  }
                });
              }
            }
          });
        }
      }
    },
    //输入源ip转换
    // Input source IP conversion
    SourceIpChange(ip, code, index) {
      if (code != "") {
        let reg = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
        if (reg.test(ip)) {
          aclVsrSimpleIPV6ToFullIPV6({ ip: ip + "/" + code }).then(res => {
            if (res.code === 10000) {
              let ip = res.result;
              if (code == 32) {
                return;
              } else {
                deviceFullIPV6ToSimpleIPV6({
                  ipv6: compareIPV6(ip, code) + "/" + code
                }).then(res => {
                  if (res.code === 10000) {
                    this.ruleForm.editableTabs[index].content.sourceIp =
                      res.result;
                  }
                });
              }
            }
          });
        }
      }
    },
    //输入掩码目的地ip转换
    // Input mask destination IP conversion
    zhuanAimIp(ip, code, index) {
      if (ip.length) {
        let reg = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
        if (reg.test(ip)) {
          aclVsrSimpleIPV6ToFullIPV6({ ip: ip + "/" + code }).then(res => {
            if (res.code === 10000) {
              let ip = res.result;
              if (code == 32) {
                return;
              } else {
                deviceFullIPV6ToSimpleIPV6({
                  ipv6: compareIPV6(ip, code) + "/" + code
                }).then(res => {
                  if (res.code === 10000) {
                    this.ruleForm.editableTabs[index].content.aimIp =
                      res.result;
                  }
                });
              }
            }
          });
        }
      }
    },
    //输入目的地ip转换
    // Enter the destination IP conversion
    aimIpChange(ip, code, index) {
      if (code != "") {
        let reg = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
        if (reg.test(ip)) {
          aclVsrSimpleIPV6ToFullIPV6({ ip: ip + "/" + code }).then(res => {
            if (res.code === 10000) {
              let ip = res.result;
              if (code == 32) {
                return;
              } else {
                deviceFullIPV6ToSimpleIPV6({
                  ipv6: compareIPV6(ip, code) + "/" + code
                }).then(res => {
                  if (res.code === 10000) {
                    this.ruleForm.editableTabs[index].content.aimIp =
                      res.result;
                  }
                });
              }
            }
          });
        }
      }
    },
    close() {
      this.$parent.isShowAddS = false;
      // console.log("123")
      this.ruleForm = {
        aclSessionName: "",
        descr: "",
        editableTabs: [
          {
            title: this.$t("vsr1000.aclremind[14]") + "1",
            name: "1",
            content: {
              //动作
              // action
              action: "",
              //目的地ip
              // Destination IP
              aimIp: "",
              //目的地掩码
              // Destination mask
              aimMask: "",
              //选择的应用
              // Application of choice
              appName: "",
              //源ip
              // The source IP
              sourceIp: "",
              //源掩码
              // Source mask
              sourceMask: ""
            }
          }
        ]
      };
      this.editableTabsValue = "1";
      this.tabIndex = 1;
      this.$refs.form.resetFields();
    },
    submitForm(formName) {
      // console.log(this.$refs[formName]);
      let deviceId = this.deviceId
      let arr = [];
      this.ruleForm.editableTabs.forEach((item, index) => {
        arr.push({
          action: item.content.action,
          destinationIp: item.content.aimIp,
          destinationIpMask: item.content.aimMask + "",
          appId: item.content.appName,
          sourceIp: item.content.sourceIp,
          sourceIpMask: item.content.sourceMask + "",
          sortOrder: index
        });
      });
      let data = {
        name: this.ruleForm.aclSessionName,
        descr: this.ruleForm.descr,
        devAclStremVoList: arr,
        deviceId,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)),
        type: 1
      };
      // console.log(this.editableTabs);

      this.$refs[formName].validate(valid => {
        if (valid) {
          addAcl(data).then(res => {
            // console.log(res);
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.aclremind[0]")
              });
              this.ruleForm = {
                aclSessionName: "",
                descr: "",
                editableTabs: [
                  {
                    title: this.$t("vsr1000.aclremind[14]") + "1",
                    name: "1",
                    content: {
                      //动作
                      // action
                      action: "",
                      //目的地ip
                      // Destination IP
                      aimIp: "",
                      //目的地掩码
                      // Destination mask
                      aimMask: "",
                      //选择的应用
                      // Application of choice
                      appName: "",
                      //源ip
                      // The source IP
                      sourceIp: "",
                      //源掩码
                      // Source mask
                      sourceMask: ""
                    }
                  }
                ]
              };
              this.tabIndex = 1;
              this.editableTabsValue = "1";
              this.$refs[formName].resetFields();
              this.$parent.isShowAddS = false;
              this.$parent.getAclListInit({
                deviceId,
                page: this.$parent.Spage,
                pageSize: this.$parent.SpageSize,
                type: 1
              });
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
              this.ruleForm = {
                aclSessionName: "",
                descr: "",
                editableTabs: [
                  {
                    title: this.$t("vsr1000.aclremind[14]") + "1",
                    name: "1",
                    content: {
                      //动作
                      // action
                      action: "",
                      //目的地ip
                      // Destination IP
                      aimIp: "",
                      //目的地掩码
                      // Destination mask
                      aimMask: "",
                      //选择的应用
                      // Application of choice
                      appName: "",
                      //源ip
                      // The source IP
                      sourceIp: "",
                      //源掩码
                      // Source mask
                      sourceMask: ""
                    }
                  }
                ]
              };
              this.tabIndex = 1;
              this.editableTabsValue = "1";
              this.$refs[formName].resetFields();
              this.$parent.isShowAddS = false;
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
          //动作
          // action
          action: "",
          //目的地ip
          // Destination IP
          aimIp: "",
          //目的地掩码
          // Destination mask
          aimMask: "",
          //选择的应用
          // Application of choice
          appName: "",
          //源ip
          // The source IP
          sourceIp: "",
          //源掩码
          // Source mask
          sourceMask: ""
        }
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
          tab => tab.name !== targetName
        );
      }
      // this.addBtnPosition()
    },
    tabsDrop() {
      let el = document.querySelectorAll(".tabsList99 .el-tabs__nav")[0];
      const _this = this;
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.ruleForm.editableTabs.splice(oldIndex, 1)[0];
          _this.ruleForm.editableTabs.splice(newIndex, 0, currRow);
        }
      });
    },
    async selectList() {
      let data = await getDict({ groupCode: "acl", typeCode: "act" });
      let data2 = await getAppNames({
        tenantId: JSON.parse(this.$route.query.devData).tenantId
      });
      this.ActItem = data.result;
      this.AppNames = data2.result;
    }
  },
  created() {},
  mounted() {
    // this.addBtnPosition()
    this.tabsDrop();
  }
};
</script>
<style scoped lang="scss">
.addACL {
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