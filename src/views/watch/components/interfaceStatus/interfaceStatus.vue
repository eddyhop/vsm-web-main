<template>
  <div class="logical">
    <div class="operate">
      <button
        @click="qhuan(1)"
        class="flBut"
        :class="{ onBut: qhuanInt == 1 }"
        v-control
      >
        {{ $t("Monit.physicalInterfaces") }}
      </button>
      <button
        @click="qhuan(2)"
        class="flBut"
        :class="{ onBut: qhuanInt == 2 }"
        v-control
      >
        {{ $t("Monit.logicalInterfaces") }}
      </button>
      <button class="add" v-control @click="refresh()">
        {{ $t("Monit.refresh") }}
      </button>
    </div>
    <!-- 物理端口-->
    <div v-if="qhuanInt == 1" class="tableView">
      <el-row style="margin-bottom: 15px">
        {{ $t("Monit.interfaceName") }}
        <el-select
          filterable
          size="small"
          v-model="interfaceName"
          @change="interfaceNameChange"
          clearable
          style="margin-right: 20px"
        >
          <el-option
            v-for="item in interfaceNameList"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
        {{ $t("Monit.configuredState") }}
        <el-select
          filterable
          size="small"
          v-model="configuredState"
          @change="configuredStateChange"
          clearable
          style="margin-right: 20px"
        >
          <el-option
            v-for="item in configuredStateList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        {{ $t("Monit.opreationalState") }}
        <el-select
          filterable
          size="small"
          v-model="opreationalState"
          @change="opreationalStateChange"
          clearable
        >
          <el-option
            v-for="item in opreationalStateList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border
        stripe
        fit
        size="small"
      >
        <el-table-column
          prop="portName"
          :label="$t('Monit.interfaceName')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="physAddress"
          :label="$t('Monit.macAddress')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="adminStatus"
          :label="$t('Monit.configuredState')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="operStatus"
          :label="$t('Monit.opreationalState')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>

        <el-table-column :label="$t('Monit.operations')" :resizable="false">
          <template slot-scope="scope">
            <button
              @click="goSetPage(scope.row)"
              type="text"
              class="edit"
              size="small"
              v-control
              style="color: #3678c8; font-size: 14px; font-weight: 400"
            >
              {{ $t("Monit.moreDetails") }}
            </button>
            <button
              type="text"
              size="small"
              class="edit"
              :class="!deviceOnline?'notallowed':''"
              :disabled="!deviceOnline"
              v-control
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              @click="restart(scope)"
            >
              {{ $t("Monit.restart") }}
            </button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="totalNum"
          @size-change="sizeChange"
          @current-change="pageChange"
          :current-page="page"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
      <el-row><pandectPic ref="pandectPic" /></el-row>
    </div>
    <!-- 逻辑端口-->
    <div v-if="qhuanInt == 2" class="tableView">
      <el-table
        ref="multipleTable"
        :data="tableData1"
        tooltip-effect="dark"
        style="width: 100%"
        border
        stripe
        fit
        size="small"
      >
        <el-table-column
          prop="loginc_name"
          :label="$t('Monit.interfaceName')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="State"
          :label="$t('Monit.state')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="MTU"
          :label="$t('Monit.mtu')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <!-- <el-table-column prop="dhcpClient" :label="$t('Monit.dhcpClient')" show-overflow-tooltip :resizable="false">
          <template slot-scope="socp">
            <span v-if="socp.row.dhcpClient==true">{{$t('vsr1000.enabled')}}</span>
            <span v-if="socp.row.dhcpClient==false">{{$t('vsr1000.disabled')}}</span>
          </template>
        </el-table-column> -->

        <el-table-column
          prop="SetDhcpClient"
          :label="$t('Monit.iPAddressAllocation')"
          show-overflow-tooltip
          :resizable="false"
        >
        </el-table-column>

        <el-table-column
          prop="LeaseTime"
          :label="$t('Monit.dHCPLeaseEndTime')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="IPAddress"
          :label="$t('Monit.ipAddress')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="GWAddress"
          :label="$t('Monit.gateway')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
      </el-table>
    </div>
    <moreDetails
      :statisticsName="statisticsName"
      :statisticsType="statisticsType"
      ref="moreDetails"
      v-show="moreDetailsShow"
    ></moreDetails>
  </div>
