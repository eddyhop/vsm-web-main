<template>
  <div class="steamGroup">
    <!-- Vsr-vpn -->
    <div class="operate">
      <button class="close" @click="removeList" v-control>{{$t('vsr1000.delete')}}</button>
      <button class="add" @click="addStreamG" v-control>
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
        <el-table-column type="selection" width="55" align="center" show-overflow-tooltip :resizable="false"></el-table-column>
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('vsr1000.index')"
          align="center"
          width="60"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column> -->
        <el-table-column
          prop="name"
          :label="$t('vsr1000.name')"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <!-- <el-table-column :label="$t('vsr1000.sourceIP')" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div
              class="tableList"
              v-for="item in scope.row.streamVoList"
              :key="item.id"
            >{{item.sourceIp}}</div>
          </template>
        </el-table-column>-->
        <!-- <el-table-column :label="$t('vsr1000.destIP')" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div
              class="tableList"
              v-for="item in scope.row.streamVoList"
              :key="item.id"
            >{{item.destinationIp}}</div>
          </template>
        </el-table-column>-->
        <!-- <el-table-column :label="$t('vsr1000.relevanceApply')" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div
              class="tableList"
              v-for="item in scope.row.streamVoList"
              :key="item.id"
            >{{item.appName}}</div>
          </template>
        </el-table-column>-->
        <el-table-column
          prop="description"
          :label="$t('vsr1000.describe')"
          align="center"
          show-overflow-tooltip
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
    <addStream :isShow="isShow" ref="add" />
    <editStream :isShow2="isShow2" ref="editStream" />
  </div>
