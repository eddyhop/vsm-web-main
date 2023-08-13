<template>
  <div class="addCGNAT" v-show="isShow">
    <div class="context">
      <h4 class="title">
        <span>CGNAT{{$t('facility.new')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="auto"
          class="demo-ruleForm"
          :inline="true"
        >
          <div class="form-top">
            <el-form-item :label="$t('facility.name')" prop="name">
              <el-input v-model="ruleForm.name" placeholder></el-input>
            </el-form-item>
            <el-form-item :label="$t('facility.tcpOutTime')" prop="tcpTimeOut">
              <el-input v-model="ruleForm.tcpTimeOut" placeholder></el-input>
            </el-form-item>
            <el-form-item :label="$t('facility.udpOutTime')" prop="udpTimeOut">
              <el-input v-model="ruleForm.udpTimeOut" placeholder></el-input>
            </el-form-item>
            <el-form-item :label="$t('facility.icmpOutTime')" prop="icmpTimeOut">
              <el-input v-model="ruleForm.icmpTimeOut" placeholder></el-input>
            </el-form-item>
            <div>
              <el-form-item :label="$t('facility.innerWeb')" prop="inAddr">
                <el-input v-model="ruleForm.inAddr" placeholder></el-input>
              </el-form-item>
              <ul class="IpLists">
                <li>
                  <el-form-item
                    v-for="(item, index) in ruleForm.ipAddress"
                    :label="$t('facility.outAddress')"
                    :key="item.key"
                    :prop="`ipAddress[${index}].outAddr`"
                    :rules="[
                        { required: true, message: '请输入内部地址', trigger: 'blur' },
                        {
                          pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                          message: '请输入正确的内部地址'
                        }
                      ]"
                  >
                    <el-input v-model="item.outAddr" placeholder></el-input>
                  </el-form-item>
                </li>
                <li>
                  <div class="addPortBtn">
                    <button @click="addIp">+</button>
                  </div>
                </li>
              </ul>
            </div>
            <el-form-item :label="$t('facility.describe')" prop="descr">
              <el-input type="textarea" v-model="ruleForm.descr" placeholder></el-input>
            </el-form-item>
          </div>

          <div class="tabsCon">
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              closable
              @tab-remove="removeTab"
              class="tabsList7"
            >
              <el-tab-pane
                v-for="(item,index) in ruleForm.editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
              >
                <!-- {{item.content}} -->
                <el-form-item
                  :label="$t('facility.protocol')"
                  :prop="`editableTabs[${index}].content.protocl`"
                  :rules="[{ required: true, message: '请输入TCP超时', trigger: 'change' },
                ]"
                >
                  <el-select filterable v-model="item.content.protocl" :placeholder="$t('facility.select')">
                    <el-option
                      v-for="el in protoclList"
                      :key="el.id"
                      :label="el.name"
                      :value="el.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="$t('facility.innerAddress')"
                  :prop="`editableTabs[${index}].content.inAddr`"
                  :rules="[{ required: true, message: '请输入内部地址', trigger: 'blur' },
                  {
                    pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                    message: '请输入正确的内部地址'
                  }
                  ]"
                >
                  <el-input v-model="item.content.inAddr" placeholder></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('facility.port')"
                  :prop="`editableTabs[${index}].content.inAddrPort`"
                  :rules="[{ required: true, message: '请输入端口', trigger: 'blur' },
                {
                    pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
                    message: '请输入正确端口'
                }
                ]"
                >
                  <el-input v-model="item.content.inAddrPort" placeholder></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('facility.outAddress')"
                  :prop="`editableTabs[${index}].content.inAddr`"
                  :rules="[{ required: true, message: '请输入内部地址', trigger: 'blur' },
                  {
                    pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                    message: '请输入正确的内部地址'
                  }]"
                >
                  <el-input v-model="item.content.outAddr" placeholder></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('facility.port')"
                  :prop="`editableTabs[${index}].content.outAddrPort`"
                  :rules="[{ required: true, message: '请输入端口', trigger: 'blur' },
                {
                    pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
                    message: '请输入正确端口'
                }
                ]"
                >
                  <el-input v-model="item.content.outAddrPort" placeholder></el-input>
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
              @click.prevent="submitForm('ruleForm')"
            >{{$t('facility.save')}}</button>
            <button class="cancel" @click="close">取消</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import Sortable from "sortablejs";
