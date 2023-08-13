<template>
  <div class="vpnApply">
    <div class="inner">
      <div class="top">
        <span>VPN申请</span>
        <img @click="$parent.isShow=false" src="@/assets/icon_close.png" alt />
      </div>
      <div class="main">
        <div class="mainHeader">
          <div class="left">
            <div>
              <span>租户：</span>
              <span>{{data.tenName}}</span>
            </div>
            <div>
              <span>租户路由域：</span>
              <span>{{tentVrfName}}</span>
            </div>
          </div>
          <div class="input">
            <span>并发数设置</span>
            <el-input v-model="num" placeholder="请输入数字" @blur="examine(num)"></el-input>
          </div>
        </div>
        <div class="table">
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            class="tableInfor"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="40"></el-table-column>
            <!-- <el-table-column type="index" :index="indexMethod" label="序号" width="60"></el-table-column> -->
            <el-table-column prop="deviceName" label="设备名称"></el-table-column>
            <el-table-column prop="deviceSerialNumber" label="设备序列号"></el-table-column>
            <el-table-column label="逻辑端口" width="120">
              <template slot-scope="scope">
                <el-select filterable v-model="scope.row.logicalPortId" placeholder="请选择">
                  <el-option
                    v-for="item in scope.row.logicalPortEntityList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="公网IP" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.ip" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="getPortDetail(scope.row)"
                  type="text"
                  v-control
                  :class="scope.row.logicalPortId?'type1':'type2'"
                  :disabled="scope.row.logicalPortId?false:true"
                >端口详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination
              :page-sizes="[5, 8]"
              :total="alllite"
              :current-page="lNumber"
              @size-change="litePage"
              @current-change="liteSize"
              :page-size="8"
              layout="total, sizes, prev, next, jumper"
            ></el-pagination>
          </div>
        </div>
        <div class="button">
          <button class="save" @click="save">保存</button>
          <button class="cancel" @click="$parent.isShow=false">取消</button>
        </div>
      </div>
      <portDetail v-if="isShow" :data="portInfor"></portDetail>
    </div>
  </div>
