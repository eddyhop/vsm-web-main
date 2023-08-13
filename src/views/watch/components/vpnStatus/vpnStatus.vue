<template>
  <div class="logical">
    <!-- 逻辑端口 -->
    <div class="operate">
      <button
        @click="qhuan(1)"
        class="flBut"
        :class="{ onBut: qhuanInt == 1 }"
        v-control
      >
        {{ $t("Diag.fixedClientStats") }}
      </button>
      <button
        @click="qhuan(2)"
        class="flBut"
        :class="{ onBut: qhuanInt == 2 }"
        v-control
      >
        {{ $t("Diag.mobileClientStats") }}
      </button>
      <button class="add" v-control @click="refresh()">
        {{ $t("Monit.refresh") }}
      </button>
    </div>
    <div v-if="qhuanInt == 1" class="tableView">
      <el-row style="margin-bottom: 15px; font-family: arial, sans-serif">
        {{ $t("Diag.name") }}
        <el-select
          filterable
          size="small"
          v-model="vpnName"
          @change="vpnNameChange"
          clearable
          style="margin-right: 20px"
        >
          <el-option
            v-for="item in vpnNameList"
            :key="item.name"
            :label="item.name"
            :value="item.name"
            style="font-family: arial, sans-serif"
          ></el-option>
        </el-select>
        {{ $t("Monit.state") }}
        <el-select
          filterable
          size="small"
          v-model="siteState"
          @change="vpnNameChange"
          clearable
        >
          <el-option
            v-for="item in stateList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            style="font-family: arial, sans-serif"
          ></el-option>
        </el-select>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
        stripe
        fit
        size="small"
      >
        <el-table-column
          prop="name"
          :label="$t('Diag.name')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="state"
          :label="$t('Monit.state')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="duration"
          :label="$t('Monit.duration')"
          show-overflow-tooltip
          :resizable="false"
        >
        <template slot-scope="scope">
            {{ scope.row.state === "Connected" ? scope.row.duration : showDisconnectedTime(scope.row.lastOnlineTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="lastOnlineTime"
          :label="$t('Monit.lastSeen')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <!--
        <el-table-column prop="remotePeerName" :label="$t('Monit.remotePeer')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="uptime" :label="$t('Monit.uptime')" show-overflow-tooltip :resizable="false"></el-table-column> -->

        <el-table-column
          width="180"
          :label="$t('Monit.operations')"
          :resizable="false"
        >
          <template slot-scope="scope">
            <button
              @click="site_stop(scope)"
              :class="!deviceOnline ? 'notallowed' : ''"
              :disabled="!deviceOnline"
              type="text"
              class="edit"
              size="small"
              v-control
              style="color: #3678c8; font-size: 14px; font-weight: 400"
            >
              {{ $t("Monit.stop") }}
            </button>
            <button
              type="text"
              size="small"
              class="edit"
              :class="!deviceOnline ? 'notallowed' : ''"
              :disabled="!deviceOnline"
              v-control
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              @click="site_start(scope)"
            >
              {{ $t("Monit.start") }}
            </button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allNum"
          @size-change="sizeChange"
          @current-change="pageChange"
          :current-page="lNumber"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
      <linkState ref="linkState" />
    </div>
    <div v-if="qhuanInt == 2" class="tableView">
      <el-row style="margin-bottom: 15px; font-family: arial, sans-serif">
        {{ $t("Diag.name") }}
        <el-select
          filterable
          size="small"
          v-model="clientUsername"
          @change="clientUsernameChange"
          clearable
          style="margin-right: 20px"
        >
          <el-option
            v-for="item in clientUsernameList"
            :key="item.name"
            :label="item.name"
            :value="item.id"
            style="font-family: arial, sans-serif"
          ></el-option>
        </el-select>
        {{ $t("Monit.state") }}
        <el-select
          filterable
          size="small"
          v-model="state"
          @change="clientUsernameChange"
          clearable
        >
          <el-option
            v-for="item in stateList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            style="font-family: arial, sans-serif"
          ></el-option>
        </el-select>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="tableData1"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
        stripe
        fit
        size="small"
      >
        <!-- <el-table-column prop="clientName" :label="$t('Monit.clientAccount')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="vpnName" :label="$t('Monit.vpnName')" show-overflow-tooltip :resizable="false"></el-table-column> -->
        <el-table-column
          prop="vpnName"
          :label="$t('Monit.clientUsername')"
          show-overflow-tooltip
          :resizable="false"
          :formatter="formatterName"
        ></el-table-column>
        <el-table-column
          prop="state"
          :label="$t('Monit.state')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="ip"
          :label="$t('Diag.associatedIP')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="duration"
            :label="$t('Monit.duration')"
            show-overflow-tooltip
            :resizable="false"
          >
          <template slot-scope="scope">
            {{ scope.row.state === "Connected" ? scope.row.duration : showDisconnectedTime(scope.row.lastOnlineTime) }}
          </template>
        </el-table-column>
        <el-table-column          
          prop="lastOnlineTime"
          :label="$t('Monit.lastSeen')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          width="180"
          :label="$t('Monit.operations')"
          :resizable="false"
        >
          <template slot-scope="scope">
            <button
              type="text"
              size="small"
              class="edit"
              :class="!(scope.row.state == 'Connected') ? 'notallowed' : ''"
              :disabled="!(scope.row.state == 'Connected')"
              v-control
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              @click="disconnect(scope)"
            >
              {{ $t("Monit.disconnect") }}
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
      <clientVpn ref="clientVpn" />
    </div>
    <!-- <editPort ref="editPort" v-show="editShow"></editPort>
    <addPzInfo ref="addPzInfo" :pzShow="pzShow"></addPzInfo> -->
  </div>
</template>
<script>
// import editPort from "./components/editPort";
// import addPzInfo from "./components/addPz";
import {
  getByVPNStatusByTts,
  repairtoolsSendGREMessageNew,
  repairtoolsSendReairMessageNew,
  siteVpnOptions,
  clientVpnOptions,
  getDevLocation,
  userInfo,
  mobileUserGetByCondition
} from "@/services/index";
import linkState from "@/views/equipment/pages/linkState/linkState"; //01链路情况 Link State
import clientVpn from "./components/clientVpn";
import moment from "moment";
export default {
  props: {},
  components: {
    linkState,
    clientVpn,
  },
  data() {
    return {
      clientUsername: "",
      clientUsernameList: [],
      clientUsernameListTemp: [],
      vpnName: "",
      state: "",
      siteState: "",
      vpnNameList: [],
      stateList: [
        {
          id: "Connected",
          name: "Connected",
        },
        {
          id: "Disconnected",
          name: "Disconnected",
        },
      ],
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
      tableData: [],
      totalNum: 0,
      page: 1,
      pageSize: 10,
      tableData1: [],
      multipleSelection: [],
      clientsList: [],
      deviceId: "",
      tenantId: "",
      //在线状态
      deviceOnline: JSON.parse(this.$route.query.devData).online,
      //设备类型
      location: JSON.parse(this.$route.query.devData).location,
      type: "",
      isButtonEnabled: false
    };
  },
  computed: {},
  methods: {
    showDisconnectedTime(s) {
      if(s!=""){
        var currentTime = new Date()
        var time = new Date(s)
        var displaySeconds = 1000,
            displayMinutes = displaySeconds * 60,
            displayHours = displayMinutes * 60,
            displayDays = displayHours * 24,
            displayMonths = displayDays * 30,
            displayYears = displayDays * 365;

        var elapsedMilliseconds = currentTime - time;
        var duration = moment.duration(elapsedMilliseconds);

        displayYears = duration._data.year;
        displayMonths = duration._data.months;
        displayDays = duration._data.days;
        displayHours = duration._data.hours;
        displayMinutes = duration._data.minutes;
        displaySeconds = duration._data.seconds;

        displayYears = displayYears > 0 ? (displayYears > 1 ? displayYears + ' Years ' : displayYears + ' Year '): '';
        displayMonths = displayMonths > 0 ? (displayMonths > 1 ? displayMonths + ' Months ' : displayMonths + ' Month ') : '';
        displayDays = displayDays > 0 ? (displayDays > 1 ? displayDays + ' Days ' : displayDays + ' Day ') : '';
        displayHours = displayHours > 0 ? (displayHours > 1 ? displayHours + ' Hours ' : displayHours + ' Hour ') : '';
        displayMinutes = displayMinutes > 0 ? displayMinutes + ' Minutes ' : '';
        displaySeconds = displaySeconds > 0 ? displaySeconds + ' Seconds' : '';

        const returnValue =
            displayYears +
            displayMonths +
                displayDays +
                displayHours +
                displayMinutes +
                displaySeconds;
        return returnValue
      }else{
        return "";
      }
    },
    formatterName(row) {
      var vpnName = row.vpnName;
      if (vpnName.indexOf("@") > -1) {
        return vpnName.split("@")[0];
      } else {
        return vpnName;
      }
    },
    clientUsernameChange() {
      this.getVpvClient();
    },
    vpnNameChange() {
      this.getVpvServer();
    },
    qhuan(r) {
      this.qhuanInt = r;
      if (r == 1) {
        this.getVpvServer();
      } else {
        this.getVpvClient();
      }
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
      if (this.qhuanInt == 2) {
        this.pageSize = val;
        this.page = 1;
      } else {
        this.size = val;
        this.lNumber = 1;
      }
    },
    pageChange(val) {
      //页数改变 Page number change
      // Page change Page Number change
      if (this.qhuanInt == 2) {
        this.page = val;
      } else {
        this.lNumber = val;
      }
    },
    getVpvServer() {
      let params = {
        deviceId: this.deviceId,
        type: "site_vpn",
        pageNumber: this.lNumber,
        pageSize: this.size,
        name: this.vpnName,
        state: this.siteState,
      };
      // getVpnSite(params).then(res => {
      //   this.tableData = res.result.content;
      //   this.allNum = res.result.totalElements;
      // });
      let thisDate = new Date();
      //时区
      var datestring = thisDate.toString();

      //与UTC时间差
      var utcDate = datestring.split("GMT")[1];
      utcDate = utcDate.substring(0, 3);
      var utc = parseInt(utcDate);

      getByVPNStatusByTts(params).then((res) => {
        // this.allNum =0;
        if (res.result != null) {
          this.allNum = res.result.length;
          this.tableData = res.result;
          this.tableData.forEach((item) => {
            var times = item.lastOnlineTime;
            if (times) {
              var newDate = new Date(times);
              newDate.setHours(newDate.getHours() + utc);
              item.lastOnlineTime = this.getTime(newDate);
            }
          });
        }

        this.$refs.linkState.showPic(this.vpnName);
      });
    },
    getVpvClient() {
      let clientUsername = "";
      if(this.clientUsernameListTemp) {
        this.clientUsernameListTemp.find((item) => {
          if (item.id == this.clientUsername) {
            clientUsername = item.name;
          }
        });
      }
      let params = {
        deviceId: this.deviceId,
        type: "client_vpn",
        pageNumber: this.page,
        pageSize: this.pageSize,
        name: clientUsername,
        state: this.state,
      };
      // getClinetVpn(params).then(res => {
      //   this.tableData1 = res.result.content;
      //   this.lNumber = res.result.totalElements;
      // });

      let thisDate = new Date();
      //时区
      var datestring = thisDate.toString();

      //与UTC时间差
      var utcDate = datestring.split("GMT")[1];
      utcDate = utcDate.substring(0, 3);
      var utc = parseInt(utcDate);

      getByVPNStatusByTts(params).then((res) => {
        //this.lNumber =0;
        if (res.result != null) {
          this.totalNum = res.result.length;
          this.tableData1 = res.result;
          this.tableData1.forEach((item) => {
            var matchingClient = this.clientsList.find(client => {
              return client.username === item.vpnName
            })

            item.ip = matchingClient.connectionIP;
          });
        }
        this.$refs.clientVpn.showPic(clientUsername);
      });
    },
    getTime(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let miao = date.getSeconds();
      let list = [year, month, day, hour, minute, miao];
      let list2 = [];
      for (let i in list) {
        if (list[i] < 10) {
          let a = "" + 0 + list[i];
          list2.push(a);
        } else {
          list2.push(list[i]);
        }
      }
      let needTime =
        "" +
        list2[0] +
        "-" +
        list2[1] +
        "-" +
        list2[2] +
        " " +
        list2[3] +
        ":" +
        list2[4] +
        ":" +
        list2[5];
      return needTime;
    },
    refresh() {
      if ("1" == this.qhuanInt) {
        this.getVpvServer();
      } else {
        this.getVpvClient();
      }
    },
    disconnect(row) {
      /*this.$confirm(this.$t('Monit.confirmReboot')).then(() => {
        this.sendEvent("ipsec_client_disconn",row.row.vpnName);
      });
*/
      this.$confirm(
        this.$t("vsr1000.sure") +
          "<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue38\",this.checked)' type='checkbox'> " +
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
          this.sendEvent("ipsec_client_disconn", row.row.vpnName);
          row.row.state = "Disconnected";
        })
        .catch(() => {});
    },
    site_start(row) {
      getDevLocation({ deviceId: row.row.remotePeer }).then((res) => {
        var remoteDeviceType = res.result;
        userInfo().then((res) => {
          this.type = res.result.type;
          if (
            remoteDeviceType == "NaaS Edge" &&
            this.location == "NaaS Edge" &&
            !(this.type == 1)
          ) {
            this.$message({
              type: "warning",
              message: this.$t("Configuration.NaaSEdgeVpnStartOrStopError"),
            });
            return;
          } else {
            this.$confirm(this.$t("Monit.confirmReboot")).then(() => {
              if (row.row.vpnRoleName == "gre") {
                this.sendGreEvent("ipsec_site_start", row.row.name);
              } else {
                this.sendEvent("ipsec_site_start", row.row.name);
              }
            });
          }
        });
      });
    },
    site_stop(row) {
      getDevLocation({ deviceId: row.row.remotePeer }).then((res) => {
        var remoteDeviceType = res.result;
        userInfo().then((res) => {
          this.type = res.result.type;
          if (
            remoteDeviceType == "NaaS Edge" &&
            this.location == "NaaS Edge" &&
            !(this.type == 1)
          ) {
            this.$message({
              type: "warning",
              message: this.$t("Configuration.NaaSEdgeVpnStartOrStopError"),
            });
            return;
          } else {
            this.$confirm(this.$t("Monit.confirmReboot")).then(() => {
              if (row.row.vpnRoleName == "gre") {
                this.sendGreEvent("ipsec_site_stop", row.row.name);
              } else {
                this.sendEvent("ipsec_site_stop", row.row.name);
              }
            });
          }
        });
      });
    },
    // Issue repair orders
    sendEvent(val, vpn_name) {
      repairtoolsSendReairMessageNew({
        devSerNum: JSON.parse(this.$route.query.devData).vsrSeries,
        type: val,
        vpn_name: vpn_name,
        interface_name: "",
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
    sendGreEvent(val, vpn_name) {
      repairtoolsSendGREMessageNew({
        devSerNum: JSON.parse(this.$route.query.devData).vsrSeries,
        type: val,
        vpn_name: vpn_name,
        interface_name: "",
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
    this.deviceId = this.$parent.edgeName;
    this.tenantId = sessionStorage.getItem("tenantValue");
    this.getVpvServer();
    this.getVpvClient();

    siteVpnOptions({ deviceId: this.deviceId }).then((res) => {
      if (res.code === 10000) {
        this.vpnNameList = res.result;
      }
    });
    //naas设备和超级管理员验证 取消验证，增加了提示
    // if (this.deviceOnline) {
    //   userInfo().then((res) => {
    //     this.type = res.result.type;
    //     if (this.location == "NaaS Edge" && !(this.type == 1)) {
    //       this.deviceOnline = false;
    //     }
    //   });
    // }

    clientVpnOptions({ deviceId: this.deviceId, tenantId: this.tenantId }).then(
      (res) => {
        if (res.code === 10000) {
          this.clientUsernameListTemp = res.result;

          this.clientUsernameListTemp.forEach((item) => {
            var _id = item.id;
            var name = item.name;
            if (item.name.indexOf("@") > -1) {
              name = item.name.split("@")[0];
            }
            var obj = { name: name, id: _id };
            this.clientUsernameList.push(obj);
          });
        }
      }
    );
    mobileUserGetByCondition({
        pageNumber: 1,
        pageSize: 10,
        tenantId: this.tenantId,
        username: ""
      }).then((res) => {
      if (res.code === 10000) {
        this.clientsList = res.result.content;
      }
    });
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
.notallowed {
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