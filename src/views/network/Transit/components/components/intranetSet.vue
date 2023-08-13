<template>
  <!-- 内网网段设置 -->
  <div class="intranetSet">
    <div class="set">
      <div class="btn">
        <button class="add" @click="addShow=true">{{$t('TenDomain.add')}}</button>
        <button class="close" @click="removeList">{{$t('TenDomain.del')}}</button>
      </div>
    </div>
    <div class="tableList">
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
          :selectable="isDisabled"
          width="55"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('Configuration.index')"
          align="center"
          width="70"
          :resizable="false"
          show-overflow-tooltip
        ></el-table-column> -->
        <el-table-column
          prop="ip"
          :label="$t('vsr1000.IPSite')"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="distance"
          :label="$t('vsr1000.distance')"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="nextHopIp"
          :label="$t('vsr1000.nextHop')"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column :label="$t('DeviceMan.operation')" align="center" :resizable="false" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{scope.row.dataFrom!=2 ? $t('vsr1000.check'):$t('DeviceMan.edit')}}</el-button>
            <el-button
              v-show="scope.row.dataFrom==2"
              @click="remove(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t('TenDomain.del')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allNum"
          @size-change="pageChange"
          @current-change="sizeChange"
          :current-page="page"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addIntranet v-if="addShow" />
    <editIntranet ref="editStatic" v-show="editShow" />
  </div>
