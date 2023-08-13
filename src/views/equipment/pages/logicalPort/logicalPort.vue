<template>
  <div class="logical">
    <!-- 逻辑端口 -->
    <div class="operate">
      <button class="add" @click="addBz" :class="!online?'add2':''" :disabled="!online" v-control>
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
        stripe
        fit
        size="small"
      >
        <el-table-column prop="name" :label="$t('vsr1000.name')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="description" :label="$t('vsr1000.describe')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="role" :label="$t('vsr1000.role')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="type" :label="$t('vsr1000.type')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="portNames" :label="$t('vsr1000.rhysicalInsterface')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="dhcpClient" :label="$t('vsr1000.dhcpClient')" show-overflow-tooltip :resizable="false"  :formatter="formatterDHCP">  </el-table-column>
        <el-table-column prop="ipv4" :label="$t('vsr1000.ipv4Address')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="subscriptions" :label="$t('vsr1000.subscriptions')" show-overflow-tooltip :resizable="false"> </el-table-column>

        <el-table-column width="180" :label="$t('vsr1000.operations')" :resizable="false">
          <template slot-scope="scope">
            <button
              :class="!online?'notallowed':''"
              @click="handleClick(scope.row)"
              type="text" class="edit"
              size="small" v-control
              cursor: not-allowed
              style="color:#3678C8;font-size:14px;font-weight:400"
              :disabled="!online"
            >{{$t('vsr1000.edit')}}</button>
            <button @click="del(scope.row)" :class="!online?'notallowed':''" :disabled="!online||scope.row.role=='Loopback'" type="text" size="small" class="edit" v-control style="color:#3678C8;font-size:14px;font-weight:400">{{$t('vsr1000.delete')}}</button>
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
    </div>
    <editPort ref="editPort" v-show="editShow"></editPort>
    <addPzInfo ref="addPzInfo" :pzShow="pzShow"></addPzInfo>
  </div>
