<template>
  <!-- Cidr设置 -->
  <div class="CidrSet">
    <div class="content">
      <h4 class="title">
        <span>{{$t('netWork.cidrSet')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <!-- <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          label-width="80px"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item prop="value">
            <el-input
              type="textarea"
              v-model="ruleForm.value"
              :placeholder="$t('netWork.msg2')"
            ></el-input>
          </el-form-item>
        </el-form>-->
        <div class="btns">
          <button class="add" @click.prevent="addNetWork">
            <img src="@/assets/newPage/icon_add@2x.png" alt />
            {{$t('newModel.add')}}
          </button>
          <button class="close" @click.prevent="removeList">{{$t('newModel.delete')}}</button>
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
      </div>
      <!-- <div class="submit">
        <button class="save" v-debounce.prevent="submitForm">{{$t('vsr1000.save')}}</button>
        <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
      </div>-->
    </div>
    <addNet ref="addNet" v-show="ishow"/>
    <editNet ref="editNet" v-show="eishow" />
  </div>
</template>
<script>
import {
  bgpCidrGet,
  bgpCidrSave,
  bgpCidrDel,
  bgpPolicyGetBgpPolicyByVrfId,
  bgpCidrCheckUrl,
} from "@/services";
import addNet from "./components/addNetWork";
import editNet from "./components/editNetWork";
export default {
  data() {
    // var IpAddressRule = (rule, value, callback) => {
    //   if (value) {
    //     let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/;
    //     let ipArr = value.split(",");
    //     let flag = null;
    //     ipArr.forEach((item) => {
    //       if (reg.test(item)) {
    //         flag = true;
    //       } else {
    //         flag = false;
    //       }
    //     });
    //     if (flag) {
    //       callback();
    //     } else {
    //       callback(new Error(this.$t("netWork.msg1")));
    //     }
    //   }
    // };
    return {
      // ruleForm: {
      //   value: "",
      // },
      // rules: {
      //   value: [
      //     {
      //       required: true,
      //       message: this.$t("vsr1000.remind2[4]"),
      //       trigger: "blur",
      //     },
      //     { validator: IpAddressRule, trigger: "blur" },
      //   ],
      // },
      // sceneId: "",
      // sceneDeviceId: "",
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
      // CidrRule: { validator: CidrRule, trigger: "blur" },
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
    //取消
    // cancel
    close() {
      this.$parent.CidrShow = false;
      this.$refs.form.resetFields();
    },
    // //获取cidr
    // To obtain the cidr
    // dataInit(params) {
    //   this.sceneId = params.sceneId;
    //   this.sceneDeviceId = params.sceneDeviceId;
    //   sceneNodeGetCidr(params).then((res) => {
    //     if (res.code === 10000) {
    //       this.ruleForm.value = res.result;
    //     }
    //   });
    // },
    // //提交
    // submit
    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       let params = {
    //         sceneDeviceId: this.sceneDeviceId,
    //         sceneId: this.sceneId,
    //         cidr: this.ruleForm.value,
    //       };
    //       sceneNodeCidr(params).then((res) => {
    //         if (res.code === 10000) {
    //           this.close();
    //           this.$message({
    //             type: "success",
    //             message: this.$t("vsr1000.remind2[5]"),
    //           });
    //           // this.$parent.page = 1;
    //           // this.$parent.dataInit({
    //           //   netName: "",
    //           //   pageNumber: this.$parent.page,
    //           //   pageSize: this.$parent.pageSize,
    //           //   tenantVrfId: this.$parent.vrfName,
    //           //   type: 1,
    //           // },"change");
    //         } else {
    //           this.$message({
    //             type: "warning",
    //             message: res.message,
    //           });
    //           this.close();
    //         }
    //       });
    //     }
    //   });
    // },
    dataInit() {
      bgpCidrGet({
        pageNumber: this.page,
        pageSize: this.pageSize,
        bgpVrfId: this.$parent.bgpVrfId,
        dataForm:"2"
      }).then((res) => {
        if (res.code === 10000) {
          this.tableData = res.result.content;
          this.allNum = res.result.totalElements;
        }
      });
      // bgpPolicyGetBgpPolicyByVrfId({
      //   deviceId: this.$parent.deviceId,
      // }).then((res) => {
      //   if (res.code === 10000) {
      //     this.routeMapList = res.result == null ? [] : res.result;
      //   }
      // });
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
      var show80 = localStorage.getItem("show80");
      if(show80 == 'true'){
        
          bgpCidrDel({ ids: [row.id] }).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]"),
              });
              this.page = 1;
              this.dataInit();
            } else if (res.code !== 10000) {
              this.page = 1;
              this.dataInit();
              this.$message({
                type: "warning",
                message: res.message,
              });
            }
          });
      }else{
        this.$confirm(this.$t("vsr1000.qosremind[1]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue80\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning",
        })
        .then(() => {
          bgpCidrDel({ ids: [row.id] }).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]"),
              });
              this.page = 1;
              this.dataInit();
              localStorage.setItem("show80",localStorage.getItem("checkedValue80"));
            } else if (res.code !== 10000) {
              this.page = 1;
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
        var show81 = localStorage.getItem("show81");
        if(show81 == 'true'){
          
            bgpCidrDel({ ids }).then((res) => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]"),
                });
                this.page = 1;
                this.dataInit();
              } else if (res.code !== 10000) {
                this.page = 1;
                this.dataInit();
                this.$message({
                  type: "warning",
                  message: res.message,
                });
              }
            });
        }else{
          this.$confirm(this.$t("vsr1000.qosremind[1]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue81\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
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
                this.page = 1;
                this.dataInit();
                localStorage.setItem("show81",localStorage.getItem("checkedValue81"));
              } else if (res.code !== 10000) {
                this.page = 1;
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
      // console.log(123);
      this.ishow = true;
      this.$refs.addNet.dataInit()
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
};
</script>
<style scoped lang="scss">
.CidrSet {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.content {
  width: 600px;
  height: 500px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -250px;
  margin-left: -300px;
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
      background: url("../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.formList {
  zoom: 1;
  padding-bottom: 20px;

  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  padding: 20px 30px;
}
.btns {
  float: right;
  padding-bottom: 20px;
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
.submit {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 30px;
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
.CidrSet {
  .el-textarea {
    width: 100%;
    height: 170px;
    .el-textarea__inner {
      height: 100%;
      border-radius: 7px;
    }
  }
  // .el-form-item {
  //   margin: 0;
  // }
  // .el-form-item__content {
  //   margin-left: 0 !important;
  // }
}
</style>