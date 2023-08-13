<template>
  <div class="mobileSetting">
    <div class="title">
      <h3>
        <span @click="retpage" style="cursor: pointer;color:#6095d6">{{ $t("Mobile.mobileCllents") }}</span>
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{ $t("Traffic.connectionConfiguration") }}</span>
      </h3>
      <div class="search" style="margin-top: -20px">
        <div class="but fl" >
          <ul class="tabs">
            <li
                :class="item.id === activeIndex ? 'active' : ''"
                v-for="(item) in tabsData"
                :key="item.id"
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
        <div class="btns" >
          <button class="add" v-control @click="addInfo()">
            <img src="@/assets/newPage/icon_add@2x.png" alt />
            {{ $t("Mobile.add") }}
          </button>
        </div>
      </div>
      <el-table :data="trafficLimitersData" style="width: 100%"   border stripe  size="small" tooltip-effect="dark" >
        <el-table-column prop="name"  :label="$t('Mobile.name')" align="center"  show-overflow-tooltip  :resizable="false"  ></el-table-column>
        <el-table-column prop="description"   :label="$t('Mobile.description')" align="center" show-overflow-tooltip :resizable="false" ></el-table-column>
        <el-table-column :label="$t('Traffic.uploadBandwidth')" align="center" show-overflow-tooltip :resizable="false">
          <template slot-scope="scope">
            {{ getUploadRate(scope.row.trafficProfileId) }}
          </template>          
        </el-table-column>
        <el-table-column :label="$t('Traffic.downloadBandwidth')" align="center" :resizable="false" >
          <template slot-scope="scope">
            {{ getDownloadRate(scope.row.trafficProfileId) }}
          </template>
        </el-table-column>
        <el-table-column prop="priority"  :label="$t('Mobile.priority')" align="center" :resizable="false" ></el-table-column>
        <el-table-column prop="destMatch"  :label="$t('Traffic.applicationMatch')" align="center" :resizable="false" ></el-table-column>
        <el-table-column :label="$t('Traffic.applicationName')" align="center" :resizable="false" >
          <template slot-scope="scope">
            {{ getAppName(scope.row.appName) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Mobile.operate')"  align="center"  :resizable="false" >
          <template slot-scope="scope">
            <el-button @click="editLimiter(scope.row)" type="text" size="small"  style="color: #3678c8; font-size: 14px; font-weight: 400" v-control >{{ $t("Mobile.edit") }}</el-button>
            <el-button type="text" size="small" @click="deleteLimiter(scope.row)"  style="color: #3678c8; font-size: 14px; font-weight: 400"  v-control>{{ $t("Mobile.delete") }}</el-button>
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
    <addTrafficLimiter v-show = "showAddTrafficLimiter"  ref="addTrafficLimiter" ></addTrafficLimiter>
    <editTrafficLimiter v-show = "showEditTrafficLimiter"  ref="editTrafficLimiter" ></editTrafficLimiter>
  </div>
</template>
<script>
import addTrafficLimiter from "./components/addTrafficLimiter";
import editTrafficLimiter from "./components/editTrafficLimiter";
import {
  userInfo,deleteTrafficLimiter,
  getTrafficLimiters, getTrafficProfiles,
  selectOptionsTrafficLimiters
} from "@/services/index.js";
export default {
  props: {},
  components: {
    addTrafficLimiter,
    editTrafficLimiter
  },
  data() {
    return {
      tabsData: [
        {
          name: this.$t('Traffic.trafficLimiters'),
          id: 1
        }        
      ],
      activeIndex: 1,
      tab1Show: true,
      showAddGroup:false,
      showEditGroup:false,
      searchVal: "",
      searchTest: this.$t('Traffic.trafficLimiter'),
      trustData: [],
      trafficLimitersData: [],
      trafficProfilesData: [],
      applist:[],
      clientList:[],
      clientGroupList:[],
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
      showAddTrafficLimiter: false,
      showEditTrafficLimiter: false,
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
      this.showAddTrafficLimiter = true;
      this.$refs.addTrafficLimiter.dataInit(this.queryData.tenantId, this.queryData.name);
      this.$refs.addTrafficLimiter.profileList=this.trafficProfilesData;
      this.$refs.addTrafficLimiter.clientId=this.queryData.groupId;
      this.$refs.addTrafficLimiter.type="2";
    },
    retpage(){
      // sessionStorage.setItem("deviceId", row.id);
      let params = {
        activeIndex:0
      };
      this.$router.push({
        path: "/base/app",
        query: { queryData: JSON.stringify(params) },
      });
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
      this.trafficLimitersList();
    },
    formatAction(row, column){
      if(row.action == "0"){
        return "Deny";
      }else{
        return "Permit";
      }
    },
    getUploadRate(profileId) {
      var matchingProfile = this.trafficProfilesData.find(x => x.id === profileId);
      return matchingProfile.uploadUnlimited ? "Unlimited" : matchingProfile.uploadRate;
    },
    getDownloadRate(profileId) {
      var matchingProfile = this.trafficProfilesData.find(x => x.id === profileId);
      return matchingProfile.downloadUnlimited ? "Unlimited" : matchingProfile.downloadRate;
    },
    getAppName(appId) {
      return this.applist.find(x => x.id === appId).name;
    },
    editLimiter(row) {
      this.showEditTrafficLimiter = true;
      this.$refs.editTrafficLimiter.clientId=this.queryData.groupId;
      this.$refs.editTrafficLimiter.type="2";
      this.$refs.editTrafficLimiter.profileList=this.trafficProfilesData;
      this.$refs.editTrafficLimiter.applist=this.applist;
      this.$refs.editTrafficLimiter.clientList=this.clientList;
      this.$refs.editTrafficLimiter.clientGroupList=this.clientGroupList;
      this.$refs.editTrafficLimiter.dataInitForEdit(row, this.queryData.name);
    },
    deleteLimiter(row) {
      //单条删除
      var show107 = localStorage.getItem("show107");
      if (show107 == "true") {
        deleteTrafficLimiter(row.id).then((res) => {
          if (res.code === 10000) {
            this.$message({
              message: this.$t("Mobile.hint1"),
              type: "success",
            });
            this.trafficLimitersList();
            this.page = 1;
          }
        });
      } else {
        this.$confirm(
          this.$t("Mobile.areYouSure") +
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
          deleteTrafficLimiter(row.id).then((res) => {
            if (res.code === 10000) {
              this.$message({
                message: this.$t("Mobile.hint1"),
                type: "success",
              });
              this.trafficLimitersList();
              this.page = 1;
              localStorage.setItem("show107",localStorage.getItem("checkedValue107"));
            }
          });
        });
      }
    },    
    trafficLimitersList() {
      let params = {
        name: this.searchVal,
        pageNumber: this.page,
        pageSize: this.pageSize,
        type: "2",
        tenantId: sessionStorage.getItem("tenantValue"),
        clientId: this.queryData.groupId
      };
      getTrafficLimiters(params).then((res) => {
        if (res.code === 10000) {
          this.allItem = res.result.totalElements;
          this.trafficLimitersData = res.result.content;
          getTrafficProfiles({
                    pageNumber: 1,
                    pageSize: 10,
                    name: "",
                    tenantId: this.queryData.tenantId
                  }).then((retVal) => {
                   if(retVal.code === 10000) {
                    this.trafficProfilesData = retVal.result.content;
                   } 
                  })
        
        }
      });
      selectOptionsTrafficLimiters({tenantId:this.queryData.tenantId}).then((res)=>{
        if (res.code === 10000) {
          this.applist =  res.result.app;
          this.clientList = res.result.client;
          this.clientGroupList = res.result.clientGroup;
        }
      });
    }
  },
  created() {
    this.queryData = JSON.parse(this.$route.query.queryData);
    if(this.tenantId != this.queryData.tenantId){
      let params = {
        activeIndex:0
      };
      this.$router.push({
        path: "/base/app",
        query: { queryData: JSON.stringify(params) },
      });
    }
    userInfo().then((res) => {
      this.userId = res.result.userId;
    });
    this.trafficLimitersList();
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
}
</style>
