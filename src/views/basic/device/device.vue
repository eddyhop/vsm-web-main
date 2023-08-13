<template>
  <!--设备管理 -->
  <div class="shebei">
    <div class="search">
      <h3>
        {{$t('DeviceMan.vsnConfigurations')}}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{$t('DeviceMan.edgeConfigurations')}}</span>
      </h3>
      <div class="formList">
        <div :class="`opt ${lang=='en' ? 'optEn' : ''}`">
          <span class="lab-height">{{$t('DeviceMan.deviceType')}}</span>
          <el-select filterable
            v-model="formData.devType"
            :placeholder="$t('DeviceMan.all')"
            @change="search"
            size="small"
          >
            <el-option value :label="$t('DeviceMan.all')"></el-option>
            <el-option style="font-family: arial, sans-serif" value="Edge" label="Edge"></el-option>
            <el-option style="font-family: arial, sans-serif" value="NaaS Edge" label="NaaS Edge"></el-option>
            <el-option style="font-family: arial, sans-serif" value="Cloud Edge" label="Cloud Edge"></el-option>
          </el-select>
        </div>
        <div :class="`opt ${lang=='en' ? 'optEn' : ''}`" id="optt">
          <i>
            <img src="@/assets/newPage/icon_search@2x.png" alt />
          </i>
          <el-autocomplete
            class="inline-input"
            v-model="searchKey"
            prefix-icon="el"
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
        <div class="opt op-but">
          <button @click="query" :class="lang=='en'?'btnEn':''">{{$t('DeviceMan.search')}}</button>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="control">
        <!-- <button v-debounce="vsrTb" :id="lang=='en'?'ebtn':''" v-control>{{$t('DeviceMan.sync')}}</button> -->
      </div>
      <el-table :data="tableData" border style="width: 100%" size="small">
        <el-table-column
          prop="deviceName"
          :label="$t('DeviceMan.edgeName')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column prop="tenantName" :label="$t('DeviceMan.tenant')" align="center" :resizable="false" v-if="!tShow"></el-table-column>
        <el-table-column
          prop="deviceLocation"
          :label="$t('DeviceMan.edgeType')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="hardwareVersion"
          :label="$t('DeviceMan.version1')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="deviceSerialNumber"
          :label="$t('DeviceMan.edgeSerialNumber')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="memo"
          :label="$t('DeviceMan.location')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column :label="$t('DeviceMan.state')" show-overflow-tooltip :resizable="false">
          <template slot-scope="scope">
            <div class="bigBar-container">
              <div
                class="bigBar"
                :style="{width: '50%', backgroundColor: getBarColor(scope.row.upInformation) }"
              ><span class="statusValue">{{ scope.row.upInformation?$t('DeviceMan.online'):$t('DeviceMan.offline') }}</span></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('DeviceMan.operations')"
          align="center"
          width="200"
          :resizable="false"
        >
          <template slot-scope="scope">
            <button :disabled="type==1 && !tenantId"
              v-control
              class="edit"
              @click="setDevice(scope.$index, scope.row)"
            >{{lang == 'en' ? '' : $t('Monit.dev')}}{{$t('DeviceMan.edit')}}</button>


            <el-button :disabled="type==1 && !tenantId"
                       class="edit"
                       @click="goSetPage(scope.row)" >{{$t('Configuration.edgeConfig')}}</el-button>
            <el-dropdown
              @command="(val)=>handleCommand(val,scope.row)"
              trigger="click"
            >
              <el-button :disabled="type==1 && !tenantId"
                class="el-dropdown-link edit"
                style="color:#3678C8;font-size:14px;font-weight:400;cursor: pointer;"
                v-if="type==1"
              >{{$t("DeviceMan.more")}}</el-button>
              <el-dropdown-menu slot="dropdown" class="editList"  v-if="type==1">
                <el-dropdown-item
                  command="a"
                  v-show="scope.row.deviceType!='vsr1000' && scope.row.deviceType!='vsr100' && scope.row.deviceType!='vsr1100'"
                >{{$t("DeviceMan.register")}}</el-dropdown-item> <!-- 设备注册 -->
                <el-dropdown-item
                  command="e"
                  v-show="!scope.row.upInformation && !scope.row.activated && (scope.row.deviceType == 'vsr1000' || scope.row.deviceType == 'vsr100' || scope.row.deviceType == 'vsr1100')"
                >{{$t("DeviceMan.isoFileCreate")}}</el-dropdown-item>                
                <el-dropdown-item
                  command="b"
                  v-show="scope.row.deviceType == 'vsr1000' || scope.row.deviceType == 'vsr100' || scope.row.deviceType == 'vsr1100'"
                >{{$t('DeviceMan.clear')}}</el-dropdown-item>    <!-- 配置清空 -->
                <!-- <el-dropdown-item command="c">强制同步</el-dropdown-item> -->
                <el-dropdown-item
                  command="c"
                  v-show="scope.row.deviceType!='vsr1000' && scope.row.deviceType!='vsr100' && scope.row.deviceType!='vsr1100'"
                >{{$t("DeviceMan.writeOff")}}</el-dropdown-item>  <!-- 注销 -->
                <el-dropdown-item
                  command="d"
                  v-show="scope.row.deviceType == 'vsr1000' || scope.row.deviceType == 'vsr100' "
                >{{$t("DeviceMan.deviceReboot")}}</el-dropdown-item>  <!-- 设备重启  在后面加一个条件就可以显示   || scope.row.deviceType == 'vsr1100'-->
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="all"
          :page-size="10"
          @size-change="Page"
          @current-change="Size"
          :current-page="this.Number"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <createISO ref="iso" v-show="isoShow"></createISO>
    <editDevice ref="vsr" v-show="vsrShow"></editDevice>
    <clear ref="clear" v-show="clearShow"></clear>
    <cloneDevice ref="clone" v-show="cloneShow"></cloneDevice>
    <devMask v-show="isShow" :showMsg="showMsg" />
    <deviceSign ref="deviceSign" v-show="SignShow" />
  </div>
