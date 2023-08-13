<template>
  <div class="logical">
    <!-- Vsr-qos -->
    <div class="operate">
      <button class="close" @click="removeList" v-control>{{$t('vsr1000.delete')}}</button>
      <button class="add" @click="addQos" v-control>
        <img src="@/assets/newPage/icon_add@2x.png" alt />
        {{$t('vsr1000.add')}}
      </button>

      <!-- <button class="copy" @click="copyList">{{$t('facility.copy')}}</button> -->
    </div>
    <div class="tableView">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
        fit
        size="small"
      >
        <el-table-column
          type="selection"
          width="55"
          :resizable="false"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('vsr1000.index')"
          align="center"
          width="70"
          :resizable="false"
        ></el-table-column> -->
        <el-table-column
          prop="name"
          :label="$t('vsr1000.QOSName')"
          align="center"
          :resizable="false"
        ></el-table-column>
        <!-- <el-table-column
          prop="lessee"
          :label="$t('vsr1000.strategy')"
          align="center"
        >
          <template slot-scope="scope">
            <div
              class="tableList"
              v-for="item in scope.row.qosPolicyVoList"
              :key="item.id"
            >{{item.strategyPro}}</div>
          </template>
        </el-table-column>-->
        <!-- <el-table-column
          prop="ip"
          :label="$t('vsr1000.flowGroup')"
          align="center"
        >
          <template slot-scope="scope">
            <div
              class="tableList"
              v-for="item in scope.row.qosPolicyVoList"
              :key="item.id"
            >{{item.streamTableName}}</div>
          </template>
        </el-table-column>-->
        <el-table-column
          prop="description"
          :label="$t('vsr1000.describe')"
          align="center"
          :resizable="false"
        ></el-table-column>
        <el-table-column :label="$t('vsr1000.operate')" align="center" :resizable="false">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t('vsr1000.edit')}}</el-button>
            <el-button
              @click="qosDetails(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t("vsr1000.check")}}</el-button>
            <el-button
              type="text"
              size="small"
              @click="copyList(scope.row)"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t('vsr1000.copy')}}</el-button>
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
          @size-change="pageChange"
          @current-change="sizeChange"
          :current-page="lNumber"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addQOS ref="addQOS" :isShow="isShow" />
    <editQOS ref="editQOS" :isShow2="isShow2" />
    <qosDetails ref="qosDetails" v-show="detailsShow" />
  </div>
