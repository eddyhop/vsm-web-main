<template>
  <div class="devMain">
    <div class="top">
      <div class="search">
        <h3>{{$t('Configuration.devConfig')}}</h3>
      </div>
      <dl class="devSelect">
        <dt>
          <div class="formItem">
            <span class="lab-height">{{$t('Configuration.devType')}}</span>
            <el-select filterable
              v-model="formData.devType"
              @change="termDevInfo(formData.devType,'devType')"
              :placeholder="$t('Configuration.all')"
            >
              <el-option value="dsddjb" :label="$t('Configuration.all')"></el-option>
              <el-option value="0001" label="VSR1000"></el-option>
              <el-option value="0002" label="VSR100"></el-option>
              <el-option value="000106" label="CLOUD"></el-option>
            </el-select>
          </div>
          <div class="formItem">
            <span class="lab-height">{{$t('Configuration.tenant')}}</span>
            <el-select filterable
              v-model="formData.tenement"
              :placeholder="$t('Configuration.all')"
              :disabled="isUserName"
              @change="termDevInfo(formData.tenement,'lessee')"
            >
              <el-option value="dsddjb" :label="$t('Configuration.all')"></el-option>
              <el-option
                v-for="(item) in rentInfo"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </div>
          <div class="formItem">
            <i>
              <img src="@/assets/newPage/icon_search@2x.png" alt />
            </i>
            <el-autocomplete
              class="inline-input"
              v-model="formData.searchVal"
              :fetch-suggestions="querySearch"
              :placeholder="$t('Configuration.devName')"
              :trigger-on-focus="false"
              @select="handleSelect"
            >
              <template slot-scope="{ item }">
                <div class="name">{{ item }}</div>
              </template>
            </el-autocomplete>
          </div>
        </dt>
        <dd>
          <button class="search" v-debounce="searchEvent" v-control>{{$t('Configuration.search')}}</button>
        </dd>
      </dl>
    </div>
    <div class="devList">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        stripe
        size="small"
        fit
        tooltip-effect="dark"
      >
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
          :label="$t('Configuration.tenant')"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="deviceSerialNumber"
          :label="$t('Configuration.devNumber')"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="deviceType"
          :label="$t('Configuration.devType')"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="hardwareVersion"
          :label="$t('Configuration.version')"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="devState"
          :label="$t('Configuration.state')"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column :label="$t('Configuration.operate')" align="center" :resizable="false" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="goDetail(scope.row)"
              style="color:#3678C8;font-size:14px;font-weight:400"
            >{{$t('Configuration.devConfig')}}</el-button>
            <!-- <el-button
              type="text"
              size="small"
              @click="setSdh(scope.row)"
              style="color:#3678C8;font-size:14px;font-weight:400"
            >{{$t('Configuration.forcedSynchronizing')}}</el-button>-->
            <el-button
              type="text"
              size="small"
              @click="setRestoration(scope.row)" v-control
              style="color:#3678C8;font-size:14px;font-weight:400"
            >{{$t('Configuration.reset')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <devMask v-show="isShow" :showMsg="showMsg" />
  </div>
</template>
<script>
import { getDevInfo, deviceSelect, getDevSerialName } from "@/services";
import devMask from "./components/devMask";
export default {
  props: {},
  components: {
    devMask
  },
  data() {
    return {
      lSize: 10, //每页条数
                 // Number each page
      lNumber: 1, //页数
                  // Number of pages
      alllite: 0, //总页数
                  // Total number of pages
      tableData: [], //表格数据
                     // Tabular data
      rentInfo: [], //租户数据
                    // The tenant data
      restaurants: [], //模糊搜素数据
                       // Fuzzy search for prime data
      isUserName: true,
      isShow: false,
      showMsg: "",
      formData: {
        devType: "dsddjb",
        tenement: "dsddjb",
        searchVal: ""
      }
    };
  },
  computed: {},
  methods: {
    setSdh(row) {
      //强制同步
      // Mandatory synchronization
      this.isShow = true;
      sessionStorage.setItem("deviceId", row.id);
      this.showMsg = this.$t("Configuration.forcedSynchronizing");
    },
    setRestoration(row) {
      //重启
      // restart
      this.isShow = true;
      sessionStorage.setItem("deviceId", row.id);
      this.showMsg = this.$t('Configuration.reset');
    },
    //设备配置
    // Device configuration
    goDetail(row) {
      sessionStorage.setItem("deviceId", row.id);
      if (row.deviceType === "VSR1000" || row.deviceType === "CLOUD") {
        sessionStorage.setItem(
          "devData",
          JSON.stringify({
            deviceName: row.deviceName,
            vsrSeries: row.deviceSerialNumber,
            tenantId: row.tenantId
          })
        );

        this.$router.push("/vsr");
      } else if (row.deviceType === "VSR100") {
        this.$router.push("/vsr_lite");
        sessionStorage.setItem(
          "devData",
          JSON.stringify({
            deviceName: row.deviceName,
            vsrSeries: row.deviceSerialNumber,
            tenantId: row.tenantId
          })
        );
      }
    },
    litePage(val) {
      //页数总条目改变
      // Total page entries change
      let tenantId =JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId;
      let userType = JSON.parse(sessionStorage.getItem("userData")).type;
      this.lSize = val;
      let params = {
        devNameRange: "devHaveName",
        deviceType: this.formData.devType,
        page: 1,
        pageSize: this.lSize,
        searchKey: this.formData.searchVal,
        tenantId: this.formData.tenement
      };
      this.lNumber = 1;
      this.getlite(params);
    },
    liteSize(val) {
      //页数改变
      // Page number change
      let tenantId =JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId;
      let userType = JSON.parse(sessionStorage.getItem("userData")).type;
      this.lNumber = val;
      let params = {
        devNameRange: "devHaveName",
        deviceType: this.formData.devType,
        page: this.lNumber,
        pageSize: this.lSize,
        searchKey: this.formData.searchVal,
        tenantId: this.formData.tenement
      };
      this.getlite(params);
    },
    async getlite(params) {
      //权限、条件查询设备信息
      // Permission and condition to query equipment information
      let data = await getDevInfo(params);
      if (data.code === 10000 && data.result.content.length) {
        this.tableData = data.result.content;
        this.tableData.forEach(item => {
          item.devState = item.upInformation ? this.$t('DeviceMan.online') : this.$t('DeviceMan.offline');
        });
        this.alllite = data.result.totalElements;
      } else {
        this.tableData = [];
      }
    },
    //搜索的事件
    // Search events
    searchEvent() {
      // console.log(12312312);
      let data = {
        devNameRange: "devHaveName",
        deviceType: this.formData.devType,
        page: 1,
        pageSize: this.lSize,
        searchKey: this.formData.searchVal,
        tenantId: this.formData.tenement
      };
      this.lNumber = 1;
      this.getlite(data);
    },
    //表格序号
    // Form the serial number
    indexMethod(index) {
      return (
        index + 1 + (this.lNumber == 1 ? 0 : this.lSize * (this.lNumber - 1))
      );
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
      return restaurant => {
        return (
          restaurant.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        );
      };
    },
    //模糊搜索列表点击
    // Click on the fuzzy search list
    handleSelect(item) {
      this.formData.searchVal = item;
      // console.log(item);
    },
    termDevInfo(val, type) {
      if (type === "devType") {
        this.getlite({
          devNameRange: "devHaveName",
          deviceType: val,
          page: 1,
          pageSize: this.lSize,
          searchKey: this.formData.searchVal,
          tenantId: this.formData.tenement
        });
        this.lNumber = 1;
      } else {
        this.getlite({
          devNameRange: "devHaveName",
          deviceType: this.formData.devType,
          page: 1,
          pageSize: this.lSize,
          searchKey: this.formData.searchVal,
          tenantId: val
        });
        this.lNumber = 1;
      }
    }
  },
  async created() {
    let tenantId =JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId;
    let userId = JSON.parse(sessionStorage.getItem("userData")).id;
    let userType = JSON.parse(sessionStorage.getItem("userData")).type;
    this.isUserName = userType === 2 ? false : true;
    let params = {
      devNameRange: "devHaveName",
      deviceType: this.formData.devType,
      page: this.lNumber,
      pageSize: this.lSize,
      searchKey: this.formData.searchVal,
      tenantId: tenantId
    };
    this.getlite(params);
    let data = await deviceSelect();
    if (data.code === 10000) {
      this.rentInfo = data.result;
      this.formData.tenement = this.rentInfo.find(
        item => item.id === tenantId
      ).id;
    }
    getDevSerialName({ tenantId: userType === 2 ? "dsddjb" : tenantId }).then(
      res => {
        if (res.code === 10000) {
          this.restaurants = res.result;
        }
      }
    );
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.devMain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-button--small, .el-button--small.is-round{
    padding: 0px;
  }
}
.top {
  width: 100%;
  padding: 20px 30px 20px 30px;
  background: #fff;
  .search {
    h3 {
      font-size: 15px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
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
}
.devSelect {
  padding-top: 20px;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  dt {
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    float: left;
    .formItem {
      float: left;
      padding-right: 30px;
      span {
        padding-right: 10px;
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }
    .formItem:last-of-type {
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
  }
  dd {
    // float: right;
    .search {
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
    .search:hover {
      background: rgba(96, 149, 214, 1);
      border: 0;
    }
  }
}
.devList {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  background: #fff;
  padding: 20px 30px;
  overflow: auto;
}
.devList::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.devList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.devList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>
<style lang="scss">
.devMain .devSelect .el-input {
  width: 140px;
  height: 34px;
  .el-input__inner {
    height: 100%;
  }
  .el-input__icon {
    line-height: normal;
  }
}
.devMain .devSelect .formItem:last-of-type {
  .el-input {
    width: 242px;
    height: 34px;
    .el-input__inner {
      padding-left: 36px;
      height: 100%;
    }
  }
}
// .devMain .el-table--small td,
// .el-table--small th {
//   padding: 5px 0;
// }
</style>