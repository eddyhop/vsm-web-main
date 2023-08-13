<template>
  <div class="tpApprove">
    <div class="top">
      <div class="title">
        <span>拓扑</span>
        <img src="@/assets/icon_right@2x.png" alt />
        <span>资源审批</span>
      </div>
      <div id="tpOperate">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="设备类型">
            <el-select filterable v-model="formInline.devType">
              <el-option label="全部" value></el-option>
              <el-option
                v-for="(item,index) in approvalType"
                :key="index"
                :label="item.type"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="租户名" prefix-icon="el-icon-search" v-model="formInline.tenName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="bottom">
      <div class="show" id="tpShow">
        <el-table :data="tableData" border style="width: 100%">
          <!-- <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            width="60"
            :resizable="false"
          ></el-table-column> -->
          <el-table-column prop="tenantName" label="租户名称" :resizable="false"></el-table-column>
          <el-table-column prop="company" label="公司" :resizable="false"></el-table-column>
          <el-table-column prop="resourceTypeMessage" label="申请资源类型" :resizable="false"></el-table-column>
          <el-table-column
            prop="applicationContent"
            label="申请内容"
            show-overflow-tooltip
            :resizable="false"
          ></el-table-column>
          <el-table-column prop="applicationYear" label="申请年限" :resizable="false"></el-table-column>
          <el-table-column prop="statusMessage" label="状态" :resizable="false"></el-table-column>
          <el-table-column prop="reason" label="原因" :resizable="false"></el-table-column>
          <el-table-column prop="applicationTime" label="申请时间" :resizable="false"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="approve(scope.row)" type="text" v-control>批准</el-button>
              <el-button @click="reject(scope.row)" type="text" v-control>驳回</el-button>
              <el-button
                @click="pause(scope.row)"
                type="text"
                v-control
                v-if="scope.row.statusMessage!=='已驳回' && scope.row.statusMessage!=='暂停'"
              >暂停</el-button>
              <el-button @click="carry(scope.row)" type="text" v-control v-else>继续</el-button>
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
            style="font-family: arial, sans-serif"
          ></el-pagination>
        </div>
      </div>
    </div>
    <rejectPop v-if="isShow1" :data="rejecInfor"></rejectPop>
    <vpnApply v-if="isShow" :data="tenInfor" :list="listInfor"></vpnApply>
  </div>
</template>
<script>
import {
  getApproveList,
  operateApproveList,
  getTopoApprovalType
} from "@/services";
import rejectPop from "./components/rejectPop";
import vpnApply from "./components/vpnApply";
export default {
  components: {
    rejectPop,
    vpnApply
  },
  data() {
    return {
      lSize: 10, //每页条数
                 // Number each page
      lNumber: 1, //当前页号
                  // The current page number
      alllite: 0, //总条数
                  // The total number of article
      tenData: [], //租户信息
                   // Tenant information
      approvalType: [], //资源审核类型数据
                        // Resource audit type data
      isShow: false,
      isShow1: false,
      tenInfor: {},
      listInfor: {},
      rejecInfor: {},
      popData: {
        name: "",
        type: ""
      },
      formInline: {
        devType: "",
        tenName: ""
      },
      tableData: []
    };
  },
  created() {
    this.tenantId = JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '' : JSON.parse(sessionStorage.getItem("userData")).tenantId || "";
    this.getList();
    this.getTopoApprovalTypes();
  },
  methods: {
    //搜索
    // search
    search() {
      this.getList();
    },
    //批准
    // approval
    approve(row) {
      if (row.resourceType === 4) {
        this.isShow = true;
        this.tenInfor = {
          tenName: row.tenantName,
          params: row.id
        };
        this.listInfor = {
          applicationYear: row.applicationYear,
          tenantId: row.tenantId,
          tenantvrfId: row.tenantvrfId,
          id: row.id,
          resourceType: row.resourceType
        };
      } else {
        this.$confirm("确定批准吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
          .then(() => {
            let params = {
              approvalId: row.id,
              reason: "",
              resourceType: row.resourceType,
              type: 1,
              status: 1
            };
            operateApproveList(params).then(res => {
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
      }
    },
    //驳回
    // rejected
    reject(row) {
      this.isShow1 = true;
      this.rejecInfor = {
        approvalId: row.id,
        resourceType: row.resourceType
      };
    },
    //暂停
    // suspended
    pause(row) {
      this.$confirm("确定暂停吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          let params = {
            approvalId: row.id,
            reason: "",
            resourceType: row.resourceType,
            type: 3,
            status: 3
          };
          operateApproveList(params).then(res => {
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
    //继续
    // Continue to
    carry(row) {
      if (row.resourceType === 4) {
        this.isShow = true;
        this.tenInfor = {
          tenName: row.tenantName,
          params: row.id
        };
        this.listInfor = {
          applicationYear: row.applicationYear,
          tenantId: row.tenantId,
          tenantvrfId: row.tenantvrfId,
          id: row.id,
          resourceType: row.resourceType
        };
      } else {
        this.$confirm("确定继续吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
          .then(() => {
            let params = {
              approvalId: row.id,
              reason: "",
              resourceType: row.resourceType,
              type: 1,
              status: 1
            };
            operateApproveList(params).then(res => {
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
      }
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
    // 获取数据列表
    // Get data list
    getList() {
      let params = {
        page: this.lNumber,
        pageSize: this.lSize,
        tenantId: "",
        resourceType: this.formInline.devType,
        applicationContent: this.formInline.tenName
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
                item.statusMessage = "未批准";
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
    },
    // 获取所有审核资源的类型
    // Gets the types of all audit resources
    getTopoApprovalTypes() {
      getTopoApprovalType().then(res => {
        if (res.code === 10000) {
          for (let key in res.result) {
            this.approvalType.push({ type: key, value: res.result[key] });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.tpApprove {
  height: 100%;
  font-family: arial, sans-serif;
  .top {
    height: 116px;
    background: #fff;
    border-radius: 7px;
    padding: 20px 20px 0 30px;
    .title {
      margin-bottom: 21px;
      span:nth-child(1) {
        font-size: 16px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-right: 4px;
      }
      img {
        width: 6px;
        height: 10px;
      }
      span:nth-child(3) {
        font-size: 14px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-left: 4px;
      }
    }
  }
  .bottom {
    height: calc(100% - 136px);
    background: #fff;
    margin-top: 20px;
    border-radius: 7px;
    padding: 20px 30px 0;
  }
}
</style>
<style lang="scss">
#tpOperate {
  .el-form--inline .el-form-item__label {
    color: rgba(51, 51, 51, 1);
    padding: 0 10px 0 0;
  }

  .el-input--suffix .el-input__inner {
    width: 160px;
    height: 34px;
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    padding: 0 10.6px 0 8px;
    &:hover {
      border-color: #3678c8;
    }
  }
  .el-form--inline .el-form-item:nth-child(1) {
    margin-right: 24px;
  }
  .el-form--inline .el-form-item:nth-child(3) {
    float: right;
  }
  .el-input--prefix .el-input__inner {
    width: 242px;
    height: 34px;
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    &:hover {
      border-color: #3678c8;
    }
  }
  .el-button--primary {
    width: 100px;
    height: 34px;
    padding: 0px;
    border-radius: 7px;
    font-family: arial, sans-serif;
    font-weight: 400;
    &:hover {
      background: #6095d6 !important;
    }
  }
}
#tpShow {
  .el-button--text {
    color: #3678c8;
    font-weight: 400;
  }
  .el-table .cell {
    white-space: nowrap;
  }
}
</style>