</template>
<script>
import addStream from "./components/addStream.vue";
import editStream from "./components/editStream";
import {
  // delStreams,
  // copyStreams,
  // getStreamList,
  // toAddStream,
  // canEditSg,
  streamGetByCondition,
  streamAreBeenQuoted,
  streamCopyStreamGroup
} from "@/services";
export default {
  props: {},
  components: {
    addStream,
    editStream
  },
  data() {
    return {
      devData:JSON.parse(this.$route.query.devData),
      isShow: false,
      isShow2: false,
      allNum: 0, //数据总条数
                 // Total number of data bars
      lNumber: 1, //当前页数,
                  // Current number of pages,
      Size: 10,
      tableData: [],
      multipleSelection: []
    };
  },
  computed: {},
  methods: {
    indexMethod(index) {
      return (
        index + 1 + (this.lNumber == 1 ? 0 : this.Size * (this.lNumber - 1))
      );
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick(row) {
      // console.log(row);
      streamAreBeenQuoted({
        action: "edit",
        verifyIds: [row.id]
      }).then(res => {
        if (res.code === 10000) {
          this.isShow2 = true;
          this.$refs.editStream.editData(row);
          this.$refs.editStream.dataInit();
        } else if (res.code !== 10000) {
          // let msg = "";
          // res.message.split(",").forEach(item => {
          //   msg += `<P style='padding:0 0 10px 0'>${item}</P>`;
          // });
          this.$message({
            type: "warning",
            // dangerouslyUseHTMLString: true,
            message: res.message
          });
        }
      });
    },
    addStreamG() {
      this.isShow = true;
      this.$refs.add.tabsDrop();
      this.$refs.add.dataInit();
    },
    pageChange(val) {
      //页数总条目改变
      // Total page entries change
      let deviceId = JSON.parse(this.$route.query.devData).deviceId;
      this.Size = val;
      let params = {
        pageSize: this.Size,
        pageNumber: 1,
        deviceId: deviceId,
        tenantId: this.devData.tenantId
      };
      this.lNumber = 1;
      this.getStreamListInit(params);
    },
    sizeChange(val) {
      //页数改变
      // Page number change
      // console.log(val)
      let deviceId = JSON.parse(this.$route.query.devData).deviceId;
      this.lNumber = val;
      let params = {
        pageSize: this.Size,
        pageNumber: this.lNumber,
        deviceId: deviceId,
        tenantId: this.devData.tenantId
      };
      this.getStreamListInit(params);
    },
    removeList() {
      if (this.multipleSelection.length) {
        let deviceId = JSON.parse(this.$route.query.devData).deviceId;
        let ids = this.multipleSelection.map(item => item.id);
        var show56 = localStorage.getItem("show56");
        if(show56 == 'true'){
            streamAreBeenQuoted({ action: "del", verifyIds: ids }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                this.getStreamListInit({
                  deviceId: JSON.parse(this.$route.query.devData).deviceId,
                  pageNumber: this.lNumber,
                  pageSize: this.Size,
                  tenantId: this.devData.tenantId
                });
              } else if (res.code !== 10000) {
                // let msg = "";
                // res.message.split(",").forEach(item => {
                //   msg += `<P style='padding:0 0 10px 0'>${item}</P>`;
                // });
                this.getStreamListInit({
                  deviceId: JSON.parse(this.$route.query.devData).deviceId,
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
          this.$confirm(this.$t("vsr1000.confirmDel")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue56\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("vsr1000.hint"), {
            confirmButtonText: this.$t("vsr1000.OK"),
            cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning"
          })
          .then(() => {
            streamAreBeenQuoted({ action: "del", verifyIds: ids }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                this.getStreamListInit({
                  deviceId: JSON.parse(this.$route.query.devData).deviceId,
                  pageNumber: this.lNumber,
                  pageSize: this.Size,
                  tenantId: this.devData.tenantId
                });
                localStorage.setItem("show56",localStorage.getItem("checkedValue56"));
              } else if (res.code !== 10000) {
                // let msg = "";
                // res.message.split(",").forEach(item => {
                //   msg += `<P style='padding:0 0 10px 0'>${item}</P>`;
                // });
                this.getStreamListInit({
                  deviceId: JSON.parse(this.$route.query.devData).deviceId,
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
              message: this.$t("vsr1000.closeDel")
            });
          });
        }
          
      } else {
        this.$message({
          type: "warning",
          message: this.$t("vsr1000.deltel")
        });
      }
    },
    remove(row) {
      let deviceId = JSON.parse(this.$route.query.devData).deviceId;
      var show57 = localStorage.getItem("show57");
      if(show57 == 'true'){
          streamAreBeenQuoted({ action: "del", verifyIds: [row.id] }).then(
            res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                this.getStreamListInit({
                  deviceId: JSON.parse(this.$route.query.devData).deviceId,
                  pageNumber: this.lNumber,
                  pageSize: this.Size,
                  tenantId: this.devData.tenantId
                });
              } else if (res.code !== 10000) {
                // let msg = "";
                // res.message.split(",").forEach(item => {
                //   msg += `<P style='padding:0 0 10px 0'>${item}</P>`;
                // });
                this.getStreamListInit({
                  deviceId: JSON.parse(this.$route.query.devData).deviceId,
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
            }
          );
      }else{
        this.$confirm(this.$t("vsr1000.confirmDel")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue57\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("vsr1000.hint"), {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          streamAreBeenQuoted({ action: "del", verifyIds: [row.id] }).then(
            res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                this.getStreamListInit({
                  deviceId: JSON.parse(this.$route.query.devData).deviceId,
                  pageNumber: this.lNumber,
                  pageSize: this.Size,
                  tenantId: this.devData.tenantId
                });
                localStorage.setItem("show57",localStorage.getItem("checkedValue57"));
              } else if (res.code !== 10000) {
                // let msg = "";
                // res.message.split(",").forEach(item => {
                //   msg += `<P style='padding:0 0 10px 0'>${item}</P>`;
                // });
                this.getStreamListInit({
                  deviceId: JSON.parse(this.$route.query.devData).deviceId,
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
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("vsr1000.closeDel")
          });
        });
      }
      
    },
    //复制单项
    // Copy the single
    copyList(row) {
      var show58 = localStorage.getItem("show58");
      if(show58 == 'true'){
        
          streamCopyStreamGroup({
            deviceId: JSON.parse(this.$route.query.devData).deviceId,
            streamGroupId: row.id
          }).then(res => {
            let deviceId = JSON.parse(this.$route.query.devData).deviceId;
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[9]")
              });
              this.getStreamListInit({
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageNumber: this.lNumber,
                pageSize: this.Size,
                tenantId: this.devData.tenantId
              });
            }
          });
      }else{
        this.$confirm(this.$t("vsr1000.confirmCopy")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue58\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("vsr1000.hint"), {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          streamCopyStreamGroup({
            deviceId: JSON.parse(this.$route.query.devData).deviceId,
            streamGroupId: row.id
          }).then(res => {
            let deviceId = JSON.parse(this.$route.query.devData).deviceId;
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[9]")
              });
              this.getStreamListInit({
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageNumber: this.lNumber,
                pageSize: this.Size,
                tenantId: this.devData.tenantId
              });
              localStorage.setItem("show58",localStorage.getItem("checkedValue58"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("vsr1000.closeDel")
          });
        });
      }
      
    },
    async getStreamListInit(params) {
      let data = await streamGetByCondition(params);
      if (data.code === 10000) {
        this.allNum = data.result.totalElements;
        this.tableData = data.result.content;
      }
    }
    // arraySpanMethod({ row, column, rowIndex, columnIndex }) {
    //   // // console.log(row);
    //   if (columnIndex === 2) {
    //     if (rowIndex=0) {
    //       return {
    //         rowspan: row.spanNum,
    //         colspan: 1
    //       };
    //     }
    //   } else{

    //   }
    //   // else if(columnIndex === 6) {
    //   //   return {
    //   //     rowspan: 0,
    //   //     colspan: 0
    //   //   };
    //   // }else if (columnIndex === 7){

    //   // }else{
    //   //   return {
    //   //     rowspan: 0,
    //   //       colspan: 0
    //   //   }
    //   // }

    //   // if (columnIndex === 2) {
    //   //   if (rowIndex % 2 === 0) {
    //   //     return {
    //   //       rowspan: 2,
    //   //       colspan: 1
    //   //     };
    //   //   } else {
    //   //     return {
    //   //       rowspan: 0,
    //   //       colspan: 0
    //   //     };
    //   //   }
    //   // }
    // }
  },
  created() {
    this.getStreamListInit({
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      pageNumber: this.lNumber,
      pageSize: this.Size,
      tenantId: this.devData.tenantId
    });
  },
  mounted() {
    // console.log(this.tableData);
  }
};
</script>
<style scoped lang="scss">
.steamGroup {
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
<style lang="scss">
.steamGroup .el-table .cell {
  padding: 0;
}
</style>