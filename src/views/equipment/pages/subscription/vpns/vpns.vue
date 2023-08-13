<template>
  <div class="vpns">
    <div class="operate">
      <div class="btns">
        <ul class="vpnsSetList">
          <li
            v-for="item in tabsData"
            :key="item.id"
            @click="tabEvent(item)"
            :class="{ active: item.id == activeIndex }"
          >
            {{ item.name }}
          </li>
        </ul>
        <div class="butInfo" v-show="tabShow">
          <button class="add" @click="add1()">
            <img src="@/assets/newPage/icon_add@2x.png" alt />
            {{ $t("subscription.add") }}
          </button>
        </div>
        <div class="butInfo" v-show="!tabShow">
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
      >
        <el-table-column
          prop="name"
          :label="$t('subscription.vpns.name')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="description"
          :label="$t('subscription.vpns.description')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="tunnelEnacaplationName"
          :label="$t('subscription.vpns.tunnelEnacaplation')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="remotePeerName"
          :label="$t('subscription.vpns.remotePeer')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="vpnRoleName"
          :label="$t('subscription.vpns.vpnRole')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="logicalName"
          :label="$t('subscription.vpns.logicalInterface')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="tunnelIp"
          :label="$t('subscription.vpns.remoteIPAddress')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="innerIp"
          :label="$t('subscription.vpns.innerIPAddress')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>

        <el-table-column
          :label="$t('subscription.vpns.operations')"
          align="center"
          width="200"
          :resizable="false"
        >
          <template slot-scope="scope">
            <el-button
              @click="edit1(scope.row)"
              type="text"
              size="small"
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              v-control
              >{{ $t("subscription.edit") }}</el-button
            >
            <el-button
              type="text"
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
      <el-row class="botbutt">
        <button
          v-debounce.prevent="exportEvent"
          :class="{ btnEn: lang == 'en' }"
        >
          {{ $t("subscription.downloadCertificate") }}
        </button>
      </el-row>
      <el-table
        :data="tableData1"
        border
        stripe
        style="width: 100%"
        size="small"
      >
        <el-table-column
          prop="vpnName"
          :label="$t('subscription.vpns.name')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="vpnDes"
          :label="$t('subscription.vpns.description')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="type"
          :label="$t('subscription.vpns.type')"
          show-overflow-tooltip
          :resizable="false"
          >Secure VPN</el-table-column
        >
        <el-table-column
          prop="logicalName"
          :label="$t('subscription.vpns.logicalInterface')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="ip"
          :label="$t('subscription.vpns.vpnEndpointIPAddress')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          :label="$t('subscription.vpns.operations')"
          align="center"
          width="200"
          :resizable="false"
        >
          <template slot-scope="scope">
            <el-button
              @click="edit(scope.row)"
              type="text"
              size="small"
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              v-control
              >{{ $t("subscription.edit") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="del(scope.row)"
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
    <addsiteVPNs ref="addsiteVPNs" v-if="addsiteVPNsShow" />
    <editsiteVPNs ref="editsiteVPNs" v-show="editsiteVPNsShow" />
    <addclientVPNs ref="addclientVPNs" v-if="addclientVPNsShow" />
    <editclientVPNs ref="editclientVPNs" v-show="editclientVPNsShow" />
  </div>
</template>
<script>
import addsiteVPNs from "./components/addsiteVPNs";
import editsiteVPNs from "./components/editsiteVPNs";
import addclientVPNs from "./components/addclientVPNs";
import editclientVPNs from "./components/editclientVPNs";
import {
  getVpnSite,
  delSiteVpn,
  getClinetVpn,
  delClientVpn,
  getVpnForLogicPort,
  getDevLocation,
  userInfo,
} from "@/services";
import axios from "axios";
import { getToken } from "@/utils/cookie";
export default {
  props: {},
  components: {
    addclientVPNs,
    editclientVPNs,
    editsiteVPNs,
    addsiteVPNs,
  },
  data() {
    return {
      addclientVPNsShow: false,
      editclientVPNsShow: false,
      addsiteVPNsShow: false,
      editsiteVPNsShow: false,
      btn_show: true,
      activeIndex: 0,
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      location: JSON.parse(this.$route.query.devData).location,
      page: 1,
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
          name: this.$t("Config.fixedClientAttribute"),
          id: 0,
        },
        {
          name: this.$t("Config.mobileClientAttribute"),
          id: 1,
        },
      ],
      tabShow: true,
      type: "",
    };
  },
  methods: {
    intidate() {
      this.getVpnSiteList();
      this.getClinetVpnList();
    },
    getVpnSiteList() {
      let params = {
        deviceId: this.deviceId,
        pageNumber: this.page,
        pageSize: this.pageSize,
      };
      getVpnSite(params).then((res) => {
        this.tableData = res.result.content;
        this.allNum = res.result.totalElements;
      });
    },
    getClinetVpnList() {
      let par = {
        deviceId: this.deviceId,
        pageNumber: this.lNumber,
        pageSize: this.size,
      };
      getClinetVpn(par).then((res) => {
        this.tableData1 = res.result.content;
        this.totalNum = res.result.totalElements;
        if (this.totalNum > 0) {
          this.btn_show = false;
        } else {
          this.btn_show = true;
        }
      });
    },
    del(row) {
      if (!this.devCheckOnline()) {
        return;
      }
      var show65 = localStorage.getItem("show65");
      if (show65 == "true") {
        let params = {
          id: row.id,
          ip: "",
          vpnName: "",
          vpnDes: "",
          secure: false,
          logId: "",
        };
        delClientVpn(params).then((res) => {
          // console.log(res)
          if (res.code == 10000) {
            this.$message({
              message: this.$t("subscription.vpns.remind[11]"),
              type: "success",
            });
            this.getClinetVpnList();
          } else {
            this.$message.error(this.$t("subscription.vpns.remind[12]"));
          }
        });
      } else {
        this.$confirm(
          this.$t("vsr1000.remind[1]") +
            "<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue65\",this.checked)' type='checkbox'> " +
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
              id: row.id,
              ip: "",
              vpnName: "",
              vpnDes: "",
              secure: false,
              logId: "",
            };
            delClientVpn(params).then((res) => {
              // console.log(res)
              if (res.code == 10000) {
                this.$message({
                  message: this.$t("subscription.vpns.remind[11]"),
                  type: "success",
                });
                this.getClinetVpnList();
                localStorage.setItem(
                  "show65",
                  localStorage.getItem("checkedValue65")
                );
              } else {
                this.$message.error(this.$t("subscription.vpns.remind[12]"));
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
    del1(row) {
      if (!this.devCheckOnline()) {
        return;
      }
      userInfo().then((res) => {
        this.type = res.result.type;
        if (this.location == "NaaS Edge" && !(this.type == 1)) {
          getDevLocation({ deviceId: row.remotePeer }).then((res) => {
            if (res.result == "NaaS Edge") {
              this.$message({
                type: "warning",
                message: this.$t("Configuration.NaaSEdgeConfigurationError"),
              });
              return;
            } else {
              var show66 = localStorage.getItem("show66");
              if (show66 == "true") {
                let params = { SiteVpnId: row.id };
                delSiteVpn(params).then((res) => {
                  if (res.code == 10000) {
                    this.$message({
                      type: "success",
                      message: this.$t("subscription.vpns.remind[11]"),
                    });
                    this.intidate();
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
                    "<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue66\",this.checked)' type='checkbox'> " +
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
                    let params = { SiteVpnId: row.id };
                    delSiteVpn(params).then((res) => {
                      if (res.code == 10000) {
                        this.$message({
                          type: "success",
                          message: this.$t("subscription.vpns.remind[11]"),
                        });
                        this.intidate();
                        localStorage.setItem(
                          "show66",
                          localStorage.getItem("checkedValue66")
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
            }
          });
        } else {
          var show66 = localStorage.getItem("show66");
          if (show66 == "true") {
            let params = { SiteVpnId: row.id };
            delSiteVpn(params).then((res) => {
              if (res.code == 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("subscription.vpns.remind[11]"),
                });
                this.intidate();
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
                "<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue66\",this.checked)' type='checkbox'> " +
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
                let params = { SiteVpnId: row.id };
                delSiteVpn(params).then((res) => {
                  if (res.code == 10000) {
                    this.$message({
                      type: "success",
                      message: this.$t("subscription.vpns.remind[11]"),
                    });
                    this.intidate();
                    localStorage.setItem(
                      "show66",
                      localStorage.getItem("checkedValue66")
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
        }
      });
    },
    edit(row) {
      if (!this.devCheckOnline()) {
        return;
      }
      // console.log(row);
      this.editclientVPNsShow = true;
      this.$refs.editclientVPNs.form.vpnName = row.vpnName;
      this.$refs.editclientVPNs.form.ip = row.ip;
      this.$refs.editclientVPNs.form.vpnDes = row.vpnDes;
      this.$refs.editclientVPNs.form.logId = row.logId;
      this.$refs.editclientVPNs.form.id = row.id;
      //this.$refs.editclientVPNs.form.mobileClientPool = row.name;
      getVpnForLogicPort({ id: row.logId }).then((res) => {
        this.$refs.editclientVPNs.ipv4 = res.result;
      });
    },
    edit1(row) {
      if (!this.devCheckOnline()) {
        return;
      }

      userInfo().then((res) => {
        this.type = res.result.type;
        if (this.location == "NaaS Edge" && !(this.type == 1)) {
          getDevLocation({ deviceId: row.remotePeer }).then((res) => {
            if (res.result == "NaaS Edge") {
              this.$message({
                type: "warning",
                message: this.$t("Configuration.NaaSEdgeConfigurationError"),
              });
              return;
            } else {
              this.editsiteVPNsShow = true;
              this.$refs.editsiteVPNs.id = row.id;
              this.$refs.editsiteVPNs.form.name = row.name;
              this.$refs.editsiteVPNs.oldname = row.name;
              this.$refs.editsiteVPNs.form.description = row.description;
              this.$refs.editsiteVPNs.form.logicalId = row.logicalId;
              this.$refs.editsiteVPNs.form.tunnelEnacaplation =
                row.tunnelEnacaplation;
              this.$refs.editsiteVPNs.form.vpnRole = row.vpnRole;
              this.$refs.editsiteVPNs.form.remotePeer = row.remotePeer;
              this.$refs.editsiteVPNs.form.tunnelIp = row.tunnelIp;
              this.$refs.editsiteVPNs.form.remotePeerName = row.remotePeerName;
              let inner_Ip = row.innerIp.split("/")[0];
              this.$refs.editsiteVPNs.form.innerIp = inner_Ip;
              this.$refs.editsiteVPNs.oldInnerIp = inner_Ip;

              this.$refs.editsiteVPNs.roleIsShow();
              this.$refs.editsiteVPNs.form.remotePeer = row.remotePeer;
              this.$refs.editsiteVPNs.form.tunnelIp = row.tunnelIp;
              this.$refs.editsiteVPNs.form.remotePeerName = row.remotePeerName;
            }
          });
        } else {
          this.editsiteVPNsShow = true;
          this.$refs.editsiteVPNs.id = row.id;
          this.$refs.editsiteVPNs.form.name = row.name;
          this.$refs.editsiteVPNs.oldname = row.name;
          this.$refs.editsiteVPNs.form.description = row.description;
          this.$refs.editsiteVPNs.form.logicalId = row.logicalId;
          this.$refs.editsiteVPNs.form.tunnelEnacaplation =
            row.tunnelEnacaplation;
          this.$refs.editsiteVPNs.form.vpnRole = row.vpnRole;
          this.$refs.editsiteVPNs.form.remotePeer = row.remotePeer;
          this.$refs.editsiteVPNs.form.tunnelIp = row.tunnelIp;
          let inner_Ip = row.innerIp.split("/")[0];
          this.$refs.editsiteVPNs.form.innerIp = inner_Ip;
          this.$refs.editsiteVPNs.oldInnerIp = inner_Ip;
          this.$refs.editsiteVPNs.roleIsShow();
          this.$refs.editsiteVPNs.form.remotePeer = row.remotePeer;
          this.$refs.editsiteVPNs.form.tunnelIp = row.tunnelIp;
          this.$refs.editsiteVPNs.form.remotePeerName = row.remotePeerName;
        }

        let devObj = {};
        devObj = this.$refs.editsiteVPNs.dev.find((item)=> {
          return item.id === row.remotePeer;
        })
        if(!devObj){
          this.$refs.editsiteVPNs.dev = [{id:row.remotePeer,name:row.remotePeerName}];
        }

      });
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
    //单项删除
    // Single delete
    remove() {},
    exportEvent() {
      var show67 = localStorage.getItem("show67");
      if (show67 == "true") {
        axios({
          // 用axios发送post请求
          // Send a POST request using AXIOS
          method: "get",
          url: " /vsm/ca/root", // 请求地址
          // Request the address
          // 参数
          // parameter
          responseType: "blob", // 表明返回服务器返回的数据类型
          // Indicates the type of data returned by the return server
          headers: {
            "Content-Type": "application/json",
            accessToken: getToken(),
          },
        }).then((res) => {
          // 处理返回的文件流
          // Process the returned file flow
          const blob = new Blob([res]); //new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
          // New Blob([RES]) returns the [Objece Objece] content in the image below without adding data (take one less layer)
          const fileName = "ca.pem"; //下载文件名称
          // Download file name
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          // Release the URL object
          document.body.removeChild(elink);
        });
      } else {
        this.$confirm(
          this.$t("Mobile.hint3") +
            "<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue67\",this.checked)' type='checkbox'> " +
            this.$t("doNotShowThisAgain") +
            "</label></div>",
          {
            confirmButtonText: this.$t("Mobile.ok"),
            cancelButtonText: this.$t("Mobile.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning",
          }
        )
          .then(() => {
            axios({
              // 用axios发送post请求
              // Send a POST request using AXIOS
              method: "get",
              url: " /vsm/ca/root", // 请求地址
              // Request the address
              // 参数
              // parameter
              responseType: "blob", // 表明返回服务器返回的数据类型
              // Indicates the type of data returned by the return server
              headers: {
                "Content-Type": "application/json",
                accessToken: getToken(),
              },
            }).then((res) => {
              // 处理返回的文件流
              // Process the returned file flow
              const blob = new Blob([res]); //new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
              // New Blob([RES]) returns the [Objece Objece] content in the image below without adding data (take one less layer)
              const fileName = "ca.pem"; //下载文件名称
              // Download file name
              const elink = document.createElement("a");
              elink.download = fileName;
              elink.style.display = "none";
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              // Release the URL object
              document.body.removeChild(elink);
              localStorage.setItem(
                "show67",
                localStorage.getItem("checkedValue67")
              );
            });
          })
          .catch(() => {
            // this.$message({
            //   type: "info",
            //   message: this.$t("Mobile.hint4")
            // });
          });
      }

      // mobileUserDownload().then(res=>{

      // })
      // location.href = "http://172.26.28.133:18888/vsm/mobileUser/download";
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
    add1() {
      if (!this.devCheckOnline()) {
        return;
      }
      this.addsiteVPNsShow = true;
    },
    add2() {
      if (!this.devCheckOnline()) {
        return;
      }
      this.addclientVPNsShow = true;
    },
  },
  created() {
    this.intidate();
  },
  mounted() {},
};
</script>
<style scoped lang="scss">
.vpns {
  width: 100%;
  .vpnsSetList {
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
.notallowed {
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
  .close {
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-left: 14px;
  }
}
.botbutt {
  padding-bottom: 15px;
  button {
    height: 34px;
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
}
</style>