</template>
<script>
import portDetail from "./portDetail";
import {
  getTopoVpnDetail,
  saveOpenVpnDevice,
  operateApproveList
} from "@/services";
export default {
  components: {
    portDetail
  },
  data() {
    return {
      num: "",
      tableData: [],
      lSize: 8, //每页条数
                // Number each page
      lNumber: 1, //当前页号
                  // The current page number
      alllite: 0, //总条数
                  // The total number of article
      isShow: false,
      tentVrfName: "",
      portInfor: "",
      detailId:"",
      multipleSelection: []
    };
  },
  props: {
    data: {
      type: Object
    },
    list: {
      type: Object
    }
  },
  created() {
    this.getTopoVpnDetails();
  },
  methods: {
    // 索引岁页面变化
    // Index year page changes
    indexMethod(index) {
      return (
        index + 1 + (this.lNumber == 1 ? 0 : this.lSize * (this.lNumber - 1))
      );
    },
    //页数条数改变
    // The number of pages has changed
    litePage(val) {
      this.lSize = val;
    },
    //页数改变
    // Page number change
    liteSize(val) {
      this.lNumber = val;
    },
    // 端口详情
    // Port details
    getPortDetail(row) {
      if (row.logicalPortId) {
        this.isShow = true;
        this.portInfor = row.logicalPortId;
      }
    },
    // 获取初始数据
    // Get initial data
    getTopoVpnDetails() {
      getTopoVpnDetail(this.data.params).then(res => {
        if (res.code === 10000) {
          this.tentVrfName = res.result.tenantVrfName;
          this.tableData = res.result.returnDeviceEntityList;
          this.detailId=res.result.id;
        }
      });
    },
    // 并发数验证
    // Concurrent number validation
    examine(num) {
      if (num) {
        let reg = /^([1-9]\d*|[0]{1,1})$/;
        if (!reg.test(num)) {
          this.isSave1 = false;
        } else {
          this.isSave1 = true;
        }
      } else {
        this.isSave1 = false;
      }
    },
    // 保存
    // save
    save() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          showClose: true,
          message: "请先选择选项",
          type: "warning"
        });
        return;
      }
      this.multipleSelection.map(item => {
        if (item.ip) {
          let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
          if (!reg.test(item.ip)) {
            this.isSave2 = false;
          } else {
            this.isSave2 = true;
          }
        } else {
          this.isSave2 = false;
        }
        if (item.logicalPortId) {
          this.isSave3 = true;
        } else {
          this.isSave3 = false;
        }
      });
      if (!this.isSave1 || !this.isSave2 || !this.isSave3) {
        this.$message({
          showClose: true,
          message: "输入内容格式不正确且内容不能为空",
          type: "warning"
        });
        return;
      }
      let params = {
        id: this.detailId,
        applicationYear: this.list.applicationYear,
        concurrency: this.num,
        deviceEntityList: this.multipleSelection,
        tenantId: this.list.tenantId,
        tenantVrfId: this.list.tenantvrfId,
        tenantVrfName: this.tentVrfName
      };
      saveOpenVpnDevice(params).then(res => {
        if (res.code === 10000) {
          let params1 = {
            approvalId: this.list.id,
            reason: "",
            resourceType: this.list.resourceType,
            type: 1,
            status: 1
          };
          operateApproveList(params1).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.$parent.getList();
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          });
          this.$parent.isShow = false;
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: "error"
          });
          this.$parent.isShow = false;
        }
      });
    },
    // 表格多选
    // Form a multiple-choice
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.vpnApply {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.5);
  z-index: 100;
  .inner {
    width: 700px;
    height: 623px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .top {
      height: 48px;
      border-bottom: 1px solid #d1d7e0;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 14px;
        height: 14px;
      }
    }
    .main {
      padding: 13px 30px 30px 30px;
      .mainHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        white-space: nowrap;
        margin-bottom: 13px;
        .left {
          display: flex;
          div:nth-child(1) {
            margin-right: 30px;
          }
        }
        .input {
          display: flex;
          align-items: center;
          span {
            margin-right: 10px;
          }
        }
      }
      .table {
        width: 640px;
        height: 420px;
        border-radius: 7px;
        border: 1px solid rgba(209, 215, 224, 1);
        position: relative;
        .page {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
        }
        .type1 {
          font-size: 14px;
          font-family: arial, sans-serif;
          font-weight: 400;
          color: rgba(54, 120, 200, 1);
        }
        .type2 {
          font-size: 14px;
          font-family: arial, sans-serif;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }
      }
      .button {
        text-align: center;
        padding-top: 30px;
        .save {
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
          margin-right: 18px;
          &:hover {
            background: #6095d6;
          }
        }
        .cancel {
          width: 70px;
          height: 34px;
          background: rgba(255, 255, 255, 1);
          border-radius: 7px;
          border: 1px solid rgba(209, 215, 224, 1);
          font-size: 14px;
          font-family: arial, sans-serif;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          &:hover {
            background: rgba(54, 120, 200, 1);
            color: #fff;
            border-color: rgba(54, 120, 200, 1);
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.vpnApply .mainHeader {
  .el-input__inner {
    width: 171px;
    height: 34px;
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    padding-left: 11px;
  }
}
.vpnApply .table .tableInfor {
  .el-input__inner {
    width: 96px;
    height: 24px;
    border-radius: 7px;
    border: 1px solid rgba(235, 235, 235, 1);
    padding-left: 8px;
  }
  .el-input__icon {
    line-height: 24px;
  }
  .el-table th > .cell {
    white-space: nowrap;
  }
  //   .el-button--text {
  //     font-size: 14px;
  //     font-family: arial, sans-serif;
  //     font-weight: 400;
  //     color: rgba(54, 120, 200, 1);
  //   }
}
.vpnApply {
  .el-table th,
  .el-table tr {
    height: 36px !important;
  }
}
</style>