<template>
  <!-- vsr100EageQos -->
  <div class="vsrQos">
    <div class="operate">
      <div class="open">
        <span>{{$t('newModel.port.open')}}</span>
        <el-switch
          v-model="value"
          @change="openOrClose"
          active-color="#3678C8"
          inactive-color="#D1D7E0"
        ></el-switch>
      </div>
      <div class="btns" v-show="value">
        <button class="add" @click.prevent="addQos">
          <img src="@/assets/newPage/icon_add@2x.png" alt />
          {{$t('newModel.add')}}
        </button>
        <button class="close" @click="removeList">{{$t('newModel.delete')}}</button>
      </div>
    </div>
    <div class="tableList" v-show="value">
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
        <el-table-column prop="name" :label="$t('newModel.name')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="priorityNmae" :label="$t('newModel.fire.priority')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="protoName" :label="$t('App.protocol')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="sourceAddress" :label="$t('newModel.fire.sourceAddress')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="targetAddress" width="120px" :label="$t('vsr100.static.IPSite')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="port" :label="$t('vsr1000.port')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="description" :label="$t('newModel.description')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column
          :label="$t('DeviceMan.operation')"
          align="center"
          width="200"
          :resizable="false"
        >
          <template slot-scope="scope">
            <el-button
              @click="edit(scope.row)"
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
    <addVsrQos ref="addVsrQos" v-show="isShow" />
    <editVsrQos ref="editVsrQos" v-show="eisShow" />
  </div>
</template>
<script>
import {
  vsmsimpleqosGetQosDetail,
  vsmsimpleqosGetQosEnable,
  getDict,
  vsmsimpleqosOpen,
  vsmsimpleqosClose,
  vsmsimpleqosDelQos
} from "@/services";
import addVsrQos from "./components/addVsrQos";
import editVsrQos from "./components/editVsrQos";
export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      allNum: 0,
      multipleSelection: [],
      value: false,
      tableData: [],
      isShow: false,
      eisShow: false
    };
  },
  components: {
    addVsrQos,
    editVsrQos
  },
  methods: {
    //页面条数改变
    // The number of page bars changed
    pageChange(val) {
      this.pageSize = val;
      this.page = 1;
      let params = {
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        pageNumber: this.page,
        pageSize: this.pageSize
      };
      this.dataInit(params);
    },
    //页数改变
    // Page number change
    sizeChange(val) {
      this.page = val;
      let params = {
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        pageNumber: this.page,
        pageSize: this.pageSize
      };
      this.dataInit(params);
    },
    //序号展示
    // The serial number display
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //多选
    // multi-select
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //编辑
    // edit
    edit(row) {
      this.eisShow = true;
      this.$refs.editVsrQos.editDataInit(row);
      this.$refs.editVsrQos.getDataList(row);
    },
    //新增
    // add
    addQos() {
      this.isShow = true;
      this.$refs.addVsrQos.getDataList();
    },
    //单项删除
    // Single delete
    remove(row) {
      let deviceId = JSON.parse(this.$route.query.devData).deviceId;
      var show68 = localStorage.getItem("show68");
      if(show68 == 'true'){
        
          vsmsimpleqosDelQos({ ids: [row.id], devId: deviceId }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]")
              });
              this.page = 1;
              this.dataInit({
                deviceId,
                pageNumber: this.page,
                pageSize: this.pageSize
              });
            } else if (res.code !== 10000) {
              this.page = 1;
              this.dataInit({
                deviceId,
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
        this.$confirm(this.$t("vsr1000.qosremind[1]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue68\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          vsmsimpleqosDelQos({ ids: [row.id], devId: deviceId }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]")
              });
              this.page = 1;
              this.dataInit({
                deviceId,
                pageNumber: this.page,
                pageSize: this.pageSize
              });
              localStorage.setItem("show68",localStorage.getItem("checkedValue68"));
            } else if (res.code !== 10000) {
              this.page = 1;
              this.dataInit({
                deviceId,
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
    //多项删除
    // A number of deleted
    removeList() {
      if (this.multipleSelection.length) {
        let deviceId = JSON.parse(this.$route.query.devData).deviceId;
        let ids = this.multipleSelection.map(item => item.id);
        var show69 = localStorage.getItem("show69");
        if(show69 == 'true'){
          
            vsmsimpleqosDelQos({ ids, devId: deviceId }).then(res => {
              if (res.code === 10000) {
                this.page = 1;
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                this.dataInit({
                  deviceId,
                  pageNumber: this.page,
                  pageSize: this.pageSize
                });
              } else if (res.code !== 10000) {
                this.page = 1;
                this.dataInit({
                  deviceId,
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
          this.$confirm(this.$t("vsr1000.qosremind[1]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue69\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
            confirmButtonText: this.$t("vsr1000.OK"),
            cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning"
          })
          .then(() => {
            vsmsimpleqosDelQos({ ids, devId: deviceId }).then(res => {
              if (res.code === 10000) {
                this.page = 1;
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                this.dataInit({
                  deviceId,
                  pageNumber: this.page,
                  pageSize: this.pageSize
                });
                localStorage.setItem("show69",localStorage.getItem("checkedValue69"));
              } else if (res.code !== 10000) {
                this.page = 1;
                this.dataInit({
                  deviceId,
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
    //数据初始化
    // Data initialization
    async dataInit(params) {
      let tableList = await vsmsimpleqosGetQosDetail(params);
      let falg = await vsmsimpleqosGetQosEnable({
        devId: JSON.parse(this.$route.query.devData).deviceId
      });
      let priorityList = await getDict({
        groupCode: "qos",
        typeCode: "priority"
      });
      let protoList = await getDict({
        groupCode: "qos",
        typeCode: "proto"
      });
      if (tableList.code === 10000) {
        this.allNum = tableList.result.totalElements;
        this.tableData = tableList.result.content;
        this.value = falg.result ? true : false;
        if (this.tableData.length) {
          this.tableData.forEach(item => {
            item.priorityNmae = priorityList.result.find(
              el => el.id === item.priority
            ).dictValue;
            item.protoName = protoList.result.find(
              el => el.id === item.protocol
            ).dictValue;
          });
        }
      }
    },
    //开启或关闭qos
    // Turn qos on or off
    openOrClose() {
      if (this.value) {
        vsmsimpleqosOpen({ devId: JSON.parse(this.$route.query.devData).deviceId }).then(
          res => {
            if (res.code === 10000) {
              let params = {
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageNumber: this.page,
                pageSize: this.pageSize
              };
              this.dataInit(params);
            }
          }
        );
      } else {
        vsmsimpleqosClose({ devId: JSON.parse(this.$route.query.devData).deviceId }).then(
          res => {
            if (res.code === 10000) {
              let params = {
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageNumber: this.page,
                pageSize: this.pageSize
              };
              this.dataInit(params);
            }
          }
        );
      }
    }
  },
  created() {
    let params = {
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      pageNumber: this.page,
      pageSize: this.pageSize
    };
    this.dataInit(params);
  }
};
</script>
<style scoped lang="scss">
.vsrQos {
  width: 100%;
  padding: 20px 30px;
}
.operate {
  width: 100%;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .open {
    float: left;
    height: 34px;
    line-height: 34px;
    span {
      margin-right: 10px;
    }
  }
}
.btns {
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
    img {
      width: 14px;
      height: 14px;
      position: relative;
      top: 1px;
    }
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
  padding-top: 20px;
}
</style>