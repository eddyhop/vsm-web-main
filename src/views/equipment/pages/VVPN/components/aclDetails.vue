<template>
  <div class="addACL">
    <div class="context">
      <h4 class="title">
        <span>{{ruleForm.aclSessionName}}{{$t("vsr1000.details")}}</span>
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
            <el-input v-model="ruleForm.aclSessionName" placeholder disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.describe')" prop="descr" label-width="120px">
            <el-input type="textarea" v-model="ruleForm.descr" placeholder disabled></el-input>
          </el-form-item>

          <div class="tabsCon">
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              closable
             
              class="tabsListD1"
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
                >
                  <el-select filterable v-model="item.content.action" disabled :placeholder="$t('vsr1000.choose')">
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
                  <el-select filterable v-model="item.content.appName" disabled :placeholder="$t('vsr1000.choose')">
                    <el-option
                      v-for="item in AppNames"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.source')+'IPV4'"
                  :prop="`editableTabs[${index}].content.sourceIp`"
                >
                  <el-input
                    v-model="item.content.sourceIp"
                    placeholder
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.maskLength')"
                  :prop="`editableTabs[${index}].content.sourceMask`"
                >
                  <el-input
                    v-model.number="item.content.sourceMask"
                    placeholder
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.dest')+'IPV4'"
                  :prop="`editableTabs[${index}].content.aimIp`"
                >
                  <el-input
                    v-model="item.content.aimIp"
                    placeholder
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('vsr1000.maskLength')"
                  :prop="`editableTabs[${index}].content.aimMask`"
                >
                  <el-input
                    v-model.number="item.content.aimMask"
                    placeholder
                    disabled
                  ></el-input>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
            <!-- <div id="addBtn">
              <el-button size="small" @click.prevent="addTab(editableTabsValue)">+</el-button>
            </div> -->
          </div>
          <!-- <div class="submit">
            <button class="save" type="primary" v-debounce.prevent="submitForm">{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div> -->
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import Sortable from "sortablejs";
import { editAcl, getDict, getAppNames, getAclDetail } from "@/services";
import { compare } from "@/utils/change";
export default {
  props: {
    isShow2: {
      type: Boolean
    }
  },
  components: {},
  data() {
    var getACLName = (rule, value, callback) => {
      if (value) {
        getACLName({
          name: value,
          deviceId: JSON.parse(this.$route.query.devData).deviceId
        }).then(res => {
          if (res.result) {
            callback();
          } else {
            callback(new Error("您输入的名称已存在"));
          }
        });
      }
    };
    return {
      ruleForm: {
        aclSessionName: "",
        descr: "",
        aclSessionId: "",
        editableTabs: [
          {
            title: "流1",
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
              sourceMask: "",
              id: "",
              aclSessionId: "",
              sortNum: null
            }
          }
        ]
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { validator: getACLName, trigger: "blur" }
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
    close() {
      this.$parent.aclDetailShow = false;
      this.editableTabsValue = "1";
    },
    tabsDrop() {
      let el = document.querySelectorAll(".tabsListD1 .el-tabs__nav")[0];
      const _this = this;
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.ruleForm.editableTabs.splice(oldIndex, 1)[0];
          _this.ruleForm.editableTabs.splice(newIndex, 0, currRow);
        }
      });
    },
    async selectList(val) {
      // let data = await getDict({ groupCode: "acl", typeCode: "act" });
      let data = await getAppNames({
        tenantId: JSON.parse(this.$route.query.devData).tenantId,
        deviceId: JSON.parse(this.$route.query.devData).deviceId
      });
      let aclDetail = await getAclDetail({ aclId: val });
      this.ActItem = data.result.actOperation;
      this.AppNames = data.result.appOperation;
      this.ruleForm.aclSessionName = aclDetail.result.name;
      this.ruleForm.descr = aclDetail.result.descr;
      this.ruleForm.aclSessionId = aclDetail.result.id;
      this.tabIndex = aclDetail.result.aclSessionList.length;
      this.editableTabsValue = "1";
      this.ruleForm.editableTabs = aclDetail.result.aclSessionList.map(
        (item, index) => {
          return {
            title: this.$t('vsr1000.aclremind[14]') + (index + 1),
            name: index + 1 + "",
            content: {
              aclId: item.id,
              action: item.action,
              aimIp: item.destinationIp,
              aimMask: item.destinationIpMask * 1,
              appName: item.appId,
              id: item.id,
              sortNum: item.sortOrder,
              sourceIp: item.sourceIp,
              sourceMask: item.sourceIpMask * 1
            }
          };
        }
      );
    }
  },
  created() {},
  mounted() {
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
