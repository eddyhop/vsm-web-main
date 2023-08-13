<template>
  <div class="addStream" v-show="isShow2">
    <div class="context">
      <h4 class="title">
        <span>{{$t('vsr1000.edit')}} {{$t('vsr1000.flowGroup')}} </span>
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
              class="tabsList2"
            >
              <el-tab-pane
                v-for="(item,index) in ruleForm.editableTabs"
                :key="item.name"
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
  // streamSaveOrFlush,
  // toAddStream,
  // isSgNamExit,
  streamToAddOrEdit,
  streamIsNameExist,
  streamSaveOrFlush
} from "@/services";
import { compare } from "@/utils/change";
export default {
  props: {
    isShow2: {
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
          verifyId: this.ruleForm.id
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
        id: "",
        editableTabs: [
          {
            title: this.$t("vsr1000.stream") + "1",
            name: "1",
            content: {
              destinationIp: "",
              appId: "",
              id: "",
              sourceIpMask: "",
              destinationIpMask: "",
              sourceIp: "",
              streamGroupId: "",
              sortNum: 0
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
      this.$parent.isShow2 = false;
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
        id: this.ruleForm.id,
        name: this.ruleForm.name,
        streamVoList: arr
      };
      // console.log(data, "123123123");

      this.$refs[formName].validate(valid => {
        if (valid) {
          streamSaveOrFlush(data).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[1]")
              });
              this.$parent.isShow2 = false;
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
              this.$parent.isShow2 = false;
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
          sourceIpMask: "",
          destinationIpMask: "",
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
      let el = document.querySelectorAll(".tabsList2 .el-tabs__nav")[0];
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
      this.appList = this.filterSelect(ying.result);
    },
    editData(row) {
      // console.log(row);
      this.ruleForm.description = row.description;
      this.ruleForm.name = row.name;
      this.ruleForm.id = row.id;
      this.tabIndex = row.streamList.length;
      this.editableTabsValue = "1";
      this.ruleForm.editableTabs = row.streamList.map((item, index) => {
        return {
          title: this.$t("vsr1000.stream") + (index + 1),
          name: index + 1 + "",
          content: {
            //目的地ip
            // Destination IP
            destinationIp: item.destinationIp,
            //选择应用
            // Choose to apply
            appId: item.appId,
            id: item.id,
            //源ip掩码
            // The source IP mask
            sourceIpMask: item.sourceIpMask * 1,
            //目的ip掩码
            // Destination IP mask
            destinationIpMask: item.destinationIpMask * 1,
            //源ip
            // The source IP
            sourceIp: item.sourceIp,
            streamGroupId: item.streamGroupId,
            sortNum: item.sortOrder
          }
        };
      });
      this.tabsDrop();
    }
  },
  created() {},
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
  padding: 30px 60px 0 60px;
}
.submit {
  width: 100%;
  text-align: center;
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
// .addStream .tabsCon .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll {
//   padding: 0;
//   .el-tabs__nav {
//     width: 822px;
//     overflow: auto;
//   }
// }
// .addStream .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav {
//   height: auto;
//   line-height: 40px;
//   width: auto;
// }
// .addStream .tabsCon .el-tabs__content .el-tab-pane {
//   width: 822px;
//   height: 260px;
//   background: rgba(250, 250, 250, 1);
//   padding: 40px 0 40px 74px;
//   display: flex;
//   flex-wrap: wrap;
//   .el-form-item:first-of-type {
//     margin-right: 300px;
//   }
//   .el-input {
//     width: 320px;
//     height: 40px;
//   }
// }
</style>