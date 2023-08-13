<template>
  <div class="content devList">
    <div id="alarmDefine">
      <div class="top">
        <div class="input">
          <!-- <i>
          <img src="@/assets/newPage/icon_search@2x.png" alt />
        </i>
          <el-input v-model="value1" placeholder="设备名称、序列号"></el-input>-->
          <!-- <el-autocomplete
            class="inline-input"
            v-model="state"
            :fetch-suggestions="querySearch"
            placeholder="事件名称"
            :trigger-on-focus="false"
            @select="handleSelect"
          >
            <i slot="prefix" class="el-input__icon el-icon-search" @click.enter="handleIconClick"></i>
            <template slot-scope="{ item }">
              <div class="devName">{{ item.devName }}</div>
          < <span class="devNum">{{ item.devNum }}</span>-->
          <!-- </template> -->
          <!-- </el-autocomplete> -->
        </div>
        <div id="but">
          <el-button icon="el-icon-plus" @click="hit()" class="bg but" v-control>{{$t('Alarm.add')}}</el-button>
        </div>
      </div>
      <div class="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :border="true"
          :row-class-name="tableRowClassName"
          :cell-class-name="cellStyle"
          size="small"
          :row-style="{height:44+'px'}"
        >
          <!-- <el-table-column type="selection" width="44" :resizable="false"></el-table-column> -->
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
            :label="$t('Alarm.eventName')"
            show-overflow-tooltip
            :resizable="false"
          ></el-table-column>
          <el-table-column
            prop="eventTypeName"
            :label="$t('Alarm.eventDefType')"
            show-overflow-tooltip
            :resizable="false"
          ></el-table-column>
          <!-- <el-table-column 
            prop="thresholdNum"
            :label="$t('Alarm.eventDefNum')"
            show-overflow-tooltip
            :resizable="false"
          ></el-table-column>-->
          <el-table-column
            prop="warningLevelName"
            :label="$t('Alarm.alarmRank')"
            show-overflow-tooltip
            :resizable="false"
          ></el-table-column>
          <el-table-column
            prop="keepTime"
            :label="$t('Alarm.continueTime')"
            show-overflow-tooltip
            :resizable="false"
          ></el-table-column>
          <el-table-column fixed="right" :label="$t('Alarm.operate')" :resizable="false">
            <template slot-scope="scope">
              <el-button
                @click="handleEdit(scope.row)"
                type="text"
                v-control
                style="color:#3678C8"
              >{{$t('Alarm.edit')}}</el-button>
              <!-- <el-button type="text">设备组</el-button> -->
              <el-button
                type="text"
                @click="handleDelete(scope.row)"
                v-control
                style="color:#3678C8"
              >{{$t('Alarm.delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <addEventDefine ref="addEventDefine" v-if="addShow"></addEventDefine>
      <editEvent ref="editEvent" v-show="editShow" :data="child"></editEvent>
      <choseDev ref="choseDev" v-show="choseDevShow"></choseDev>
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
import { getEvents, deleteRow, getEventType } from "@/services/index.js";
import addEventDefine from "./eventCompoent/addEventDefine";
import editEvent from "./eventCompoent/editEvent";
import choseDev from "./eventCompoent/choseDev";
export default {
  components: { addEventDefine, editEvent, choseDev },
  data() {
    return {
      addShow: false,
      editShow: false,
      choseDevShow: false,
      lSize: 10, //每页条数
                 // Number each page
      lNumber: 1, //页数
                  // Number of pages
      alllite: 0, //总条数
                  // The total number of article
      state: "",
      restaurants: [], //模糊搜素数据
                       // Fuzzy search for prime data
      child: "",
      tableData: [],
      langType: sessionStorage.getItem("lang") || "en",
      addInfo: {}
    };
  },
  created() {
    this.tenantId =JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId || "";
    this.type = JSON.parse(sessionStorage.getItem("userData")).type || "";
    this.id = JSON.parse(sessionStorage.getItem("userData")).id || "";
    this.getTableInfor();
  },
  methods: {
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
      this.getTableInfor();
    },
    //页数改变
    // Page number change
    liteSize(val) {
      this.lNumber = val;
      this.getTableInfor();
    },
    // 新增表格列表弹窗出现
    // A new table list popup appears
    hit() {
      this.addShow = true;
      this.$refs.choseDev.dataInit();
      getEventType().then(res => {
        this.$refs.addEventDefine.choseList = res.result;
      });
    },
    handleSelectionChange(val) {
      // this.multipleSelection = val;
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
    // 获取数据列表
    // Get data list
    getTableInfor() {
      let params = {
        pageNumber: this.lNumber,
        pageSize: this.lSize,
        tenantId: this.tenantId,
        userType: this.type,
        userId: this.id
      };
      this.restaurants = [];
      getEvents(params).then(res => {
        if (res.code === 10000) {
          this.tableData = res.result[0];
          this.alllite = res.result[1];
          this.copyTableData = JSON.parse(JSON.stringify(this.tableData));
          res.result.param &&
            res.result.param.forEach(item => {
              this.restaurants.push({
                devName: item.eventName
              });
            });
        }
      });
    },
    // 删除列表一行数据
    // Deletes a row from the list
    handleDelete(row) {
      var show99 = localStorage.getItem("show99");
      if(show99 == 'true'){
          deleteRow({ ids: row.id }).then(res => {
            if (res.code === 10000) {
              this.getTableInfor();
              this.$message({
                message: this.$t("Alarm.hint8"),
                type: "success"
              });
            }
          });
      }else{
        this.$confirm(this.$t("Alarm.hint7")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue99\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("Alarm.hint"), {
          confirmButtonText: this.$t("Alarm.ok"),
          cancelButtonText: this.$t("Alarm.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          deleteRow({ ids: row.id }).then(res => {
            if (res.code === 10000) {
              this.getTableInfor();
              this.$message({
                message: this.$t("Alarm.hint8"),
                type: "success"
              });
              localStorage.setItem("show99",localStorage.getItem("checkedValue99"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("Alarm.hint12")
          });
        });
      }
      
    },
    // 编辑列表一行数据
    // Edit a line of data in the list
    handleEdit(row) {
      this.editShow = true;
      getEventType().then(res => {
        this.$refs.editEvent.choseList = res.result;
      });
      // console.log(row)
      this.$refs.editEvent.inputMessage.eventName = row.eventName;
      this.$refs.editEvent.inputMessage.eventTypeName = row.eventType;
      this.$refs.editEvent.inputMessage.keepTime = row.keepTime;
      this.$refs.editEvent.inputMessage.warningLevelName = row.warningLevelName;
      sessionStorage.setItem("eventId", row.id);
      this.$refs.editEvent.choseEve(row.eventType);
      this.$refs.choseDev.value = []
      this.$refs.choseDev.value2 = []
      this.$refs.choseDev.dataInit(row.devSerNumAndName);
      if(row.eventType==4||row.eventType==6){
        this.$refs.editEvent.worth = Number(JSON.parse(row.thresholdNum)[0])/1024/1024/8;
        this.$refs.editEvent.worth1 = Number(JSON.parse(row.thresholdNum)[1])/1024/1024/8;
      }else{
        this.$refs.editEvent.worth = Number(JSON.parse(row.thresholdNum)[0]);
        this.$refs.editEvent.worth1 = Number(JSON.parse(row.thresholdNum)[1]);
      }
      this.$refs.editEvent.region = JSON.parse(row.operator)[0];
      this.$refs.editEvent.region1 = JSON.parse(row.operator)[1];
      this.child = row;
    },
    // 模糊搜索
    // Fuzzy search
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      // A callback call returns the data for the list of suggestions
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.devName
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) !== -1
        );
      };
    },
    //模糊搜索列表点击
    // Click on the fuzzy search list
    handleSelect(item) {
      this.state = item.devName;
    },
    //模糊搜索点击
    // Fuzzy search click
    handleIconClick(ev) {
      this.tableData = this.copyTableData.filter(item => {
        return item.eventName === this.state;
      });
      if (this.state === "") {
        this.getTableInfor();
      }
    },
    // 控制单元格根据告警级别呈现不同样式
    // The control cells are styled according to the alarm level
    cellStyle({ row }) {
      if (
        row.warningLevelName === "严重" ||
        row.warningLevelName === "Serious"
      ) {
        return "warning";
      } else if (
        row.warningLevelName === "一般" ||
        row.warningLevelName === "Normal"
      ) {
        return "normal";
      } else {
        return "ordinary";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: calc(100% - 116px);
  background: #fff;
  margin-top: 20px;
  padding: 20px 30px 20px;
  overflow: auto;
  .top {
    width: 100%;
    height: 34px;
    display: flex;
    justify-content: space-between;
    .input {
      width: 242px;
      position: relative;
      i {
        position: absolute;
        z-index: 10;
        top: -2px;
      }
    }
    .but {
      width: 100px;
      height: 34px;
      background: #3678c8;
      margin-left: 14px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
      padding: 0px;
      border-radius: 7px;
      color: #fff;
      border: none;
      &:hover {
        background: #6095d6;
      }
    }
  }
  .table {
    margin-top: 20px;
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
}
</style>
<style lang="scss">
#alarmDefine {
  .el-input__inner {
    width: 242px;
    height: 34px;
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    padding-left: 36px;
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
}
</style>