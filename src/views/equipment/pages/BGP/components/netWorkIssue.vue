<template>
  <!-- 网段发布 -->
  <div class="netWorkIssue">
    <!-- <el-form
      :model="ruleForm"
      ref="form"
      label-width="90px"
      class="demo-ruleForm"
      @submit.native.prevent
    >
      <div class="tabsCon">
        <el-tabs
          v-model="editableTabsValue"
          type="card"
          closable
          editable
          @edit="addTab"
          class="tabsNetWorkIssue"
        >
          <el-tab-pane
            v-for="(item,index) in ruleForm.formData"
            :key="item.name"
            :label="item.title"
            :name="item.name"
            class="addEl"
          >
            <el-form-item
              label="cidr"
              :prop="'formData.'+index+'.cidr'"
              :rules="[
                {required: true,message: $t('newModel.msg3'),trigger: 'blur'},
                CidrRule,
              ]"
            >
              <el-input type="textarea" v-model="item.cidr" @blur="zhuan(item.cidr,index)"></el-input>
            </el-form-item>
            <el-form-item
              class="RouteMap"
              label="Route_Map"
              :prop="'formData.'+index+'.bgpPolicyId'"
            >
              <el-select filterable v-model="item.bgpPolicyId" v-if="devType==='vsr1000'">
                <el-option :label="$t('vsr1000.noHave')" value></el-option>
                <el-option v-for="el in routeMapList" :key="el.id" :label="el.name" :value="el.id"></el-option>
              </el-select>
              <button
                :class="{btnEn:lang=='en'}"
                @click.prevent="goRouteMap"
              >{{$t('newModel.jumpTo')}}</button>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form>-->
    <div class="submit">
      <div class="btns">
        <button class="add" @click.prevent="addNetWork">
          <img src="@/assets/newPage/icon_add@2x.png" alt />
          {{$t('newModel.add')}}
        </button>
        <button class="close" @click.prevent="removeList">{{$t('newModel.delete')}}</button>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      stripe
      size="small"
      fit
      @selection-change="handleSelectionChange"
      tooltip-effect="dark"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        show-overflow-tooltip
        :resizable="false"
      ></el-table-column>
      <!-- <el-table-column
        type="index"
        :index="indexMethod"
        :label="$t('vsr1000.index')"
        align="center"
        width="65"
        show-overflow-tooltip
        :resizable="false"
      ></el-table-column> -->
      <el-table-column
        prop="cidr"
        label="Cidr"
        align="center"
        show-overflow-tooltip
        :resizable="false"
      ></el-table-column>
      <el-table-column
        prop="bgpPolicyName"
        label="Route_Map"
        align="center"
        show-overflow-tooltip
        :resizable="false"
      ></el-table-column>
      <el-table-column
        :label="$t('newModel.operation')"
        align="center"
        show-overflow-tooltip
        :resizable="false"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row)"
            type="text"
            size="small"
            style="color:#3678C8;font-size:14px;font-weight:400"
            v-control
          >{{$t('vsr1000.edit')}}</el-button>
          <el-button
            type="text"
            size="small"
            @click="remove(scope.row)"
            style="color:#3678C8;font-size:14px;font-weight:400"
            v-control
          >{{$t('vsr1000.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        :page-sizes="[5, 10]"
        :total="allNum"
        :page-size="10"
        @size-change="pageChange"
        @current-change="sizeChange"
        :current-page="page"
        layout="total, sizes, prev, next, jumper"
        style="font-family: arial, sans-serif"
      ></el-pagination>
    </div>
    <addNet v-if="ishow" />
    <editNet ref="editNet" v-show="eishow" />
  </div>
</template>
<script>
import addNet from "./components/addNetWork";
import editNet from "./components/editNetWork";
import {
  bgpCidrGet,
  bgpCidrSave,
  bgpCidrDel,
  bgpPolicyGetBgpPolicyByVrfId,
  bgpCidrCheckUrl,
} from "@/services";
import { compare } from "@/utils/change";
export default {
  data() {
    var CidrRule = (rule, value, callback) => {
      if (value) {
        bgpCidrCheckUrl({ urls: value }).then((res) => {
          if (res.success) {
            callback();
          } else {
            callback(new Error(this.$t("newModel.msg20")));
          }
        });
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      ruleForm: {
        formData: [
          {
            title: `${this.$t("newModel.declare")}1`,
            name: "1",
            bgpPolicyId: "",
            bgpPolicyName: "",
            bgpVrfId: this.$parent.bgpVrfId,
            cidr: "",
            id: "",
            sendId: null,
          },
        ],
      },
      routeMapList: [],
      formDataArr: [],
      CidrRule: { validator: CidrRule, trigger: "blur" },
      tabIndex: 1,
      editableTabsValue: "1",
      devType: "",
      tableData: [],
      multipleSelection: [],
      page: 1,
      pageSize: 5,
      allNum: 0,
      ishow: false,
      eishow: false,
    };
  },
  components: {
    addNet,
    editNet,
  },
  methods: {
    //新增删除tbs
    // Add delete TBS
    // Add delete TBS
    // addTab(targetName, action) {
    //   if (action === "add") {
    //     let newTabName = ++this.tabIndex + "";
    //     this.ruleForm.formData.push({
    //       title: `${this.$t("newModel.declare")}` + this.tabIndex,
    //       name: newTabName,
    //       bgpPolicyId: "",
    //       bgpPolicyName: "",
    //       bgpVrfId: this.$parent.bgpVrfId,
    //       cidr: "",
    //       id: "",
    //       sendId: null,
    //     });
    //     this.editableTabsValue = newTabName;
    //   }
    //   if (action === "remove") {
    //     let tabs = this.ruleForm.formData;
    //     let id = "";
    //     if (tabs.length > 1) {
    //       id = tabs.find((item) => item.name == targetName).id;
    //       this.ruleForm.formData = tabs.filter(
    //         (tab) => tab.name !== targetName
    //       );
    //     } else if (tabs.length == 1) {
    //       id = tabs.find((item) => item.name == targetName).id;
    //       this.ruleForm.formData = [
    //         {
    //           title: `${this.$t("newModel.declare")}1`,
    //           name: "1",
    //           bgpPolicyId: "",
    //           bgpPolicyName: "",
    //           bgpVrfId: this.$parent.bgpVrfId,
    //           cidr: "",
    //           id: "",
    //           sendId: null,
    //         },
    //       ];
    //     }
    //     this.ruleForm.formData = this.ruleForm.formData.map((item, index) => {
    //       return {
    //         title: `${this.$t("newModel.declare")}` + (index + 1),
    //         name: index + 1 + "",
    //         bgpPolicyId: item.bgpPolicyId,
    //         bgpPolicyName: item.bgpPolicyName,
    //         bgpVrfId: this.$parent.bgpVrfId,
    //         cidr: item.cidr,
    //         id: item.id,
    //         sendId: item.sendId,
    //       };
    //     });
    //     this.tabIndex = this.ruleForm.formData.length;
    //     this.editableTabsValue = this.tabIndex + "";
    //     if (id.length) {
    //       bgpCidrDel({ id }).then((res) => {
    //         if (res.code === 10000) {
    //           this.$message({
    //             type: "success",
    //             message: this.$t("vsr1000.remind2[2]"),
    //           });
    //         }
    //       });
    //     }
    //   }
    // },
    // //提交
    // submit
    // submitForm() {
    //   this.$refs.form.validate((valid) => {
    //     if (valid) {
    //       let params = this.setParamsData().map((item) => {
    //         return {
    //           bgpPolicyId: item.bgpPolicyId,
    //           bgpPolicyName:
    //             this.devType == "vsr1000" && item.bgpPolicyId
    //               ? this.routeMapList.find((el) => el.id == item.bgpPolicyId)
    //                   .name
    //               : "",
    //           bgpVrfId: this.$parent.bgpVrfId,
    //           cidr: item.cidr,
    //           id: item.id,
    //           sendId: item.sendId,
    //         };
    //       });

    //       params.forEach((item) => {
    //         if (!item.id.length) {
    //           delete item.id;
    //         }
    //         if (!item.sendId) {
    //           delete item.sendId;
    //         }
    //       });
    //       if (params.length) {
    //         bgpCidrSave(params).then((res) => {
    //           if (res.code === 10000) {
    //             this.$message({
    //               type: "success",
    //               message: this.$t("vsr1000.remind2[5]"),
    //             });
    //             this.dataInit();
    //           }
    //         });
    //       }
    //     }
    //   });
    // },
    // //下发数据封装
    // Release data encapsulation
    // setParamsData() {
    //   let data1 = this.ruleForm.formData;
    //   let data2 = this.formDataArr;
    //   let paramsArr = [];
    //   data1.forEach((item, index) => {
    //     let bgpItem = data2.find((el) => el.id == item.id);
    //     if (bgpItem) {
    //       if (this.isObjectValueEqual(item, bgpItem)) {
    //         paramsArr.push(item);
    //       } else {
    //         paramsArr = [...paramsArr];
    //       }
    //     } else {
    //       paramsArr.push(item);
    //     }
    //   });
    //   return paramsArr;
    // },
    // //判断下发数据是否修改
    // Determine whether the issued data is modified
    // isObjectValueEqual(val1, val2) {
    //   var aProps = Object.keys(val1);
    //   for (var i = 0; i < aProps.length; i++) {
    //     var propName = aProps[i];
    //     if (val1[propName] !== val2[propName]) {
    //       return true;
    //     }
    //   }
    //   return false;
    // },
    //数据初始化
    // Data initialization
    // Data initialization
    dataInit() {
    
      bgpCidrGet({
        pageNumber: this.page,
        pageSize: this.pageSize,
        bgpVrfId: this.$parent.bgpVrfId,
      }).then((res) => {
        // if (res.code === 10000 && res.result.length) {
        //   let dataArr = [];
        //   res.result.map((item, index) => {
        //     dataArr.push({
        //       title: `${this.$t("newModel.declare")}` + (index + 1),
        //       name: index + 1 + "",
        //       bgpPolicyId: item.bgpPolicyId,
        //       bgpPolicyName: item.bgpPolicyName,
        //       bgpVrfId: this.$parent.bgpVrfId,
        //       cidr: item.cidr,
        //       id: item.id,
        //       sendId: item.sendId,
        //     });
        //   });
        //   this.formDataArr = JSON.parse(JSON.stringify(dataArr));
        //   this.ruleForm.formData = dataArr;
        //   this.tabIndex = dataArr.length;
        // } else {
        //   this.ruleForm = {
        //     formData: [
        //       {
        //         title: `${this.$t("newModel.declare")}1`,
        //         name: "1",
        //         bgpPolicyId: "",
        //         bgpPolicyName: "",
        //         bgpVrfId: this.$parent.bgpVrfId,
        //         cidr: "",
        //         id: "",
        //         sendId: null,
        //       },
        //     ],
        //   };
        //   this.tabIndex = this.ruleForm.formData.length;
        //   this.editableTabsValue = this.tabIndex + "";
        // }
        if (res.code === 10000) {
          this.tableData = res.result.content;
          this.allNum = res.result.totalElements;
        }
      });
      // bgpPolicyGetBgpPolicyByVrfId({
      //   deviceId: this.$parent.deviceId,
      //   bgpVrfId: this.$parent.bgpVrfId,
      // }).then((res) => {
      //   if (res.code === 10000) {
      //     this.routeMapList = res.result == null ? [] : res.result;
      //   }
      // });
    },
    //ip地址转换
    // IP address translation
    // zhuan(val, index) {
    //   if (val.length) {
    //     let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/;
    //     let str = "";
    //     val.split(",").forEach((item) => {
    //       if (reg.test(item)) {

    //         let ip = item.split("/")[0];
    //         let code = item.split("/")[1];
    //         if (code == 32) {
    //           return;
    //         } else {
    //           str += compare(ip, code) + "/" + code + ","
    //         }
    //       }
    //     });
    //     this.ruleForm.formData[index].cidr = str.slice(0,-1)
    //     // console.log(str.slice(0,-1))
    //     // if (reg.test(val)) {
    //     //   let str = "";
    //     //   let ip = val.split("/")[0];
    //     //   let code = val.split("/")[1];
    //     //   if (code == 32) {
    //     //     return;
    //     //   } else {
    //     //     str = compare(ip, code) + "/" + code;
    //     //   }

    //     //   this.ruleForm.formData[index].cidr = str;
    //     // }
    //   }
    // },
    goRouteMap() {
      this.$parent.tabsIndex = 1;
    },

    //多选
    // multi-select
    // multi-select
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //序号展示
    // The serial number display
    // Serial number display
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //编辑
    // edit
    // edit
    handleClick(row) {
      this.eishow = true;
      this.$refs.editNet.dataInit(row);
    },
    //单项删除
    // Single delete
    // Item deletion
    remove(row) {
      var show17 = localStorage.getItem("show17");
      if(show17 == 'true'){
        bgpCidrDel({ ids:[row.id] }).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]"),
              });
              this.page = 1
              this.dataInit();
            } else if (res.code !== 10000) {
              this.page = 1
              this.dataInit();
              this.$message({
                type: "warning",
                message: res.message,
              });
            }
          });
      }else{
        this.$confirm(this.$t("vsr1000.qosremind[1]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue17\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
        confirmButtonText: this.$t("vsr1000.OK"),
        cancelButtonText: this.$t("vsr1000.cancel"),
          dangerouslyUseHTMLString: true,
        type: "warning",
      })
        .then(() => {
          bgpCidrDel({ ids:[row.id] }).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]"),
              });
              this.page = 1
              this.dataInit();
              localStorage.setItem("show17",localStorage.getItem("checkedValue17"));
            } else if (res.code !== 10000) {
              this.page = 1
              this.dataInit();
              this.$message({
                type: "warning",
                message: res.message,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("vsr1000.qosremind[2]"),
          });
        });
      }
      
      
    },
    //多项删除
    // A number of deleted
    // Multiple deletions
    removeList() {
      if (this.multipleSelection.length) {
        let ids = this.multipleSelection.map((item) => item.id);
        var show18 = localStorage.getItem("show18");
        if(show18 == 'true'){
          bgpCidrDel({ ids }).then((res) => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]"),
                });
                this.page = 1
                this.dataInit();
              } else if (res.code !== 10000) {
                this.page = 1
                this.dataInit();
                this.$message({
                  type: "warning",
                  message: res.message,
                });
              }
            });
        }else{
          this.$confirm(this.$t("vsr1000.qosremind[1]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue18\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning",
        })
          .then(() => {
            bgpCidrDel({ ids }).then((res) => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]"),
                });
                this.page = 1
                this.dataInit();
                localStorage.setItem("show18",localStorage.getItem("checkedValue18"));
              } else if (res.code !== 10000) {
                this.page = 1
                this.dataInit();
                this.$message({
                  type: "warning",
                  message: res.message,
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("vsr1000.qosremind[2]"),
            });
          });
        }
        
      } else {
        this.$message({
          type: "warning",
          message: this.$t("vsr1000.qosremind[4]"),
        });
      }
    },
    //新增
    // add
    //add
    addNetWork() {
      this.ishow = true;
    },
    //页面条数改变
    // The number of page bars changed
    //The number of page bars changed
    pageChange(val) {
      this.pageSize = val;
      this.page = 1;
      
      this.dataInit();
    },
    //页数改变
    // Page number change
    //Page number change
    sizeChange(val) {
      this.page = val;
      
      this.dataInit();
    },
  },
  mounted() {},
  created() {
    this.devType = JSON.parse(this.$route.query.devData).deviceType;
    // this.dataInit()
  },
};
</script>
<style scoped lang="scss">
.netWorkIssue {
  width: 100%;
  height: 100%;
}
.inRouter,
.outRouter {
  button {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    border: 0;
    outline: none;
    background: #fff;
    cursor: pointer;
  }
}
.tabsCon {
  width: 100%;
  height: 100%;
  .tabsNetWorkIssue {
    width: 100%;
    height: 100%;
  }
}
.RouteMap {
  button {
    width: 160px;
    text-align: right;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    border: 0;
    outline: none;
    background: #fff;
    cursor: pointer;
  }
  .btnEn {
    width: 160px;
  }
}
.submit {
  zoom: 1;
  padding-bottom: 20px;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
}
.btns {
  float: right;
  .save {
    width: 90px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border: 0;
    border-radius: 7px;
    color: #fff;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    outline: none;
    cursor: pointer;
  }
  .save:hover {
    background: #6095d6;
  }
  .add,
  .close {
    width: 100px;
    height: 34px;
    font-family: arial, sans-serif;
    font-weight: 400;
    border: 0;
    outline: none;
    cursor: pointer;
    margin-left: 14px;
    img {
      width: 14px;
      height: 14px;
      position: relative;
      top: 1px;
    }
  }
  .add {
    background: #3678c8;
    color: #fff;
  }
  .add:hover {
    background: #6095d6;
  }
  .close {
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
  }
}
</style>
<style lang="scss">
.netWorkIssue {
  .el-form {
    width: 100%;
    height: 100%;
  }
  // .el-input,
  // .el-select {
  //   width: 100%;
  //   height: 34px;
  //   .el-input__inner {
  //     height: 100%;
  //     border-radius: 7px;
  //   }
  //   .el-input__icon {
  //     line-height: normal;
  //   }
  // }
  .el-textarea {
    width: 100%;
    height: 160px;
    .el-textarea__inner {
      height: 100%;
      border-radius: 7px;
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
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: 1px solid rgba(209, 215, 224, 1);
  }
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
  .el-tabs__content {
    background: #fff;
    overflow: auto;
    padding: 30px;
    border: 1px solid rgba(209, 215, 224, 1);
    border-top: 0;
    width: 100%;
    height: calc(100% - 31px);
  }
  .el-tabs__content::-webkit-scrollbar {
    width: 4px;
  }
  .el-tabs__content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .el-tabs__content::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .el-tabs__item {
    padding: 0 16px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(49, 104, 172, 1);
    background: #fff;
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
  .RouteMap {
    .el-form-item__content {
      height: 40px;
      display: flex;
      align-items: center;
    }
  }
}
</style>