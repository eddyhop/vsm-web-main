<template>
  <div class="addressTranslation">
    <div class="operate">
      <div class="btns">
        <ul class="addressTranslationSetList">
          <li
            v-for="item in tabsData"
            :key="item.id"
            @click="tabEvent(item)"
            :class="{ active: item.id == activeIndex }"
          >
            {{ item.name }}
          </li>
        </ul>
        <div class="butInfo" v-if="tabShow">
          <button class="add" @click="addSourceNATShow = true" :class="!online?'add2':''" :disabled="!online" v-if="btn_show">
            <img src="@/assets/newPage/icon_add@2x.png" alt />
            {{ $t("subscription.add") }}
          </button>
        </div>
        <div class="butInfo" v-else>
          <button class="add" @click="add2()" :class="!online?'add2':''" :disabled="!online" v-if="btn_show_for">
            <img src="@/assets/newPage/icon_add@2x.png" alt />
            {{ $t("subscription.add") }}
          </button>
        </div>
      </div>
    </div>
    <div class="tableList" v-if="tabShow">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        size="small"
      >
        <el-table-column
          prop="name"
          :label="$t('subscription.addressTranslation.name')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="description"
          :label="$t('subscription.addressTranslation.description')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="type"
          :label="$t('subscription.addressTranslation.type')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="outInterfaceName"
          :label="$t('subscription.addressTranslation.egressLogicalInterface')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <!-- <el-table-column
          prop="outIp"
          :label="$t('subscription.addressTranslation.egressInterfaceAddress')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column> -->
        
        <el-table-column
          :label="$t('subscription.addressTranslation.operations')"
          align="center"
          width="200"
          :resizable="false"
        >
          <template slot-scope="scope">
            <el-button
              :class="!online?'notallowed':''"
              @click="edit1(scope.row)"
              :disabled="!online"
              type="text"
              size="small"
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              v-control
              >{{ $t("subscription.edit") }}</el-button
            >
            <el-button
              type="text"
              :class="!online?'notallowed':''"
              :disabled="!online"
              size="small"
              @click="del1(scope.row)"
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              v-control
              >{{ $t("subscription.delete") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <el-table
        :data="tableData1"
        border
        stripe
        style="width: 100%"
        size="small"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          prop="name"
          :label="$t('subscription.addressTranslation.name')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="description"
          :label="$t('subscription.addressTranslation.description')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="localIp"
          :label="$t('subscription.addressTranslation.internalIPAddress')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="locpalPort"
          :label="$t('subscription.addressTranslation.internalPort')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="protocolName"
          :label="$t('subscription.addressTranslation.protocol')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="snatName"
          :label="$t('subscription.addressTranslation.ingressLogicalInterface')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="outIp"
          :label="$t('subscription.addressTranslation.externalIPAddress')"
          show-overflow-tooltip
          :resizable="false"
        >0.0.0.0/0</el-table-column>
        <el-table-column
          prop="outPort"
          :label="$t('subscription.addressTranslation.externalPort')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          :label="$t('subscription.addressTranslation.operations')"
          align="center"
          width="200"
          :resizable="false"
        >
          <template slot-scope="scope">
            <el-button
              :class="!online?'notallowed':''"
              @click="edit2(scope.row)"
              :disabled="!online"
              type="text"
              size="small"
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              v-control
              >{{ $t("subscription.edit") }}</el-button
            >
            <el-button
              type="text"
              :class="!online?'notallowed':''"
              :disabled="!online"
              size="small"
              @click="del2(scope.row)"
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              v-control
              >{{ $t("subscription.delete") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allNum"
          :page-size="10"
          @size-change="pageChange"
          @current-change="sizeChange"
          :current-page="page"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addSourceNAT v-if="addSourceNATShow" />
    <editSourceNAT v-if="editSourceNATShow" />
    <addPortForwarding v-if="addPortForwardingShow" />
    <editPortForwarding  ref="editDNAT" v-show="editPortForwardingShow" />
  </div>
</template>
<script>
import addSourceNAT from "./components/addSourceNAT";
import editSourceNAT from "./components/editSourceNAT";
import addPortForwarding from "./components/addPortForwarding";
import editPortForwarding from "./components/editPortForwarding";
import {dnatGet, getSnatList, snatDel,dnatDel,getSnatPort,userInfo} from "@/services";
export default {
  data() {
    return {
      btn_show:true,
      btn_show_for:false,
      addPortForwardingShow: false,
      editPortForwardingShow: false,
      addSourceNATShow: false,
      editSourceNATShow: false,
      activeIndex: 0,
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      online: JSON.parse(this.$route.query.devData).online,
      location: JSON.parse(this.$route.query.devData).location,
      page: 1,
      pageSize: 10,
      allNum: 0,
      multipleSelection: [],
      tableData: [],
      tableData1: [],
      tabsData: [
        {
          name: this.$t("subscription.addressTranslation.sourceNAT"),
          id: 0,
        },
        {
          name: this.$t("subscription.addressTranslation.portForwarding"),
          id: 1,
        },
      ],
      tabShow: true,
      type: ""
    };
  },
  components: {
    addPortForwarding,
    editPortForwarding,
    editSourceNAT,
    addSourceNAT,
  },
  methods: {
    del1(row) {
      let params = {
        ids: [row.id],
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)) + "", //随机Id
        // Random Id
      };
      var show59 = localStorage.getItem("show59");
      if(show59 == 'true'){
          snatDel(params).then((res) => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr100.static.remind[4]"),
              });
              this.getSnat();
            }
          });
      }else{
        this.$confirm(this.$t("vsr100.static.remind[0]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue59\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("vsr100.confirm"),
          cancelButtonText: this.$t("vsr100.static.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning",
        })
        .then(() => {
          snatDel(params).then((res) => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr100.static.remind[4]"),
              });
              this.getSnat();
              localStorage.setItem("show59",localStorage.getItem("checkedValue59"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("vsr100.static.remind[1]"),
          });
        });
      }
      
    },
    add2(){
      if(!this.devCheckOnline()){
        return;
      }
      this.addPortForwardingShow = true;
    }
   ,
    del2(row) {
      if(!this.devCheckOnline()){
        return;
      }
      let params = { id: row.id };
      var show60 = localStorage.getItem("show60");
      if(show60 == 'true'){
        
          dnatDel(params).then((res) => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr100.static.remind[4]"),
              });
              this.dataInit();
            }
          });
      }else{
        this.$confirm(this.$t("vsr100.static.remind[0]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue60\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("vsr100.confirm"),
          cancelButtonText: this.$t("vsr100.static.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning",
        })
        .then(() => {
          dnatDel(params).then((res) => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr100.static.remind[4]"),
              });
              this.dataInit();
              localStorage.setItem("show60",localStorage.getItem("checkedValue60"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("vsr100.static.remind[1]"),
          });
        });
      }
      
      
    },
    async edit1() {
      // console.log(row);
      this.editSourceNATShow = true;

    },
    tabEvent(item) {
      this.activeIndex = item.id;
      this.tabShow = item.id === 0 ? true : false;
    },
    //页面条数改变
    // The number of page bars changed
    pageChange(val) {
      this.pageSize = val;
      this.page = 1;
    },
    //页数改变
    // Page number change
    sizeChange(val) {
      this.page = val;
    },
    //序号展示
    // The serial number display
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //多选
    // multi-select
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //编辑
    // edit
    edit2(row) {
      if(!this.devCheckOnline()){
        return;
      }
      this.editPortForwardingShow = true;
      this.$refs.editDNAT.dataInit(row);
    },
    //单项删除
    // Single delete
    remove() {},
    //多项删除
    // A number of deleted
    removeList() {},
    getSnat(){
      getSnatList({deviceId:this.deviceId}).then((res) => {
        if (res.code == 10000) {
          this.tableData = res.result;
          if(this.tableData.length > 0 ){
            this.btn_show = false;
            getSnatPort({logicalId:this.tableData[0].outInterfaceId}).then((res) => {
              if(res.code == 10000){
                this.btn_show_for = true ;
              }else{
                this.btn_show_for = false ;
              }
            });
          }else{
            this.btn_show = true;
            this.btn_show_for = false ;
          }
        }
      });
    },
    dataInit() {
      dnatGet({deviceId:this.deviceId}).then(res => {
        if (res.code === 10000) {
          this.allNum = res.result.totalElements;
          this.tableData1 = res.result.content;
        }
      });
    },
    devCheckOnline() {
      let  online = JSON.parse(this.$route.query.devData).online;
      if(!online){
        this.$message({
          type: "warning",
          message: this.$t("Configuration.EdgeConfiguration"),
        });
        return ;
      }
      return online;
      // return true;
    }
  },
  created() {
    this.deviceId = JSON.parse(this.$route.query.devData).deviceId;

    if (this.online) {
      userInfo().then((res) => {
        this.type = res.result.type;
        if (this.location == "NaaS Edge" && !(this.type == 1)) {
          this.online = false;
        }
      });
    }

    this.getSnat();
    this.dataInit();
  }
};
</script>
<style scoped lang="scss">
.addressTranslation {
  width: 100%;
  .addressTranslationSetList {
    float: left;
    padding-bottom: 20px;
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    li {
      float: left;
      height: 34px;
      text-align: center;
      line-height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      margin-right: 14px;
      cursor: pointer;
      padding: 0 12px;
    }
    .active {
      background: #3678c8;
      color: #fff;
      border: 1px solid #3678c8;
    }
    .active:hover {
      background: rgba(96, 149, 214, 1);
      border: 1px solid rgba(96, 149, 214, 1);
    }
    li:hover {
      background: #3678c8;
      color: #fff;
      border: 1px solid #3678c8;
    }
  }
}
.notallowed{
  cursor: not-allowed;
}
.operate {
  width: 100%;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
}
.btns {
  button {
    width: 100px;
    height: 34px;
    margin-left: 14px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    border: none;
    outline: none;
    text-align: center;
    line-height: 34px;
    cursor: pointer;
    display: table-cell;
    vertical-align: middle;
    img {
      width: 14px;
      height: 14px;
      position: relative;
      top: 1px;
    }
  }
  .butInfo {
    float: right;
  }
  .add {
    &:hover {
      background: rgba(96, 149, 214, 1);
    }
  }
    .add2 {
    &:hover {
      cursor: not-allowed;
      background: rgba(96, 149, 214, 1);
    }
  }
  .close {
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-left: 14px;
  }
}
</style>