</template>
<script>
import editPort from "./components/editPort";
import addPzInfo from "./components/addPz";
import {
  logicalPortGet,
  logicalPortGetSelect,
  logicalPortDel,
  logicalPortExtra,
  logicalPortExtraGet,
  userInfo,
} from "@/services/index";
export default {
  props: {},
  components: {
    editPort,
    addPzInfo,
  },
  data() {
    return {
      deviceSerialNumber: JSON.parse(this.$route.query.devData).vsrSeries,
      online: JSON.parse(this.$route.query.devData).online,
      location: JSON.parse(this.$route.query.devData).location,
      isShow: false,
      pzShow: false,
      editShow: false,
      allNum: 0, //数据总条数 Total number of data bars
      // Total number of data bars
      lNumber: 1, //当前页数, The current number of pages
      // The current number of pages
      Size: 10,
      tableData: [],
      multipleSelection: [],
      deviceId: "",
      tenantId: "",
      portNames: "",
      type: "",
    };
  },
  computed: {},
  methods: {
    formatterDHCP(row, column) {
      if (row.role == "WAN" && row.type == "Routed") {
        if (row.dhcpClient == true) {
          return this.$t("vsr1000.enabled");
        } else {
          return this.$t("vsr1000.disabled");
        }
      }
      return "";
    },
    addBz() {
      if (!this.devCheckOnline()) {
        return;
      }
      this.pzShow = true;
      logicalPortGetSelect({
        deviceId: this.deviceId,
        tenantId: this.tenantId,
      }).then((res) => {
        this.$refs.addPzInfo.form.physicalInterfaceList = res.result.port;

        this.portNames = "";
        this.tableData.forEach((itme) => {
          this.portNames += itme.portNames + ",";
        });
        this.$refs.addPzInfo.usePortName = this.portNames;
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
        var show38 = localStorage.getItem("show38");
        if (show38 == "true") {
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
            this.getList(params);
          });
        } else {
          this.$confirm(
            this.$t("vsr1000.remind[1]") +
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
                  this.getList();
                  localStorage.setItem(
                    "show38",
                    localStorage.getItem("checkedValue38")
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
      if (!this.devCheckOnline()) {
        return;
      }
      if (row.name == "WAN-Ethernet" && row.portNames == "G0") {
        this.$message({
          type: "warning",
          dangerouslyUseHTMLString: true,
          message: this.$t("vsr1000.delLogical"),
        });
        return;
      }
      if (row.subscriptions != "") {
        this.$message({
          type: "warning",
          dangerouslyUseHTMLString: true,
          message: this.$t("vsr1000.subscriptionsInfo"),
        });
        return false;
      }
      var show39 = localStorage.getItem("show39");
      if (show39 == "true") {
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
            "<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue39\",this.checked)' type='checkbox'> " +
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
                this.getList();
                localStorage.setItem(
                  "show39",
                  localStorage.getItem("checkedValue39")
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
      /*   if(!row.subscriptions || row.subscriptions==null || row.subscriptions== undefined || row.subscriptions== ''){
         this.$message({
            type: "warning",
            message: this.$t('vsr1000.subscriptionsInfo')
          });
         return false
       }*/
      if (!this.devCheckOnline()) {
        return;
      }
      this.editShow = true;
      logicalPortGetSelect({
        deviceId: this.deviceId,
        tenantId: this.tenantId,
      }).then((res) => {
        this.$refs.editPort.form.physicalInterfaceList = res.result.port;

        this.portNames = "";
        this.tableData.forEach((itme) => {
          if (row.portId != itme.portId) {
            this.portNames += itme.portNames + ",";
          }
        });

        this.$refs.editPort.usePortName = this.portNames;

        if (row.portNames == "G0" || row.portNames == "LTE") {
          this.$refs.editPort.isG0 = true;
        } else {
          this.$refs.editPort.isG0 = false;
        }
      });

      if(row.role!="Loopback"){
        let more = row.portId.split(",");
        this.$refs.editPort.form.portId = more;
      }

      this.$refs.editPort.lodPortId = row.portId;

      if (row.portNames == "LTE") {
        this.$refs.editPort.selLte = true;
      }

      let arr1 = [];

      let arr2 = [];

      if (row.subscriptions != null && row.subscriptions != "") {
        let subs = row.subscriptions.split(",");
        subs.map((item) => {
          arr1.push(item);
          if (item != "Source NAT") {
            arr2.push(item);
          }
        });
        if (arr2.length > 0) {
          this.$refs.editPort.disabledAll = true;
        } else {
          this.$refs.editPort.disabledAll = false;
        }
      } else {
        this.$refs.editPort.disabledAll = false;
      }

      this.$refs.editPort.form.ipv4 = row.ipv4;
      this.$refs.editPort.form.oldipv4 = row.ipv4;
      this.$refs.editPort.form.oldgateway = row.gateway;

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
      this.$refs.editPort.form.portName = row.portNames;
      this.$refs.editPort.deviceId = row.deviceId;
      this.$refs.editPort.form.mtu = row.mtu;

      this.$refs.editPort.openVPN();
      this.$refs.editPort.subscriptionsFn();
      this.$refs.editPort.dhcpClientFn();

      if (row.portNames == "G0") {
        this.$refs.editPort.form.roleDisable = true;
        this.$refs.editPort.form.portDisable = true;
        this.$refs.editPort.form.typeDisable = true;
      } else {
        this.$refs.editPort.form.roleDisable = false;
        this.$refs.editPort.form.portDisable = false;
        this.$refs.editPort.form.typeDisable = false;
      }
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
      this.getList();
    },
    pageChange(val) {
      //页数改变 Page number change
      // Page change Page Number change
      // console.log(val)
      this.lNumber = val;
      this.getList();
    },
    getList() {
      let params = {
        deviceId: this.deviceId,
        pageNumber: this.lNumber,
        pageSize: this.Size,
      };

      this.portNames = "";
      logicalPortGet(params).then((res) => {
        this.tableData = res.result.content;
        this.allNum = res.result.totalElements;
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
    (this.deviceId = JSON.parse(this.$route.query.devData).deviceId),
      (this.tenantId = sessionStorage.getItem("tenantValue"));

    if (this.online) {
      userInfo().then((res) => {
        this.type = res.result.type;
        if (this.type != 1) {
          this.online = false;
        }
      });
    }
    // initDefaultPort({deviceId:this.deviceId,tenantId:this.tenantId,deviceSerialNumber:this.deviceSerialNumber});
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
  .add2:hover {
    cursor: not-allowed;
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
