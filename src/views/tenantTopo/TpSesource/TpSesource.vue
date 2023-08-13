<template>
  <div class="TpSesource">
    <div class="header">
      <div class="title">
        <span>拓扑</span>
        <img src="@/assets/icon_right@2x.png" alt />
        <span>资源管理</span>
      </div>
    </div>
    <div class="middle">
      <div class="item">
        <div class="top">
          <span class="num">{{mainDeviceCount}}</span>
          <span class="apply" @click="isShow1=true">申请</span>
        </div>
        <div class="bottom">已开通骨干节点</div>
      </div>
      <div class="item">
        <div class="top">
          <span class="num">{{ceCount}}</span>
          <span class="apply" @click="isShow2=true">申请</span>
        </div>
        <div class="bottom">CE接通数量</div>
      </div>
      <div class="item">
        <div class="top">
          <span class="num">{{tenantVrfCount}}</span>
          <span class="apply" @click="isShow3=true">申请</span>
        </div>
        <div class="bottom">租户路由</div>
      </div>
      <div class="item">
        <div class="top">
          <span class="num">{{vpnCount}}</span>
          <span class="apply" @click="isShow4=true">申请</span>
        </div>
        <div class="bottom">VPN开通</div>
      </div>
    </div>
    <div class="footer">
      <div class="show" id="tpShow">
        <el-table :data="tableData" border style="width: 100%">
          <!-- <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            width="60"
            :resizable="false"
          ></el-table-column> -->
          <el-table-column
            prop="resourceTypeMessage"
            label="申请资源类型"
            show-overflow-tooltip
            :resizable="false"
          ></el-table-column>
          <el-table-column prop="applicationContent" label="申请内容" show-overflow-tooltip></el-table-column>
          <el-table-column prop="applicationYear" label="申请年限" :resizable="false"></el-table-column>
          <el-table-column prop="useingTime" label="有效期" :resizable="false"></el-table-column>
          <el-table-column prop="statusMessage" label="状态" show-overflow-tooltip :resizable="false"></el-table-column>
          <el-table-column label="操作" :resizable="false">
            <template slot-scope="scope">
              <div v-if="scope.row.resourceType===1">
                <el-button
                  @click="changeBand(scope.row)"
                  type="text"
                  :disabled="scope.row.statusMessage==='申请中'"
                  :class="scope.row.statusMessage==='申请中'?'bg':null"
                >带宽变更</el-button>
                <el-button
                  @click="changeBand(scope.row)"
                  type="text"
                  :disabled="scope.row.statusMessage==='申请中'"
                  :class="scope.row.statusMessage==='申请中'?'bg':null"
                >续期</el-button>
                <el-button
                  @click="deletelApproval(scope.row)"
                  type="text"
                  :disabled="scope.row.statusMessage==='申请中'"
                  :class="scope.row.statusMessage==='申请中'?'bg':null"
                >注销</el-button>
              </div>
              <div v-if="scope.row.resourceType===3">
                <el-button
                  @click="changeBand(scope.row)"
                  type="text"
                  :disabled="scope.row.statusMessage==='申请中'"
                  :class="scope.row.statusMessage==='申请中'?'bg':null"
                >续期</el-button>
                <el-button
                  @click="deletelApproval(scope.row)"
                  type="text"
                  :disabled="scope.row.statusMessage==='申请中'"
                  :class="scope.row.statusMessage==='申请中'?'bg':null"
                >注销</el-button>
              </div>
              <div v-if="scope.row.resourceType===4">
                <el-button
                  type="text"
                  :disabled="scope.row.statusMessage==='申请中'"
                  :class="scope.row.statusMessage==='申请中'?'bg':null"
                >并发修改</el-button>
                <el-button
                  type="text"
                  :disabled="scope.row.statusMessage==='申请中'"
                  :class="scope.row.statusMessage==='申请中'?'bg':null"
                >地址分配</el-button>
                <el-button
                  type="text"
                  :disabled="scope.row.statusMessage==='申请中'"
                  :class="scope.row.statusMessage==='申请中'?'bg':null"
                >注册</el-button>
              </div>
              <div v-if="scope.row.resourceType===2">
                <el-button
                  @click="deletelApproval(scope.row)"
                  type="text"
                  :disabled="scope.row.statusMessage==='申请中'"
                  :class="scope.row.statusMessage==='申请中'?'bg':null"
                >注销</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            :page-sizes="[5, 10]"
            :total="alllite"
            :current-page="lNumber"
            @size-change="litePage"
            @current-change="liteSize"
            :page-size="10"
            layout="total, sizes, prev, next, jumper"
          ></el-pagination>
        </div>
      </div>
    </div>
    <Backbone v-if="isShow1"></Backbone>
    <CE v-if="isShow2"></CE>
    <tptenant v-if="isShow3"></tptenant>
    <openVpn v-if="isShow4"></openVpn>
  </div>
