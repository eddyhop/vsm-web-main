<template>
  <!-- 静态路由 -->
  <div class="staticRoute">
    <div class="operate">
      <div class="btns">
        <button class="add">
          <img src="@/assets/newPage/icon_add@2x.png" alt />
          新增
        </button>
        <button class="close" @click="removeList">删除</button>
      </div>
    </div>
    <div class="tableList">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        size="small"
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
        <el-table-column prop="address" label="租户域" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" label="IP地址" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" label="管理距离" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" label="下一跳" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column
          :label="$t('DeviceMan.operation')"
          align="center"
          width="200"
          :resizable="false"
        >
          <template slot-scope="scope">
            <el-button
              @click="edit(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t('vsr1000.edit')}}</el-button>
            <el-button
              type="text"
              size="small"
              @click="remove(scope.row)"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t('vsr1000.delete')}}</el-button>
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
    <!-- <addStaticRoute/> -->
    <!-- <editStaticRoute/> -->
  </div>
</template>
<script>
import addStaticRoute from "./components/addStaticRoute"
import editStaticRoute from "./components/editStaticRoute"
export default {
  data() {
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      page: 1,
      pageSize: 10,
      allNum: 0,
      multipleSelection: [],
      tableData:[]
    };
  },
  components:{
      addStaticRoute,
      editStaticRoute
  },
  methods: {
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
    },
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
    //编辑
    // edit
    edit() {},
    //单项删除
    // Single delete
    remove() {},
    //多项删除
    // A number of deleted
    removeList() {}
  }
};
</script>
<style scoped lang="scss">
.staticRoute {
  width: 100%;
  padding: 20px 30px;
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