</template>
<script>
import addQOS from "./components/addQOS.vue";
import editQOS from "./components/editQOS.vue";
import qosDetails from "./components/qosDetails";
import {
  // delQoss,
  // copyQoss,
  // getQosList,
  // toAddQos,
  // canEditQos
  getQosByCondition,
  qosAreBeenQuoted,
  qosCopQos
} from "@/services";
export default {
  props: {},
  components: {
    addQOS,
    editQOS,
    qosDetails
  },
  data() {
    return {
      devData:JSON.parse(this.$route.query.devData),
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      isShow: false,
      isShow2: false,
      detailsShow: false,
      allNum: 0, //数据总条数 Total number of data bars
                 // Total number of data bars
      lNumber: 1, //当前页数, The current number of pages
                  // The current number of pages
      Size: 10,
      tableData: [],
      multipleSelection: []
    };
  },
  computed: {},
  methods: {
    qosDetails(row) {
      this.detailsShow = true;
      this.$refs.qosDetails.dataInit(row);
    },
    indexMethod(index) {
      return (
        index + 1 + (this.lNumber == 1 ? 0 : this.Size * (this.lNumber - 1))
      );
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick(row) {
      qosAreBeenQuoted({
        action: "edit",
        verifyIds: [row.id]
      }).then(res => {
        if (res.code === 10000) {
          this.isShow2 = true;
          this.$refs.editQOS.dataInit(row);
        } else if (res.code !== 10000) {
          this.$message({
            type: "warning", 
            message: res.message
          });
        }
      });
    },
    
    pageChange(val) {
      //页数总条目改变 Total page entries change
      // Total page entries change Total Page Entries Change
      let deviceId = this.deviceId;
      this.Size = val;
      let params = {
        pageSize: this.Size,
        pageNumber: 1,
        deviceId: deviceId,
        tenantId: this.devData.tenantId
      };
      this.lNumber = 1;
      this.getQosInit(params);
    },
    sizeChange(val) {
      //页数改变 Page number change
      // Page change Page Number change
      let deviceId = this.deviceId;
      this.lNumber = val;
      let params = {
        pageSize: this.Size,
        pageNumber: this.lNumber,
        deviceId: deviceId,
        tenantId: this.devData.tenantId
      };
      this.getQosInit(params);
    },
    addQos() {
      this.isShow = true;
      this.$refs.addQOS.dataInit();
      this.$refs.addQOS.tabsDrop();
    },
    removeList() {
      if (this.multipleSelection.length) {
        let deviceId = this.deviceId;
        let ids = this.multipleSelection.map(item => item.id);
        var show47 = localStorage.getItem("show47");
        if(show47 == 'true'){
            qosAreBeenQuoted({
              action: "del",
              verifyIds: ids,
              devSerNum: this.devData.vsrSeries
            }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                this.lNumber = 1;
                this.getQosInit({
                  deviceId: this.deviceId,
                  pageNumber: this.lNumber,
                  pageSize: this.Size,
                  tenantId: this.devData.tenantId
                });
              } else if (res.code !== 10000) {
                // let msg = "";
                // res.message.split(",").forEach(item => {
                //   msg += `<P style='padding:0 0 10px 0'>${item}</P>`;
                // });
                this.lNumber = 1;
                this.getQosInit({
                  deviceId: this.deviceId,
                  pageNumber: this.lNumber,
                  pageSize: this.Size,
                  tenantId: this.devData.tenantId
                });
                this.$message({
                  type: "warning",
                  // dangerouslyUseHTMLString: true,
                  message: res.message
                });
              }
            });
        }else{
          this.$confirm(this.$t("vsr1000.qosremind[1]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue47\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
            confirmButtonText: this.$t("vsr1000.OK"),
            cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning"
          })
          .then(() => {
            qosAreBeenQuoted({
              action: "del",
              verifyIds: ids,
              devSerNum: this.devData.vsrSeries
            }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                this.lNumber = 1;
                this.getQosInit({
                  deviceId: this.deviceId,
                  pageNumber: this.lNumber,
                  pageSize: this.Size,
                  tenantId: this.devData.tenantId
                });
                localStorage.setItem("show47",localStorage.getItem("checkedValue47"));
              } else if (res.code !== 10000) {
                // let msg = "";
                // res.message.split(",").forEach(item => {
                //   msg += `<P style='padding:0 0 10px 0'>${item}</P>`;
                // });
                this.lNumber = 1;
                this.getQosInit({
                  deviceId: this.deviceId,
                  pageNumber: this.lNumber,
                  pageSize: this.Size,
                  tenantId: this.devData.tenantId
                });
                this.$message({
                  type: "warning",
                  // dangerouslyUseHTMLString: true,
                  message: res.message
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("vsr1000.qosremind[2]")
            });
          });

        }
        
        
      } else {
        this.$message({
          type: "warning",
          message: this.$t("vsr1000.qosremind[4]")
        });
      }
    },
    remove(row) {
      let deviceId = this.deviceId;
      var show48 = localStorage.getItem("show48");
        if(show48 == 'true'){
          qosAreBeenQuoted({
            action: "del",
            verifyIds: [row.id],
            devSerNum: this.devData.vsrSeries
          }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]")
              });
              this.lNumber = 1;
              this.getQosInit({
                deviceId: this.deviceId,
                pageNumber: this.lNumber,
                pageSize: this.Size,
                tenantId: this.devData.tenantId
              });
            } else if (res.code !== 10000) {
              // let msg = "";
              // res.message.split(",").forEach(item => {
              //   msg += `<P style='padding:0 0 10px 0'>${item}</P>`;
              // });
              this.lNumber = 1;
              this.getQosInit({
                deviceId: this.deviceId,
                pageNumber: this.lNumber,
                pageSize: this.Size,
                tenantId: this.devData.tenantId
              });
              this.$message({
                type: "warning",
                // dangerouslyUseHTMLString: true,
                message: res.message
              });
            }
          });
        }else{
          this.$confirm(this.$t("vsr1000.qosremind[1]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue48\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          qosAreBeenQuoted({
            action: "del",
            verifyIds: [row.id],
            devSerNum: this.devData.vsrSeries
          }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]")
              });
              this.lNumber = 1;
              this.getQosInit({
                deviceId: this.deviceId,
                pageNumber: this.lNumber,
                pageSize: this.Size,
                tenantId: this.devData.tenantId
              });
              localStorage.setItem("show48",localStorage.getItem("checkedValue48"));
            } else if (res.code !== 10000) {
              // let msg = "";
              // res.message.split(",").forEach(item => {
              //   msg += `<P style='padding:0 0 10px 0'>${item}</P>`;
              // });
              this.lNumber = 1;
              this.getQosInit({
                deviceId: this.deviceId,
                pageNumber: this.lNumber,
                pageSize: this.Size,
                tenantId: this.devData.tenantId
              });
              this.$message({
                type: "warning",
                // dangerouslyUseHTMLString: true,
                message: res.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("vsr1000.qosremind[2]")
          });
        });
        }
      
    },
    copyList(row) {
      var show49 = localStorage.getItem("show49");
      if(show49 == 'true'){
          let deviceId = this.deviceId;
          qosCopQos({
            deviceId,
            qosId: row.id,
            devSerialNum: this.devData.vsrSeries
          }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.qosremind[6]")
              });
              this.getQosInit({
                deviceId: this.deviceId,
                pageNumber: this.lNumber,
                pageSize: this.Size,
                tenantId: this.devData.tenantId
              });
            }
          });
      }else{
        this.$confirm(this.$t("vsr1000.confirmCopy"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue49\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          let deviceId = this.deviceId;
          qosCopQos({
            deviceId,
            qosId: row.id,
            devSerialNum: this.devData.vsrSeries
          }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.qosremind[6]")
              });
              this.getQosInit({
                deviceId: this.deviceId,
                pageNumber: this.lNumber,
                pageSize: this.Size,
                tenantId: this.devData.tenantId
              });
              localStorage.setItem("show49",localStorage.getItem("checkedValue49"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("vsr1000.qosremind[3]")
          });
        });
      }
      
    },
    //Qos列表获取
    // Qos list acquisition
    async getQosInit(params) {
      let data = await getQosByCondition(params);
      // let data2 = await toAddQos(params);
      if (data.code === 10000) {
        this.allNum = data.result.totalElements;
        this.tableData = data.result.content;
      }
    }
  },
  created() {
    this.getQosInit({
      deviceId: this.deviceId,
      pageNumber: this.lNumber,
      pageSize: this.Size,
      tenantId: this.devData.tenantId
    });
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.logical {
  padding: 20px 30px 0 30px;
}
.operate {
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  button {
    float: right;
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    border: none;
    outline: none;
    cursor: pointer;
    display: table-cell;
    vertical-align: middle;
    img {
      width: 14px;
      height: 14px;
      position: relative;
      top: 1px;
    }
  }
  .add:hover {
    background: #6095d6;
  }
  .close {
    float: right;
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-left: 23px;
  }
}
.tableView {
  padding-top: 20px;
}
.tableList {
  line-height: 40px;
}
.tableList:first-of-type {
  border-bottom: 1px solid #ebeef5;
}
.tableList:last-of-type {
  border: 0;
}
</style>
