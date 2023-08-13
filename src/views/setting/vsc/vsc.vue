<template>
  <div class="vsc">
    <div class="search">
      <h3>{{$t("Vsc.set")}}<img src="@/assets/icon_right@2x.png" alt=""/><span>{{$t("Vsc.vscMan")}}</span></h3>
    </div>
    <div class="content">
      <div class="control">
        <div class="limit">
          <el-input :placeholder="$t('Vsc.vscName')" prefix-icon="el-icon-search" size="small" ></el-input>
        </div>
        <div class="but">
          <!-- <button class="add">+新增</button>
          <button>删除</button> -->
        </div>
      </div>
      <el-table :data="tableData" border stripe size="small" style="width: 100%" :empty-text="$t('Vsc.noData')">
        <el-table-column width="60px" :label="$t('Vsc.index')" :resizable="false">1</el-table-column>
        <el-table-column prop="name" :label="$t('Vsc.vscName')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="ip" :label="$t('Vsc.ipAddress')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="secret" :label="$t('Vsc.remark')" show-overflow-tooltip :resizable="false"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { vscGet } from "@/services";
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.getVsc();
  },
  methods: {
    getVsc() {
      vscGet().then(res => {
        this.tableData = res.result;
        // console.log(res);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  flex: 1;
  background: white;
  margin-top: 20px;
  padding: 20px 30px;
  overflow-x: hidden;
  overflow-y: auto;
  .control {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .limit {
      width: 240px;
    }
    .add:hover{
            background: rgba(96, 149, 214, 1);
        }
    button {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: none;
      color: white;
      margin-left: 14px;
    }
    .but button:nth-of-type(2) {
      background: rgba(239, 239, 239, 1);
      color: rgba(51, 51, 51, 1);
      border: 1px solid rgba(209, 215, 224, 1);
    }
  }
}
.search {
  width: 100%;
  height: 62px;
  background: white;
  padding: 20px 30px;
  h3 {
      font-size: 15px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      span{
        font-size: 14px;
        line-height: 8px;
      }
      img{
        width:5px;
        height:8px;
        margin-left: 5px;
        margin-right: 5px;
      }
    }
}
.vsc {
  width: 100%;
  height: 100%;
  // background: white;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
}
</style>