<template>
  <!-- edge节点选择 -->
  <div class="edgeSelect">
    <div class="serch">
      <div class="devType">
        <span>{{$t('DeviceMan.deviceType')}}</span>
        <el-select filterable v-model="devType" @change="devTypeChange(devType)">
          <el-option value :label="$t('Home.all')"></el-option>
          <el-option value="0002" label="VSR100"></el-option>
          <el-option value="000206" label="ClOUD100"></el-option>
        </el-select>
      </div>
      <div class="serchInp">
        <i>
          <img src="@/assets/newPage/icon_search@2x.png" alt />
        </i>
        <el-input v-model="searchVal"></el-input>
        <!-- <el-autocomplete
          class="inline-input"
          v-model="searchVal"
          :fetch-suggestions="querySearch"
          :placeholder="$t('Configuration.devName')"
          :trigger-on-focus="false"
          @select="handleSelect"
        >
          <template slot-scope="{ item }">
            <div class="name">{{ item }}</div>
          </template>
        </el-autocomplete>-->
      </div>
      <div class="btn">
        <button @click="searchEvent">{{$t('DeviceMan.search')}}</button>
      </div>
    </div>
    <div class="tableList">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @current-change="clickChange"
        border
        fit
        size="small"
      >
        <el-table-column
          :label="$t('netWork.select')"
          width="65"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        >
          <template slot-scope="scope">
            <el-radio v-model="tableRadio" :label="scope.row.deviceId">
              <i></i>
            </el-radio>
          </template>
        </el-table-column>
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('Configuration.index')"
          align="center"
          width="70"
          :resizable="false"
          show-overflow-tooltip
        ></el-table-column> -->
        <el-table-column
          prop="deviceName"
          :label="$t('Configuration.devName')"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="tenantName"
          :label="$t('DeviceMan.tenant')"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="num"
          :label="$t('DeviceMan.devNumber')"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('DeviceMan.state')"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span
              :class="{activeFont:scope.row.status,defaultFont:!scope.row.status}"
              v-html="scope.row.status?$t('DeviceMan.online'):$t('DeviceMan.offline')"
            ></span>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allNum"
          @size-change="pageChange"
          @current-change="sizeChange"
          :current-page="page"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { scenenodeGetEdgeList } from "@/services";
export default {
  data() {
    return {
      devType: "",
      searchVal: "",
      restaurants: [], //模糊搜索数据
                       // Fuzzy search data
      tableData: [],
      page: 1,
      pageSize: 10,
      allNum: 0,
      tableRadio: {},
      multipleSelection: [],
    };
  },
  methods: {
    //选择设备类型
    // Select device Type
    devTypeChange(val) {
      let params = {
        searchKey: this.searchVal,
        type: val,
        sceneId: this.$parent.netData.sceneId,
        pageNumber: this.page,
        pageSize: this.pageSize,
      };
      this.dataInit(params);
    },
    //搜索
    // search
    async searchEvent() {
      let params = {
        searchKey: this.searchVal,
        type: "",
        sceneId: this.$parent.netData.sceneId,
        pageNumber: this.page,
        pageSize: this.pageSize,
      };
      scenenodeGetEdgeList(params).then((res) => {
        if (res.code === 10000) {
          this.allNum = res.result.totalElements;
          this.tableData = res.result.content;
          this.tableRadio = this.tableData[0].deviceId;
          sessionStorage.setItem("edgeDevId", this.tableRadio);
          this.$parent.chaneCheck();
        }
      });
    },
    //页面条数改变
    // The number of page bars changed
    pageChange(val) {
      this.pageSize = val;
      this.page = 1;
      let params = {
        searchKey: this.searchVal,
        type: this.devType,
        sceneId: this.$parent.netData.sceneId,
        pageNumber: this.page,
        pageSize: this.pageSize,
      };
      this.dataInit(params);
      this.$parent.chaneCheck();
    },
    //页数改变
    // Page number change
    sizeChange(val) {
      this.page = val;
      let params = {
        searchKey: this.searchVal,
        type: this.devType,
        sceneId: this.$parent.netData.sceneId,
        pageNumber: this.page,
        pageSize: this.pageSize,
      };
      this.dataInit(params);
      this.$parent.chaneCheck();
    },
    // //多选
    // multi-select
    // handleSelectionChange(val) {
    //   this.multipleSelection = val;
    // },
    //单选
    // The radio
    clickChange(item) {
      if (item != null) {
        this.tableRadio = item.deviceId;
        sessionStorage.setItem("edgeDevId", this.tableRadio);
        this.$parent.chaneCheck();
        this.multipleSelection = [item];
        this.$parent.isCloud = item.isCloud
      }
    },
    //模糊搜索
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
      this.searchVal = item;
      // console.log(item);
    },
    //序号
    // The serial number
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //表格数据初始化
    // Table data initialization
    dataInit(params) {
      scenenodeGetEdgeList(params).then((res) => {
        if (res.code === 10000) {
          this.allNum = res.result.totalElements;
          this.tableData = res.result.content;
          if (this.tableData.length > 0) {
            this.tableRadio = this.tableData[0].deviceId;
            this.$parent.isCloud = this.tableData[0].isCloud
            sessionStorage.setItem("edgeDevId", this.tableRadio);
          } else {
            sessionStorage.setItem("edgeDevId", "");
          }
          
        }
      });
    },
  },
  created() {},
};
</script>
<style scoped lang="scss">
.edgeSelect {
}
.serch {
  width: 100%;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  > div {
    float: left;
  }
}
.serchInp {
  position: relative;
  i {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 9px;
    left: 10px;
    z-index: 100;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.serch .btn {
  float: right;
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
  }
  button:hover {
    background: #6095d6;
  }
}
.devType {
  padding-right: 20px;
  span {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-right: 10px;
  }
}
.tableList {
  width: 100%;
  height: 420px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  border: 1px solid rgba(209, 215, 224, 1);
  margin: 20px 0 30px 0;
  overflow: auto;
}
.tableList::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.tableList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.tableList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.defaultFont {
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(186, 39, 39, 1);
}
.activeFont {
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(54, 120, 200, 1);
}
</style>
<style lang="scss">
.edgeSelect .serch .serchInp {
  .el-input,
  .el-select {
    width: 242px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
      padding-left: 30px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
}
.edgeSelect .serch .devType {
  .el-input,
  .el-select {
    width: 200px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
}
.edgeSelect .tableList {
  .el-radio__input.is-checked .el-radio__inner {
    border-color: rgba(54, 120, 200, 1);
    background: rgba(54, 120, 200, 1);
  }
  .el-radio__label {
    padding: 0;
  }
}
</style>