import { addCgnat, getProtoclItems } from "@/services";
export default {
  props: {
    isShow: {
      type: Boolean
    }
  },
  components: {},
  data() {
    return {
      ruleForm: {
        name: "",
        descr: "",
        //icmp超时秒
        // The icmp timeout seconds
        icmpTimeOut: "",
        id: "",
        //内部地址
        // Internal address
        inAddr: "",
        //tcp超时秒
        // TCP timeout seconds
        tcpTimeOut: "",
        //udp超时秒
        // Udp timeout seconds
        udpTimeOut: "",
        ipAddress: [
          {
            //外部地址
            // External address
            outAddr: "",
            key: Date.now()
          }
        ],
        editableTabs: [
          {
            title: "静态地址映射1",
            name: "1",
            content: {
              id: "",
              //内部地址
              // Internal address
              inAddr: "",
              //内部地址端口
              // Internal address port
              inAddrPort: "",
              //外部地址
              // External address
              outAddr: "",
              //外部地址端口
              // External address port
              outAddrPort: "",
              //协议
              // agreement
              protocl: ""
            }
          }
        ]
      },
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        tcpTimeOut: [
          { required: true, message: "请输入TCP超时", trigger: "blur" },
          {
            pattern: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/,
            message: "请输入正确的TCP超时"
          }
        ],
        udpTimeOut: [
          { required: true, message: "请输入UDP超时", trigger: "blur" },
          {
            pattern: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/,
            message: "请输入正确的TCP超时"
          }
        ],
        icmpTimeOut: [
          { required: true, message: "请输入ICMP超时", trigger: "blur" },
          {
            pattern: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/,
            message: "请输入正确的TCP超时"
          }
        ],
        inAddr: [
          { required: true, message: "请输入内部地址", trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: "请输入正确的内部地址"
          }
        ]
      },
      editableTabsValue: "1",
      // ruleForm.editableTabs: [
      //   {
      //     title: "静态地址映射1",
      // Title: "Static address mapping 1"
      //     name: "1",
      //     content: {
      //       id: "",
      //       //内部地址
      // Internal address
      //       inAddr: "",
      //       //内部地址端口
      // Internal address port
      //       inAddrPort: "",
      //       //外部地址
      // External address
      //       outAddr: "",
      //       //外部地址端口
      // External address port
      //       outAddrPort: "",
      //       //协议
      // agreement
      //       protocl: ""
      //     }
      //   }
      // ],
      protoclList: [],
      tabIndex: 1
    };
  },
  computed: {},
  methods: {
    close() {
      this.$parent.isShow = false;
      this.ruleForm = {
        name: "",
        descr: "",
        //icmp超时秒
        // The icmp timeout seconds
        icmpTimeOut: "",
        id: "",
        //内部地址
        // Internal address
        inAddr: "",
        //tcp超时秒
        // TCP timeout seconds
        tcpTimeOut: "",
        //udp超时秒
        // Udp timeout seconds
        udpTimeOut: "",
        ipAddress: [
          {
            //外部地址
            // External address
            outAddr: "",
            key: Date.now()
          }
        ],
        editableTabs: [
          {
            title: "静态地址映射1",
            name: "1",
            content: {
              id: "",
              //内部地址
              // Internal address
              inAddr: "",
              //内部地址端口
              // Internal address port
              inAddrPort: "",
              //外部地址
              // External address
              outAddr: "",
              //外部地址端口
              // External address port
              outAddrPort: "",
              //协议
              // agreement
              protocl: ""
            }
          }
        ]
      };
      this.tabIndex = 1;
      this.editableTabsValue = "1";
      this.$refs.ruleForm.resetFields();
    },
    submitForm(formName) {
      console.log(this.$refs[formName]);
      let mid = sessionStorage.getItem("mid");
      let arr = this.ruleForm.editableTabs.map((item, index) => {
        return {
          id: "",
          inAddr: item.content.inAddr,
          inAddrPort: item.content.inAddrPort,
          outAddr: item.content.outAddr,
          outAddrPort: item.content.outAddrPort,
          protocl: item.content.protocl,
          sortNum: index
        };
      });
      let data = {
        cgnatAddrList: arr,
        descr: this.ruleForm.descr,
        icmpTimeOut: this.ruleForm.icmpTimeOut,
        id: "",
        inAddr: this.ruleForm.inAddr,
        mid: mid,
        name: this.ruleForm.name,
        outAddr: this.ruleForm.ipAddress.map(item => item.outAddr).join(","),
        tcpTimeOut: this.ruleForm.tcpTimeOut,
        udpTimeOut: this.ruleForm.udpTimeOut
      };
      // console.log(this.ruleForm.ipAddress.map(item=>item.outAddr).join(","))

      this.$refs[formName].validate(valid => {
        if (valid) {
          addCgnat(data).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: "新增成功!"
              });
              this.ruleForm = {
                name: "",
                descr: "",
                //icmp超时秒
                // The icmp timeout seconds
                icmpTimeOut: "",
                id: "",
                //内部地址
                // Internal address
                inAddr: "",
                //tcp超时秒
                // TCP timeout seconds
                tcpTimeOut: "",
                //udp超时秒
                // Udp timeout seconds
                udpTimeOut: "",
                ipAddress: [
                  {
                    //外部地址
                    // External address
                    outAddr: "",
                    key: Date.now()
                  }
                ],
                editableTabs: [
                  {
                    title: "静态地址映射1",
                    name: "1",
                    content: {
                      id: "",
                      //内部地址
                      // Internal address
                      inAddr: "",
                      //内部地址端口
                      // Internal address port
                      inAddrPort: "",
                      //外部地址
                      // External address
                      outAddr: "",
                      //外部地址端口
                      // External address port
                      outAddrPort: "",
                      //协议
                      // agreement
                      protocl: ""
                    }
                  }
                ]
              };
              this.tabIndex = 1;
              this.editableTabsValue = "1";
              this.$refs[formName].resetFields();
              this.$parent.getCgnatListInit({
                mid,
                page: this.$parent.lNumber,
                pageSize: this.$parent.Size
              });
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
        title: "静态地址映射" + this.tabIndex,
        name: newTabName,
        content: {
          port: ""
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
      let el = document.querySelectorAll(".tabsList7 .el-tabs__nav")[0];
      const _this = this;
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.ruleForm.editableTabs.splice(oldIndex, 1)[0];
          _this.ruleForm.editableTabs.splice(newIndex, 0, currRow);
        }
      });
    },

    addIp() {
      this.ruleForm.ipAddress.push({
        outAddr: "",
        key: Date.now()
      });
    },
    dataInit() {
      getProtoclItems().then(res => {
        this.protoclList = res.result;
      });
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
.addCGNAT {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(176, 181, 194, 0.3);
  z-index: 100;
}
.context {
  width: 942px;
  // height: 850px;
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
  display: flex;
  position: relative;
  #addBtn {
    position: absolute;
    top: -5px;
    left: -48px;
    > button {
      border: 0;
      font-size: 34px;
    }
  }
}
.form-top {
  display: flex;
  flex-wrap: wrap;
}
.IpLists {
  position: relative;
  .addPortBtn {
    position: absolute;
    top: 0;
    right: -48px;
  }
}
</style>
<style lang="scss">
.addCGNAT {
  .el-input {
    width: 322px;
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
    width: 322px;
    height: 34px;
    .el-textarea__inner {
      height: 100%;
    }
  }
  .el-tabs__header {
    margin-bottom: 0;
    border: 0;
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
      margin-right: 40px;
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
// .addCGNAT .tabsCon .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll {
//   padding: 0;
// }
// .addCGNAT .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav {
//   height: auto;
//   line-height: 40px;
//   width: auto;
// }
// .addCGNAT .tabsCon .el-tabs__content .el-tab-pane {
//   width: 1100px;
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
// .addCGNAT .form-top {
//   .el-textarea {
//     width: 320px;
//     height: 110px;
//     .el-textarea__inner {
//       width: 100%;
//       height: 100%;
//     }
//   }
//   .el-input {
//     width: 320px;
//     height: 4px;
//   }
// }
</style>