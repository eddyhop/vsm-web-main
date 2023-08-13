<template>
  <div class="dhcpServer">
    <div class="operate">
      <div class="btns">
        <ul class="dhcpServerSetList">
          <li
            v-for="item in tabsData"
            :key="item.id"
            @click="tabEvent(item)"
            :class="{ active: item.id == activeIndex }"
          >
            {{ item.name }}
          </li>
        </ul>
        <div class="butInfo" v-if="tabShow">
          <button
            class="add"
            :class="!online?'add2':''"
            @click="add1()"
            :disabled="!online"
            v-show="btn_show1"
          >
            <img src="@/assets/newPage/icon_add@2x.png" alt />
            {{ $t("subscription.add") }}
          </button>
        </div>
        <div class="butInfo" v-else>
          <button class="add" @click="add2()" v-show="btn_show">
            <img src="@/assets/newPage/icon_add@2x.png" alt />
            {{ $t("subscription.add") }}
          </button>
        </div>
      </div>
    </div>
    <div class="tableList" v-if="tabShow">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        size="small"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          prop="name"
          :label="$t('subscription.dhcpServer.name')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="description"
          :label="$t('subscription.dhcpServer.description')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="logicName"
          :label="$t('subscription.dhcpServer.logicalInterface')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="ipStart"
          :label="$t('subscription.dhcpServer.startingIPAddress')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="ipEnd"
          :label="$t('subscription.dhcpServer.endingIPAddress')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="leaseTime"
          :label="$t('subscription.dhcpServer.leaseTime')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="dnsIp"
          :label="$t('subscription.dhcpServer.primaryDNS')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          :label="$t('subscription.dhcpServer.operations')"
          align="center"
          width="200"
          :resizable="false"
        >
          <template slot-scope="scope">
            <el-button
              :class="!online?'notallowed':''"
              @click="edit1(scope.row)"
              :disabled="!online"
              type="text"
              size="small"
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              v-control
              >{{ $t("subscription.edit") }}</el-button
            >
            <el-button
              type="text"
              :class="!online?'notallowed':''"
              :disabled="!online"
              size="small"
              @click="del1(scope.row)"
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              v-control
              >{{ $t("subscription.delete") }}</el-button
            >
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
    <div v-else>
      <el-table
        :data="tableData1"
        border
        stripe
        style="width: 100%"
        size="small"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          prop="name"
          :label="$t('subscription.dhcpServer.name')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="description"
          :label="$t('subscription.dhcpServer.description')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="netSegment"
          :label="$t('subscription.dhcpServer.addressPool')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="maxMask"
          :label="$t('subscription.dhcpServer.maskLength')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="routeIssue"
          :label="$t('subscription.dhcpServer.advertisedSubnets')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="dns_value"
          :label="$t('subscription.dhcpServer.dnsServer')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          :label="$t('subscription.dhcpServer.operations')"
          align="center"
          width="200"
          :resizable="false"
        >
          <template slot-scope="scope">
            <el-button
              @click="edit2(scope.row)"
              type="text"
              size="small"
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              v-control
              >{{ $t("subscription.edit") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="del2(scope.row)"
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              v-control
              >{{ $t("subscription.delete") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="totalNum"
          :page-size="10"
          @size-change="pageChange"
          @current-change="sizeChange"
          :current-page="lNumber"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addDHCPServer v-if="addDHCPServerShow" />
    <editDHCPServer :dhcpId="dhcpId" v-if="editDHCPServerShow" />
    <addPools v-if="addPoolsShow" />
    <editPools :devId="devId" v-if="editPoolsShow" />
  </div>
</template>
<script>
import addDHCPServer from "./components/addDHCPServer";
import editDHCPServer from "./components/editDHCPServer";
import addPools from "./components/addPools";
import editPools from "./components/editPools";
import {
  tenantServiceDel,
  getPoolList,
  getDhcpServerList,
  dhcpDel,
  userInfo
} from "@/services";
export default {
  data() {
    return {
      devId: "",
      dhcpId: "",
      online: JSON.parse(this.$route.query.devData).online,
      location: JSON.parse(this.$route.query.devData).location,
      addPoolsShow: false,
      editPoolsShow: false,
      addDHCPServerShow: false,
      editDHCPServerShow: false,
      btn_show: true,
      btn_show1: true,
      activeIndex: 0,
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      page: 1, //当前页数
      pageSize: 10,
      allNum: 0,
      lNumber: 1, //当前页数
      size: 10,
      totalNum: 0,
      multipleSelection: [],
      tableData: [],
      tableData1: [],
      tabsData: [
        {
          name: this.$t("subscription.dhcpServer.dhcpServer"),
          id: 0,
        }
      ],
      tabShow: true,
      type: ""
    };
  },
  components: {
    addPools,
    editPools,
    addDHCPServer,
    editDHCPServer,
  },
  methods: {
    add1() {
      if (!this.devCheckOnline()) {
        return;
      }
      this.addDHCPServerShow = true;
    },
    add2() {
      if (!this.devCheckOnline()) {
        return;
      }
      this.addPoolsShow = true;
    },
    del1(row) {
      if (!this.devCheckOnline()) {
        return;
      }
      var show61 = localStorage.getItem("show61");
      if (show61 == "true") {
        let params = { deviceId: row.deviceId };
        dhcpDel(params).then((res) => {
          if (res.code == 10000) {
            this.$message({
              type: "success",
              message: this.$t("subscription.vpns.remind[11]"),
            });
            this.getDHCPService();
          } else {
            this.$message({
              type: "warning",
              dangerouslyUseHTMLString: true,
              message: res.message,
            });
          }
        });
      } else {
        this.$confirm(
          this.$t("vsr1000.remind[1]") +
            "<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue61\",this.checked)' type='checkbox'> " +
            this.$t("doNotShowThisAgain") +
            "</label></div>",
          {
            confirmButtonText: this.$t("vsr1000.OK"),
            cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning",
          }
        )
          .then(() => {
            let params = { deviceId: row.deviceId };
            dhcpDel(params).then((res) => {
              if (res.code == 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("subscription.vpns.remind[11]"),
                });
                this.getDHCPService();
                localStorage.setItem(
                  "show61",
                  localStorage.getItem("checkedValue61")
                );
              } else {
                this.$message({
                  type: "warning",
                  dangerouslyUseHTMLString: true,
                  message: res.message,
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("vsr1000.remind[2]"),
            });
          });
      }
    },
    del2(row) {
      if (!this.devCheckOnline()) {
        return;
      }
      var show62 = localStorage.getItem("show62");
      if (show62 == "true") {
        if (row.secure) {
          this.$message({
            type: "warning",
            message: this.$t(
              "subscription.dhcpServer.addMobileClientPooleCheck"
            ),
          });
          return false;
        }
        let params = { id: row.id };
        tenantServiceDel(params).then((res) => {
          if (res.code == 10000) {
            this.$message({
              type: "success",
              message: this.$t("subscription.vpns.remind[11]"),
            });
            this.getTenantService();
          } else {
            this.$message({
              type: "warning",
              dangerouslyUseHTMLString: true,
              message: res.message,
            });
          }
        });
      } else {
        this.$confirm(
          this.$t("vsr1000.remind[1]") +
            "<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue62\",this.checked)' type='checkbox'> " +
            this.$t("doNotShowThisAgain") +
            "</label></div>",
          {
            confirmButtonText: this.$t("vsr1000.OK"),
            cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning",
          }
        )
          .then(() => {
            if (row.secure) {
              this.$message({
                type: "warning",
                message: this.$t(
                  "subscription.dhcpServer.addMobileClientPooleCheck"
                ),
              });
              return false;
            }
            let params = { id: row.id };
            tenantServiceDel(params).then((res) => {
              if (res.code == 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("subscription.vpns.remind[11]"),
                });
                this.getTenantService();
                localStorage.setItem(
                  "show62",
                  localStorage.getItem("checkedValue62")
                );
              } else {
                this.$message({
                  type: "warning",
                  dangerouslyUseHTMLString: true,
                  message: res.message,
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("vsr1000.remind[2]"),
            });
          });
      }
    },
    async edit1(row) {
      if (!this.devCheckOnline()) {
        return;
      }
      this.dhcpId = row.id;
      this.editDHCPServerShow = true;
    },
    tabEvent(item) {
      this.activeIndex = item.id;
      this.tabShow = item.id === 0 ? true : false;
    },
    //页面条数改变
    // The number of page bars changed
    pageChange(val) {
      if (this.tabShow) {
        this.pageSize = val;
        this.page = 1;
      } else {
        this.size = val;
        this.lNumber = 1;
      }
    },
    //页数改变
    // Page number change
    sizeChange(val) {
      if (this.tabShow) {
        this.page = val;
      } else {
        this.lNumber = val;
      }
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
    edit2(row) {
      if (!this.devCheckOnline()) {
        return;
      }
      this.devId = row.id;
      this.editPoolsShow = true;
    },
    //单项删除
    // Single delete
    remove() {},
    //多项删除
    // A number of deleted
    removeList() {},
    //加载连接池
    getTenantService(){
        let params = { deviceId: this.deviceId, pageNumber: this.page, pageSize: this.pageSize ,tenantId: sessionStorage.getItem("tenantValue")};
       getPoolList(params).then(res => {
        if (res.code === 10000) {
          this.totalNum = res.result.totalElements;
          this.tableData1 = res.result.content;
          if (this.totalNum > 0) {
            this.btn_show = false;
          } else {
            this.btn_show = true;
          }
        }
      });
    },
    getDHCPService(){
      let params = { deviceId: this.deviceId, pageNumber: this.page, pageSize: this.pageSize ,tenantId:sessionStorage.getItem("tenantValue")};
      getDhcpServerList(params).then(res => {
        if (res.code === 10000) {
          this.allNum = res.result.totalElements;
          this.tableData = res.result.content;
          if (this.allNum > 0) {
            this.btn_show1 = false;
          } else {
            this.btn_show1 = true;
          }
        }
      });
    },
    devCheckOnline() {
      let online = JSON.parse(this.$route.query.devData).online;
      if (!online) {
        this.$message({
          type: "warning",
          message: this.$t("Configuration.EdgeConfiguration"),
        });
        return;
      }
      return online;
      // return true;
    },
  },
  created() {
  this.deviceId = JSON.parse(this.$route.query.devData).deviceId;
  this.tenantId = sessionStorage.getItem("tenantValue");
    if (this.online) {
      userInfo().then((res) => {
        this.type = res.result.type;
        if (this.location == "NaaS Edge" && !(this.type == 1)) {
          this.online = false;
        }
      });
    }
    this.getTenantService();
    this.getDHCPService();
  },
mounted() {}
};
</script>
<style scoped lang="scss">
.dhcpServer {
  width: 100%;
  .dhcpServerSetList {
    float: left;
    padding-bottom: 20px;
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    li {
      float: left;
      height: 34px;
      text-align: center;
      line-height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      margin-right: 14px;
      cursor: pointer;
      padding: 0 12px;
    }
    .active {
      background: #3678c8;
      color: #fff;
      border: 1px solid #3678c8;
    }
    .active:hover {
      background: rgba(96, 149, 214, 1);
      border: 1px solid rgba(96, 149, 214, 1);
    }
    li:hover {
      background: #3678c8;
      color: #fff;
      border: 1px solid #3678c8;
    }
  }
}
.notallowed{
  cursor: not-allowed;
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
}
.btns {
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
  .butInfo {
    float: right;
  }
  .add {
    &:hover {
      background: rgba(96, 149, 214, 1);
    }
  }
  .add2 {
    &:hover {
      cursor: not-allowed;
      background: rgba(96, 149, 214, 1);
    }
  }
  .close {
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-left: 14px;
  }
}
</style>
