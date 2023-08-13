<template>
  <div class="GREMain">
    <!-- Vsr-vpn -->
    <div class="operate">
      <button class="close" @click="removeGreList" v-control>{{$t('vsr1000.delete')}}</button>
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
        <el-table-column type="selection" width="55" show-overflow-tooltip :resizable="false"></el-table-column>
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
        <el-table-column
          prop="vrfName"
          :label="$t('vsr1000.tenantRoutingDomain')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column prop="sourceIp" :label="$t('vsr1000.sourceIP')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="destinationIp" :label="$t('vsr1000.destIP')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="ipv4List[0]" :label="$t('vsr1000.tunnelIP')" show-overflow-tooltip :resizable="false"></el-table-column>
        <!-- <el-table-column prop="IPV6" :label="$t('vsr1000.tunnel')+'IPV6'" show-overflow-tooltip></el-table-column> -->
        <el-table-column width="180" :label="$t('vsr1000.operate')" :resizable="false">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t('vsr1000.edit')}}</el-button>
            <el-button
              @click="grandeClick(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t('vsr1000.expertSet')}}</el-button>
            <el-button
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
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
    <addGRE v-if="isShow" />
    <editGRE v-show="isShowD" ref="editGRE" />
    <grandSet v-show="isShowG" ref="grandSet" />
  </div>
</template>
<script>
import addGRE from "./components/addGRE";
import editGRE from "./components/editGRE";
import grandSet from "./components/grandSet";
import { getGre, delGres } from "@/services";
export default {
  props: {},
  components: {
    addGRE,
    editGRE,
    grandSet
  },
  data() {
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      isShow: false,
      isShowD: false,
      isShowG: false,
      lSize: 10, //每页条数 Number each page
                 // Number each page
      lNumber: 1, //页数 number of pages
                  // The number of pages
      alllite: 0, //总条数 total number
                  // Total number total number
      tableData: [],
      //多选选中的数据 Multi-select the selected data
      // Multi-select the selected data
      multipleSelection: []
    };
  },
  computed: {},
  methods: {
    //多选删除
    // Much choose delete
    //Much choose delete
    removeGreList() {
      // console.log(this.multipleSelection);
      if (this.multipleSelection.length) {
        let ids = this.multipleSelection.map(item => item.id);

        let deviceId = this.deviceId;
        let _this = this;
        var show29 = localStorage.getItem("show29");
        if(show29 == 'true'){
          
            delGres({
              deviceSerialNumber: JSON.parse(this.$route.query.devData)
                .vsrSeries,
              greIds: ids,
              tenantId: JSON.parse(this.$route.query.devData).tenantId
            }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                _this.greDataInit({
                  deviceId: this.deviceId,
                  page: 1,
                  pageSize: this.lSize
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
          this.$confirm(this.$t("vsr1000.confirmDel"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue29\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), this.$t("vsr1000.hint"), {
            confirmButtonText: this.$t("vsr1000.OK"),
            cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning"
          })
          .then(() => {
            delGres({
              deviceSerialNumber: JSON.parse(this.$route.query.devData)
                .vsrSeries,
              greIds: ids,
              tenantId: JSON.parse(this.$route.query.devData).tenantId
            }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                _this.greDataInit({
                  deviceId: this.deviceId,
                  page: 1,
                  pageSize: this.lSize
                });
                this.lNumber = 1;
                localStorage.setItem("show29",localStorage.getItem("checkedValue29"));
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
    //新增弹框
    // The new play box
    //The new play box
    addEvent() {
      this.isShow = true;
    },
    //多选选中
    // Multiple selected
    //Multiple selected
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //序号排序
    // The serial number sequence
    //The serial number sequence
    indexMethod(index) {
      return (
        index + 1 + (this.lNumber == 1 ? 0 : this.lSize * (this.lNumber - 1))
      );
    },
    //获取列表数据
    // Getting list data
    //Getting list data
    greDataInit(params) {
      getGre(params).then(res => {
        if (res.code === 10000) {
          this.alllite = res.result.totalElements;
          this.tableData = res.result.content;
        }
      });
    },
    //页数总条目改变
    // Total page entries change
    //Total page entries change
    litePage(val) {
      this.lSize = val;
      let deviceId = this.deviceId;

      let params = {
        pageSize: this.lSize,
        page: 1,
        deviceId
      };
      this.lNumber = 1;
      this.greDataInit(params);
    },
    //页数改变
    // Page number change
    //Page number change
    liteSize(val) {
      // console.log(val)
      let deviceId = this.deviceId;
      this.lNumber = val;
      let params = {
        pageSize: this.lSize,
        page: this.lNumber,
        deviceId
      };
      this.greDataInit(params);
    },
    //编辑
    // edit
    //edit
    handleClick(row) {
      this.isShowD = true;
      this.$refs.editGRE.dataInit(row);
    },
    //高级设置
    // Advanced Settings
    //advanced setup
    grandeClick(row) {
      this.isShowG = true;
      this.$refs.grandSet.getSelectList(row);
    },
    //单项删除
    // Single delete
    //Single delete
    remove(row) {
      let deviceId = this.deviceId;
      let _this = this;

      var show30 = localStorage.getItem("show30");
      if(show30 == 'true'){
        
          delGres({
            deviceSerialNumber: JSON.parse(this.$route.query.devData)
              .vsrSeries,
            greIds: [row.id],
            tenantId: JSON.parse(this.$route.query.devData).tenantId
          }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]")
              });
              _this.greDataInit({
                deviceId: this.deviceId,
                page: 1,
                pageSize: this.lSize
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
        this.$confirm(this.$t("vsr1000.confirmDel"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue30\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), this.$t("vsr1000.hint"), {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          delGres({
            deviceSerialNumber: JSON.parse(this.$route.query.devData).vsrSeries,
            greIds: [row.id],
            tenantId: JSON.parse(this.$route.query.devData).tenantId
          }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]")
              });
              _this.greDataInit({
                deviceId: this.deviceId,
                page: 1,
                pageSize: this.lSize
              });
              this.lNumber = 1;
              localStorage.setItem("show30",localStorage.getItem("checkedValue30"));
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
      
    }
  },
  created() {
    let params = {
      deviceId: this.deviceId,
      page: this.lNumber,
      pageSize: this.lSize
    };
    this.greDataInit(params);
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.GREMain {
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