<template>
  <!-- 静态DHCP -->
  <div class="staticDHCP">
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
      size="small"
      @selection-change="handleSelectionChange"
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
        :label="$t('DeviceMan.index')"
        align="center"
        width="70"
        :resizable="false"
      ></el-table-column> -->
      <el-table-column prop="mac" :label="'MAC'+$t('newModel.lan.address')" show-overflow-tooltip :resizable="false"></el-table-column>
      <el-table-column prop="ip" :label="$t('newModel.IPAddress')" show-overflow-tooltip :resizable="false"></el-table-column>
      <el-table-column prop="leasetime" :label="$t('newModel.lan.tenancyTaerm')" show-overflow-tooltip :resizable="false"></el-table-column>
      <el-table-column prop="name" :label="$t('newModel.lan.hostName')" show-overflow-tooltip :resizable="false"></el-table-column>
      <el-table-column :label="$t('newModel.lan.status')" show-overflow-tooltip :resizable="false">
        <template slot-scope="scope">
          <span :class="{active:!scope.row.delFlag}">{{!scope.row.delFlag? $t('newModel.lan.takeEffect') : $t('newModel.lan.loseEfficacy')}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('newModel.operation')" align="center" show-overflow-tooltip :resizable="false">
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
    <addStaticDHCP v-show="isShow" />
    <editStaticDHCP ref="editStaticDHCP" v-show="eisShow"/>
  </div>
</template>
<script>
import {
  staticdhcpGet,
  staticdhcpFailure,
  staticdhcpForce,
  staticdhcpDel
} from "@/services";
import addStaticDHCP from "./addStaticDHCP";
import editStaticDHCP from "./editStaticDHCP"
export default {
  data() {
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      page: 1,
      pageSize: 10,
      allNum: 0,
      multipleSelection: [],
      tableData: [],
      isShow: false,
      eisShow:false
    };
  },
  components: {
    addStaticDHCP,
    editStaticDHCP
  },
  methods: {
    //页面条数改变 The number of page bars changed
    // The number of page bars changes
    pageChange(val) {
      this.pageSize = val;
      this.page = 1;
      let params = {
        devId: this.deviceId,
        pageNumber: this.page,
        pageSize: this.pageSize
      };
      this.dataInit(params);
    },
    //页数改变 Page number change
    // Page change Page Number change
    sizeChange(val) {
      this.page = val;
      let params = {
        devId: this.deviceId,
        pageNumber: this.page,
        pageSize: this.pageSize
      };
      this.dataInit(params);
    },
    dataInit(params) {
      staticdhcpGet(params).then(res => {
        if (res.code === 10000) {
          this.allNum = res.result.totalElements;
          this.tableData = res.result.content;
        }
      });
    },
    //序号展示 The serial number display
    // The serial Number display
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //多选 multiple choice
    // Multi-select multiple choice
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //失效与生效 Invalidation and effectiveness
    // Invalidation and effectiveness Invalidation and effectiveness
    portMap(flag) {
      if (this.multipleSelection.length) {
        let ids = this.multipleSelection.map(item => item.id);
        if (flag) {
          staticdhcpForce({
            ids,
            devId: this.deviceId
          }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]")
              });
              this.dataInit({
                devId: this.deviceId,
                pageNumber: this.page,
                pageSize: this.pageSize
              });
            }
          });
        } else {
          staticdhcpFailure({
            ids,
            devId: this.deviceId
          }).then(res => {
            this.$message({
              type: "success",
              message: this.$t("vsr1000.remind2[5]")
            });
            this.dataInit({
              devId: this.deviceId,
              pageNumber: this.page,
              pageSize: this.pageSize
            });
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: this.$t('newModel.lan.msg1')
        });
      }
    },
    //单项删除 Single delete
    // Single DELETE
    remove(row) {
      let devId = this.deviceId;
      var show36 = localStorage.getItem("show36");
      if(show36 == 'true'){
        
          staticdhcpDel({ ids: [row.id], devId }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.qosremind[0]")
              });
              this.dataInit({
                devId,
                pageNumber: this.page,
                pageSize: this.pageSize
              });
            } else if (res.code !== 10000) {
              this.dataInit({
                devId,
                pageNumber: this.page,
                pageSize: this.pageSize
              });
              this.$message({
                type: "warning",
                message: res.message
              });
            }
          });
      }else{
        this.$confirm(this.$t("vsr1000.qosremind[1]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue36\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          staticdhcpDel({ ids: [row.id], devId }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.qosremind[0]")
              });
              this.dataInit({
                devId,
                pageNumber: this.page,
                pageSize: this.pageSize
              });
              localStorage.setItem("show36",localStorage.getItem("checkedValue36"));
            } else if (res.code !== 10000) {
              this.dataInit({
                devId,
                pageNumber: this.page,
                pageSize: this.pageSize
              });
              this.$message({
                type: "warning",
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
    //多选删除 Much choose delete
    // Delete Much choose DELETE
    removeList() {
      if (this.multipleSelection.length) {
        let devId = this.deviceId;
        let ids = this.multipleSelection.map(item => item.id);
        var show37 = localStorage.getItem("show37");
        if(show37 == 'true'){
          
            staticdhcpDel({ ids, devId }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.qosremind[0]")
                });
                this.dataInit({
                  devId,
                  pageNumber: this.page,
                  pageSize: this.pageSize
                });
              } else if (res.code !== 10000) {
                this.dataInit({
                  devId,
                  pageNumber: this.page,
                  pageSize: this.pageSize
                });
                this.$message({
                  type: "warning",
                  message: res.message
                });
              }
            });
        }else{
          this.$confirm(this.$t("vsr1000.qosremind[1]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue37\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
          .then(() => {
            staticdhcpDel({ ids, devId }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.qosremind[0]")
                });
                this.dataInit({
                  devId,
                  pageNumber: this.page,
                  pageSize: this.pageSize
                });
                localStorage.setItem("show37",localStorage.getItem("checkedValue37"));
              } else if (res.code !== 10000) {
                this.dataInit({
                  devId,
                  pageNumber: this.page,
                  pageSize: this.pageSize
                });
                this.$message({
                  type: "warning",
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
    handleClick(row){
      this.eisShow = true
      this.$refs.editStaticDHCP.dataInit(row)
    }
  },
  created() {
    let params = {
      devId: this.deviceId,
      pageNumber: this.page,
      pageSize: this.pageSize
    };
    this.dataInit(params);
  }
};
</script>
<style scoped>
.staticDHCP {
}
.active {
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(54, 120, 200, 1);
}
</style>