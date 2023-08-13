<template>
  <!-- prefix list -->
  <div class="prefixList">
    <div class="submit">
      <div class="btns">
        <button class="add" @click.prevent="addPrefixList">
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
        prop="name"
        :label="$t('newModel.listname')"
        align="center"
        show-overflow-tooltip
        :resizable="false"
      ></el-table-column>
      <el-table-column
        prop="content"
        :label="$t('newModel.content')"
        align="center"
        show-overflow-tooltip
        :resizable="false"
      ></el-table-column>
      <el-table-column
        prop="description"
        :label="$t('newModel.description')"
        align="center"
        show-overflow-tooltip
        :resizable="false"
      ></el-table-column>
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
    <addIpList v-show="isShow" />
    <editIplist ref="editIplist" v-show="eisShow" />
  </div>
</template>
<script>
import {
  bgpIpListGetByCondition,
  bgpIpListDelBgpIpList,
  bgpIpListDeleteCheck
} from "@/services";
import addIpList from "./components/addIpList";
import editIplist from "./components/editIpList";
export default {
  data() {
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      tableData: [],
      multipleSelection: [],
      page: 1,
      pageSize: 10,
      allNum: 0,
      isShow: false,
      eisShow: false
    };
  },
  components: {
    addIpList,
    editIplist
  },
  methods: {
    //页面条数改变
    // The number of page bars changed
    //The number of page bars changed
    pageChange(val) {
      this.pageSize = val;
      this.page = 1;
      let params = {
        deviceId: this.deviceId,
        pageNumber: this.page,
        pageSize: this.pageSize,
        order: "desc"
        // bgpVrfId: sessionStorage.getItem("bgpVrfId")
      };
      this.dataInit(params);
    },
    //页数改变
    // Page number change
    //Page number change
    sizeChange(val) {
      this.page = val;
      let params = {
        deviceId: this.deviceId,
        pageNumber: this.page,
        pageSize: this.pageSize,
        order: "desc"
        // bgpVrfId: sessionStorage.getItem("bgpVrfId")
      };
      this.dataInit(params);
    },
    //多选
    // multi-select
    //multiple choice
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //序号展示
    // The serial number display
    //The serial number display
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //数据初始化
    // Data initialization
    //Data initialization
    dataInit(params) {
      bgpIpListGetByCondition(params).then(res => {
        if (res.code === 10000) {
          this.allNum = res.result.totalElements;
          this.tableData = res.result.content;
        }
      });
    },
    //编辑
    // edit
    //edit
    handleClick(row) {
      this.eisShow = true;
      this.$refs.editIplist.dataInit(row);
      this.$refs.editIplist.saveEditData(row);
    },
    //单项删除
    // Single delete
    //Single delete
    remove(row) {
      var show19 = localStorage.getItem("show19");
      if(show19 == 'true'){
        bgpIpListDeleteCheck({ bgpIplistId: row.id }).then(res => {
            if (res.code === 10000) {
              bgpIpListDelBgpIpList({
                deviceId: this.deviceId,
                ids: [row.id]
              }).then(res => {
                if (res.code === 10000) {
                  this.$message({
                    type: "success",
                    message: this.$t("vsr1000.qosremind[5]")
                  });
                  this.page = 1
                  this.dataInit({
                    deviceId: this.deviceId,
                    pageNumber: this.page,
                    pageSize: this.pageSize,
                    order: "desc"
                    // bgpVrfId: sessionStorage.getItem("bgpVrfId")
                  });
                } else if (res.code !== 10000) {
                  this.page = 1
                  this.dataInit({
                    deviceId: this.deviceId,
                    pageNumber: this.page,
                    pageSize: this.pageSize,
                    order: "desc"
                    // bgpVrfId: sessionStorage.getItem("bgpVrfId")
                  });
                  this.$message({
                    type: "warning",
                    message: res.message
                  });
                }
              });
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
            }
          });
      }else{
        this.$confirm(this.$t("vsr1000.qosremind[1]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue19\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
        confirmButtonText: this.$t("vsr1000.OK"),
        cancelButtonText: this.$t("vsr1000.cancel"),
          dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          bgpIpListDeleteCheck({ bgpIplistId: row.id }).then(res => {
            if (res.code === 10000) {
              bgpIpListDelBgpIpList({
                deviceId: this.deviceId,
                ids: [row.id]
              }).then(res => {
                if (res.code === 10000) {
                  this.$message({
                    type: "success",
                    message: this.$t("vsr1000.qosremind[5]")
                  });
                  this.page = 1
                  this.dataInit({
                    deviceId: this.deviceId,
                    pageNumber: this.page,
                    pageSize: this.pageSize,
                    order: "desc"
                    // bgpVrfId: sessionStorage.getItem("bgpVrfId")
                  });
                  localStorage.setItem("show19",localStorage.getItem("checkedValue19"));
                } else if (res.code !== 10000) {
                  this.page = 1
                  this.dataInit({
                    deviceId: this.deviceId,
                    pageNumber: this.page,
                    pageSize: this.pageSize,
                    order: "desc"
                    // bgpVrfId: sessionStorage.getItem("bgpVrfId")
                  });
                  this.$message({
                    type: "warning",
                    message: res.message
                  });
                }
              });
            } else {
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
    //多选删除
    // Much choose delete
    //Much choose delete
    removeList() {
      if (this.multipleSelection.length) {
        let ids = this.multipleSelection.map(item => item.id);
        var show20 = localStorage.getItem("show20");
        if(show20 == 'true'){
          bgpIpListDelBgpIpList({
              deviceId: this.deviceId,
              ids
            }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.qosremind[5]")
                });
                this.page = 1
                this.dataInit({
                  deviceId: this.deviceId,
                  pageNumber: this.page,
                  pageSize: this.pageSize,
                  order: "desc"
                  // bgpVrfId: sessionStorage.getItem("bgpVrfId")
                });
              } else if (res.code !== 10000) {
                this.page = 1
                this.dataInit({
                  deviceId: this.deviceId,
                  pageNumber: this.page,
                  pageSize: this.pageSize,
                  order: "desc"
                  // bgpVrfId: sessionStorage.getItem("bgpVrfId")
                });
                this.$message({
                  type: "warning",
                  message: res.message
                });
              }
            });
        }else{
          this.$confirm(this.$t("vsr1000.qosremind[1]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue20\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
          .then(() => {
            bgpIpListDelBgpIpList({
              deviceId: this.deviceId,
              ids
            }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.qosremind[5]")
                });
                this.page = 1
                this.dataInit({
                  deviceId: this.deviceId,
                  pageNumber: this.page,
                  pageSize: this.pageSize,
                  order: "desc"
                  // bgpVrfId: sessionStorage.getItem("bgpVrfId")
                });
                localStorage.setItem("show20",localStorage.getItem("checkedValue20"));
              } else if (res.code !== 10000) {
                this.page = 1
                this.dataInit({
                  deviceId: this.deviceId,
                  pageNumber: this.page,
                  pageSize: this.pageSize,
                  order: "desc"
                  // bgpVrfId: sessionStorage.getItem("bgpVrfId")
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
    //新增
    // add
    //add
    addPrefixList() {
      this.isShow = true;
    }
  },
  created() {
    let params = {
      deviceId: this.deviceId,
      pageNumber: this.page,
      pageSize: this.pageSize,
      order: "desc"
      // bgpVrfId: sessionStorage.getItem("bgpVrfId")
    };
    this.dataInit(params);
  }
};
</script>
<style scoped lang="scss">
.prefixList {
  width: 100%;
  height: calc(100% - 54px);
  padding: 20px;
  overflow: auto;
  border:1px solid rgba(209,215,224,1);
}
.prefixList::-webkit-scrollbar {
  width: 4px;
}
.prefixList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.prefixList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
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