</template>
<script>
import createISO from "./components/createISO.vue"
import editDevice from "./components/deviceEdit";
import cloneDevice from "./components/clone";
import clear from "./components/clearConfig";
import deviceSign from "./components/deviceSign";
import devMask from "./components/devMask";
import {
  deviceSelect,
  syncVsa,
  getDevInfo,
  getDevSerialName,
  verifyTheDevHaveConf,
  vsmScreenSetFindOperation,
  sceneCheckTran,
  clearUpConfiguration, userInfo,
} from "@/services";
export default {
  data() {
    return {
      type: '',
      tenantId: sessionStorage.getItem("tenantValue"),
      cloneShow: false,
      clearShow: false,
      rentId: "",
      vsrShow: false,
      isoShow: false,
      flag: false,
      isShow: false,
      SignShow: false,
      showMsg: "",
      formData: {
        devType: "",
        devRange: "",
      },
     // user: sessionStorage.getItem("userData"),
      tableData: [],
      value: "",
      options: [],
      all: 0,
      listSize: 10,
      Number: 1,
      vsrInfo: [],
      liteInfo: [],
      searchKey: "",
      leveno: [],
      lang: sessionStorage.getItem("lang") || "en",
      tenantValue:undefined,
      tShow:false,
    };
  },
  created() {
    // if(sessionStorage.getItem("tenantValue")){
    //   this.tenantValue=sessionStorage.getItem("tenantValue");
    //   this.value=sessionStorage.getItem("tenantValue");
    // }
    userInfo().then(res => {
      this.type =  res.result.type;
    });


    let tenantId = sessionStorage.getItem("tenantValue");
    if(tenantId!=''){
      this.tShow = true;
    }
   // let type = JSON.parse(sessionStorage.getItem("userData")).type;
    this.value = sessionStorage.getItem("tenantValue");
    //this.flag = type === 2 ? true : false;
    this.getAllList();
    this.$nextTick(function () {
      //页面加载完成后执行
      // Execute after the page loads
      //Execute after the page loads
      let lang = sessionStorage.getItem("lang");
      let tag = document.getElementById("tenant");
      // let tag = document.getElementsByTagName('label')
      // let opt = Array.prototype.slice.call(tag)
      // console.log(tag)
      // console.log(opt[i])
      // if (lang == "en") {
        // opt[i].style.lineHeight = "16px"
        // tag.style.width = "80px";
      // } else {
        // opt[i].style.width = '108px'
      // }
    });
    this.getCitiesData();
  },
  methods: {
    getBarColor(value) {
      console.log(value)
      return value ? '#3DDC97' : '#E9190F'
    },
    clone(row) {
      let params = {
        devId: row.id,
        devType: row.deviceType == "VSR1000" ? "0001" : "0002",
      };
      this.$refs.clone.deviceType = row.deviceType;
      this.$refs.clone.targetDevId = row.id;
      this.$refs.clone.tenant = row.renantId;
      // console.log(row)
      verifyTheDevHaveConf(params).then((res) => {
        if (res.code == 10000 && row.tenantName != "") {
          let _this = this;
          async function cloneList() {
            let tenant = await deviceSelect().then((res) => {
              _this.$refs.clone.select = res.result;
              _this.$refs.clone.getTable();
            });
          }
          cloneList();
          this.cloneShow = true;
        } else if (row.tenantName == "") {
          this.$message({
            type: "warning",
            message: this.$t("DeviceMan.hint8"),
          });
        } else {
          this.$message({
            type: "warning",
            message: res.message,
          });
        }
      });
    },
    clear(row) {
      this.clearShow = true;
      this.$refs.clear.info = row;
    },
    async getAllList() {
      let getTable = await this.getList();
      let getTenant = await deviceSelect().then((res) => {
        this.options = res.result;
      });
      let Select = await getDevSerialName({ tenantId: this.value }).then(
        (res) => {
          this.leveno = res.result;
        }
      );
    },
    //表格序号
    // Form the serial number
    indexMethod(index) {
      return (
        index + 1 + (this.Number == 1 ? 0 : this.listSize * (this.Number - 1))
      );
    },
    //模糊搜索
    // Fuzzy search
    querySearch(queryString, cb) {
      var leveno = this.leveno;
      var results = leveno.filter(this.createFilter(queryString));
      // 调用 callback 返回建议列表的数据
      // A callback call returns the data for the list of suggestions
      cb(results);
    },
    createFilter(queryString) {
      return (leveno) => {
        return leveno.toLowerCase().indexOf(queryString.toLowerCase()) !== -1;
      };
    },
    //模糊搜索列表点击
    // Click on the fuzzy search list
    handleSelect(item) {
      this.searchKey = item;
    },
    query() {
      this.Number = 1;
      this.getList();
    },
    search() {
      this.searchKey = "";
      this.Number = 1;
      getDevSerialName({ tenantId: this.value }).then((res) => {
        this.leveno = res.result;
      });
      this.getList();
    },
    Page(val) {
      this.listSize = val;
      this.getList();
    },
    Size(val) {
      this.Number = val;
      this.getList();
    },
    getList() {
      let params = {
        pageNumber: this.Number,
        pageSize: this.listSize,
        deviceType: this.formData.devRange,
        deviceLocation: this.formData.devType,
        sort: "",
        order: "",
        searchKey: this.searchKey,
        tenantId: this.value,
      };
      getDevInfo(params).then((res) => {
        if (res.result == null) {
          this.tableData = [];
          this.all = 0;
        } else {
          this.tableData = res.result.content;
          this.all = res.result.totalElements;
        }
      });
    },
    vsrTb() {
      //vsr同步vsa
      // VSR synchronous vsa
      //VSR synchronous vsa
      var show4 = localStorage.getItem("show4");
      if(show4 == 'true') {
        syncVsa().then((res) => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("DeviceMan.hint11"),
              });
              this.getList();
            } else {
              this.$message({
                type: "warning",
                message: this.$t("DeviceMan.hint12"),
              });
            }
          });
      }else{
      this.$confirm(this.$t("DeviceMan.hint10")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue4\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
        confirmButtonText: this.$t("DeviceMan.ok"),
        cancelButtonText: this.$t("DeviceMan.cancel"),
        dangerouslyUseHTMLString: true,
        type: "warning",
      }).then(() => {
          syncVsa().then((res) => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("DeviceMan.hint11"),
              });
              this.getList();
              localStorage.setItem("show4",localStorage.getItem("checkedValue4"));
            } else {
              this.$message({
                type: "warning",
                message: this.$t("DeviceMan.hint12"),
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("DeviceMan.hint13"),
          });
        });
      }
    },
    getProtoclList() {
      deviceSelect().then((res) => {
        this.$refs.vsr.from.options = res.result;
      });
    },
    async setDevice(index, row) {
      // console.log(row);
      this.vsrShow = true;
      this.$refs.vsr.from.id = row.id;
      this.$refs.vsr.from.input = row.deviceName;
      this.$refs.vsr.devname = row.deviceName;
      this.$refs.vsr.from.value = row.tenantId;
      this.$refs.vsr.from.remark = row.memo;

      this.$refs.vsr.longitude = row.longitude;
      this.$refs.vsr.latitude = row.latitude;
      this.$refs.vsr.addressName =
        row.devAddrName == null ? "" : row.devAddrName;
      let addressArr =
        row.devAddrName == null ? ["", "", "", ""] : row.devAddrName.split("-");
      let addressCode =
        row.address == null ? ["", "", "", ""] : row.address.split("-");
      // console.log(addressCode,addressArr)
      this.$refs.vsr.from.country = addressArr[0];
      if (addressArr[1] && addressArr[2] && addressArr[3]) {
        let cityData = JSON.parse(sessionStorage.getItem("cityData"));
        this.$refs.vsr.from.province = addressCode[1];
        this.$refs.vsr.from.cities = addressCode[2];
        this.$refs.vsr.from.distinctVos = addressCode[3];
        this.$refs.vsr.cirtiesArr = cityData;
        this.$refs.vsr.cities = cityData.find(
          (item) => item.code == addressCode[1]
        ).cityList;
        this.$refs.vsr.distinctVos = cityData
          .find((item) => item.code == addressCode[1])
          .cityList.find((item) => item.code == addressCode[2]).distinctVos;
        this.$refs.vsr.isCitiesChange = false;
      }
      let protocol = await this.getProtoclList();
    },
    //获取城市数据
    // Access to city data
    //Access to city data
    getCitiesData() {
      vsmScreenSetFindOperation({
        findFromFile: true,
        regionCode: 100000,
      }).then((res) => {
        if (res.code === 10000) {
          sessionStorage.setItem(
            "cityData",
            JSON.stringify(res.result.provinceList)
          );
        }
      });
    },
    //点击更多的回调
    // Click on more callbacks
    handleCommand(val, row) {
      switch (val) {
        case "a":
          this.register(row);
          break;
        case "b":
          this.clear(row);
          break;
        case "c":
          this.logout(row);
          break;
        case "d":
          this.isShow = true;
          sessionStorage.setItem("deviceId", row.id);
          this.showMsg = this.$t("Configuration.reset");
          break;
        case "e":
          this.isoShow = true;
          this.$refs.iso.from.vmName = row.deviceName;
          this.$refs.iso.from.deviceSeries = row.deviceSerialNumber;
          break;
        default:
          break;
      }
    },
    //跳转设备配置页面
    // Jump to the device configuration page
    //Jump to the device configuration page
    goSetPage(row) {
     /* if(!row.upInformation){
        this.$message({
          type: "warning",
          message: this.$t("Configuration.EdgeConfiguration"),
        });
        return ;
      }*/
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
      
      // sessionStorage.setItem("deviceId", row.id);
      let params = {
        deviceId: row.id,
        deviceType: row.deviceType,
        deviceName: row.deviceName,
        vsrSeries: row.deviceSerialNumber,
        tenantId: row.tenantId,
        online: row.upInformation,
        location: row.memo,
      };
      this.$router.push({
        path: "/devSet/allocation",
        query: { devData: JSON.stringify(params) },
      });
    },
    //设备注册
    // Equipment registration
    //Equipment registration
    register(row) {
      if (!row.cloudBind) {
        this.SignShow = true;
        this.$refs.deviceSign.dataInit(row);
      } else {
        this.$message({
          type: "warning",
          message: this.$t("DeviceMan.hint16"),
        });
      }
    },
    //注销
    // The cancellation
    //write off
    logout(row) {
      var show5 = localStorage.getItem("show5");
      if(show5 == 'true') {
        sceneCheckTran({
            deviceId: row.id,
            type:
              row.deviceType == "vsr1000" || row.deviceType == "Cloud-vsr1000"
                ? 1
                : 0,
          }).then((res) => {
            if (res.result) {
              clearUpConfiguration({ deviceId: row.id }).then((res) => {
                if (res.code === 10000) {
                  this.$message({
                    type: "success",
                    message: this.$t("DeviceMan.msg2"),
                  });
                  this.getList();
                } else {
                  this.$message({
                    type: "warning",
                    message: res.message,
                  });
                }
              });
            } else {
              this.$message({
                type: "warning",
                message: this.$t("netWork.msg6"),
              });
            }
          });
      }else{
        this.$confirm(this.$t("DeviceMan.msg1")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue5\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning",
        })
        .then(() => {
          sceneCheckTran({
            deviceId: row.id,
            type:
              row.deviceType == "vsr1000" || row.deviceType == "Cloud-vsr1000"
                ? 1
                : 0,
          }).then((res) => {
            if (res.result) {
              clearUpConfiguration({ deviceId: row.id }).then((res) => {
                if (res.code === 10000) {
                  this.$message({
                    type: "success",
                    message: this.$t("DeviceMan.msg2"),
                  });
                  this.getList();
                  localStorage.setItem("show5",localStorage.getItem("checkedValue5"));
                } else {
                  this.$message({
                    type: "warning",
                    message: res.message,
                  });
                }
              });
            } else {
              this.$message({
                type: "warning",
                message: this.$t("netWork.msg6"),
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("vsr1000.closeDel"),
          });
        });
      }
    },
  },
  components: { createISO, editDevice, cloneDevice, clear, deviceSign, devMask },
};
</script>
<style lang="scss">
#ebtn {
  width: 200px;
}
#height {
  // line-height: 16px;
}
.opt {
  .el-input__inner {
    height: 34px;
  }
  .el-input--small .el-input__inner {
    height: 34px;
  }
}
.shebei .formList {
  .el-input,
  .el-select {
    width: 140px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  #optt {
    .el-input,
    .el-select {
      width: 100%;
      height: 34px;
    }
  }
}
.shebei {
  .el-dropdown span {
    padding: 1px 6px;
  }
}

