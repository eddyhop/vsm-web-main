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
        {{ $t("Monit.serviceRouting") }}
      </button>
      <button
        @click="qhuan(2)"
        class="flBut"
        :class="{ onBut: qhuanInt == 2 }"
        v-control
      >
        {{ $t("Monit.arpTable") }}
      </button>
      <button class="add" v-control @click="refreshOn()">
        {{ $t("Monit.refresh") }}
      </button>
    </div>
    <div v-if="qhuanInt == 1" class="tableView">
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
        <el-table-column
          prop="dst_network"
          :label="$t('Monit.destinationIPOrMask')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="next_hop_addr"
          :label="$t('Monit.nextHop')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="outgoing_interface"
          :label="$t('Monit.interfaceName')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="preference"
          :label="$t('Monit.administrativeDistance')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
      </el-table>
    </div>
    <div v-if="qhuanInt == 2" class="tableView">
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
          prop="ip_address"
          :label="$t('Monit.ip')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="phys_address"
          :label="$t('Monit.macAddress')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="interface"
          :label="$t('Monit.interfaceName')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>

        <el-table-column
          prop="static"
          :label="$t('Monit.type')"
          show-overflow-tooltip
          :resizable="false"
        >
          <template slot-scope="scope">
            {{ scope.static ? "Static" : "Dynamic" }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <editPort ref="editPort" v-show="editShow"></editPort>
    <addPzInfo ref="addPzInfo" :pzShow="pzShow"></addPzInfo> -->
  </div>
</template>
<script>
// import editPort from "./components/editPort";
// import addPzInfo from "./components/addPz";
import {
  logicalPortGet,
  logicalPortGetSelect,
  logicalPortDel,
  logicalPortExtra,
  logicalPortExtraGet,
  checkEditIps,
  logicalPortGetByTts,
  userInfo,
} from "@/services/index";
export default {
  props: {},
  components: {
    // editPort,
    // addPzInfo
  },
  data() {
    return {
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
      tableData1: [],
      tableData: [],
      multipleSelection: [],
      deviceId: "",
      tenantId: "",
      type: "",
    };
  },
  computed: {},
  methods: {
    qhuan(r) {
      this.qhuanInt = r;
    },
    refreshOn() {
      if (1 == this.qhuanInt) {
        this.getList1();
      } else {
        this.getList();
      }
    },
    addBz() {
      this.pzShow = true;
      logicalPortGetSelect({
        deviceId: this.deviceId,
        tenantId: this.tenantId,
      }).then((res) => {
        this.$refs.addPzInfo.form.physicalInterfaceList = res.result.port;
      });
    },
    //表格序号 Form the serial number
    // Form the serial number
    indexMethod(index) {
      return (
        index + 1 + (this.lNumber == 1 ? 0 : this.Size * (this.lNumber - 1))
      );
    },
    choseDel() {
      let ids = [];
      this.multipleSelection.map((item) => {
        ids.push(item.id);
      });
      if (this.tableData.length == 0) {
        this.$message({
          message: this.$t("vsr1000.remind[3]"),
          type: "warning",
        });
      } else if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("vsr1000.remind[4]"),
          type: "warning",
        });
      } else {
        var show103 = localStorage.getItem("show103");
        if (show103 == "true") {
          logicalPortDel({
            logicalPortIds: ids.join(","),
            deviceSerialNumber: this.deviceSerialNumber,
            tenantId: this.tenantId,
          }).then((res) => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind[5]"),
              });
              this.getList1();
              this.getList();
            } else {
              let strArr = res.message.split(",");
              let str = "";
              strArr.forEach((item) => {
                str += `<p style='padding:0 0 10px 0'><b>${item}</b></p>`;
              });
              this.$message({
                type: "warning",
                dangerouslyUseHTMLString: true,
                message: str,
              });
            }
            let params = {
              pageSize: this.Size,
              page: this.lNumber,
              mid: this.mid,
            };
            this.getList1(params);
            this.getList(params);
          });
        } else {
          this.$confirm(
            this.$t("vsr1000.remind[1]") +
              "<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue103\",this.checked)' type='checkbox'> " +
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
              logicalPortDel({
                logicalPortIds: ids.join(","),
                deviceSerialNumber: this.deviceSerialNumber,
                tenantId: this.tenantId,
              }).then((res) => {
                if (res.code == 10000) {
                  this.$message({
                    type: "success",
                    message: this.$t("vsr1000.remind[5]"),
                  });
                  this.getList1();
                  this.getList();
                  localStorage.setItem(
                    "show103",
                    localStorage.getItem("checkedValue103")
                  );
                } else {
                  let strArr = res.message.split(",");
                  let str = "";
                  strArr.forEach((item) => {
                    str += `<p style='padding:0 0 10px 0'><b>${item}</b></p>`;
                  });
                  this.$message({
                    type: "warning",
                    dangerouslyUseHTMLString: true,
                    message: str,
                  });
                }
                let params = {
                  pageSize: this.Size,
                  page: this.lNumber,
                  mid: this.mid,
                };
                this.getList1(params);
                this.getList(params);
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: this.$t("vsr1000.remind[2]"),
              });
            });
        }
      }
    },
    del(row) {
      var show104 = localStorage.getItem("show104");
      if (show104 == "true") {
        let params = {
          logicalPortIds: row.id,
          deviceSerialNumber: this.deviceSerialNumber,
          tenantId: this.tenantId,
        };
        logicalPortDel(params).then((res) => {
          if (res.code == 10000) {
            this.$message({
              type: "success",
              message: this.$t("vsr1000.remind[5]"),
            });
            this.getList1();
            this.getList();
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
            "<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue104\",this.checked)' type='checkbox'> " +
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
            let params = {
              logicalPortIds: row.id,
              deviceSerialNumber: this.deviceSerialNumber,
              tenantId: this.tenantId,
            };
            logicalPortDel(params).then((res) => {
              if (res.code == 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind[5]"),
                });
                this.getList1();
                this.getList();
                localStorage.setItem(
                  "show104",
                  localStorage.getItem("checkedValue104")
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
    add() {
      this.isShow = true;
      logicalPortGetSelect({
        deviceId: this.deviceId,
        tenantId: this.tenantId,
      }).then((res) => {
        let type = this.type;
        for (let i in res.result.tenantVrf) {
          if (type == 2) {
            if (res.result.tenantVrf[i].name == "default") {
              this.$refs.addPort.form.vrf = res.result.tenantVrf[i].id;
            } else {
              this.$refs.addPort.form.vrf = res.result.tenantVrf[0].id;
            }
          } else {
            this.$refs.addPort.form.vrf = res.result.tenantVrf[0].id;
          }
        }
        this.$refs.addPort.form.vrfList = res.result.tenantVrf;
        this.$refs.addPort.form.options = res.result.port;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //编辑 edit
    // Editors edit
    handleClick(row) {
      this.editShow = true;
      logicalPortGetSelect({
        deviceId: this.deviceId,
        tenantId: this.tenantId,
      }).then((res) => {
        this.$refs.editPort.form.physicalInterfaceList = res.result.port;
      });

      let more = row.portId.split(",");
      let arr = [];
      more.map((item) => {
        arr.push({ key: item });
      });
      this.$refs.editPort.form.portId = arr;
      checkEditIps({ logicalId: row.id }).then((res) => {
        if (res.result) {
          this.$refs.editPort.form.ipv4 = row.ipv4;
        } else {
          this.$message({
            type: "warning",
            message: this.$t("vsr1000.hadlog"),
          });
          this.$refs.editPort.form.couldBack = true;
        }
      });
      let subs = row.subscriptions.split(",");
      let arr1 = [];
      subs.map((item) => {
        arr1.push(item);
      });

      this.$refs.editPort.form.subscriptions = arr1;
      this.$refs.editPort.form.name = row.name;
      this.$refs.editPort.form.oldName = row.name;
      this.$refs.editPort.form.id = row.id;
      this.$refs.editPort.form.description = row.description;
      this.$refs.editPort.form.vrfId = row.vrfId;
      this.$refs.editPort.form.role = row.role;
      this.$refs.editPort.form.type = row.type;
      this.$refs.editPort.form.gateway = row.gateway;
      this.$refs.editPort.form.vpnIp1 = row.vpnIp1;
      this.$refs.editPort.form.vpnIp2 = row.vpnIp2;
      this.$refs.editPort.form.dhcpClient = row.dhcpClient;
      this.$refs.editPort.openVPN();
    },
    //高级设置 advanced setup
    // Advanced Setup
    handleClickSet(row) {
      this.$refs.gradeSet.$el.classList.remove("isShow");
      this.$refs.gradeSet.form.id = row.id;
      let params = { deviceId: this.deviceId };
      //逻辑端口选项获取 Logical port option get
      // The Logical port option gets the Logical Port Option GET
      let _this = this;
      async function getAll() {
        let chose = logicalPortExtra(params).then((res) => {
          _this.$refs.gradeSet.form.options1 = res.result.acl;
          _this.$refs.gradeSet.form.options2 = res.result.qos;
          _this.$refs.gradeSet.form.options3 = res.result.dhcp;
          _this.$refs.gradeSet.form.options4 = res.result.cgant;
        });
        let search = logicalPortExtraGet({ logicalPortId: row.id }).then(
          (res) => {
            _this.$refs.gradeSet.form.mss = Number(res.result.mss);
            _this.$refs.gradeSet.form.mtu = res.result.mtu;
            _this.$refs.gradeSet.form.value4 = res.result.cgnatId;
            _this.$refs.gradeSet.form.value3 = res.result.dhcpId;
            _this.$refs.gradeSet.form.valueIn = res.result.aclInput;
            _this.$refs.gradeSet.form.value2 = res.result.qosInput;
            _this.$refs.gradeSet.form.valueOut = res.result.aclOutput;
            // _this.$refs.gradeSet.form.open = res.result.arp ? true : false;
            // let arr = res.result.arp.map(item => {
            //   return { ipVal: item.arpIp, macVal: item.mac };
            // });
            // this.$refs.gradeSet.form.ipAddress = arr;
          }
        );
      }
      getAll();
    },
    sizeChange(val) {
      //页数总条目改变 Total page entries change
      // Total page entries change Total Page Entries Change
      this.Size = val;
      this.lNumber = 1;
      this.getList1();
      this.getList();
    },
    pageChange(val) {
      //页数改变 Page number change
      // Page change Page Number change
      // console.log(val)
      this.lNumber = val;
      this.getList1();
      this.getList();
    },
    getList1() {
      let params = {
        deviceId: this.deviceId,
        type: "VPP_ROUTE",
        pageNumber: this.lNumber,
        pageSize: this.Size,
      };
      logicalPortGetByTts(params).then((res) => {
        this.allNum = 0;
        //console.log(res);
        if (res.result != null) {
          var obj = JSON.parse(res.result);

          this.allNum = obj.stats.vpp_route_list.length;
          this.tableData1 = obj.stats.vpp_route_list;
          this.tableData1.forEach((item) => {
            if (item.preference) {
              item.preference = item.preference - 10;
            }
          });
        }
      });
    },
    removeByValue(arr, attr, value) {
      var index = 0;
      for (var i in arr) {
        if (arr[i][attr] == value) {
          index = i;
          break;
        }
      }
      arr.splice(index, 1);
    },
    getList() {
      let params = {
        deviceId: this.deviceId,
        type: "VPP_ARP",
        pageNumber: this.lNumber,
        pageSize: this.Size,
      };
      logicalPortGetByTts(params).then((res) => {
        this.allNum = 0;
        //console.log(res);

        if (res.result != null) {
          var obj = JSON.parse(res.result);
          this.allNum = obj.stats.vpp_arp_list.length;
          this.removeByValue(obj.stats.vpp_arp_list,"interface","tap300")
          this.tableData = obj.stats.vpp_arp_list;
        }
      });
    },
  },
  created() {
    (this.deviceId = JSON.parse(this.$route.query.devData).deviceId),
      (this.tenantId = JSON.parse(this.$route.query.devData).tenantId),
      userInfo().then((res) => {
        this.type = res.result.type;
      });

    this.getList1();
    this.getList();
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