</template>
<script>
import Backbone from "./components/backbone";
import CE from "./components/CE";
import tptenant from "./components/tptenant";
import openVpn from "./components/openVpn";
import {
  getApproveList,
  renewalApproval,
  cancelApproval,
  getTopoApplyDetail,
  getConcurrentResource
} from "@/services";
export default {
  components: {
    Backbone,
    CE,
    tptenant,
    openVpn
  },
  data() {
    return {
      lSize: 10, //每页条数
                 // Number each page
      lNumber: 1, //当前页号
                  // The current page number
      alllite: 0, //总条数
                  // The total number of article
      tableData: [], //信息
                     // information
      tapeWidth: "",
      resourceId: "",
      isShow1: false,
      isShow2: false,
      isShow3: false,
      isShow4: false,
      tenantVrfCount: "",
      vpnCount: "",
      ceCount: "",
      mainDeviceCount: ""
    };
  },
  created() {
    this.tenantId =JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId || "";
    this.getList();
    this.getConcurrentResources();
  },
  methods: {
    //  续期或者更改带宽
    // Renew or change bandwidth
    changeBand(row) {
      let data = {
        id: row.id,
        type: row.resourceType
      };
      this.getTopoApplyDetails(data);
      
      this.$confirm("确定带宽变更或者续期吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          let params = {
            applicationYear: row.applicationYear,
            id: row.id,
            tapeWidth: this.tapeWidth,
            type: row.resourceType
          };
          renewalApproval(params).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getList();
            } else {
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
            message: "已取消"
          });
        });
    },
    // 注销
    // The cancellation
    deletelApproval(row) {
      this.$confirm("确定注销吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          let params = {
            id: row.id,
            type: row.resourceType
          };
          cancelApproval(params).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getList();
            } else {
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
            message: "已取消"
          });
        });
    },
    // 状态不同样式变化
    // States vary in style
    cellStyle({ row }) {
      if (row.status === 5) {
        return "warning";
      } else {
        return "ordinary";
      }
    },
    // 获取申请资源的详情，例如获取测申请的详情，获取租户路由域申请的详情
    // Get details of application resources, such as get details of test applications, get details of tenant routing domain applications
    getTopoApplyDetails(params) {
      getTopoApplyDetail(params).then(res => {
        if (res.code === 10000) {
          if (res.result.tapeWidth) {
            this.tapeWidth = res.result.tapeWidth;
          }
          this.resourceId = res.result.id;
        }
      });
    },
    //获取租户的当前资源
    // Gets the tenant's current resources
    getConcurrentResources() {
      let params = {
        tenantId: this.tenantId
      };
      getConcurrentResource(params).then(res => {
        if (res.code === 10000) {
          this.tenantVrfCount = res.result.tenantVrfCount;
          this.vpnCount = res.result.vpnCount;
          this.ceCount = res.result.ceCount;
          this.mainDeviceCount = res.result.mainDeviceCount;
        }
      });
    },
    //页数条数改变
    // The number of pages has changed
    litePage(val) {
      this.lSize = val;
      this.getList();
    },
    //页数改变
    // Page number change
    liteSize(val) {
      this.lNumber = val;
      this.getList();
    },
    // 索引岁页面变化
    // Index year page changes
    indexMethod(index) {
      return (
        index + 1 + (this.lNumber == 1 ? 0 : this.lSize * (this.lNumber - 1))
      );
    },
    // 获取页面列表数据
    // Gets the page list data
    getList() {
      let params = {
        page: this.lNumber,
        pageSize: this.lSize,
        tenantId: this.tenantId
      };
      getApproveList(params).then(res => {
        if (res.code === 10000) {
          this.tableData = res.result.content;
          this.alllite = res.result.totalElements;
          this.tableData.map(item => {
            switch (item.status) {
              case 0:
                item.statusMessage = "已驳回";
                break;
              case 1:
                item.statusMessage = "已批准";
                break;
              case 3:
                item.statusMessage = "暂停";
                break;
              case 5:
                item.statusMessage = "申请中";
                break;
              case 6:
                item.statusMessage = "注销";
                break;
              case 7:
                item.statusMessage = "过期";
                break;
              default:
                break;
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.TpSesource {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .header {
    height: 62px;
    line-height: 62px;
    background: #fff;
    border-radius: 7px;
    padding-left: 30px;
    font-family: arial, sans-serif;
    color: #333333;
    .title {
      span:nth-child(1) {
        font-size: 16px;
        margin-right: 4px;
        font-weight: 400;
      }
      img {
        width: 6px;
        height: 10px;
      }
      span:nth-child(3) {
        font-size: 14px;
        font-weight: 400;
        margin-left: 4px;
      }
    }
  }
  .middle {
    height: 100px;
    display: flex;
    justify-content: space-between;
    .item {
      height: 100%;
      width: calc(25% - 15px);
      border-radius: 7px;
      background: #fff;
      padding: 20px 30px 20px 30px;
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        .num {
          font-size: 22px;
          font-family: arial, sans-serif;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }
        .apply {
          font-size: 16px;
          font-family: arial, sans-serif;
          font-weight: 400;
          color: rgba(54, 120, 200, 1);
          cursor: pointer;
        }
      }
      .bottom {
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 20px;
      }
    }
  }
  .footer {
    height: calc(100% - 202px);
    background: #fff;
    border-radius: 7px;
    padding: 20px;
  }
  .bg {
    color: #c0c4cc !important;
  }
}
</style>
<style lang="scss">
.TpSesource {
  .el-button--text {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
  }
  .el-table .ordinary:nth-child(6) .cell {
    color: rgba(54, 120, 200, 1);
  }
  .el-table .warning:nth-child(6) .cell {
    color: #d89012;
  }
}
</style>