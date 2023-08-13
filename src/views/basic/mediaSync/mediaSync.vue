<template>
  <!-- 设备同步 -->
  <!-- Device synchronization -->
  <div class="mediaSync">
    <div class="top">
      <div class="search">
        <h3>
          {{$t('DeviceMan.settings')}}
          <img src="@/assets/icon_right@2x.png" alt />
          <span>{{$t('DeviceMan.licenseManagemert')}}</span>
        </h3>
      </div>
      <dl class="devSelect">
        <dt>
          <!-- <div :class="`formItem ${lang=='en' ? 'formItemEn' : ''}`">
            <span class="lab-height">{{$t("DeviceMan.EquipmentType")}}</span>
            <el-select filterable
              v-model="formData.devType"
              @change="termDevInfo(formData.devType,'devType')"
              :placeholder="$t('Configuration.all')"
            >
              <el-option value :label="$t('DeviceMan.all')"></el-option>
              <el-option value="devNoName" :label="$t('DeviceMan.unnamed')"></el-option>
              <el-option value="0001" label="VSR1000"></el-option>
              <el-option value="0002" label="VSR100"></el-option>
              <el-option value="0003" label="VSR1100"></el-option>
              <el-option value="000106" label="ClOUD1000"></el-option>
              <el-option value="000206" label="ClOUD100"></el-option>
            </el-select>
          </div> -->
          <div :class="`formItem ${lang=='en' ? 'formItemEn' : ''}`">
            <span class="lab-height">{{$t('Configuration.devType')}}</span>
            <el-select filterable
              v-model="formData.devBelone"
              @change="termDevInfo(formData.devType,'devType')"
              :placeholder="$t('Configuration.all')"
            >
              <el-option value :label="$t('Configuration.all')"></el-option>
              <el-option value="Edge" label="Edge"></el-option>
              <el-option value="NaaS Edge" label="NaaS Edge"></el-option>
              <el-option value="Cloud Edge" label="Cloud Edge"></el-option>
            </el-select>
          </div>
          <div :class="`formItem ${lang=='en' ? 'formItemEn' : ''}`">
            <i>
              <img src="@/assets/newPage/icon_search@2x.png" alt />
            </i>
            <el-autocomplete
              class="inline-input"
              v-model="formData.searchVal"
              :fetch-suggestions="querySearch"
              :placeholder="$t('DeviceMan.devNameNumber')"
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
          <button :class="lang=='en'?'btnEn search':'search'" v-debounce="searchEvent" v-control>{{$t('Configuration.search')}}</button>
        </dd>
      </dl>
        <span style="float:right">Version: {{version}}</span>
    </div>
    <div class="devList">
      <div class="btn">
        <button :class="lang=='en'?'VSAbtnEn':''" v-debounce="vsrTb" v-control>{{$t('DeviceMan.sync')}}</button>
      </div>
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
          :label="$t('DeviceMan.type')"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="deviceLocation"
          :label="$t('DeviceMan.deviceType')"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('Configuration.operate')"
          align="center"
          :resizable="false"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="setTenant(scope.row)"
              :disabled="scope.row.tenantName!=null"
              style="color:#3678C8;font-size:14px;font-weight:400"
            >{{$t("DeviceMan.assignToATenant")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allNum"
          @size-change="litePage"
          @current-change="liteSize"
          :current-page="page"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <allotMediaSync ref="allotMediaSync" v-show="allocation" />
  </div>
</template>
<script>
import allotMediaSync from "./components/allotMediaSync";
import {
  deviceSelect,
  syncVsa,
  getDevInfo,
  getDevSerialName,
  verifyTheDevHaveConf,
  haveConfigurationDevices,
  vsmScreenSetFindOperation,
  tenantSelect,
  getVsmVersion
} from "@/services";
export default {
  data() {
    return {
      lang:sessionStorage.getItem("lang") || "en",
      allocation: false,
      allNum: 0,
      page: 1,
      pageSize: 10,
      formData: {
        devType: "",
        tenement: sessionStorage.getItem("tenantValue"),
        searchVal: "",
        devBelone: ""
      },
      headValue:undefined,
      version:"",
      tableData: [], //表格数据 tabular data
                     // Tabular data
      rentInfo: [], //租户数据 The tenant data
                    // Tenant Data The Tenant Data
      leveno: []
    };
  },
  components: {
    allotMediaSync
  },
  created() {
    this.getList();
    getVsmVersion().then(res =>{
      this.version = res;
    });
  },
  methods: {
    //序号展示
    // The serial number display
    //The serial number display
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    litePage(val) {
      //页数总条目改变
      // Total page entries change
      //Total page entries change
      this.pageSize = val;
      this.page = 1;
      this.getList();
    },
    liteSize(val) {
      //页数改变
      // Page number change
      //Page number change
      this.page = val;
      this.getList();
    },
    searchEvent(val) {
      this.page = 1
      this.getList();
    },
    termDevInfo(val) {
      this.page = 1
      this.getList();
    },
    //分配租户
    // Distribution of the tenant
    //Distribution of the tenant
    setTenant(row) {
      this.allocation = true;
      this.$refs.allotMediaSync.deviceId = row.id;
      this.$refs.allotMediaSync.deviceSerialNumber = row.deviceSerialNumber;
      this.$refs.allotMediaSync.deviceType = row.deviceType;
      this.$refs.allotMediaSync.deviceLocation = row.deviceLocation;
      this.$refs.allotMediaSync.tenantId = row.tenantId;
      this.$refs.allotMediaSync.tenantName = row.tenantName;
      tenantSelect().then(res => {
        this.$refs.allotMediaSync.tenantList = res.result;
      });
    },
    //获取设备列表信息
    // Gets device list information
    //Gets device list information
    async getList() {
      let params = {
        pageNumber: this.page,
        pageSize: this.pageSize,
        deviceType: this.formData.devType,
        deviceLocation: this.formData.devBelone,
        sort: "",
        order: "",
        // devNameRange: this.formData.devRange,
        searchKey: this.formData.searchVal,
        tenantId: ""
      };
      let getTable = await getDevInfo(params);
      if (getTable.result == null) {
        this.tableData = [];
        this.allNum = 0;
      } else {
        this.tableData = getTable.result.content;
        this.allNum = getTable.result.totalElements;
      }
      let getTenant = await tenantSelect();
      this.rentInfo = getTenant.result;
      
      let getNumber = await getDevSerialName({ tenantId: this.value });
      this.leveno = getNumber.result;
    },
    //模糊搜索
    // Fuzzy search
    //fuzzy search
    querySearch(queryString, cb) {
      var leveno = this.leveno;
      var results = leveno.filter(this.createFilter(queryString));
      // 调用 callback 返回建议列表的数据
      // A callback call returns the data for the list of suggestions
      cb(results);
    },
    createFilter(queryString) {
      return leveno => {
        return leveno.toLowerCase().indexOf(queryString.toLowerCase()) !== -1;
      };
    },
    //模糊搜索列表点击
    // Click on the fuzzy search list
    //Click on the fuzzy search list
    handleSelect(item) {
      this.formData.searchVal = item;
      // console.log(item);
    },
    vsrTb() {
      //vsr同步vsa
      // VSR synchronous vsa
      //VSR synchronous vsa
      var show7 = localStorage.getItem("show7");
      if(show7 == 'true') {
        syncVsa().then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("DeviceMan.hint11")
              });
              this.getList();
            } else {
              this.$message({
                type: "warning",
                message: this.$t("DeviceMan.hint12")
              });
            }
          });
      }else{
        this.$confirm(this.$t("DeviceMan.hint10")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue7\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("DeviceMan.ok"),
          cancelButtonText: this.$t("DeviceMan.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning"
        }).then(() => {
          syncVsa().then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("DeviceMan.hint11")
              });
              this.getList();
              localStorage.setItem("show7",localStorage.getItem("checkedValue7"));
            } else {
              this.$message({
                type: "warning",
                message: this.$t("DeviceMan.hint12")
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("DeviceMan.hint13")
          });
        });
      }
    }
  }
};
</script>
<style scoped lang='scss'>
.mediaSync {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  .el-button--small,
  .el-button--small.is-round {
    padding: 0px;
  }
}
.top {
  width: 100%;
  padding: 20px 30px 20px 30px;
  background: #fff;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
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
    .formItemEn{
      padding-right: 22px;
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
    .btnEn{
      width: 90px;
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
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
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
.btn {
  width: 100%;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  padding-bottom: 20px;
  button {
    float: right;
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    border: 0;
    outline: none;
    cursor: pointer;
  }
  .VSAbtnEn{
    width: 120px;
    height: 40px;
  }
  button:hover {
    background: rgba(96, 149, 214, 1);
  }
}
</style>
<style lang="scss">
.mediaSync .devSelect .el-input {
  width: 140px;
  height: 34px;
  .el-input__inner {
    height: 100%;
  }
  .el-input__icon {
    line-height: normal;
  }
}
.mediaSync .devSelect .formItem:last-of-type {
  .el-input {
    width: 242px;
    height: 34px;
    .el-input__inner {
      padding-left: 36px;
      height: 100%;
    }
  }
}
</style>