<template>
  <!-- 网关互联 -->
  <div class="gatewayLink">
    <div class="top">
      <h3>
        {{$t('netWork.network')}}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{$t('netWork.TheConnected')}}</span>
      </h3>
      <div class="set">
        <div class="left">
          <span>{{$t('netWork.tenDomain')}}</span>
          <el-select filterable v-model="vrfName" @change="changeVrfName(vrfName)" :disabled="type!=1">
            <el-option :label="$t('netWork.all')" value=""></el-option>
            <el-option v-for="item in VrfList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select filterable v-model="netName" @change="changeNet(netName)">
            <el-option :label="$t('netWork.AllNetwork')" value=""></el-option>
            <el-option v-for="item in netList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="right">
          <button :class="lang=='en' ? 'add addEn' : 'add'" @click="addLink">
            <img src="@/assets/newPage/icon_add@2x.png" alt />
            {{$t('netWork.NewGatewayInterconnection')}}
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
      <div class="netWorkItem" v-for="(item) in netTableList" :key="item.sceneId">
        <div class="title">
          <h4 class="netWorkName" @mouseover="nameHint" ref="netWorkName">
            <el-tooltip placement="top" :disabled="nameShow" :content="item.name">
              <p>{{item.name}}</p>
            </el-tooltip>
          </h4>
          <div class="submit">
            <!-- <span>Site-to-Cloud</span> -->
            <button class="save" @click="saveScene(item)">{{$t('netWork.commit')}}</button>
            <button class="close" @click="removeScene(item)">{{$t('netWork.del')}}</button>
          </div>
        </div>
        <div class="Transit-tableList">
          <div class="topDev">
            <div>{{item.deviceName}}</div>
            <div>
              <span
                :class="{activeFont:item.devStatus,defaultFont:!item.devStatus}"
                v-html="item.devStatus?$t('DeviceMan.online'):$t('DeviceMan.offline')"
              ></span>
            </div>

            <!-- <div>
              <span
                :class="{activeFont:item.tunStatus,defaultFont:!item.tunStatus}"
                v-html="item.tunStatus?$t('netWork.normal'):$t('netWork.interrupt')"
              ></span>
            </div> -->
            <div>{{item.edgeNet!=null ? item.edgeNet.join(",") : ''}}</div>
            <div>
              <el-button
                type="text"
                size="small"
                @click="cidrSet(item)"
                style="color:#3678C8;font-size:14px;font-weight:400"
              >{{$t('netWork.cidrSet')}}</el-button>
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
          >
            <el-table-column
              prop="edgeName"
              :label="$t('Home.deviceName')"
              align="left"
              :resizable="false"
              show-overflow-tooltip
              width="200"
            ></el-table-column>
            <el-table-column
              prop="devStatus"
              :label="$t('netWork.deviceState')"
              align="center"
              :resizable="false"
              show-overflow-tooltip
              width="200"
            >
              <template slot-scope="scope">
                <span
                  :class="{activeFont:scope.row.devStatus,defaultFont:!scope.row.devStatus}"
                  v-html="scope.row.devStatus?$t('DeviceMan.online'):$t('DeviceMan.offline')"
                ></span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="tunStatus"
              :label="$t('netWork.TunnelStatus')"
              align="center"
              :resizable="false"
              show-overflow-tooltip
              width="200"
            >
              <template slot-scope="scope">
                <span
                  :class="{activeFont:scope.row.tunStatus,defaultFont:!scope.row.tunStatus}"
                  v-html="scope.row.tunStatus?$t('netWork.normal'):$t('netWork.interrupt')"
                ></span>
              </template>
            </el-table-column> -->
            <el-table-column
              prop="edgeNet"
              :label="'CIDR ' + $t('Vpn.segment')"
              align="center"
              :resizable="false"
              show-overflow-tooltip
              width="200"
            >
              <template slot-scope="scope">
                <span>{{scope.row.edgeNet !=null ? scope.row.edgeNet.join(",") : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('DeviceMan.operation')" align="left" :resizable="false">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="cidrSet(scope.row)"
                  :class="lang=='en' ? 'btnEn' : ''"
                  style="color:#3678C8;font-size:14px;font-weight:400"
                >{{$t('netWork.cidrSet')}}</el-button>
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
                  @click="goDevSet(scope.row)"
                  :class="lang=='en' ? 'btnEn' : ''"
                  style="color:#3678C8;font-size:14px;font-weight:400"
                >{{$t('Configuration.devConfig')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <p v-if="loading" class="loadingTit">{{$t('Jump.loading')}}...</p>
      <p v-if="noMore" class="noMoreTit">{{$t('vsr1000.noData')}}</p>
    </div>
    <addGatewayLink ref="addGatewayLink" v-show="isShow" />
    <CidrSet ref="CidrSet" v-show="CidrShow" />
    <netWorklink ref="netWorklink" v-show="netWorkShow" />
  </div>
</template>
<script>
import {
  sceneGetByCondition,
  sceneNodeGetTenantVrfList,
  sceneNodeGetNetList,
  scenePush,
  sceneDelete,
} from "@/services";
import CidrSet from "./components/CidrSet";
import netWorklink from "./components/netWorkLink";
import addGatewayLink from "./components/addGatewayLink";
import plug from "@/utils/plug";
export default {
  data() {
    return {
      lang: sessionStorage.getItem("lang") || "en",
      netWorkShow: false,
      CidrShow: false,
      isShow: false,
      loading: false,
      noMore: false,
      nameShow: true,
      VrfList: [], //租户路由域列表
                   // A tenant routing domain list
      vrfName: "", //租户路由域名字
                   // Tenants route domain names
      netList: [], //网络列表
                   // List of network
      netName: "", //网络名字,
                   // The web name,
      netTableList: [],
      page: 1,
      pageSize: 5,
      bgpVrfId:"",
      deviceId:"",
      type: JSON.parse(sessionStorage.getItem("userData")).type,
    };
  },
  components: {
    addGatewayLink,
    CidrSet,
    netWorklink,
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
  },
  methods: {
    //提交
    // submit
    saveScene(item) {
      plug.debounce(Sync(item), 2000);
      let _this = this;
      function Sync(item) {
        scenePush({
          sceneId: item.sceneId,
          sceneType: 3,
        }).then((res) => {
          if (res.code === 10000) {
            _this.$message({
              message: _this.$t("App.hint5"),
              type: "success",
            });
          }
        });
      }
    },
    //切换租户路由域改变网络
    // Switching the tenant routing domain changes the network
    changeVrfName(val) {
      sceneNodeGetNetList({ vrfId: val, type: 3 }).then((res) => {
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
        type: 3,
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
        type: 3,
      };
      this.dataInit(params, "change");
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
          type: 3,
        };
        this.dataInit(params);
      }, 500);
    },
    //名字超过提示
    // Name above prompt
    nameHint() {
      let W = this.$refs.netWorkName.offsetWidth;
      if (W >= 567) {
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
    //网络数据初始化
    // Network data initialization
    dataInit(params, type) {
      sceneGetByCondition(params).then((res) => {
        if (res.code === 10000) {
          res.result.content.forEach((item) => {
            item.vsrList = [item.resultEdgeInfo];
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
            type: 3,
          };
          this.dataInit(params);
          sceneNodeGetNetList({ vrfId: this.vrfName, type: 3 }).then((res) => {
            if (res.code === 10000) {
              this.netList = res.result;
            }
          });
        }
      });
    },
    //新增
    // add
    addLink() {
      this.isShow = true;
      this.$refs.addGatewayLink.dataInit();
    },
    // //cidr
    // cidrSet(row) {
    //   this.CidrShow = true;
    //   this.$refs.CidrSet.dataInit({
    //     sceneId: row.sceneId,
    //     sceneDeviceId: row.sceneDeviceId,
    //   });
    // },
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
          message: this.$t("netWork.msg8"),
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
    //删除场景
    // Delete the scene
    removeScene(row) {
      var show79 = localStorage.getItem("show79");
      if(show79 == 'true'){
          sceneDelete({ sceneId: row.sceneId, sceneType: 3 }).then((res) => {
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
                  type: 3,
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
                  type: 3,
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
        this.$confirm(this.$t("vsr1000.qosremind[1]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue79\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
        confirmButtonText: this.$t("vsr1000.OK"),
        cancelButtonText: this.$t("vsr1000.cancel"),
          dangerouslyUseHTMLString: true,
        type: "warning",
      })
        .then(() => {
          sceneDelete({ sceneId: row.sceneId, sceneType: 3 }).then((res) => {
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
                  type: 3,
                },
                "change"
              );
              localStorage.setItem("show79",localStorage.getItem("checkedValue79"));
            } else if (res.code !== 10000) {
              this.page = 1;
              this.dataInit(
                {
                  netName: "",
                  pageNumber: this.page,
                  pageSize: this.pageSize,
                  tenantVrfId: this.vrfName,
                  type: 3,
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
    //跳转设备配置页面
    // Jump to the device configuration page
    goDevSet(row) {
      let params = {
        deviceId: row.deviceId,
        deviceType: row.modelType == '0001' ? 'vsr1000' : row.modelType == '0002' ? 'vsr100' : row.modelType=='000106' ? 'Cloud-vsr1000' : 'Cloud-vsr100',
        deviceName: row.deviceName || row.edgeName,
        vsrSeries: row.deviceSerNum,
        tenantId: row.tenantId,
      };
      // console.log(row);
      let routeData = this.$router.resolve({
        name: "netWorkDevSet",
        query: { devData: JSON.stringify(params) },
      });
      window.open(routeData.href, "_blank");
    },
  },
  created() {
    this.getSelectList();
  },
};
</script>
<style scoped lang="scss">
.gatewayLink {
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
      width: 130px;
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
    button:hover {
      background: rgba(96, 149, 214, 1);
    }
    .addEn{
      width: 240px;
    }
  }
}
.netWorkList {
  flex: 1;
  padding: 0 30px 30px 30px;
  background: #fff;
  margin-top: 20px;
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
}
.netWorkName {
  p {
    max-width: 567px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    width: 200px;
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
.loadingTit,
.noMoreTit {
  width: 100%;
  height: 40px;
  text-align: center;
  line-height: 40px;
}
.btnEn{
  margin: 5px auto;
  display: block;
}
</style>
<style lang="scss">
.gatewayLink .top {
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
.gatewayLink .Transit-tableList {
  .el-table .warning-row {
    background: #fff;
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
}
.gatewayLink .Transit-tableList {
  .el-table__header-wrapper {
    margin-bottom: 44px;
  }
}
</style>