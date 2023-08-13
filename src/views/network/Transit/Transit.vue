<template>
  <!-- Transit组网 -->
  <div class="Transit">
    <div class="top">
      <h3>
        {{$t('netWork.network')}}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>Transit{{$t('netWork.networking')}}</span>
      </h3>
      <div class="set">
        <div class="left">
          <span>{{$t('netWork.tenDomain')}}</span>
          <el-select filterable v-model="vrfName" @change="changeVrfName(vrfName)" :disabled="type!=1">
            <el-option :label="$t('netWork.all')" value></el-option>
            <el-option v-for="item in VrfList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select filterable v-model="netName" @change="changeNet(netName)">
            <el-option :label="$t('netWork.AllNetwork')" value></el-option>
            <el-option v-for="item in netList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="right">
          <button :class="lang=='en' ? 'add addEn' : 'add'" @click="addTransit">
            <img src="@/assets/newPage/icon_add@2x.png" alt />
            {{$t('netWork.NewNetwork')}}
          </button>
        </div>
      </div>
    </div>
    <div
      class="netWorkList"
      v-infinite-scroll="loadNetWork"
      infinite-scroll-disabled="disabled"
      infinite-scroll-distance="40"
      infinite-scroll-immediate="false"
      infinite-scroll-delay="1"
    >
      <div class="netWorkItem" v-for="(item,index) in netTableList" :key="item.sceneId">
        <div class="title">
          <h4 class="netWorkName" @mouseover="nameHint">
            <el-tooltip placement="top" :disabled="nameShow" :content="item.name">
              <div @click="item.tabIndex=1" :class="{active:item.tabIndex==1}">
                <p ref="netWorkName">{{item.name}}</p>
              </div>
            </el-tooltip>
            <!-- <div @click="item.tabIndex=2" :class="{active:item.tabIndex==2}">
              <p>{{$t('netWork.ProtectNode')}}</p>
            </div>-->
          </h4>
          <div class="submit">
            <span>As number:{{item.asNumber}}</span>
            <button class="save" @click="saveScene(item)">{{$t('netWork.commit')}}</button>
            <button class="close" @click="removeScene(item)">{{$t('netWork.del')}}</button>
          </div>
        </div>
        <div class="btns">
          <!-- <button
            :class="lang=='en' ? 'mobileSet mobileSetEn' : 'mobileSet'"
            @click="mobileSet(item)"
          >{{$t('netWork.MobileSetting')}}</button> -->
          <button
            :class="lang=='en' ? 'addEdge addEdgeEn' : 'addEdge'"
            @click="addEdeg(item)"
          >{{$t('netWork.AddEdgeNode')}}</button>
        </div>
        <div class="Transit-tableList">
          <div class="topDev">
            <div class="devName">
              <span :class="{openVsrList:item.isOpen}" @click="openVsrList(item,index)">
                <img src="@/assets/icon_right@2x.png" alt />
              </span>
              {{item.deviceName}}
            </div>
            <div>
              <span
                :class="{activeFont:item.devStatus,defaultFont:!item.devStatus}"
                v-html="item.devStatus?$t('DeviceMan.online'):$t('DeviceMan.offline')"
              ></span>
            </div>
            <div>{{item.devType}}</div>
            <!-- <div>
              <span
                :class="{activeFont:item.tunStatus,defaultFont:!item.tunStatus}"
                v-html="item.tunStatus?$t('netWork.normal'):$t('netWork.interrupt')"
              ></span>
            </div> -->
            <div>{{item.net}}</div>
            <div>
              <el-button
                type="text"
                size="small"
                @click="setDev(item)"
                style="color:#3678C8;font-size:14px;font-weight:400"
              >{{$t('newModel.set')}}</el-button>
            </div>
            <div>
              <el-button
                type="text"
                size="small"
                @click="cidrSet(item)"
                style="color:#3678C8;font-size:14px;font-weight:400"
              >Cidr</el-button>
              <el-button
                type="text"
                size="small"
                @click="goDevSet(item)"
                style="color:#3678C8;font-size:14px;font-weight:400"
              >{{$t('Configuration.devConfig')}}</el-button>
            </div>
          </div>
          <el-table
            :data="item.vsrList"
            style="width: 100%"
            stripe
            size="small"
            fit
            tooltip-effect="dark"
            :row-class-name="tableRowClassName"
            empty-text=" "
          >
            <el-table-column
              prop="deviceName"
              :label="$t('Home.deviceName')"
              align="left"
              :resizable="false"
              show-overflow-tooltip
              width="140"
            ></el-table-column>
            <el-table-column
              :label="$t('netWork.deviceState')"
              align="center"
              :resizable="false"
              show-overflow-tooltip
              width="140"
            >
              <template slot-scope="scope">
                <span
                  :class="{activeFont:scope.row.devStatus,defaultFont:!scope.row.devStatus}"
                  v-html="scope.row.devStatus?$t('DeviceMan.online'):$t('DeviceMan.offline')"
                ></span>
              </template>
            </el-table-column>
            <el-table-column
              prop="devType"
              :label="$t('DeviceMan.deviceType')"
              align="center"
              :resizable="false"
              show-overflow-tooltip
              width="140"
            ></el-table-column>
            <!-- <el-table-column
              prop="deviceName"
              :label="$t('netWork.TunnelStatus')"
              align="center"
              :resizable="false"
              show-overflow-tooltip
              width="140"
            >
              <template slot-scope="scope">
                <span
                  :class="{activeFont:scope.row.tunStatus,defaultFont:!scope.row.tunStatus}"
                  v-html="scope.row.tunStatus?$t('netWork.normal'):$t('netWork.interrupt')"
                ></span>
              </template>
            </el-table-column> -->
            <el-table-column
              prop="net"
              :label="$t('Vpn.segment')"
              align="center"
              :resizable="false"
              show-overflow-tooltip
              width="150"
            >
              <template slot-scope="scope">
                <span>{{scope.row.edgeNet.join(",")}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="deviceName"
              :label="$t('netWork.OpenAccelerate')"
              align="center"
              :resizable="false"
              show-overflow-tooltip
              width="140"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.accelerationEnable"
                  v-show="item.accelerationEnable"
                  @change="edgeAcceleration(scope.row.accelerationEnable,scope.row.sceneDeviceId,scope.row)"
                  active-color="#3678C8"
                  inactive-color="#D1D7E0"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="deviceName"
              :label="$t('DeviceMan.operation')"
              align="left"
              :resizable="false"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="networkSet(scope.row)"
                  :class="lang=='en' ? 'btnEn' : ''"
                  style="color:#3678C8;font-size:14px;font-weight:400"
                >{{$t('vsr1000.networkLink')}}</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="cidrSet(scope.row)"
                  :class="lang=='en' ? 'btnEn' : ''"
                  style="color:#3678C8;font-size:14px;font-weight:400"
                >Cidr</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="goDevSet(scope.row)"
                  :class="lang=='en' ? 'btnEn' : ''"
                  style="color:#3678C8;font-size:14px;font-weight:400"
                >{{$t('Configuration.devConfig')}}</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="delDev(scope.row,item)"
                  :class="lang=='en' ? 'btnEn' : ''"
                  style="color:#3678C8;font-size:14px;font-weight:400"
                >{{$t('netWork.Withdraw')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination
              :page-sizes="[5, 10]"
              :total="item.allNum"
              :page-size="5"
              @size-change="(val)=>pageChange(val,item)"
              @current-change="(val)=>sizeChange(val,item)"
              :current-page="item.page"
              layout="total, sizes, prev, next, jumper"
              style="font-family: arial, sans-serif"
            ></el-pagination>
          </div>
        </div>
      </div>
      <p v-if="loading" class="loadingTit">{{$t('Jump.loading')}}...</p>
      <p v-if="noMore" class="noMoreTit">{{$t('vsr1000.noData')}}</p>
    </div>
    <addTransit ref="addTransit" v-show="addTransShow" />
    <vpnAddress ref="vpnAddress" v-show="vpnAddressShow" />
    <addEdge ref="addEdge" v-show="edegShow" />
    <gatewaySet ref="gatewaySet" v-show="gatewayShow" />
    <CidrSet ref="CidrSet" v-show="CidrShow" />
    <netWorklink ref="netWorklink" v-show="netWorkShow" />
  </div>
</template>
<script>
import addTransit from "./components/addTransit"; //新增组网
                                                  // The new network
import vpnAddress from "./components/vpnAddress"; //移动vpn地址池设置
                                                  // Mobile VPN address pool Settings
import addEdge from "./components/addEdge"; //添加edge节点
                                            // Add edge node
import gatewaySet from "./components/gatewaySet"; //加速网关设置
                                                  // Accelerated gateway setup
import CidrSet from "./components/CidrSet"; //Cidr设置
                                            // Cidr set
import netWorklink from "./components/netWorkLink";
import {
  sceneGetByCondition,
  sceneNodeGetTenantVrfList,
  sceneNodeGetNetList,
  sceneGetEdgeByCondition,
  sceneDelete,
  sceneNodeAcceleration,
  sceneNode,
  scenePush,
} from "@/services";
import plug from "@/utils/plug";
export default {
  data() {
    return {
      lang: sessionStorage.getItem("lang") || "en",
      vpnAddressShow: false,
      CidrShow: false,
      addTransShow: false,
      gatewayShow: false,
      netWorkShow: false,
      loading: false,
      noMore: false,
      nameShow: true,
      tabIndex: 1,
      tableData: [],
      netTableList: [],
      page: 1,
      pageSize: 5,
      VrfList: [], //租户路由域列表
                   // A tenant routing domain list
      vrfName: "", //租户路由域名字
                   // Tenants route domain names
      netList: [], //网络列表
                   // List of network
      netName: "", //网络名字,
                   // The web name,
      edegShow: false,
      num: 0,
      // acceleration: false, //100加速网关按钮是否显示
      // Acceleration: False, Acceleration 100 acceleration gateway button is displayed
      type: JSON.parse(sessionStorage.getItem("userData")).type,
      bgpVrfId: "",
      deviceId: "",
    };
  },
  components: {
    addTransit,
    vpnAddress,
    addEdge,
    gatewaySet,
    CidrSet,
    netWorklink,
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
  },
  methods: {
    //跳转设备配置页面
    // Jump to the device configuration page
    goDevSet(row) {
      let params = {
        deviceId: row.deviceId,
        deviceType:
          row.modelType == "0001"
            ? "vsr1000"
            : row.modelType == "0002"
            ? "vsr100"
            : row.modelType == "000106"
            ? "Cloud-vsr1000"
            : "Cloud-vsr100",
        deviceName: row.deviceName,
        vsrSeries: row.deviceSerNum,
        tenantId: row.tenantId,
      };
      console.log(row,params);
      let routeData = this.$router.resolve({
        name: "netWorkDevSet",
        query: { devData: JSON.stringify(params) },
      });
      window.open(routeData.href, "_blank");
    },
    //移动端设置
    // Mobile terminal setting
    mobileSet(item) {
      this.vpnAddressShow = true;
      this.$refs.vpnAddress.dataInit(item);
    },
    //提交
    // submit
    saveScene(item) {
      // console.log(item);
      // if (item.edgeCount) {
      plug.debounce(Sync(item), 2000);
      let _this = this;
      function Sync(item) {
        scenePush({
          sceneId: item.sceneId,
          sceneType: 1,
        }).then((res) => {
          if (res.code === 10000) {
            _this.$message({
              message: _this.$t("App.hint5"),
              type: "success",
            });
          } else {
            _this.$message({
              message: res.message,
              type: "warning",
            });
          }
        });
      }
      // } else {
      //   this.$message({
      //     message: this.$t("netWork.msg4"),
      //     type: "warning",
      //   });
      // }
    },
    //退网
    // logout
    delDev(row, item) {
      sceneNode({
        sceneId: row.sceneId,
        sceneDeviceId: row.sceneDeviceId,
      }).then((res) => {
        if (res.code === 10000) {
          this.$message({
            type: "success",
            message: this.$t("vsr1000.remind2[5]"),
          });
          this.getVsrList(item);
        }
      });
    },
    //vsr100的网速网关设置
    // Vsr100 network speed gateway Settings
    edgeAcceleration(accelerationEnable, sceneDeviceId, row) {
      if (row.vpnEnable) {
        sceneNodeAcceleration({ sceneDeviceId, accelerationEnable }).then(
          (res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]"),
              });
            }
          }
        );
      } else {
        row.accelerationEnable = false;
        this.$message({
          type: "warning",
          message: this.$t('netWork.msg10'),
        });
      }
    },
    //页面条数改变
    // The number of page bars changed
    pageChange(val, item) {
      item.pageSize = val;
      item.page = 1;
      this.getVsrList(item);
      // console.log(val,item)
      // this.pageSize = val;
      // this.page = 1;
      // let params = {
      //   deviceId: sessionStorage.getItem("deviceId"),
      //   pageNumber: this.page,
      //   pageSize: this.pageSize
      // };

      // this.dataInit(params);
    },
    //页数改变
    // Page number change
    sizeChange(val, item) {
      // console.log(val,item)
      item.page = val;
      this.getVsrList(item);
      // this.page = val;
      // let params = {
      //   deviceId: sessionStorage.getItem("deviceId"),
      //   pageNumber: this.page,
      //   pageSize: this.pageSize
      // };
      // this.dataInit(params);
    },
    //上拉加载
    // Pull on loading
    loadNetWork() {
      this.loading = true;
      setTimeout(() => {
        this.page += 1;
        let params = {
          netName: "",
          pageNumber: this.page,
          pageSize: this.pageSize,
          tenantVrfId: this.vrfName,
          type: 1,
        };
        this.dataInit(params);
      }, 500);
    },
    //名字超过提示
    // Name above prompt
    nameHint() {
      let W = this.$refs.netWorkName.offsetWidth;
      if (W >= 270) {
        this.nameShow = false;
      } else {
        this.nameShow = true;
      }
    },
    //改变表格行样式
    // Change the table row style
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "success-row";
      } else {
        return "warning-row";
      }
      return "";
    },
    //数据初始化
    // Data initialization
    dataInit(params, type) {
      sceneGetByCondition(params).then((res) => {
        if (res.code === 10000) {
          res.result.content.forEach((item) => {
            item.isOpen = false;
            item.vsrList = [];
            item.page = 1;
            item.pageSize = 5;
            item.allNum = 0;
            item.tabIndex = 1;
          });
          this.loading = false;
          this.noMore = res.result.content.length === 0;
          if (type == "change") {
            this.netTableList = res.result.content;
          } else {
            this.netTableList = this.netTableList.concat(res.result.content);
          }
        }
      });
    },
    //获取租户路由域与网络列表
    // Gets the tenant routing domain and network list
    getSelectList() {
      sceneNodeGetTenantVrfList().then((res) => {
        if (res.code === 10000) {
          this.VrfList = res.result;
          let type = JSON.parse(sessionStorage.getItem("userData")).type;
          if (type === 1) {
            this.vrfName = this.VrfList.find(
              (item) => item.name == "default"
            ).id;
          } else {
            this.vrfName = this.VrfList[0].id;
          }
          let params = {
            netName: "",
            pageNumber: this.page,
            pageSize: this.pageSize,
            tenantVrfId: this.vrfName,
            type: 1,
          };
          this.dataInit(params);
          sceneNodeGetNetList({ vrfId: this.vrfName, type: 1 }).then((res) => {
            if (res.code === 10000) {
              this.netList = res.result;
            }
          });
        }
      });
    },
    //获取vsr100的列表
    // Gets a list of VSR100
    getVsrList(row) {
      sceneGetEdgeByCondition({
        sceneId: row.sceneId,
        deviceId: row.deviceId,
        pageNumber: row.page,
        pageSize: row.pageSize,
      }).then((res) => {
        if (res.code === 10000) {
          row.vsrList = res.result.content;
          row.allNum = res.result.totalElements;
        }
      });
    },
    //开启vsr100
    // Open vsr100
    openVsrList(row, index) {
      row.isOpen = !row.isOpen;
      // this.netTableList[index].isOpen = !this.netTableList[index].isOpen;
      if (row.isOpen) {
        this.getVsrList(row);
        // this.$refs.gatewaySet.dataInit(row);
      } else {
        row.vsrList = [];
      }
    },
    //新增edeg节点
    // New EDEG node
    addEdeg(row) {
      this.$refs.addEdge.dataInit(row);
      // sessionStorage.setItem("sceneId", row.sceneId); //组网id
      // sessionStorage.setItem("sceneId", row.sceneId); Network id
      // sessionStorage.setItem("netDeviceId", row.deviceId); //组网1000设备id
      // sessionStorage.setItem("netDeviceId", row.deviceId); Network 1000 device ID
      // sessionStorage.setItem("sceneDeviceId", row.sceneDeviceId); //场景1000设备id
      // sessionStorage.setItem("sceneDeviceId", row.sceneDeviceId); Scenario 1000 device ID
      this.edegShow = true;
    },
    //加速网关
    // Accelerate the gateway
    setDev(row) {
      this.gatewayShow = true;
      this.$refs.gatewaySet.dataInit(row);
    },
    //新增组网
    // The new network
    addTransit() {
      this.addTransShow = true;
      this.$refs.addTransit.getVsrTransit();
    },
    //cidr设置
    // Cidr set
    cidrSet(row) {
      // console.log(row);
      // this.CidrShow = true;

      if (row.bgpVrfId) {
        this.CidrShow = true;
        this.bgpVrfId = row.bgpVrfId;
        this.deviceId = row.deviceId;
        this.$refs.CidrSet.dataInit();
      } else {
        this.$message({
          type: "warning",
          message: this.$t("netWork.msg9"),
        });
      }
      // this.$refs.CidrSet.dataInit({
      //   sceneId: row.sceneId,
      //   sceneDeviceId: row.sceneDeviceId,
      // });
    },
    //专网连接
    // Private network connection
    networkSet(row) {
      this.netWorkShow = true;
      this.$refs.netWorklink.dataInit(row);
    },
    //切换租户路由域改变网络
    // Switching the tenant routing domain changes the network
    changeVrfName(val) {
      sceneNodeGetNetList({ vrfId: val, type: 1 }).then((res) => {
        if (res.code === 10000) {
          this.netList = res.result;
        }
      });
      this.page = 1;
      let params = {
        netName: "",
        pageNumber: this.page,
        pageSize: this.pageSize,
        tenantVrfId: this.vrfName,
        type: 1,
      };
      this.dataInit(params, "change");
    },
    //切换网络
    // Switching network
    changeNet(val) {
      this.page = 1;
      let params = {
        netName: val ? this.netList.find((item) => item.id == val).name : val,
        pageNumber: this.page,
        pageSize: this.pageSize,
        tenantVrfId: this.vrfName,
        type: 1,
      };
      this.dataInit(params, "change");
    },
    //删除场景
    // Delete the scene
    removeScene(row) {
      var show82 = localStorage.getItem("show82");
      if(show82 == 'true'){
        
          sceneDelete({ sceneId: row.sceneId, sceneType: 1 }).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]"),
              });
              this.page = 1;
              this.dataInit(
                {
                  netName: "",
                  pageNumber: this.page,
                  pageSize: this.pageSize,
                  tenantVrfId: this.vrfName,
                  type: 1,
                },
                "change"
              );
            } else if (res.code !== 10000) {
              this.page = 1;
              this.dataInit(
                {
                  netName: "",
                  pageNumber: this.page,
                  pageSize: this.pageSize,
                  tenantVrfId: this.vrfName,
                  type: 1,
                },
                "change"
              );
              this.$message({
                type: "warning",
                message: res.message,
              });
            }
          });
      }else{
        this.$confirm(this.$t("vsr1000.qosremind[1]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue82\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning",
        })
        .then(() => {
          sceneDelete({ sceneId: row.sceneId, sceneType: 1 }).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]"),
              });
              this.page = 1;
              this.dataInit(
                {
                  netName: "",
                  pageNumber: this.page,
                  pageSize: this.pageSize,
                  tenantVrfId: this.vrfName,
                  type: 1,
                },
                "change"
              );
              localStorage.setItem("show82",localStorage.getItem("checkedValue82"));
            } else if (res.code !== 10000) {
              this.page = 1;
              this.dataInit(
                {
                  netName: "",
                  pageNumber: this.page,
                  pageSize: this.pageSize,
                  tenantVrfId: this.vrfName,
                  type: 1,
                },
                "change"
              );
              this.$message({
                type: "warning",
                message: res.message,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("vsr1000.qosremind[2]"),
          });
        });
      }
      
    },
  },
  created() {
    this.getSelectList();
  },
};
</script>
<style scoped lang="scss">
.Transit {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-button--small,
  .el-button--small.is-round {
    padding: 0px;
  }
}
.top {
  width: 100%;
  padding: 20px 30px 20px 30px;
  background: #fff;
  h3 {
    font-size: 15px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    span {
      font-size: 14px;
      line-height: 8px;
    }
    img {
      width: 5px;
      height: 8px;
      margin-left: 5px;
      margin-right: 5px;
    }
  }
}
.set {
  width: 100%;
  zoom: 1;
  padding-top: 20px;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .left {
    float: left;
    span {
      margin-right: 10px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
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
      border: 0;
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
    .addEn {
      width: 160px;
    }
    button:hover {
      background: rgba(96, 149, 214, 1);
    }
  }
}
.netWorkList {
  flex: 1;
  padding: 0 30px 30px 30px;
  background: #fff;
  margin-top: 20px;
  overflow: auto;
}
.netWorkList::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.netWorkList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.netWorkList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.netWorkItem {
  width: 100%;
  border: 1px solid rgba(209, 215, 224, 1);
  margin-top: 20px;
  .title {
    width: 100%;
    padding: 0 20px;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid rgba(209, 215, 224, 1);
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    h4 {
      float: left;
      font-size: 18px;
      font-family: arial, sans-serif;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
    .submit {
      float: right;
      button {
        width: 100px;
        height: 34px;
        border-radius: 7px;
        border: 1px solid rgba(209, 215, 224, 1);
        outline: none;
        cursor: pointer;
        margin-left: 14px;
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
      }
      .save {
        background: rgba(54, 120, 200, 1);
        color: #fff;
        border: 0;
        margin-left: 0;
      }
      .save:hover {
        background: rgba(96, 149, 214, 1);
      }
      .close {
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(209, 215, 224, 1);
        color: rgba(51, 51, 51, 1);
      }
      span {
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-right: 70px;
      }
    }
  }
  .btns {
    width: 100%;
    padding: 13px 20px;
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    .mobileSet {
      float: left;
    }
    .addEdge {
      float: right;
    }
    button {
      width: 105px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: 0;
      outline: none;
      cursor: pointer;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
    button:hover {
      background: rgba(96, 149, 214, 1);
    }
    .mobileSetEn {
      width: 176px;
    }
    .addEdgeEn {
      width: 124px;
    }
  }
}
.netWorkName {
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  div {
    float: left;
    position: relative;
    padding-right: 40px;
    cursor: pointer;
  }
  p {
    max-width: 270px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .active {
    font-size: 18px;
    font-family: arial, sans-serif;
    font-weight: 500;
    color: rgba(54, 120, 200, 1);
    &:after {
      display: block;
      content: "";
      width: 2px;
      height: 15px;
      background: rgba(54, 120, 200, 1);
      position: absolute;
      top: 23px;
      left: -8px;
      z-index: 100;
    }
  }
}
.Transit-tableList {
  position: relative;
}
.topDev {
  width: 100%;
  height: 44px;
  // background: #f4f8fe;
  z-index: 10;
  position: absolute;
  top: 44px;
  left: 0;
  display: flex;
  line-height: 44px;
  > div {
    width: 140px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  > div:last-of-type {
    flex: 1;
  }
}
.activeFont {
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(54, 120, 200, 1);
}
.defaultFont {
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(186, 39, 39, 1);
}
.devName {
  > span {
    cursor: pointer;
    padding-left: 5px;
    img {
      width: 5px;
      height: 8px;
      margin-left: 5px;
      margin-right: 5px;
    }
  }
}
.openVsrList {
  img {
    transform: rotate(90deg);
  }
}
.loadingTit,
.noMoreTit {
  width: 100%;
  height: 40px;
  text-align: center;
  line-height: 40px;
}
.btnEn {
  margin: 5px auto;
  display: block;
}
</style>
<style lang="scss">
.Transit .top {
  .el-input,
  .el-select {
    width: 270px;
    height: 34px;
    margin-right: 20px;
    .el-input__inner {
      height: 100%;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
}
.Transit .Transit-tableList {
  .el-table .warning-row {
    background: #fff !important;
  }

  .el-table .success-row {
    background: rgba(249, 250, 251, 1) !important;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #fff !important;
  }
  .el-table .el-table__row:first-of-type .is-center:first-of-type .cell {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    // color: #f00;
  }
  .el-table__header-wrapper {
    margin-bottom: 44px;
  }
  // .el-table__empty-block {
  //   display: none;
  // }
}
</style>