<template>
  <!--  -->
  <div class="cloudNetWorkAcc">
    <div class="operate">
      <div class="btns">
        <button class="add">
          <img src="@/assets/newPage/icon_add@2x.png" alt />
          新增
        </button>
        <button class="close">删除</button>
      </div>
    </div>
    <div class="tableList">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        tooltip-effect="dark"
        size="small"
        fit
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('DeviceMan.index')"
          align="center"
          width="70"
          :resizable="false"
        ></el-table-column> -->
        <el-table-column prop="address" width="159" label="隧道名称" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" width="130" label="网络接口" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" width="150" label="加速用途" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" width="157" label="加速服务器地址" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" width="100" label="类型" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" width="157" label="用户名" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" width="100" label="隧道IP" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" width="157" label="运行时长" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" width="100" label="ping延时" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" width="100" label="出口流量" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" width="100" label="入口流量" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" width="100" label="监测周期" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" width="100" label="中断次数" show-overflow-tooltip :resizable="false"></el-table-column>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      allNum: 0,
      multipleSelection: [],
      tableData: []
    };
  },
  methods: {
    //序号展示
    // The serial number display
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //多选
    // multi-select
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //页面条数改变
    // The number of page bars changed
    pageChange(val) {
      this.pageSize = val;
      this.page = 1;
    },
    //页数改变
    // Page number change
    sizeChange(val) {
      this.page = val;
    }
  }
};
</script>
<style scoped lang="scss">
.cloudNetWorkAcc {
  padding: 20px 30px 0 30px;
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
  float: right;
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
  .add:hover {
    background: rgba(96, 149, 214, 1);
  }
  .close {
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-left: 14px;
  }
}
.tableList {
  padding-top: 20px;
}
</style>
<style lang="scss">
.cloudNetWorkAcc {
  .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px; // 横向滚动条
                // Horizontal scroll bar
    height: 6px; // 纵向滚动条 必写
                 // Vertical scroll bars must be written
  }
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 3px;
  }
}
</style>