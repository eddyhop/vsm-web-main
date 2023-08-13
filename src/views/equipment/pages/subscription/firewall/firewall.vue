<template>
  <div class="firewall">
    <div class="operate" style="margin-bottom:20px">
      <div class="btns">
        
        <div class="butInfo" v-if="tabShow">
          <button class="add" @click="add()" :class="!online?'add2':''" :disabled="!online">
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
          :label="$t('subscription.firewall.name')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="description"
          :label="$t('subscription.firewall.description')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="interfaceName"
          :label="$t('subscription.firewall.interface')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="directionVal"
          :label="$t('subscription.firewall.direction')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="appName"
          :label="$t('subscription.firewall.application')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="appGroupName"
          :label="$t('subscription.firewall.applicationGroup')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="actionName"
          :label="$t('subscription.firewall.action')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="priority"
          :label="$t('subscription.firewall.prioruty')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        
        <el-table-column
          :label="$t('subscription.firewall.operations')"
          align="center"
          width="200"
          :resizable="false"
        >
          <template slot-scope="scope">
            <el-button
              @click="edit1(scope.row)"
              :class="!online?'notallowed':''"
              :disabled="!online"
              type="text"
              size="small"
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              v-control
              >{{ $t("subscription.edit") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              :class="!online?'notallowed':''"
              :disabled="!online"
              @click="del1(scope.row)"
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
    <addfirewall v-if="addfirewallShow" />
    <editfirewall ref="editfirewall" v-show="editfirewallShow" />
  </div>
</template>
<script>
import addfirewall from "./components/addfirewall";
import editfirewall from "./components/editfirewall";
import {GetFirewalldList, firewalldDel,userInfo} from "@/services";
export default {
  data() {
    return {
      addfirewallShow: false,
      editfirewallShow: false,
      activeIndex: 0,
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      online: JSON.parse(this.$route.query.devData).online,
      location: JSON.parse(this.$route.query.devData).location,
      page: 1,
      pageSize: 10,
      allNum: 0,
      multipleSelection: [],
      tableData: [],
      tabShow: true,
      actionList:[],
      protoList:[],
      type:""
    };
  },
  components: {
    editfirewall,
    addfirewall,
  },
  methods: {
    add(){
      if(!this.devCheckOnline()){
        return;
      }
      this.addfirewallShow = true;
    },
    del1(row) {
      if(!this.devCheckOnline()){
        return;
      }
      let params = {
        ids: [row.id],
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)) + "", //随机Id
        // Random Id
      };
      var show63 = localStorage.getItem("show63");
      if(show63 == 'true'){
        
            firewalldDel(params).then((res) => {
              if (res.code == 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr100.static.remind[4]"),
                });
                let params = {
                  deviceId: this.deviceId,
                  pageNumber: this.page,
                  pageSize: this.pageSize
                };
                this.dataInit(params);
              }
            });
      }else{
        this.$confirm(this.$t("vsr100.static.remind[0]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue63\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("vsr100.confirm"),
          cancelButtonText: this.$t("vsr100.static.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning",
        })
          .then(() => {
            firewalldDel(params).then((res) => {
              if (res.code == 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr100.static.remind[4]"),
                });
                let params = {
                  deviceId: this.deviceId,
                  pageNumber: this.page,
                  pageSize: this.pageSize
                };
                this.dataInit(params);
                localStorage.setItem("show63",localStorage.getItem("checkedValue63"));
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
     edit1(row) {
       if(!this.devCheckOnline()){
         return;
       }
       this.editfirewallShow = true;
       this.$refs.editfirewall.intiDate(row);
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
    async dataInit(params) {
      let tableData = await GetFirewalldList(params)
      if(tableData.code===10000){
        this.allNum = tableData.result.totalElements;
        this.tableData = tableData.result.content;

      }
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
    let params = {
      deviceId: this.deviceId,
      pageNumber: this.page,
      pageSize: this.pageSize
    };

    if (this.online) {
      userInfo().then((res) => {
        this.type = res.result.type;
        if (this.location == "NaaS Edge" && !(this.type == 1)) {
          this.online = false;
        }
      });
    }
    this.dataInit(params);
  }
};
</script>
<style scoped lang="scss">
.firewall {
  width: 100%;
  .firewallSetList {
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