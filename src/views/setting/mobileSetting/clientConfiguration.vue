<template>
  <div class="mobileSetting">
    <div class="title">
      <h3>
        <span @click="retpage" style="cursor: pointer;color:#6095d6">{{ $t("Mobile.mobileCllents") }}</span>
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{ $t("Mobile.clientConfig") }}</span>
      </h3>
      <div class="search" style="margin-top: -20px">
        <div class="but fl" >
          <ul class="tabs">
            <li
                :class="item.id === activeIndex ? 'active' : ''"
                v-for="(item) in tabsData"
                :key="item.id"
                @click="tabsEvent(item)"
            >{{item.name}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="devList" >
      <div class="operate">
        <div class="opSearch">
          <i>
            <img src="@/assets/newPage/icon_search@2x.png" alt />
          </i>
          <el-input :placeholder="searchTest"
                    size="small"
                    v-model="searchVal"
                    prefix-icon="el"
          ></el-input>
        </div>
        <div class="btns" style="float: left">
          <button style="height: 32px" class="add" @click="searchEvent">
            {{ $t("Mobile.search") }}
          </button>
        </div>
        <div class="btns" v-show="addShow">
          <button class="add" v-control @click="addInfo()">
            <img src="@/assets/newPage/icon_add@2x.png" alt />
            {{ $t("Mobile.add") }}
          </button>
        </div>
      </div>

      <el-table  v-show="tab1Show"  :data="clientData" style="width: 100%"   border stripe  size="small" tooltip-effect="dark" >
        <el-table-column  prop="name"     :label="$t('Mobile.connectionName')" align="center"  show-overflow-tooltip  :resizable="false"  ></el-table-column>
        <el-table-column  prop="description"     :label="$t('Mobile.description')" align="center" show-overflow-tooltip :resizable="false" ></el-table-column>
        <el-table-column  prop="ip"   :label="$t('Mobile.connectionIp')" align="center" show-overflow-tooltip :resizable="false" ></el-table-column>
        <el-table-column  prop="preference"   :label="$t('Mobile.connectionPreference')" align="center" :resizable="false" ></el-table-column>
        <el-table-column prop="createTime"  :label="$t('Mobile.addTime')" align="center" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column :label="$t('Mobile.operate')"  align="center"  :resizable="false" >
          <template slot-scope="scope">
            <el-button @click="connectionConfigClick(scope.row)" type="text" size="small" class="small" style="color: #3678c8; font-size: 14px; font-weight: 400"  v-control>{{ $t("Mobile.connectionConfiguration") }}</el-button>
            <el-button @click="handleClick(scope.row)" type="text" size="small"  style="color: #3678c8; font-size: 14px; font-weight: 400" v-control >{{ $t("Mobile.edit") }}</el-button>
            <el-button type="text" size="small"  :disabled="true" class="edit" style="color: #3678c8; font-size: 14px; font-weight: 400"  v-control>{{ $t("Mobile.delete") }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table  v-show="tab2Show"  :data="trustData" style="width: 100%"   border stripe  size="small" tooltip-effect="dark" >
        <el-table-column  prop="name"  :label="$t('Mobile.name')" align="center"  show-overflow-tooltip  :resizable="false"  ></el-table-column>
        <el-table-column  prop="description"   :label="$t('Mobile.description')" align="center" show-overflow-tooltip :resizable="false" ></el-table-column>
        <el-table-column prop="action"  :label="$t('Mobile.action')" align="center" show-overflow-tooltip :resizable="false" :formatter="formatAction"></el-table-column>
        <el-table-column prop="priority"  :label="$t('Mobile.priority')" align="center" :resizable="false" ></el-table-column>
        <el-table-column prop="sourceValue"  :label="$t('Mobile.sourceMatch')" align="center" :resizable="false" ></el-table-column>
        <el-table-column prop="destValue"  :label="$t('Mobile.destMatch')" align="center" :resizable="false" ></el-table-column>
        <el-table-column prop="appValue"  :label="$t('Mobile.appMatch')" align="center" :resizable="false" ></el-table-column>
        <el-table-column prop="reflexive"  :label="$t('Mobile.reflexive')" align="center" :resizable="false" ></el-table-column>

        <el-table-column :label="$t('Mobile.operate')"  align="center"  :resizable="false" >
          <template slot-scope="scope">
            <el-button @click="editTrust(scope.row)" type="text" size="small"  style="color: #3678c8; font-size: 14px; font-weight: 400" v-control >{{ $t("Mobile.edit") }}</el-button>
            <el-button type="text" size="small" @click="del(scope.row)"  style="color: #3678c8; font-size: 14px; font-weight: 400"  v-control>{{ $t("Mobile.delete") }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allItem"
          :page-size="10"
          @size-change="pageChange"
          @current-change="sizeChange"
          :current-page="page"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>

    <editConnection v-show="isShow2" ref="editConnection" />
    <addTrustPolicy v-show = "showTrust"  ref="addTrustPolicy" ></addTrustPolicy>
    <editTrustPolicy v-show = "showEditTrust"  ref="editTrustPolicy" ></editTrustPolicy>
  </div>
</template>
<script>
import editConnection from "./components/editConnection";
import addTrustPolicy from "./components/addTrustPolicy";
import editTrustPolicy from "./components/editTrustPolicy";
import {
  userInfo,delClientGroup,
  getClientConnectionList,
  getTrustPolicyList,trustPolicyDel
} from "@/services/index.js";
export default {
  props: {},
  components: {
    editConnection,
    addTrustPolicy,
    editTrustPolicy
  },
  data() {
    return {
      tabsData: [
        {
          name: this.$t('Mobile.connections'),
          id: 0
        },{
          name: this.$t('Mobile.trustPolicies'),
          id: 1
        }
      ],
      activeIndex: 0,
      tab1Show: true,
      tab2Show: false,
      showAddGroup:false,
      showEditGroup:false,
      searchVal: "",
      searchTest: this.$t('Mobile.connectionName'),
      trustData: [],
      clientData: [],
      index: 0,
      isShow: false,
      isShowT: false,
      isShow2: false,
      page: 1,
      pageSize: 10,
      allItem: 0,
      input: "",
      flag: false,
      file: {},
      repeatName: false,
      showSync: true,
      three: false,
      timer: null,
      tenantId: sessionStorage.getItem("tenantValue"),
      addShow: false,
      showTrust: false,
      showEditTrust: false,
      userId: "",
      queryData: {},
    };
  },
  computed: {
    otherData: function () {
      return {
        tenantId: sessionStorage.getItem("tenantValue"),
        vrfId: this.vlfName,
      };
    },
  },
  methods: {
    addInfo(){
        this.showTrust = true ;
        this.$refs.addTrustPolicy.dataInit("2",this.queryData.clientId,this.queryData.clientName,this.queryData.tenantId);
    },
    retpage(){
      // sessionStorage.setItem("deviceId", row.id);
      let params = {
        activeIndex:1
      };
      this.$router.push({
        path: "/base/app",
        query: { queryData: JSON.stringify(params) },
      });
    },
    tabsEvent(el) {
      this.activeIndex = el.id;
      this.favFlag = el.id === 0 ? false : true;
      this.page = 1;
      this.pageSize = 10;
      if(el.id === 0 ){
        this.tab1Show = true;
        this.tab2Show = false;
        this.addShow = false;
        this.searchTest = this.$t('Mobile.connectionName');
      }else{
        this.tab1Show = false;
        this.tab2Show = true;
        this.addShow = true;
        this.searchTest = this.$t('Mobile.name');
      }
      this.forSearchList();
    },
    pageChange(val) {
      //页数总条目改变
      // Total page entries change
      this.pageSize = val;

      this.forSearchList();
    },
    sizeChange(val) {
      //页数改变
      // Page number change
      // console.log(val)
      this.page = val;
      this.forSearchList();
    },
    searchEvent() {
      this.page = 1;
      this.pageSize = 10;
      this.forSearchList();
    },
    forSearchList(){
       if(this.tab1Show){
         this.clientConnectionList();
       }
       if(this.tab2Show){
         this.trustPolicyList();
       }
     },
    //编辑 组信息
    editTrust(row) {
      this.showEditTrust = true;
      this.$refs.editTrustPolicy.dataInit(row,this.queryData.clientName);
    },
    formatAction(row, column) {
      if (row.action == "0") {
        return "Deny";
      } else {
        return "Permit";
      }
    },
    connectionConfigClick(row){
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
        groupId: row.id,
        name: row.name,
        tenantId: this.tenantId
      };
      this.$router.push({
        path: "/mobileSet/connConfig",
        query: { queryData: JSON.stringify(params) },
      });
    },      // edit
    handleClick(row) {
      this.isShow2 = true;
      this.$refs.editConnection.dataInit(row);
    },
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
    del(row) {
      //单条删除
      var show107 = localStorage.getItem("show107");
      if (show107 == "true") {
        trustPolicyDel({ id: row.id }).then((res) => {
          if (res.code === 10000) {
            this.$message({
              message: this.$t("Mobile.hint1"),
              type: "success",
            });
            this.trustPolicyList();
          }
        });
      } else {
        this.$confirm(
          this.$t("vsr1000.remind[1]") +
            "<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue107\",this.checked)' type='checkbox'> " +
            this.$t("doNotShowThisAgain") +
            "</label></div>",
          {
            confirmButtonText: this.$t("vsr1000.OK"),
            cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning",
          }
        ).then(() => {
          trustPolicyDel({ id: row.id }).then((res) => {
            if (res.code === 10000) {
              this.$message({
                message: this.$t("Mobile.hint1"),
                type: "success",
              });
              this.trustPolicyList();
              localStorage.setItem("show107",localStorage.getItem("checkedValue107"));
            }
           });
        });
      }
    },
    delGroup(row) {
      //单条删除
      var show1071 = localStorage.getItem("show1071");
      if (show1071 == "true") {
        delClientGroup({
          id: row.id,
        }).then((res) => {
          if (res.code === 10000) {
            this.$message({
              message: this.$t("Mobile.hint1"),
              type: "success",
            });
            this.getClientGroupData({
              pageNumber: 1,
              pageSize: 10,
              tenantId: sessionStorage.getItem("tenantValue"),
              name: "",
              vrfId: this.vlfName,
            });
            this.page = 1;
          }
        });
      } else {
        this.$confirm(
            this.$t("vsr1000.remind[1]") +
            "<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue1071\",this.checked)' type='checkbox'> " +
            this.$t("doNotShowThisAgain") +
            "</label></div>",
            {
              confirmButtonText: this.$t("vsr1000.OK"),
              cancelButtonText: this.$t("vsr1000.cancel"),
              dangerouslyUseHTMLString: true,
              type: "warning",
            }
        ).then(() => {
          //原内容
          delClientGroup({
            id: row.id,
          }).then((res) => {
            if (res.code === 10000) {
              this.$message({
                message: this.$t("Mobile.hint1"),
                type: "success",
              });
              this.getClientGroupData({
                pageNumber: 1,
                pageSize: 10,
                tenantId: sessionStorage.getItem("tenantValue"),
                name: "",
                vrfId: this.vlfName,
              });
              this.page = 1;
              localStorage.setItem("show1071",localStorage.getItem("checkedValue1071"));
            }
          });
        });
      }
    },
    clientConnectionList(){
      let thisDate = new Date();
      //时区
      var datestring = thisDate.toString();

      //与UTC时间差
      var utcDate = datestring.split("GMT")[1];
      utcDate = utcDate.substring(0, 3);
      var utc = parseInt(utcDate);

      let params = {
        name: this.searchVal,
        pageNumber: this.page,
        pageSize: this.pageSize,
        clientId: this.queryData.clientId,
      };
      getClientConnectionList(params).then((res) => {
        if (res.code === 10000) {
          this.allItem = res.result.totalElements;
          this.clientData = res.result.content;

          this.clientData.forEach((item) => {
            var times = item.createTime;
            if (times) {
              var newDate = new Date(times);
              newDate.setHours(newDate.getHours() + utc);
              item.createTime = this.getTime(newDate);
            }
          });
        }
      });
    },
    trustPolicyList() {
      let params = {
        username: this.searchVal,
        pageNumber: this.page,
        pageSize: this.pageSize,
        clientId: this.queryData.clientId,
        type: "2"
      };
      getTrustPolicyList(params).then((res) => {
        if (res.code === 10000) {
          this.allItem = res.result.totalElements;
          this.trustData = res.result.content;
        }
      });
    }
  },
  created() {
    console.log("22222222222")
    this.queryData = JSON.parse(this.$route.query.queryData);
    if(this.tenantId != this.queryData.tenantId){
      let params = {
        activeIndex:1
      };
      this.$router.push({
        path: "/base/app",
        query: { queryData: JSON.stringify(params) },
      });
    }
    userInfo().then((res) => {
      this.userId = res.result.userId;
    });
    this.clientConnectionList();
  },
  mounted() {},
};
</script>
<style scoped lang="scss">
.tabs {
  padding-top: 21px;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  li:nth-of-type(1){
    &:hover {
      background: #3678c8;
      color: white
    }
  }
  li:nth-of-type(2){
    &:hover {
      color: white;
      background: #3678c8;
    }
  }
  // li:nth-of-type(3){
  //   width: 150px;
  //   &:hover {
  //     color: white;
  //     background: #3678c8;
  //   }
  // }
  li {
    float: left;
    width: 156px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    text-align: center;
    line-height: 34px;
    margin-right: 18px;
    transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
    cursor: pointer;
  }
  .active {
    background: #3678c8;
    color: #fff;
    border: none;
    &:hover {
      background: #6095d6;
      border: none;
    }
  }
}
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
  margin-top: 20px;
  background: #fff;
  padding: 20px 30px;
  overflow-x: hidden;
  overflow-y: auto;
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
        z-index: 9;
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
  font-family: arial, sans-serif;
}
</style>