</template>
<script>
import { getLStatic, getFindStaticOutInter, sceneNodeDeleteEdgeStatic } from "@/services";
import addIntranet from "./staticComponents/addIntranet";
import editIntranet from "./staticComponents/editIntranet";
export default {
  data() {
    return {
      addShow: false,
      editShow: false,
      searchVal: "",
      restaurants: [], //模糊搜索数据
                       // Fuzzy search data
      tableData: [],
      page: 1,
      pageSize: 10,
      allNum: 0,
      multipleSelection: [],
    };
  },
  components: {
    addIntranet,
    editIntranet,
  },
  methods: {
    //选择禁用
    // Choose to disable
    isDisabled(row) {
      if (row.dataFrom != 2) {
        return 0;
      } else {
        return 1;
      }
    },
    //页面条数改变
    // The number of page bars changed
    pageChange(val) {
      this.pageSize = val;
      this.page = 1;
      let params = {
        deviceId: sessionStorage.getItem("edgeDevId"),
        pageNumber: this.page,
        pageSize: this.pageSize,
      };
      this.dataInit(params);
    },
    //页数改变
    // Page number change
    sizeChange(val) {
      this.page = val;
      let params = {
        deviceId: sessionStorage.getItem("edgeDevId"),
        pageNumber: this.page,
        pageSize: this.pageSize,
      };
      this.dataInit(params);
    },
    //多选
    // multi-select
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //序号
    // The serial number
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //编辑
    // edit
    async handleClick(row) {
      this.editShow = true;
      this.$refs.editStatic.isEdit = row.dataFrom != 2;
      let apiArr = await getFindStaticOutInter({
        devId: sessionStorage.getItem("edgeDevId"),
      });
      this.$refs.editStatic.form.dis = row.distance;
      this.$refs.editStatic.form.ip = row.ip;
      this.$refs.editStatic.form.title = Number(row.tag);
      this.$refs.editStatic.form.nextHopIp = row.nextHopIp;
      this.$refs.editStatic.form.id = row.id;
      this.$refs.editStatic.form.api = row.interName;
      this.$refs.editStatic.apiArr = apiArr.result;
    },
    //单项删除
    // Single delete
    remove(row) {
      var show85 = localStorage.getItem("show85");
      if(show85 == 'true'){
        
          sceneNodeDeleteEdgeStatic({ids:[row.id]}).then((res) => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr100.static.remind[4]"),
              });
              this.page = 1;
              let params = {
                deviceId: sessionStorage.getItem("edgeDevId"),
                pageNumber: this.page,
                pageSize: this.pageSize,
              };
              this.dataInit(params);
              
            } else {
              this.page = 1;
              let params = {
                deviceId: sessionStorage.getItem("edgeDevId"),
                pageNumber: this.page,
                pageSize: this.pageSize,
              };
              this.dataInit(params);
              this.$message({
                type: "warning",
                message: res.message,
              });
            }
          });
      }else{
        this.$confirm(this.$t("vsr100.static.remind[0]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue85\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("vsr100.confirm"),
          cancelButtonText: this.$t("vsr100.static.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning",
        })
        .then(() => {
          sceneNodeDeleteEdgeStatic({ids:[row.id]}).then((res) => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr100.static.remind[4]"),
              });
              this.page = 1;
              let params = {
                deviceId: sessionStorage.getItem("edgeDevId"),
                pageNumber: this.page,
                pageSize: this.pageSize,
              };
              this.dataInit(params);
              localStorage.setItem("show85",localStorage.getItem("checkedValue85"));
              
            } else {
              this.page = 1;
              let params = {
                deviceId: sessionStorage.getItem("edgeDevId"),
                pageNumber: this.page,
                pageSize: this.pageSize,
              };
              this.dataInit(params);
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
            message: this.$t("vsr100.static.remind[1]"),
          });
        });
      }
      
    },
    //多项删除
    // A number of deleted
    removeList() {
      if (this.multipleSelection.length) {
        let ids = this.multipleSelection.map((item) => item.id);
        var show86 = localStorage.getItem("show86");
        if(show86 == 'true'){
            sceneNodeDeleteEdgeStatic({ids}).then((res) => {
              if (res.code === 10000) {
                this.page = 1;
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]"),
                });
                this.page = 1;
                let params = {
                  deviceId: sessionStorage.getItem("edgeDevId"),
                  pageNumber: this.page,
                  pageSize: this.pageSize,
                };
                this.dataInit(params);
              } else {
                this.page = 1;
                let params = {
                  deviceId: sessionStorage.getItem("edgeDevId"),
                  pageNumber: this.page,
                  pageSize: this.pageSize,
                };
                this.dataInit(params);
                this.$message({
                  type: "warning",
                  message: res.message,
                });
              }
            });
        }else{
          this.$confirm(this.$t("vsr1000.qosremind[1]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue86\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
            confirmButtonText: this.$t("vsr1000.OK"),
            cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning",
          })
          .then(() => {
            sceneNodeDeleteEdgeStatic({ids}).then((res) => {
              if (res.code === 10000) {
                this.page = 1;
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]"),
                });
                this.page = 1;
                let params = {
                  deviceId: sessionStorage.getItem("edgeDevId"),
                  pageNumber: this.page,
                  pageSize: this.pageSize,
                };
                this.dataInit(params);
                localStorage.setItem("show86",localStorage.getItem("checkedValue86"));
              } else {
                this.page = 1;
                let params = {
                  deviceId: sessionStorage.getItem("edgeDevId"),
                  pageNumber: this.page,
                  pageSize: this.pageSize,
                };
                this.dataInit(params);
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
    dataInit(params) {
      getLStatic(params).then((res) => {
        this.tableData = res.result.content;
        this.allNum = res.result.totalElements;
      });
    },
  },
  created() {},
};
</script>
<style scoped lang="scss">
.intranetSet {
}
.set {
  width: 100%;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
}
.set .btn {
  float: right;
  button {
    width: 100px;
    height: 34px;
    margin-left: 14px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    border: none;
    outline: none;
    text-align: center;
    line-height: 34px;
    cursor: pointer;
    display: table-cell;
    vertical-align: middle;
  }
  .add:hover {
    background: rgba(96, 149, 214, 1);
  }
  .close {
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-left: 14px;
  }
}
.tableList {
  width: 100%;
  height: 420px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  border: 1px solid rgba(209, 215, 224, 1);
  margin: 20px 0 30px 0;
  overflow: auto;
}
.tableList::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.tableList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.tableList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.defaultFont {
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(186, 39, 39, 1);
}
.activeFont {
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(54, 120, 200, 1);
}
</style>
