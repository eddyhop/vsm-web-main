<template>
  <div class="mobileSetting">
    <div class="devList" >
      <div class="operate">
        <div class="opSearch">
          <span>{{$t('Home.sortBy')}}</span>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-select filterable size="small" v-model="sortBy"  style="margin-right:20px" @change="searchEvent">
            <el-option style="font-family: arial, sans-serif"
                v-for="item in rank"
                :key="item.name"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>

        </div>

        <div class="btns" >
          <button class="add" v-control @click="refreshEvent">
            {{$t('Home.refresh')}}
          </button>
        </div>
      </div>
      <el-table
          :data="tableData"
          style="width: 100%"
          border
          size="small"
          tooltip-effect="dark"
      >
        <el-table-column
            prop="id"
            :label="$t('Home.rank')"
            align="center"
            show-overflow-tooltip
            :resizable="false"
            width="80px"
        ></el-table-column>

        <el-table-column
            prop="edgeName"
            :label="$t('Home.edgeName')"
            align="center"
            show-overflow-tooltip
            :resizable="false"
            width="200px"
        ></el-table-column>
        <el-table-column
            prop="status"
            :label="$t('Home.status')"
            align="center"
            show-overflow-tooltip
            :resizable="false"
        >
          <template slot-scope="scope">
            <div class="bigBar-container">
              <div
                class="bigBar"
                :style="{width: '50%', backgroundColor: getBarColor(scope.column.property, scope.row.status) }"
              ><span class="statusValue">{{ scope.row.status }}</span></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
              prop="cpu"
              :label="$t('Home.cup')"
              align="center"
              show-overflow-tooltip
              :resizable="false"
          >
            <template slot-scope="scope">
              <div class="bar-container">
                <div
                  class="bar"
                  :style="{minWidth: '1%', width: scope.row.cpu, backgroundColor: getBarColor(scope.column.property, scope.row.cpu) }"                ></div>
                <span class="value">{{ scope.row.cpu }}</span>
              </div>
            </template>
          </el-table-column>
        <el-table-column
              prop="memory"
              :label="$t('Home.sortMemory')"
              align="center"
              show-overflow-tooltip
              :resizable="false"
          >
            <template slot-scope="scope">
              <div class="bar-container">
                <div
                  class="bar"
                  :style="{minWidth: '1%', width: scope.row.memory, backgroundColor: getBarColor(scope.column.property, scope.row.memory) }"
                ></div>
                <span class="value">{{ scope.row.memory }}</span>
              </div>
            </template>
          </el-table-column>
        <el-table-column
            prop="trafficSent"
            :label="$t('Home.trafficSent')"
            align="center"
            show-overflow-tooltip
            :resizable="false"
        ></el-table-column>

        <el-table-column
            prop="trafficReceived"
            :label="$t('Home.trafficReceived')"
            align="center"
            show-overflow-tooltip
            :resizable="false"
        ></el-table-column>


        <el-table-column :label="$t('Mobile.operate')" align="center" :resizable="false" >
          <template slot-scope="scope">
            <el-button
                type="text"
                size="small"
                style="color:#3678C8;font-size:14px;font-weight:400"
                @click="goSetPage(scope.row)"
                v-control
            >{{$t('Home.more')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
            :page-sizes="[10]"
            :total="allItem"
            :page-size="10"
            @size-change="pageChange"
            @current-change="sizeChange"
            :current-page="page"
            layout="total, prev, next, jumper"
            style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <!-- layout="total, sizes, prev, next, jumper" -->
    <!-- <importFile v-show="flag" /> -->
  </div>
</template>
<script>
import {
  deviceSortBy
} from "@/services/index.js";
export default {
  props: {},
  components: {
  },
  data() {
    return {
      tenantId:sessionStorage.getItem("tenantValue"),
       rank:[
           { name: this.$t('Home.cpu'), id: "cpu" },
           { name: this.$t('Home.sortMemory'),id: "memory"},
           { name: this.$t('Home.trafficSent'),id: "trafficSent"},
           { name: this.$t('Home.trafficReceived'),id: "trafficReceived"},
       ],
      sortBy:"CPU",
      tableData:[],
      pageSize:10,
      page:1,
      rankIndex : 1,
      allItem:0
    };
  },
  computed: {

  },
  methods: {
    getNumericValue(value) {
      // Extract numeric part from the string and convert to a number
      return parseFloat(value.replace('%', ''));
    },
    getBarColor(column, value) {
      if(column === "status") {
        return value === "Online" ? '#3DDC97' : '#E9190F'
      } else {
        const numericValue = this.getNumericValue(value);
        if (numericValue <= 60) {
          return '#3DDC97'; // green color
        } else if (numericValue > 60 && numericValue <= 75) {
          return '#F3E37C'; // yellow color
        } else {
          return '#E9190F'; // red color
        }
      }
    },
    formatName(row, column) {

    },
    formatDom(row, column) {

    },
    pageChange(val) {
      //页数总条目改变
      // Total page entries change
      this.pageSize = val;
      let params = {
        pageNo: this.page,
        pageSize: this.pageSize,
        sortBy:this.sortBy,
        tenantId:this.tenantId,
      };
      // this.page = 1;
      this.dataInit(params);
    },
    sizeChange(val) {
      //页数改变
      // Page number change
      // console.log(val)
      this.page = val;
      let params = {
        pageNo: this.page,
        pageSize: this.pageSize,
        sortBy:this.sortBy,
        tenantId:this.tenantId,
      };
      this.dataInit(params);
    },
    searchEvent() {
      this.rankIndex = 1;
      this.page = 1;
      this.dataInit({
        pageNo: 1,
        pageSize: 10,
        sortBy:this.sortBy,
        tenantId:this.tenantId,
      });
    },
    refreshEvent() {
      this.rankIndex = 1;
      this.page = 1;
      this.dataInit({
        pageNo: 1,
        pageSize: 10,
        sortBy:"cpu",
        tenantId:this.tenantId,
      });
    },
    load() {

    },
    dataInit(params) {
      deviceSortBy(params).then((res) => {
        if (res.code === 10000) {
          this.allItem = res.result.totalElements;
          this.tableData = res.result.content;

          this.tableData.forEach((item) => {
            if(item.cpu==0){
              item.cpu = "No Data";
            }else{
              item.cpu =   item.cpu+"%";
            }

            if(item.memory==0){
              item.memory = "No Data";
            }else{
              item.memory =   item.memory+"%";
            }

            if(item.trafficSent==0){
              item.trafficSent = "No Data";
            }else{
              if(item.trafficSent > 1000){
                item.trafficSent =   ((item.trafficSent-0) / 1000 )+" kbps";
              }else{
                item.trafficSent =   item.trafficSent+" bps";
              }
              
            }

            if(item.trafficReceived==0){
              item.trafficReceived = "No Data";
            }else{
              if(item.trafficReceived>1000){
                item.trafficReceived =   ((item.trafficReceived-0) / 1000 )+" kbps";
              }else{
                item.trafficReceived =   item.trafficReceived+" bps";
              }
              
            }
            item.id =  this.rankIndex + (this.page * this.pageSize) - 10;
            this.rankIndex++;
          });
          this.rankIndex = 1;
        }
      });
    },//跳转设备配置页面
    goSetPage(row) {
      var lan = this.$i18n.locale;
      if(lan=="en"){
        sessionStorage.setItem("lan", "English");
        sessionStorage.setItem("lang", "en");
        sessionStorage.setItem("User-Language", "en-US");
      }else if(lan=="cn"){
        sessionStorage.setItem("lan", "简体中文");
        sessionStorage.setItem("lang", "cn");
        sessionStorage.setItem("User-Language", "zh-CN");
      }

      let params = {
        deviceId: row.dev_id,
        deviceName: row.edgeName,
      };
      this.$router.push({
        path: "/watch/healthOverview",
        query: { devData: JSON.stringify(params) },
      });
    },
  },
  created() {
    let params = {
      pageNo: 1,
      pageSize: 10,
      sortBy:this.sortBy,
      tenantId:this.tenantId,
    };
    this.rankIndex = 1;
    this.dataInit(params);
  },
  mounted() {},
};
</script>
<style scoped lang="scss">
.mobileSetting {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.title {
  width: 100%;
  //   height: 62px;
  background: white;
  padding: 20px 30px;
  h3 {
    font-size: 15px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-bottom: 21px;
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
.search {
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .formItem {
    float: left;
    span {
      padding-right: 10px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }
  .formItem:last-of-type {
    float: right;
    button {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: 0;
      outline: none;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
      margin-left: 14px;
    }
    .active {
      background: #efefef;
      color: #999999;
    }
    .active:hover {
      background: #efefef;
      color: #999999;
    }
  }
}
.searchBtn {
  width: 100px;
  height: 34px;
  background: rgba(54, 120, 200, 1);
  border-radius: 7px;
  border: 0;
  outline: none;
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}
.searchBtn:hover {
  background: rgba(96, 149, 214, 1);
  border: 0;
}
.devList {
  flex: 1;
  background: #fff;
  padding: 20px 30px;
  overflow-x: hidden;
  overflow-y: auto;
  .operate {
    width: 100%;
    padding-bottom: 20px;
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    .btns {
      float: right;
      zoom: 1;
      &:after {
        display: block;
        clear: both;
        content: "";
        visibility: hidden;
        height: 0;
      }
      display: flex;
      button {
        width: 100px;
        height: 34px;
        background: rgba(54, 120, 200, 1);
        border-radius: 7px;
        border: 0;
        outline: none;
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
        margin-left: 14px;
      }
      // .active {
      //   background: #efefef;
      //   color: #999999;
      // }
      button:hover {
        background: rgba(96, 149, 214, 1);
        border: 0;
      }
      // .active:hover {
      //   background: #efefef;
      //   color: #999999;
      // }
      .add {
        img {
          width: 14px;
          height: 14px;
          position: relative;
          top: 1px;
        }
      }
      .add:hover {
        background: #6095d6;
      }
    }
    .opSearch {
      float: left;
      position: relative;
      font-family: arial, sans-serif;
      i {
        width: 16px;
        height: 16px;
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 100;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
.serverData {
  max-height: 136px;
}
</style>
<style lang="scss">
.mobileSetting .title .el-input {
  width: 242px;
  height: 34px;
  .el-input__inner {
    height: 100%;
  }
}
.inline-input .el-input__inner {
  padding-left: 34px;
}
.greenClass {
  background: #edfced;
}
.redClass {
  background: #fae6e6;
}

.bar-container {
  display: flex;
  align-items: center;
  width: 100px;
}

.bigBar {
  height: 20px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
}

.bigBar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 130px;
}

.bar {
  height: 18px;
  border-radius: 5px;
}

.value {
  margin-left: 10px;
}
.statusValue {
  color:#efefef
}
</style>
