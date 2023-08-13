<template>
  <div class="logical">
    <!-- Vsr-vpn -->
    <div class="operate">
      <button class="close" @click="removeVpnList" v-control>{{$t('vsr1000.delete')}}</button>
      <button class="add" @click="addEvent" v-control>
        <img src="@/assets/newPage/icon_add@2x.png" alt />
        {{$t('vsr1000.add')}}
      </button>
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
        <el-table-column type="selection" :selectable="isDisabled" width="55" show-overflow-tooltip :resizable="false"></el-table-column>
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('vsr1000.index')"
          align="center"
          width="70"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column> -->
        <el-table-column prop="name" :label="$t('vsr1000.name')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="logName" :label="$t('vsr1000.logicPort')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="roleName" :label="$t('vsr1000.VPNRole')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="serverIp" :label="$t('vsr1000.IPSite')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="IPV4" :label="$t('vsr1000.tunnelIP')" show-overflow-tooltip :resizable="false"></el-table-column>
        <!-- <el-table-column prop="IPV6" :label="$t('vsr1000.tunnel')+'IPV6'" show-overflow-tooltip></el-table-column> -->
        <el-table-column width="180" :label="$t('vsr1000.operate')" :resizable="false">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t("vsr1000.check")}}</el-button>
            <el-button
              @click="grandeClick(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
              v-show="scope.row.dataFrom!==2"
            >{{$t('vsr1000.expertSet')}}</el-button>
            <el-button
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
              v-show="scope.row.dataFrom!==2"
              @click="remove(scope.row)"
            >{{$t('vsr1000.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="alllite"
          @size-change="litePage"
          @current-change="liteSize"
          :current-page="lNumber"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addVPN ref="addVPN" v-show="isShow" />
    <grandeSet ref="grandeSet" />
    <editVPN ref="editVPN" />
  </div>
</template>
<script>
import addVPN from "./components/addVPN.vue";
import grandeSet from "./components/grandeSet";
import editVPN from "./components/editVPN";
import {
  delVsrVpn,
  getVsrVpnList,
  // getLoginPort,
  // getVpnRole,
  getDict,
  vpnGetByCondition
} from "@/services";
export default {
  props: {},
  components: {
    addVPN,
    grandeSet,
    editVPN
  },
  data() {
    return {
      isShow: false,
      lSize: 10, //每页条数
                 // Number each page
      lNumber: 1, //页数
                  // Number of pages
      alllite: 0,
      tableData: [],
      multipleSelection: []
    };
  },
  computed: {},
  methods: {
    //判断是否是场景的设备
    // Determine if it is the device of the scene
    isDisabled(row) {
      if (row.dataFrom == 2) {
        return 0;
      } else {
        return 1;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick(row) {
      // this.$refs.editVPN.editVPNData = row;
      this.$refs.editVPN.dataInit(row);
      this.$refs.editVPN.$el.classList.remove("isShow");
    },
    litePage(val) {
      //页数总条目改变
      // Total page entries change
      this.lSize = val;
      let deviceId = JSON.parse(this.$route.query.devData).deviceId;

      let params = {
        pageSize: this.lSize,
        pageNumber: 1,
        deviceId: deviceId
      };
      this.lNumber = 1;
      this.getVsrVpnListInit(params);
    },
    liteSize(val) {
      //页数改变
      // Page number change
      // console.log(val)
      let deviceId = JSON.parse(this.$route.query.devData).deviceId;

      this.lNumber = val;
      let params = {
        pageSize: this.lSize,
        pageNumber: this.lNumber,
        deviceId: deviceId
      };
      this.getVsrVpnListInit(params);
    },

    // getVsrVpnListInit(params) {
    //   this.$emit("getVsrVpnListInit", params);
    // },
    //新增弹框
    // The new play box
    addEvent() {
      this.isShow = true;
      this.$refs.addVPN.dataInit();
    },
    //高级设置
    // Advanced Settings
    grandeClick(row) {
      this.$refs.grandeSet.$el.classList.remove("isShow");
      this.$refs.grandeSet.getSelectList({ deviceId: row.deviceId }, row);
    },
    //多选删除列表
    // Multiple - select delete list
    removeVpnList() {
      if (this.multipleSelection.length) {
        let ids = this.multipleSelection.map(item => item.id);
        let deviceId = JSON.parse(this.$route.query.devData).deviceId;
        let _this = this;
        var show72 = localStorage.getItem("show72");
        if(show72 == 'true'){
            delVsrVpn({
              ids,
              deviceId,
              randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))
            }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                _this.getVsrVpnListInit({
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageSize: this.lSize,
                pageNumber: 1
              });
              this.lNumber = 1;
              } else if (res.code !== 10000) {
                this.$message({
                  type: "error",
                  message: res.message
                });
              }
            });
        }else{
          this.$confirm(this.$t("vsr1000.confirmDel")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue72\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("vsr1000.hint"), {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
          .then(() => {
            delVsrVpn({
              ids,
              deviceId,
              randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))
            }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                _this.getVsrVpnListInit({
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageSize: this.lSize,
                pageNumber: 1
              });
              this.lNumber = 1;
                localStorage.setItem("show72",localStorage.getItem("checkedValue72"));
              } else if (res.code !== 10000) {
                this.$message({
                  type: "error",
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
    //删除当前列表数据
    // Deletes current list data
    remove(row) {
      let deviceId = JSON.parse(this.$route.query.devData).deviceId;
      let _this = this;
      var show73 = localStorage.getItem("show73");
      if(show73 == 'true'){
          delVsrVpn({
            ids: [row.id],
            deviceId,
            randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))
          }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]")
              });
              _this.getVsrVpnListInit({
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageSize: this.lSize,
                pageNumber: 1
              });
              this.lNumber = 1;
            } else if (res.code !== 10000) {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          });
      }else{
        this.$confirm(this.$t("vsr1000.confirmDel")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue73\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("vsr1000.hint"), {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          delVsrVpn({
            ids: [row.id],
            deviceId,
            randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))
          }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]")
              });
              _this.getVsrVpnListInit({
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageSize: this.lSize,
                pageNumber: 1
              });
              this.lNumber = 1;
              localStorage.setItem("show73",localStorage.getItem("checkedValue73"));
            } else if (res.code !== 10000) {
              this.$message({
                type: "error",
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
      
    },
    //获取列表数据
    // Getting list data
    async getVsrVpnListInit(params) {
      let data = await vpnGetByCondition(params);
      let role = await getDict({ groupCode: "vpn", typeCode: "vpn" });
      let newData = data.result.content;
      if (newData.length) {
        newData.forEach(item => {
          role.result.forEach(tir => {
            if (item.vpnCharacter === tir.id) {
              item.roleName = tir.dictValue;
            }
          });
          item.IPV4 = item.ipfList == null ? [] : item.ipfList[0];
          item.IPV6 = item.ipsList == null ? [] : item.ipsList[0];
        });
      }
      this.alllite = data.result.totalElements;
      this.tableData = newData;
    },
    indexMethod(index) {
      return (
        index + 1 + (this.lNumber == 1 ? 0 : this.lSize * (this.lNumber - 1))
      );
    }
  },
  created() {
    this.getVsrVpnListInit({
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      pageSize: this.lSize,
      pageNumber:this.lNumber
    });
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.logical {
  padding: 20px 30px 0 30px;
  .el-button--small, .el-button--small.is-round{
    padding: 0px;
  }
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
</style>