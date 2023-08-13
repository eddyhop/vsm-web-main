<template>
  <div class="routTable">
    <div class="content">
      <h4 class="title">
        <span class="name">路由表</span>
        <span class="close"></span>
      </h4>
      <div class="content-main">
        <div class="search">
          <div class="opt">
            <span>路由来源</span>
            <el-select filterable
              size="small"
              style="width:160px;height:34px"
              v-model="vlfName"
              placeholder="请选择"
            >
              <el-option value :label="$t('Upgrade.all')"></el-option>
            </el-select>
          </div>
          <div class="searchInp">
            <i class="icon-search">
              <img src="@/assets/newPage/icon_search@2x.png" alt />
            </i>
            <el-input style="width:242px;height:34px" placeholder="目标地址、子网掩码"></el-input>
          </div>
          <div class="op-but">
            <button>搜索</button>
          </div>
        </div>
        <div class="table">
          <div class="tabTit">
            <span>IPV4</span>
          </div>
          <div class="tableList">
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              border
              stripe
              size="mini"
              fit
            >
              <!-- <el-table-column
                type="index"
                :index="IndexMethod"
                :label="$t('vsr1000.index')"
                align="center"
                width="70"
                show-overflow-tooltip
                :resizable="false"
              ></el-table-column> -->
              <el-table-column
                prop="name"
                label="目标地址"
                align="center"
                show-overflow-tooltip
                :resizable="false"
              ></el-table-column>
              <el-table-column
                prop="name"
                label="子网掩码"
                align="center"
                show-overflow-tooltip
                :resizable="false"
              ></el-table-column>
              <el-table-column
                prop="name"
                label="下一跳"
                align="center"
                show-overflow-tooltip
                :resizable="false"
              ></el-table-column>
              <el-table-column
                prop="name"
                label="接口名称"
                align="center"
                show-overflow-tooltip
                :resizable="false"
              ></el-table-column>
              <el-table-column
                prop="name"
                label="路由来源"
                align="center"
                show-overflow-tooltip
                :resizable="false"
              ></el-table-column>
            </el-table>
            <div class="page">
              <el-pagination
                :page-sizes="[5, 10]"
                :total="Allnum"
                @size-change="sizeChange"
                @current-change="pageChange"
                :current-page="page"
                :page-size="10"
                layout="total, sizes, prev, next, jumper"
                style="font-family: arial, sans-serif"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  data() {
    return {
      tableData: [],
      page: 1,
      pageSize: 10,
      allNum: 0
    };
  },
  computed: {},
  methods: {
    //表格序号
    // Form the serial number
    IndexMethod() {},
    //每页条数改变
    // Change the number of bars per page
    sizeChange(val) {},
    //页数改变
    // Page number change
    pageChange(val) {}
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.routTable {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
  background: rgba(32, 42, 59, 0.2);
}
.content {
  width: 700px;
  height: 627px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -313.5px;
  margin-left: -350px;
}
.title {
  width: 100%;
  height: 48px;
  border-bottom: 1px solid #d1d7e0;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .name {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .close {
    width: 14px;
    height: 14px;
    background-image: url("../../../../assets/icon_close.png");
    background-size: 14px 14px;
  }
}
.content-main {
  padding: 30px;
  .search {
    width: 100%;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    .opt {
      float: left;
      padding-right: 24px;
      span {
        padding-right: 10px;
      }
    }
    .op-but {
      // float: right;
      button {
        width: 100px;
        height: 34px;
        background: rgba(54, 120, 200, 1);
        border-radius: 7px;
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        outline: none;
        border: 0;
        cursor: pointer;
        margin-left: 18px;
      }
      button:hover {
        background: #6095d6;
      }
    }
  }
}
.searchInp {
  float: left;
  position: relative;
  .icon-search {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 9px;
    left: 10px;
    z-index: 10;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.tabTit {
  width: 100%;
  padding-top: 30px;
  span {
    display: block;
    width: 80px;
    height: 34px;
    text-align: center;
    line-height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px 2px 0px 0px;
    border: 1px solid rgba(235, 235, 235, 1);
    border-bottom: 0;
  }
}
</style>
<style lang="scss">
.routTable .content {
  .el-table th > .cell {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
}
.routTable .content .search {
  .el-input {
    height: 100%;
  }
  .el-input__inner {
    height: 100%;
    border-radius: 7px;
  }
  .el-input__icon {
    line-height: normal;
  }
  .searchInp {
    .el-input__inner {
      padding-left: 30px;
    }
  }
}
</style>