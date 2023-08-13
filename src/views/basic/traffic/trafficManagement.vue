<template>
  <div class="mobileSetting">
    <div class="title">
      <h3>
        {{ $t("Mobile.vsnConfigurations") }}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{ $t("Traffic.trafficManagementTitle") }}</span>
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
    <div class="devList" v-show="!isShowT">
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
            {{ $t("Traffic.addTrafficProfile") }}
          </button>
        </div>
      </div>

      <el-table  v-show="tab1Show"  :data="tableDataG" style="width: 100%"   border stripe  size="small" tooltip-effect="dark" >
        <el-table-column prop="name"     :label="$t('Mobile.name')" align="center"  show-overflow-tooltip  :resizable="false"  ></el-table-column>
        <el-table-column prop="description"     :label="$t('Mobile.description')" align="center" show-overflow-tooltip :resizable="false" ></el-table-column>
        <el-table-column :label="$t('Traffic.uploadRate')" align="center" :resizable="false" >
          <template slot-scope="scope">
            {{ scope.row.uploadUnlimited?$t('Traffic.unlimited'):scope.row.uploadRate }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Traffic.downloadRate')" align="center" :resizable="false" >
          <template slot-scope="scope">
            {{ scope.row.downloadUnlimited?$t('Traffic.unlimited'):scope.row.downloadRate }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Mobile.operate')"  align="center"  :resizable="false" v-if="addShow" >
          <template slot-scope="scope">
            <el-button @click="editProfile(scope.row)" type="text" size="small"  style="color: #3678c8; font-size: 14px; font-weight: 400" v-control >{{ $t("Mobile.edit") }}</el-button>
            <el-button type="text" size="small" @click="deleteProfile(scope.row)"  style="color: #3678c8; font-size: 14px; font-weight: 400"  v-control>{{ $t("Mobile.delete") }}</el-button>
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
    <addTrafficProfile v-show="showAddTrafficProfile" ref="addTrafficProfile"></addTrafficProfile>
    <editTrafficProfile v-show="showEditTrafficProfile" ref="editTrafficProfile"></editTrafficProfile>
  </div>
</template>
<script>
import addTrafficProfile from "./components/addTrafficProfile";
import editTrafficProfile from "./components/editTrafficProfile";
import {
  deleteTrafficProfile,
  userInfo,getTrafficProfiles
} from "@/services/index.js";
export default {
  props: {},
  components: {
    addTrafficProfile,
    editTrafficProfile
  },
  data() {
    return {
      tabsData: [
        {
          name: this.$t('Traffic.trafficProfiles'),
          id: 0
        }
      ],
      activeIndex: 0,
      tab1Show: true,
      showAddTrafficProfile:false,
      showEditTrafficProfile:false,
      searchVal: "",
      searchTest: this.$t('Traffic.searchText'),
      restaurants: [],
      tableData: [],
      tableDataG: [],
      index: 0,
      isShow: false,
      isShowT: false,
      isShow2: false,
      vlfName: "",
      vlfList: [],
      vlfPage: 1,
      vlfPageSize: 20,
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
      userId: "",
      queryData:{},
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
      if(this.tab1Show){
        this.showAddTrafficProfile = true ;
      }
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
      let params = {
        name: this.searchVal,
        pageNumber: this.page,
        pageSize: this.pageSize,
        tenantId: this.tenantId
      };
      this.getClientGroupData(params);
    },
    editProfile(row) {
      this.showEditTrafficProfile = true;
      this.$refs.editTrafficProfile.dataInit(row);
    },
    //上拉加载租户路由域
    // Pull up and load the tenant routing domain
    load() {},
    deleteProfile(row) {
      //单条删除
      var show107 = localStorage.getItem("show107");
      if (show107 == "true") {
        deleteTrafficProfile(row.id).then((res) => {
          if (res.code === 10000) {
            this.$message({
              message: this.$t("Mobile.hint1"),
              type: "success",
            });
            let params = {
              name: this.searchVal,
              pageNumber: this.page,
              pageSize: this.pageSize,
              tenantId: this.tenantId
            };
            this.getClientGroupData(params);
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
          deleteTrafficProfile(row.id).then((res) => {
            if (res.code === 10000) {
              this.$message({
                message: this.$t("Mobile.hint1"),
                type: "success",
              });
              let params = {
                name: this.searchVal,
                pageNumber: this.page,
                pageSize: this.pageSize,
                tenantId: this.tenantId
              };
              this.getClientGroupData(params);
              this.page = 1;
              localStorage.setItem("show107",localStorage.getItem("checkedValue107"));
            }
          });
        });
      }
    },
    getClientGroupData(params){
      getTrafficProfiles(params).then((res) => {
        if (res.code === 10000) {
          this.allItem = res.result.totalElements;
          this.tableDataG = res.result.content;
        }
      });
    }
  },
  created() {
    userInfo().then((res) => {
      this.userId = res.result.userId;
      let tenantId = sessionStorage.getItem("tenantValue");
      if(tenantId!=''){
        this.showSync = true;
      }else{
        this.showSync = false;
      }
    });

    if (this.tenantId) {
      this.addShow = true;
    }
    if(this.$route.query.queryData!=null){
      this.queryData = JSON.parse(this.$route.query.queryData);
      this.activeIndex = this.queryData.activeIndex;
    }
    if(this.activeIndex == 0){
      this.tab1Show = true;
    }else{
      this.tab1Show = false;
    }
    this.forSearchList();

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
  padding-left: 20px;
}
.title {
  width: 100%;
  background: white;
  padding: 20px 30px;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
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
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
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
        };
        width: 170px;
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
    font-family: Arial, Helvetica, sans-serif;
  }
}
.inline-input .el-input__inner {
  padding-left: 34px;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
