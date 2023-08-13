<template>
  <div class="logical">
    <!-- Vsr-vpn -->
    <div class="operate">
      <div class="left">
        <!-- <button @click="tabs(0)" :class="{active:index===0}">IPV4</button>
          <button @click="tabs(1)" :class="{active:index===1}">IPV6</button> -->
      </div>
      <div class="right">
        <button class="add" @click="addStatic" v-control>
          <img src="@/assets/newPage/icon_add@2x.png" alt />
          {{$t('vsr1000.add')}}
        </button>
      </div>
    </div>
    <div class="tableView">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
        size="small"
      >
        <!-- <el-table-column :selectable="isDisabled" type="selection" width="55" show-overflow-tooltip :resizable="false"></el-table-column> -->
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('vsr1000.index')"
          align="center"
          width="70"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column> -->

        <el-table-column
            prop="interName"
            :label="$t('vsr1000.name')"
            show-overflow-tooltip
            :resizable="false"
        ></el-table-column>

        <el-table-column
            prop="des"
            :label="$t('vsr1000.describe')"
            show-overflow-tooltip
            :resizable="false"
        ></el-table-column>

        <el-table-column
            prop="ip"
            :label="$t('vsr1000.DesNetwork')"
            show-overflow-tooltip
            :resizable="false"
        ></el-table-column>

        <el-table-column
            prop="nextHopIp"
            :label="$t('vsr1000.nextHop')"
            show-overflow-tooltip
            :resizable="false"
        ></el-table-column>


        <el-table-column
            prop="distance"
            :label="$t('vsr1000.distance')"
            show-overflow-tooltip
            :resizable="false"
        ></el-table-column>

        <el-table-column :label="$t('vsr1000.operation')" :resizable="false">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{scope.row.dataFrom==2 ? '查看':$t('vsr1000.edit')}}</el-button>
            <el-button
              type="text"
              size="small"
              :style="'color:#3678C8;font-size:14px;font-weight:400'"
              v-control
              @click="remove(scope.row)"
              v-show="scope.row.dataFrom!=2"
            >{{$t('vsr1000.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="index === 0 ? allNum : numIpv6"
          @size-change="pageChange"
          @current-change="sizeChange"
          :current-page="index === 0 ? lNumber : pageSize"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addSTATIC v-show="isShow" ref="addSTATIC" />
    <editSTATIC ref="editSTATIC" />
  </div>
</template>
<script>
import addSTATIC from "./components/addSTATIC.vue";
import editSTATIC from "./components/editSTATIC.vue";
import {delBatchSta , getLStatic} from "@/services";
export default {
  props: {},
  components: {
    addSTATIC,
    editSTATIC
  },
  data() {
    return {
      isShow: false,
      //ipv4数据总条数
      // Total number of IPv4 data bars
      allNum: 0,
      //ipv4每页条数
      // Ipv4 number of pages per page
      lSize: 10,
      //ipv4页数
      // Ipv4 pages
      lNumber: 1,
      //ipv6数据总条数
      // Total number of ipv6 data bars
      numIpv6: 0,
      //ipv6每页条数
      // Ipv6 number of entries per page
      sizeIpv6: 10,
      //ipv6页数
      // Ipv6 pages
      pageSize: 1,
      tableData: [],
      multipleSelection: [],
      // flag:true,
      index: 0 ,//tab切换的下标
               // TAB subscript
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
    };
  },
  computed: {},
  methods: {
    //多选禁用ip为0.0.0.0/0
    // Multi-select disabled IP is 0.0.0.0/0
    isDisabled(row){
      if (row.dataFrom == 2) {
        return 0;
      } else {
        return 1;
      }
    },
    //tab切换
    // The TAB to switch
    tabs(index) {
      this.index = index;
      let params = {
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        pageSize: this.lSize,
        type: index,
        routeType: 0
      };
      this.getStaticListInit(params);
    },
    indexMethod(index) {
      let num = null;
      if (this.index === 0) {
        num =
          index + 1 + (this.lNumber == 1 ? 0 : this.lSize * (this.lNumber - 1));
      } else if (this.index === 1) {
        num =
          index +
          1 +
          (this.pageSize == 1 ? 0 : this.sizeIpv6 * (this.pageSize - 1));
      }
      return num;
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
    //多选
    // multi-select
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick(row) {
      // console.log(row);
      if(!this.devCheckOnline()){
        return;
      }
      this.$refs.editSTATIC.isEdit = row.dataFrom != 2;
      this.$refs.editSTATIC.dataInit(row, this.index);
      this.$refs.editSTATIC.$el.classList.remove("isShow");
    },
    pageChange(val) {
      //页数总条目改变
      // Total page entries change
      let deviceId = JSON.parse(this.$route.query.devData).deviceId;
      this.index === 0 ? (this.lSize = val) : (this.sizeIpv6 = val);
      let params = {
        pageSize: this.index === 0 ? this.lSize : this.sizeIpv6,
        pageNumber: 1,
        deviceId: deviceId,
        type: this.index,
        routeType: 0
      };
      this.lNumber = 1;
      this.pageSize = 1;
      this.getStaticListInit(params);
    },
    sizeChange(val) {
      //页数改变
      // Page number change
      // console.log(val)
      let deviceId = JSON.parse(this.$route.query.devData).deviceId;
      this.index === 0 ? (this.lNumber = val) : (this.pageSize = val);
      let params = {
        pageSize: this.index === 0 ? this.lSize : this.sizeIpv6,
        pageNumber: this.index === 0 ? this.lNumber : this.pageSize,
        deviceId: deviceId,
        type: this.index,
        routeType: 0
      };
      this.getStaticListInit(params);
    },
    addStatic() {
      if(!this.devCheckOnline()){
        return;
      }
      this.isShow = true;
      this.$refs.addSTATIC.dataInit(this.index);
    },
    // getStaticListInit(params) {
    //   this.$emit("getStaticListInit", params);
    // },
    removeList() {
      if (this.multipleSelection.length) {
        let ids = this.multipleSelection.map(item => item.id);
        let deviceId = JSON.parse(this.$route.query.devData).deviceId;
        let _this = this;
        var show70 = localStorage.getItem("show70");
        if(show70 == 'true'){
          
            delBatchSta({
              ids,
              deviceId,
              randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)),
              tenantId: JSON.parse(this.$route.query.devData).tenantId
            }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                _this.getStaticListInit({
                  deviceId: JSON.parse(this.$route.query.devData).deviceId,
                  pageNumber: 1,
                  pageSize: this.index === 0 ? this.lSize : this.sizeIpv6,
                  type: this.index,
                  routeType: 0
                });
                this.lNumber = 1;
                this.pageSize = 1;
              }
            });
        }else{
          this.$confirm(this.$t("vsr1000.confirmDel")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue70\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("vsr1000.hint"), {
            confirmButtonText: this.$t("vsr1000.OK"),
            cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning"
          })
          .then(() => {
            delBatchSta({
              ids,
              deviceId,
              randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)),
              tenantId: JSON.parse(this.$route.query.devData).tenantId
            }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                _this.getStaticListInit({
                  deviceId: JSON.parse(this.$route.query.devData).deviceId,
                  pageNumber: 1,
                  pageSize: this.index === 0 ? this.lSize : this.sizeIpv6,
                  type: this.index,
                  routeType: 0
                });
                this.lNumber = 1;
                this.pageSize = 1;
                localStorage.setItem("show70",localStorage.getItem("checkedValue70"));
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
      if(!this.devCheckOnline()){
        return;
      }
      let deviceId = JSON.parse(this.$route.query.devData).deviceId;
      let _this = this;
      var show71 = localStorage.getItem("show71");
      if(show71 == 'true'){
        
          delBatchSta({
            ids: [row.id],
            deviceId,
            randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)),
            tenantId: JSON.parse(this.$route.query.devData).tenantId
          }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]")
              });
              _this.getStaticListInit({
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageNumber: 1,
                pageSize: this.index === 0 ? this.lSize : this.sizeIpv6,
                type: this.index,
                routeType: 0
              });
              this.lNumber = 1;
              this.pageSize = 1;
            }
          });
      }else{
        this.$confirm(this.$t("vsr1000.confirmDel")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue71\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("vsr1000.hint"), {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          delBatchSta({
            ids: [row.id],
            deviceId,
            randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)),
            tenantId: JSON.parse(this.$route.query.devData).tenantId
          }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]")
              });
              _this.getStaticListInit({
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageNumber: 1,
                pageSize: this.index === 0 ? this.lSize : this.sizeIpv6,
                type: this.index,
                routeType: 0
              });
              this.lNumber = 1;
              this.pageSize = 1;
              localStorage.setItem("show71",localStorage.getItem("checkedValue71"));
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
    //获取static列表
    // Get static list
    async getStaticListInit(params) {
      this.getList();
    },
    getList() {
      let params = {
        pageNumber: this.lNumber,
        pageSize: this.lSize,
        deviceId: this.deviceId
      };
      getLStatic(params).then(res => {
        // this.tableData = res.result.content;
        this.tableData = [];
        res.result.content.forEach(item =>{
            //2022 0804 ip为0.0.0.0/0的数据不显示
            // if(item.ip!="0.0.0.0/0" && item.routeType != 0){
            if(item.routeType != 0){
              this.tableData.push(item);
            }
          });
        this.allNum = res.result.totalElements;
      });
    },
    devCheckOnline() {
      let  online = JSON.parse(this.$route.query.devData).online;
      if(!online){
        this.$message({
          type: "warning",
          message: this.$t("Configuration.EdgeConfiguration"),
        });
        return ;
      }
      return online;
      // return true;
    }
  },
  created() {
    this.getList();
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.logical {
  padding: 20px 30px 0 30px;
  .el-button--small,
  .el-button--small.is-round {
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
  .left {
    float: left;
    button {
      width: 84px;
      height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      outline: none;
      cursor: pointer;
      margin-right: 15px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
    }
    button:hover {
      background: rgba(54, 120, 200, 1);
      color: #fff;
      border-color: #fff;
    }
    .active {
      background: rgba(54, 120, 200, 1);
      color: #fff;
      border-color: #fff;
    }
    .active:hover {
      background: #6095d6;
    }
  }
  .right {
    float: right;
    button {
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
      background: rgba(239, 239, 239, 1);
      color: #333333;
      border: 1px solid rgba(209, 215, 224, 1);
      margin-left: 23px;
    }
  }
}
.tableView {
  padding-top: 20px;
}
</style>