</template>
<script>
import moreDetails from "./components/moreDetails";
import pandectPic from "./components/pandectPic";
import {
  getPhysicalPort,
  getPortList,
  getLogicalPortByTts,
  repairtoolsSendReairMessageNew,
  userInfo
} from "@/services/index";
export default {
  props: {},
  components: {
    moreDetails,
    pandectPic,
  },
  data() {
    return {
      opreationalState: undefined,
      opreationalStateList: [
        {
          name: "UP",
          id: "UP",
        },
        {
          name: "DOWN",
          id: "DOWN",
        },
      ],
      configuredState: undefined,
      configuredStateList: [
        {
          name: "UP",
          id: "UP",
        },
        {
          name: "DOWN",
          id: "DOWN",
        },
      ],
      interfaceName: undefined,
      interfaceNameList: [],
      statisticsType: undefined,
      statisticsName: undefined,
      qosDetailShow: false,
      moreDetailsShow: false,
      qhuanInt: 1,
      // deviceSerialNumber:JSON.parse(this.$route.query.devData).vsrSeries,
      isShow: false,
      pzShow: false,
      editShow: false,
      allNum: 0, //数据总条数 Total number of data bars
      // Total number of data bars
      lNumber: 1, //当前页数, The current number of pages
      // The current number of pages
      Size: 10,
      totalNum: 0,
      page: 1,
      pageSize: 10,
      tableData: [],
      tableData1: [],
      multipleSelection: [],
      deviceId: this.$parent.edgeName,
      tenantId: "",
      portNames: "",
      //在线状态
      deviceOnline: JSON.parse(this.$route.query.devData).online,
      //设备类型
      location: JSON.parse(this.$route.query.devData).location,
      type: ""
    };
  },
  computed: {},
  methods: {
    opreationalStateChange() {
      this.physicalPortInit();
    },
    configuredStateChange() {
      this.physicalPortInit();
    },
    interfaceNameChange() {
      this.physicalPortInit();
    },
    qhuan(r) {
      this.qhuanInt = r;
    },
    //表格序号 Form the serial number
    // Form the serial number
    indexMethod(index) {
      return (
        index + 1 + (this.lNumber == 1 ? 0 : this.Size * (this.lNumber - 1))
      );
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    sizeChange(val) {
      //页数总条目改变 Total page entries change
      // Total page entries change Total Page Entries Change
      this.Size = val;
      this.lNumber = 1;
      this.getList();
    },
    pageChange(val) {
      //页数改变 Page number change
      // Page change Page Number change
      // console.log(val)
      this.lNumber = val;
      this.getList();
    },
    getlogicalPortList() {
      this.deviceId = this.$parent.edgeName;
      let params = {
        deviceId: this.deviceId,
        type: "INTERFACE_DETAIL",
        pageNumber: this.lNumber,
        pageSize: this.Size,
      };
      getLogicalPortByTts(params).then((res) => {
        this.allNum = 0;
        if (res.result != null) {
          this.allNum = res.result.length;
          res.result.forEach((item) => {
            if (item.SetDhcpClient == true) {
              item.IPAddress = item.Dhcp.IPAddress;
              item.GWAddress = item.Dhcp.GWAddress;
              item.LeaseTime = item.Dhcp.LeaseTime;
              item.SetDhcpClient = "Dynamic";
            } else {
              item.SetDhcpClient = "Static";
            }
          });

          this.tableData1 = res.result;
        }
        // this.allNum = res.result.totalElements;
        // this.tableData1 = res.result.content;
      });
    },
    physicalPortInit() {
      this.deviceId = this.$parent.edgeName;
      let params = {
        deviceId: this.deviceId,
        pageSize: this.pageSize,
        page: this.page,
        interfaceName: this.interfaceName,
        configuredState: this.configuredState,
        opreationalState: this.opreationalState,
      };

      getPortList(params).then((res) => {
        this.totalNum = res.result.totalElements;
        res.result.content.forEach((item) => {
          item.portSwitch = item.portEnabled ? "Up" : "Down";
        });
        this.tableData = res.result.content;
        this.$refs.pandectPic.showPic(this.interfaceName);
      });
    },
    refresh() {
      if ("1" == this.qhuanInt) {
        this.physicalPortInit();
      } else {
        this.getlogicalPortList();
      }
    },
    goSetPage(row) {
      this.statisticsName = row.portName;
      this.statisticsType = row.portType;
      this.$refs.moreDetails.initData(row);
      this.moreDetailsShow = true;
    },
    restart(row) {
      this.$confirm(this.$t("Monit.confirmReboot")).then(() => {
        this.sendEvent("interface_restart", row.row.portName);
      });
    },
    // Issue repair orders
    sendEvent(val, interface_name) {
      repairtoolsSendReairMessageNew({
        devSerNum: JSON.parse(this.$route.query.devData).vsrSeries,
        type: val,
        vpn_name: "",
        interface_name: interface_name,
      }).then((res) => {
        if (res.code === 10000) {
          this.$message({
            message: this.$t("Monit.success"),
            type: "success",
          });
        } else {
          this.$message({
            type: "warning",
            message: res.message,
          });
        }
      });
    },
  },
  created() {
    this.tenantId = sessionStorage.getItem("tenantValue");
    this.physicalPortInit();
    this.getlogicalPortList();

    if (this.deviceOnline) {
      userInfo().then((res) => {
        this.type = res.result.type;
        if (this.location == "NaaS Edge" && !(this.type == 1)) {
          this.deviceOnline = false;
        }
      });
    }

    getPhysicalPort({ deviceId: this.deviceId, tenantId: this.tenantId }).then(
      (res) => {
        this.interfaceNameList = res.result.port;
      }
    );
  },
  mounted() {},
};
</script>
<style lang="scss">
.logical {
  .el-table th {
    text-align: center;
  }
  .el-table td {
    text-align: center;
  }
}
</style>
<style scoped lang="scss">
.logical {
  padding: 20px 30px 0 30px;
}
.notallowed{
  cursor: not-allowed;
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
  .add:hover {
    background: #6095d6;
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
  .flBut {
    padding: 0 15px;
    &.onBut {
      background: rgba(54, 120, 200, 1);
      color: #ffffff;
    }
    width: auto;
    float: left;
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-right: 20px;
    &:hover {
      background: #6095d6;
      color: #ffffff;
    }
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
  .edit {
    font-size: 11px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    border: none;
    background: none;
  }
}
</style>