<template>
  <div class="networkIssue">
    <div class="tit">
      <h3>
        <i class="back" @click="$router.push('/netWorkTopo')">
          <img src="@/assets/cloudPage/icon_back@2x.png" alt />
        </i>
        拓扑图
        <img src="@/assets/icon_right@2x.png" style="margin:0 4px" alt />
        <span>网段发布</span>
      </h3>
    </div>
    <div class="contentList">
      <div class="btns">
        <button class="add">新增</button>
        <button class="close">删除</button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
        stripe
        size="small"
        fit
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
          :label="$t('vsr1000.index')"
          align="center"
          width="70"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column> -->
        <el-table-column
          prop="name"
          label="类型"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="IP地址"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allNum"
          @size-change="sizeChange"
          @current-change="pageChange"
          :current-page="page"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addNetworkIssue/>
  </div>
</template>
<script>
import addNetworkIssue from "./components/addNetworkIssue"
export default {
  props: {},
  components: {addNetworkIssue},
  data() {
    return {
      //表格数据
      // Tabular data
      tableData: [],
      //选中的表格数据
      // Selected table data
      multipleSelection: [],
      //页数
      // Number of pages
      page:1,
      //每页条数
      // Number each page
      pageSize:10,
      //总条数
      // The total number of article
      allNum:0
    };
  },
  computed: {},
  methods: {
    sizeChange(val) {
      //页数总条目改变
      // Total page entries change
     
      this.pageSize = val;
     
      this.page = 1;
     
    },
    pageChange(val) {
      //页数改变
      // Page number change
     
      this.page = val;
      
     
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    indexMethod(){
      
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.networkIssue {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .tit {
    width: 100%;
    background: #fff;
    padding: 16px 30px;
    h3 {
      font-size: 16px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      display: flex;
      align-items: center;
    }
    img {
      width: 6px;
      height: 10px;
    }
  }
}
.tit h3 .back {
  width: 30px;
  height: 30px;
  margin-right: 20px;
  img {
    width: 100%;
    height: 100%;
  }
}
.contentList {
  zoom: 1;
  width: 100%;
  height: 100%;
  margin-top: 20px;
  background: #fff;
  padding: 20px 30px;
  overflow: auto;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
}
.contentList::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.contentList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.contentList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.btns {
  float: right;
  padding-bottom: 20px;
  button {
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
    .addIcon {
      width: 14px;
      height: 14px;
      position: relative;
      top: 1px;
      display: inline-block;
      background: url("../../../../assets/newPage/equipment_icon_add@2x.png")
        no-repeat;
      background-size: cover;
    }
  }
  .add:hover {
    background: #6095d6;
    .addIcon {
      background: url("../../../../assets/newPage/icon_add@2x.png") no-repeat;
      background-size: cover;
    }
  }
  .close {
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-left: 23px;
  }
}
</style>