<template>
  <!-- 端口映射 -->
  <div class="portMapping">
    <div class="btns">
      <div class="open">
        <span>{{$t('newModel.port.open')}}</span>
        <el-switch
          v-model="value"
          @change="openOrDown(value)"
          active-color="#3678C8"
          inactive-color="#D1D7E0"
        ></el-switch>
      </div>
      <ul>
        <li class="add" @click="addPort">
          <img src="@/assets/newPage/icon_add@2x.png" alt />
          {{$t('newModel.add')}}
        </li>
        <li @click.prevent="portMap(true)">{{$t('newModel.lan.takeEffect')}}</li>
        <li @click.prevent="portMap(false)">{{$t('newModel.lan.loseEfficacy')}}</li>
        <li class="close" @click.prevent="removeList">{{$t('newModel.delete')}}</li>
      </ul>
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
          prop="extPort"
          :label="$t('newModel.port.ExternalPort')"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="interPort"
          :label="$t('newModel.port.internalPort')"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="ipAddress"
          :label="$t('newModel.IPAddress')"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="protoValue"
          :label="$t('App.protocol')"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="state"
          :label="$t('newModel.lan.status')"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        >
          <template slot-scope="scope">
            <span :class="{active:!scope.row.delFlag}">{{scope.row.state}}</span>
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
          @size-change="pageChange"
          @current-change="sizeChange"
          :current-page="page"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addPortMapping ref="addPortMapping" v-show="isShow" />
    <editPortMapping ref="editPortMapping" v-show="eisShow" />
  </div>
</template>
<script>
import {
  getEnableProtmap,
  getProtmap,
  getDict,
  protmapDel,
  protmapClose,
  protmapOpen,
  protmapForce,
  protmapFailure
} from "@/services/index";
import addPortMapping from "./components/addPortMapping";
import editPortMapping from "./components/editPortMapping";
export default {
  data() {
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      tableData: [],
      multipleSelection: [],
      page: 1,
      pageSize: 10,
      allNum: 0,
      value: false,
      isShow: false,
      eisShow: false
    };
  },
  components: {
    addPortMapping,
    editPortMapping
  },
  methods: {
    //页面条数改变 The number of page bars changed
    // The number of page bars changes
    pageChange(val) {
      this.pageSize = val;
      this.page = 1;
      let params = {
        deviceId: this.deviceId,
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
        deviceId: this.deviceId,
        pageNumber: this.page,
        pageSize: this.pageSize
      };
      this.dataInit(params);
    },
    //多选 multiple choice
    // Multi-select multiple choice
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //序号展示 The serial number display
    // The serial Number display
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //编辑 edit
    // Editors edit
    handleClick(row) {
      this.eisShow = true;
      this.$refs.editPortMapping.editDataInit(row);
    },
    //单项删除 Single delete
    // Single DELETE
    remove(row) {
      let deviceId = this.deviceId;
      var show45 = localStorage.getItem("show45");
      if(show45 == 'true'){
        
          protmapDel({ ids: [row.id] }).then(res => {
            if (res.code === 10000) {
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
        this.$confirm(this.$t("vsr1000.qosremind[1]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue45\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          protmapDel({ ids: [row.id] }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]")
              });
              this.dataInit({
                deviceId,
                pageNumber: this.page,
                pageSize: this.pageSize
              });
              localStorage.setItem("show45",localStorage.getItem("checkedValue45"));
            } else if (res.code !== 10000) {
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
    //多选删除 Much choose delete
    // Delete Much choose DELETE
    removeList() {
      if (this.multipleSelection.length) {
        let deviceId = this.deviceId;
        let ids = this.multipleSelection.map(item => item.id);
        var show46 = localStorage.getItem("show46");
        if(show46 == 'true'){
            protmapDel({ ids }).then(res => {
              if (res.code === 10000) {
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
          this.$confirm(this.$t("vsr1000.qosremind[1]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue46\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
            confirmButtonText: this.$t("vsr1000.OK"),
            cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning"
          })
          .then(() => {
            protmapDel({ ids }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                this.dataInit({
                  deviceId,
                  pageNumber: this.page,
                  pageSize: this.pageSize
                });
                localStorage.setItem("show46",localStorage.getItem("checkedValue46"));
              } else if (res.code !== 10000) {
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
    //获取列表数据 Getting list data
    // Get list data Getting List Data
    async dataInit(params) {
      let data = await getProtmap(params);
      let protoList = await getDict({ groupCode: "port", typeCode: "proto" });
      if (data.code === 10000) {
        this.allNum = data.result.totalElements;
        this.tableData = data.result.content;
        this.tableData.forEach(item => {
          item.protoValue = protoList.result.find(
            el => el.id == item.proto
          ).dictValue;
          item.state = item.delFlag ? this.$t('newModel.lan.Disabled') : this.$t('newModel.lan.Enabled');
        });
      }
    },
    //端口是否开启 Whether the port is on
    // Whether the port is on or not
    getProtmap() {
      getEnableProtmap({ devId: this.deviceId }).then(
        res => {
          if (res.code === 10000) {
            this.value = res.result ? true : false;
          }
        }
      );
    },
    //新增端口映射 Add port mapping
    // Add Port Mapping
    addPort() {
      this.isShow = true;
      this.$refs.addPortMapping.getProtoList();
    },
    //开启或关闭端口映射 Turn port mapping on or off
    // Turn port Mapping on or off
    openOrDown(val) {
      console.log(val);
      if (val) {
        protmapOpen({
          devId: this.deviceId
        }).then(res => {});
      } else {
        protmapClose({
          devId: this.deviceId
        }).then(res => {});
      }
    },
    //端口映射生效或失效 Port mappings take effect or fail
    // Port Mappings take effect or fail
    portMap(val) {
      if (this.multipleSelection.length) {
        let ids = this.multipleSelection.map(item => item.id);
        if (val) {
          protmapForce({ ids }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]")
              });
              this.dataInit({
                deviceId: this.deviceId,
                pageNumber: this.page,
                pageSize: this.pageSize
              });
            }
          });
        } else {
          protmapFailure({ ids }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]")
              });
              this.dataInit({
                deviceId: this.deviceId,
                pageNumber: this.page,
                pageSize: this.pageSize
              });
            }
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: this.$t('newModel.lan.msg1')
        });
      }
    }
  },
  created() {
    let params = {
      deviceId: this.deviceId,
      pageNumber: this.page,
      pageSize: this.pageSize
    };
    this.dataInit(params);
    this.getProtmap();
  }
};
</script>
<style scoped lang='scss'>
.portMapping {
  width: 100%;
  height: 100%;
  padding: 20px 30px;
}
.btns {
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  width: 100%;
  padding-bottom: 20px;
  .open {
    float: left;
    height: 34px;
    line-height: 34px;
    span {
      margin-right: 10px;
    }
  }
  ul {
    float: right;
  }
  li {
    float: left;
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
  li:not(:last-of-type):hover {
    background: #6095d6;
  }
  .close {
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-left: 23px;
  }
}
.active {
  color: rgba(54, 120, 200, 1);
}
</style>