<template>
  <div class="content" id="table">
    <p>{{LogonType=='1' ? type.type2 :type.type}}</p>
    <div class="biaoGe">
      <el-table :data="tableData" style="width: 100%">
        
        <el-table-column prop="rank" class="rank" show-overflow-tooltip>
          <template slot="header">
            <el-tooltip class="item" effect="dark" :content="$t('Home.ranking')" placement="top">
              <span>{{$t('Home.ranking')}}</span>
            </el-tooltip>
          </template>

        </el-table-column>
        <el-table-column
          prop="name"
          :label="LogonType=='1' && type.name=='2' ? $t('TenMan.tenName') : $t('Home.deviceName')"
          class="rank"
          show-overflow-tooltip
        >
          <template slot="header">
            <el-tooltip class="item" effect="dark" :content="LogonType=='1' && type.name=='2' ? $t('TenMan.tenName') : $t('Home.deviceName')" placement="top">
              <span>{{LogonType=='1' && type.name=='2' ? $t('TenMan.tenName') : $t('Home.deviceName')}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="load" :label="type.content" class="rank" show-overflow-tooltip>
          <template slot="header">
            <el-tooltip class="item" effect="dark" :content="type.content" placement="top">
              <span>{{type.content}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="tiShi" v-if="tableData.length===0">
      <img src="@/assets/home_icon_ranking.png" alt />
      <div>{{type.default}}</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      empty: {
        rank: <span class="empty"></span>,
        name: <span class="empty"></span>,
        load: <span class="empty"></span>
      },
      tableData: [],
      LogonType: ""
    };
  },
  methods: {
    drawChart() {
      while (this.tableData.length >= 1 && this.tableData.length < 5) {
        this.tableData.push(this.empty);
      }
    }
  },
  props: ["type", "m"],
  created() {
    this.LogonType = JSON.parse(sessionStorage.getItem("userData")).type;
  },
  watch: {
    m: function(newVal, oldVal) {
      this.tableData = newVal;
      newVal && this.drawChart();
    }
  }
};
</script>
<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  font-family: arial, sans-serif;
  font-weight: 400;
  padding: 14px 14px 16px 14px;
  position: relative;
  p {
    font-size: 14px;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    margin-bottom: 14px;
  }
  p::before {
    display: inline-block;
    content: "";
    width: 2px;
    height: 12px;
    background: rgba(54, 120, 200, 1);
    margin-right: 6px;
    position: relative;
    top: 1px;
  }
  .biaoGe {
    width: 100%;
    height: 171px;
  }
  .tiShi {
    width: 112px;
    height: 66px;
    position: absolute;
    text-align: center;
    top: 116px;
    left: 50%;
    margin-left: -56px;
    div {
      width: 100%;
      height: 20px;
      font-size: 14px;
      color: rgba(153, 153, 153, 1);
      line-height: 20px;
      white-space: nowrap;
      position: absolute;
      bottom: 0px;
      display: flex;
      justify-content: center;
    }
  }
  .empty {
    display: block;
    width: 12px;
    height: 2px;
    background: rgba(209, 215, 224, 1);
    text-align: center;
    margin: 13px auto 0;
  }
}
</style>
<style lang="scss">
#table {
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: none;
  }
  .el-table th,
  .el-table tr {
    height: 0px;
  }
  .el-table th > .cell {
    height: 27.7px;
    line-height: 27.7px;
    font-size: 13px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: #333333;
  }
  .el-table tbody tr:hover {
    background: #f7f8fa;
  }
  .el-table::before {
    height: 0px;
    background: #fff;
    overflow: hidden;
  }
  .el-table td,
  .el-table th {
    padding: 5px 0 !important;
  }
  .el-table td {
    background: none;
  }
  .el-table .cell {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 18px;
    white-space: nowrap;
  }
  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
  }
  .el-table tr:nth-child(1) td:nth-child(1) .cell {
    color: rgba(186, 39, 39, 1);
  }
  .el-table tr:nth-child(2) td:nth-child(1) .cell {
    color: rgba(216, 144, 18, 1);
  }
  .el-table tr:nth-child(3) td:nth-child(1) .cell {
    color: rgba(2, 152, 5, 1);
  }
  .el-table__empty-text {
    display: none;
  }
  .el-table__body,
  .el-table__footer,
  .el-table__header thead th {
    background: #f7f8fa;
  }
  .el-table__body,
  .el-table__footer,
  .el-table__header thead th .cell {
    // overflow: visible;
  }
  .el-table tr td:nth-child(1) .cell {
    font-weight: 500;
    font-size: 15px;
    font-family: arial, sans-serif;
  }
  .el-table tr td:nth-child(2) .cell {
    font-weight: 400;
    font-size: 13px;
    font-family: arial, sans-serif;
  }
  .el-table tr td:nth-child(3) .cell {
    font-weight: 400;
    font-size: 14px;
    font-family: arial, sans-serif;
  }
  // .el-table .cell, .el-table th div{
  //   text-overflow: initial;
  // }
}
</style>