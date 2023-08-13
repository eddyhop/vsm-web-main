<template>
  <div class="content devList">
    <div id="table1">
      <div class="head">
        <button :class="{'bg':type===0}" @click="hit(0)">{{$t('Alarm.tab1')}}</button>
        <button :class="{'bg':type===1}" @click="hit(1)">{{$t('Alarm.tab2')}}</button>
        <button :class="{'bg':type===2}" @click="hit(2)">{{$t('Alarm.tab3')}}</button>
        <!-- <div id="tenantList">
          <el-select>
            <el-option></el-option>
          </el-select>
        </div>-->
        <div class="inputAlam">
          <i @click.enter="handleIconClick">
            <img src="@/assets/newPage/icon_search@2x.png" alt />
          </i>
          <el-autocomplete
            class="inline-input"
            v-model="state"
            :fetch-suggestions="querySearch"
            :placeholder="$t('Alarm.devNameNumber')"
            :trigger-on-focus="false"
            @select="handleSelect"
          >
            <!-- <i slot="prefix" class="el-input__icon el-icon-search" @click.enter="handleIconClick"></i> -->
            <template slot-scope="{ item }">
              <div class="devName">{{ item }}</div>
            </template>
          </el-autocomplete>
        </div>
        <button
          class="ignore"
          v-show="type==0"
          @click="toggleSelection()"
          v-control
        >{{$t('Alarm.ignore')}}</button>
        <button class="export" @click="out" v-control>{{$t('Alarm.export')}}</button>
      </div>
      <div class="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :border="true"
          stripe
          size="small"
        >
          <el-table-column type="selection" width="44" :resizable="false" v-if="type==0"></el-table-column>
          <!-- <el-table-column
            prop="index"
            :index="indexMethod"
            type="index"
            :label="$t('Alarm.index')"
            width="70"
            :resizable="false"
          ></el-table-column> -->
          <el-table-column prop="id" label="ID" show-overflow-tooltip :resizable="false"></el-table-column>
          <el-table-column
            prop="eventName"
            :label="$t('Alarm.alarmContent')"
            show-overflow-tooltip
            :resizable="false"
          ></el-table-column>
          <el-table-column
            prop="warningLevel"
            :label="$t('Alarm.alarmRank')"
            show-overflow-tooltip
            :resizable="false"
          ></el-table-column>
          <el-table-column
            prop="startTime"
            :label="$t('Alarm.alarmTime')"
            show-overflow-tooltip
            :resizable="false"
          ></el-table-column>
          <el-table-column
            prop="devType"
            :label="$t('Alarm.devSort')"
            show-overflow-tooltip
            :resizable="false"
          ></el-table-column>
          <el-table-column
            prop="devName"
            :label="$t('Alarm.devName')"
            show-overflow-tooltip
            :resizable="false"
          ></el-table-column>
          <el-table-column
            prop="devSerNum"
            :label="$t('Alarm.devNumber')"
            show-overflow-tooltip
            :resizable="false"
          ></el-table-column>
          <el-table-column
            prop="operate"
            :label="type==0?$t('Alarm.operate'):type==1?$t('Home.endTime'):$t('Alarm.ignoreTime')"
            show-overflow-tooltip
            :resizable="false"
          >
            <template slot-scope="scope">
              <el-button
                v-show="type==0"
                type="text"
                @click="changeType(scope.row)"
                v-control
                style="color:#3678C8;padding:0px"
              >{{$t('Alarm.ignore')}}</el-button>
              <span v-show="type==1">{{scope.row.endTime}}</span>
              <span v-show="type==2">{{scope.row.endTime}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="page">
      <el-pagination
        :page-sizes="[5, 10]"
        :total="alllite"
        @size-change="litePage"
        @current-change="liteSize"
        :current-page="lNumber"
        :page-size="10"
        layout="total, sizes, prev, next, jumper"
        style="font-family: arial, sans-serif"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  getAlarmInfos,
  changeSlove,
  // getRestaurants,
  getDevSerialName,
} from "@/services/index.js";
import axios from "axios";
const qs = require('qs');
export default {
  data() {
    return {
      type: 0,
      restaurants: [], //模糊搜素数据
                       // Fuzzy search for prime data
      state: "",
      multipleSelection: [],
      tableData: [],
      // finishTableData: [],
      lSize: 10, //每页条数
                 // Number each page
      lNumber: 1, //页数
                  // Number of pages
      alllite: 0, //总条数
                  // The total number of article
    };
  },
  created() {
    this.tenantId =JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId || "";
    this.userType = JSON.parse(sessionStorage.getItem("userData")).type || "";
    this.id = JSON.parse(sessionStorage.getItem("userData")).id || "";
    this.getInfos();
    this.getRestaurantsData();
  },
  methods: {
    //转换时间戳
    // Conversion timestamp
    getTime(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let miao = date.getSeconds();
      let list = [year, month, day, hour, minute, miao];
      let list2 = [];
      for (let i in list) {
        if (list[i] < 10) {
          let a = "" + 0 + list[i];
          list2.push(a);
        } else {
          list2.push(list[i]);
        }
      }
      let needTime =
        "" +
        list2[0] +
        "-" +
        list2[1] +
        "-" +
        list2[2] +
        " " +
        list2[3] +
        ":" +
        list2[4] +
        ":" +
        list2[5];
      return needTime;
    },
    // 获取模糊搜索数据
    // Get fuzzy search data
    getRestaurantsData() {
      let params = {
        tenantId: this.tenantId,
      };
      getDevSerialName(params).then((res) => {
        if (res.code === 10000) {
          this.restaurants = res.result;
        }
      });
    },
    // 索引岁页面变化
    // Index year page changes
    indexMethod(index) {
      return (
        index + 1 + (this.lNumber == 1 ? 0 : this.lSize * (this.lNumber - 1))
      );
    },
    //页数总条目改变
    // Total page entries change
    litePage(val) {
      this.lSize = val;
      this.getInfos();
    },
    //页数改变
    // Page number change
    liteSize(val) {
      this.lNumber = val;
      this.getInfos();
    },
    // 改变按钮样式,切换已处理和待处理
    // Change the button style to switch between processed and pending
    hit(i) {
      this.type = i;
      this.lNumber = 1;
      this.getInfos();
    },
    // 多选忽略
    // Much choose ignore
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach((item) => {
        this.multipleSelection.push(item.id);
      });
    },
    // 隔行变色
    // Interlaced discoloration
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      } else if (rowIndex % 2 === 0) {
        return "success-row";
      }
    },
    // 获取列表信息
    // Get list information
    getInfos(val) {
      this.tableData = [];
      let arr = this.state.split(",");
      // console.log(arr.length);
      let params = {
        pageNumber: this.lNumber,
        pageSize: this.lSize,
        isSolve: this.type,
        tenantId: this.tenantId,
        userType: this.userType,
        userId: this.id,
        devName: arr.length > 1 ? arr[1] : "",
        devSerNum: arr.length > 1 ? arr[0] : "",
      };
      val ? (params = val) : null;
      getAlarmInfos(params).then((res) => {
        if (res.code === 10000) {
          this.alllite = res.result.totalElements;
          res.result.content.forEach((item) => {
            if (item.devType === "0001") {
              item.devType = "VSR1000";
            } else if (item.devType === "0002") {
              item.devType = "VSR100";
            }
            if (item.warningLevel === 2) {
              item.warningLevel = this.$t("Alarm.serious1");
            } else if (item.warningLevel === 1) {
              item.warningLevel = this.$t("Alarm.normal1");
            } else {
              item.warningLevel = this.$t("Alarm.urgency");
            }
            if (item.startTime) {
              let time = new Date(item.startTime);
              let y = time.getFullYear();
              let M = time.getMonth() + 1;
              let d = time.getDate();
              let h = time.getHours();
              let m = time.getMinutes();
              let s = time.getSeconds();
              item.startTime =
                y + "-" + M + "-" + d + " " + h + ":" + m + ":" + s;
            }
            if (item.endTime) {
              let time = new Date(item.endTime);
              let y = time.getFullYear();
              let M = time.getMonth() + 1;
              let d = time.getDate();
              let h = time.getHours();
              let m = time.getMinutes();
              let s = time.getSeconds();
              item.endTime =
                y + "-" + M + "-" + d + " " + h + ":" + m + ":" + s;
            }
            this.tableData.push(item);
          });
        }
      });
    },
    // 告警信息忽略
    // Warning messages are ignored
    changeType(row) {
      var show100 = localStorage.getItem("show100");
      if(show100 == 'true'){
          let ids = [];
          ids.push(row.id);
          changeSlove(ids).then((res) => {
            if (res.code === 10000) {
              this.tableData = [];
              this.getInfos();
              this.$parent.getTypeInfoNums();
              this.$message({
                message: this.$t("Alarm.hint10"),
                type: "success",
              });
              localStorage.setItem("show100",localStorage.getItem("checkedValue100"));
            }
          });
      }else{
        this.$confirm(this.$t("Alarm.hint9")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue100\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("Alarm.hint"), {
          confirmButtonText: this.$t("Alarm.ok"),
          cancelButtonText: this.$t("Alarm.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning",
        })
        .then(() => {
          let ids = [];
          ids.push(row.id);
          changeSlove(ids).then((res) => {
            if (res.code === 10000) {
              this.tableData = [];
              this.getInfos();
              this.$parent.getTypeInfoNums();
              this.$message({
                message: this.$t("Alarm.hint10"),
                type: "success",
              });
              localStorage.setItem("show100",localStorage.getItem("checkedValue100"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("Alarm.hint11"),
          });
        });
      }
    },
    // 多个告警信息忽略
    // Multiple alarm messages are ignored
    toggleSelection() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: "info",
          message: this.$t("Alarm.hint1"),
        });
        return;
      }
      var show101 = localStorage.getItem("show101");
      if(show101 == 'true'){
        
          let ids = this.multipleSelection;
          changeSlove(ids).then((res) => {
            if (res.code === 10000) {
              this.tableData = [];
              this.multipleSelection = [];
              this.lNumber = 1;
              this.getInfos();
              this.$parent.getTypeInfoNums();
              this.$message({
                message: this.$t("Alarm.hint10"),
                type: "success",
              });
            }
          });
      }else{
        this.$confirm(this.$t("Alarm.hint9")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue101\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("Alarm.hint"), {
          confirmButtonText: this.$t("Alarm.ok"),
          cancelButtonText: this.$t("Alarm.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning",
        })
        .then(() => {
          let ids = this.multipleSelection;
          changeSlove(ids).then((res) => {
            if (res.code === 10000) {
              this.tableData = [];
              this.multipleSelection = [];
              this.lNumber = 1;
              this.getInfos();
              this.$parent.getTypeInfoNums();
              this.$message({
                message: this.$t("Alarm.hint10"),
                type: "success",
              });
              localStorage.setItem("show101",localStorage.getItem("checkedValue101"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("Alarm.hint11"),
          });
        });
      }
      
    },
    // 导出
    // export
    out() {
      let params = {
        tenantId: this.tenantId,
        isSolve: this.type,
        ids: this.multipleSelection,
      };
      // params.ids = params.ids.toString()
      axios({
        // 用axios发送post请求
        // Send a POST request using AXIOS
        method: "get",
        params: params,
        paramsSerializer: function (params) {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
        url: "/vsm/mon/download", // 请求地址
                                  // Request the address
        responseType: "blob", // 表明返回服务器返回的数据类型
                              // Indicates the type of data returned by the return server
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          // 处理返回的文件流
          // Process the returned file flow
          const blob = new Blob([res]); //new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
                                        // New Blob([RES]) returns the [Objece Objece] content in the image below without adding data (take one less layer)
          const fileName = "告警管理.xls"; //下载文件名称
                                       // Download file name
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
                                           // Release the URL object
          document.body.removeChild(elink);
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: this.$t("Alarm.msg1"),
          });
        });
    },
    // 模糊搜索
    // Fuzzy search
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = restaurants.filter(this.createFilter(queryString));
      // 调用 callback 返回建议列表的数据
      // A callback call returns the data for the list of suggestions
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        );
      };
    },
    //模糊搜索列表点击
    // Click on the fuzzy search list
    handleSelect(item) {
      // console.log(item)
      this.state = item;
      let arr = this.state.split(",");
      // console.log(999,this.state,arr)
      let params = {
        pageNumber: this.lNumber,
        pageSize: this.lSize,
        type: this.type,
        tenantId: this.tenantId,
        userType: this.userType,
        isSolve: this.type,
        userId: this.id,
        devName: arr.length > 1 ? arr[1] : "",
        devSerNum: arr.length > 1 ? arr[0] : "",
      };
      this.getInfos(params);
    },
    // 模糊搜索点击
    // Fuzzy search click
    handleIconClick() {
      // console.log(999,this.state)
      let arr = this.state.split(",");
      // console.log(999,this.state)
      let params = {
        page: this.lNumber,
        pageSize: this.lSize,
        type: this.type,
        tenantId: this.tenantId,
        userType: this.userType,
        isSolve: this.type,
        userId: this.id,
        devName: arr.length > 1 ? arr[1] : "",
        devSerNum: arr.length > 1 ? arr[0] : "",
      };
      this.getInfos(params);
    },
  },
  computed: {
    address() {
      return this.state;
    },
  },
  watch: {
    address: {
      handler: function (newval, oldval) {
        if (newval == "") {
          this.getInfos();
        }
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: calc(100% - 154px);
  background: #fff;
  padding: 20px 30px 0 30px;
  margin-top: 20px;
  overflow: auto;
  .head {
    width: 100%;
    height: 34px;
    display: flex;
    position: relative;
    button {
      width: 106px;
      height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      outline: none;
      font-size: 14px;
      color: #333333;
      &:hover {
        background: #3678c8;
        color: #fff;
        border: none;
      }
    }
    .bg {
      background: #3678c8;
      color: #fff;
      border: none;
      &:hover {
        background: #6095d6;
        border: none;
      }
    }
    button:nth-child(1) {
      margin-right: 18px;
    }
    button:nth-child(2) {
      margin-right: 18px;
    }
    .export {
      background: #3678c8;
      color: #fff;
      border: none;
      position: absolute;
      right: 0;
      top: 0;
      &:hover {
        background: #6095d6;
        border: none;
      }
    }
    .ignore {
      background: #3678c8;
      color: #fff;
      border: none;
      position: absolute;
      top: 0px;
      right: 120px;
      &:hover {
        background: #6095d6;
        border: none;
      }
    }
    .inputAlam {
      width: 242px;
      position: absolute;
      // margin: 0 0 0 342px;
      right: 266px;
    }
  }
  .table {
    margin-top: 20px;
    overflow: visible;
  }
  .page {
    padding-bottom: 20px;
  }
}
.devList::-webkit-scrollbar {
  width: 4px;
}
.devList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.devList::-webkit-scrollbar-track  {
     -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
     border-radius: 0;
     background: rgba(0, 0, 0, 0.1);
}
#tenantList {
  width: 160px;
  padding-left: 18px;
}
</style>
<style lang="scss">
#table1 {
  .el-input__inner {
    width: 242px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    padding-left: 36px;
  }
  .el-table--small td,
  .el-table--small th,
  .el-table td,
  .el-table th {
    padding: 0px !important;
  }
  .el-input__inner:hover {
    border-color: #3678c8;
  }
  .el-table .warning-row {
    background: #f4f8fe;
  }
  .el-table .normal:nth-child(5) .cell {
    color: #029805;
  }
  .el-table .ordinary:nth-child(5) .cell {
    color: #d89012;
  }
  .el-table .warning:nth-child(5) .cell {
    color: #ba2727;
  }
  .el-table tr th:nth-child(2) .cell {
    white-space: nowrap;
    overflow: visible;
  }
  .el-table th td,
  .el-table tr td {
    height: 44px !important;
  }
}
.devList #tenantList {
  .el-input,
  .el-select {
    width: 100%;
    height: 34px;
    .el-input__inner {
      width: 100%;
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
}

.inputAlam {
  position: relative;
  i {
    width: 24px;
    height: 24px;
    position: absolute;
    top: 5px;
    left: 10px;
    z-index: 3;
    cursor: pointer;
    padding: 4px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style lang="scss">
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .devName {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .devNum {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .devNum {
      color: #ddd;
    }
  }
}
</style>