.greenClass {
  background: #edfced;
}
.redClass {
  background: #fae6e6;
}
</style>
<style lang="scss" scoped>
#optt {
  div {
    width: 240px;
  }
}
.noInfo {
  font-size: 16px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  span {
    color: #3678c8;
  }
}
.shebei {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  background: #eaeef4;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  .search {
    width: 100%;
    height: 116px;
    background: white;
    padding: 20px 30px;
    position: relative;
    border-radius: 7px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
    button {
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: white;
      border: none;
      background: none;
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
    }
    .btnEn {
      width: 90px;
    }
    .opt {
      display: flex;
      margin-top: 20px;
      padding-right: 30px;
      span {
        margin-right: 10px;
        line-height: 34px;
      }
    }
    .optEn {
      padding-right: 22px;
      font-family: arial, sans-serif;
    }
    .op-but {
      justify-content: flex-end;
      padding-right: 0;
    }
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
  .formList {
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
    }
  }
  .content::-webkit-scrollbar {
    width: 4px;
    /*height: 4px;*/
  }
  .content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .content::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .content {
    flex: 1;
    background: white;
    margin-top: 20px;
    padding: 20px 30px;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 7px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
    .control {
      width: 100%;
      text-align: right;
      margin-bottom: 20px;
      button {
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: white;
        border: none;
        background: none;
        width: 100px;
        height: 34px;
        padding: 0px;
        background: rgba(54, 120, 200, 1);
        border-radius: 7px;
      }
      button:hover {
        background: rgba(96, 149, 214, 1);
      }
    }
    .edit {
      height: 20px;
      border: none;
      background: none;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(54, 120, 200, 1);
      cursor: pointer;
      // float: left;
    }
    .edit[disabled='disabled'],.edit[disabled='true']{
      color: #999999 !important;
    }
    .editIdev {
      height: 20px;
      border: none;
      background: none;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(54, 120, 200, 1);
      cursor: pointer;
      // float: left;
    }
  }

  .page {
    width: 100%;
    text-align: center;
    margin-top: 12px;
  }
}
.opt {
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
.statusValue {
  color:#efefef
}
.editList {
  li {
    padding: 0 17px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  li:hover {
    background: #fff;
    color: #3678c8;
  }
}

</style>
