<template>
  <div class="yinyon">
    <div class="search">
      <h3>
        {{$t('App.vsnConfigurations')}}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{$t('App.app')}}</span>
      </h3>
      <div class="control">

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
        <div class="but fr" v-if="tenantId!='All'">
          <ul class="tabs">
            <li id="favorite" v-show="activeIndex==0" @click="add" class="active"  style="width: 150px;">
              <img src="@/assets/newPage/icon_add@2x.png" alt class="imgs" /> {{$t('App.addApplication')}}
            </li>
            <li id="favorite" v-show="activeIndex==1" @click="addG" class="active" style="width: 190px;" >
              <img src="@/assets/newPage/icon_add@2x.png" alt class="imgs" /> {{$t('App.addApplicationGroup')}}
            </li>
          </ul>

        </div>
      </div>
    </div>
    <div class="content">
      <div class="formList">
        <div class="opt">
          <div class="limit">
            <i>
              <img src="@/assets/newPage/icon_search@2x.png" alt />
            </i>
            <el-input v-show="tab1Show"
                :placeholder="$t('App.appName')"
                size="small"
                v-model="input2"
                prefix-icon="el"
            ></el-input>
            <el-input v-show="tab2Show"
                      :placeholder="$t('App.appGroupName')"
                      size="small"
                      v-model="input3"
                      prefix-icon="el"
            ></el-input>
          </div>
        </div>
        <div class="opt op-but">
          <button v-debounce="query">{{$t('App.search')}}</button>
        </div>
      </div>

      <el-table
        v-show="tab1Show"
        ref="multipleTable"
        :data="tableData"
        border
        stripe
        size="small"
        tooltip-effect="dark"
        style="width: 100%"
      >

        <el-table-column prop="appName" :label="$t('App.name')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="appDescription" :label="$t('App.description')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="groupName" :label="$t('App.applicationGroups')" show-overflow-tooltip :resizable="false"> </el-table-column>
        <el-table-column prop="appPriority" :label="$t('App.applicationPriority')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="marchingCriteria" :label="$t('App.marchingCriteria')" show-overflow-tooltip :resizable="false">ACL</el-table-column>

        <el-table-column :label="$t('App.operations')" :resizable="false">
          <template slot-scope="scope">
            <button class="edit" @click="edit(scope.row)" v-control>{{$t('App.edit')}}</button>
            <button class="edit" @click="del(scope.$index,scope.row)" v-control>{{$t('App.del')}}</button>
            <!-- <button class="edit" @click="copy(scope.row)" v-control>{{$t('App.copy')}}</button> -->
          </template>
        </el-table-column>
      </el-table>

      <el-table
          v-show="tab2Show"
          ref="multipleTableG"
          :data="tableDataG"
          border
          stripe
          size="small"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange" >

        <el-table-column prop="groupName" :label="$t('App.name')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="groupDesc" :label="$t('App.description')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column :label="$t('App.operations')" :resizable="false">
          <template slot-scope="scope">
            <button class="edit" @click="editGroupApp(scope.row)" v-control>{{$t('App.edit')}}</button>
            <button :class="{'noen':scope.row.id == '488147776358584320' || scope.row.groupName=='Default Application group'}" :disabled="scope.row.id == '488147776358584320' || scope.row.groupName=='Default Application group'" class="edit" @click="delGroup(scope.row)" v-control>{{$t('App.del')}}</button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allItem"
          :page-size="10"
          @size-change="changeSize"
          @current-change="changePage"
          :current-page="this.num"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addG ref="addG" v-show="addGShow"></addG>
    <editG ref="editG" v-show="editGShow" ></editG>
    <addGroup ref="addGroup" v-show="addGroupShow" ></addGroup>
    <editGroup ref="editGroup" v-show="editGroupShow" ></editGroup>
  </div>
</template>
<script>
import addG from "./addG";
import editG from "./editG";
import addGroup from "./addGroup";
import editGroup from "./editGroup";

import {
  apply,
  applyDel,
  applyGet
  , AppGroupGetByCondition, delAppGroup, APPGetSelect,
} from "@/services";
export default {
  data() {
    return {
      tenantValue:sessionStorage.getItem("tenantValue"),
      editGShow:false,
      addGShow: false,
      addGroupShow:false,
      editGroupShow:false,
      tab1Show: true,
      tab2Show: false,
      rent:  sessionStorage.getItem("tenantValue") ,
      rentList: [],
      tableData: [],
      tableDataG: [],
      multipleSelection: [],
      allItem: 0,
      num: 1, //当前页数  The current number of pages
              // The current number of pages
      size: 10, //页面size  page size
                // Page size Page size
      tenantId: "", //当前登录租户Id  Current login tenant Id
                    // Current login tenant Id Current Login Tenant Id
      input2: "",
      input3: "",
      tabsData: [
        {
          name: this.$t('App.applications'),
          id: 0
        },
        {
          name: this.$t('App.applicationGroups'),
          id: 1
        },
      ],
      activeIndex: 0,
      //收藏夹的显示隐藏
      // Favorites show hidden
      favFlag: false,
    };
  },
  created() {
    this.tenantId =  sessionStorage.getItem("tenantValue") ;
    if(this.tenantId==""){
      this.tenantId = "All";
    }

    this.getApply();
   // this.$refs.editG.selectList();

     APPGetSelect({  tenantId: this.tenantId, }).then((res) => {
      this.$refs.editG.ActItem = res.result.acl;
      this.$refs.editG.AppNames = res.result.apps;
      this.$refs.editG.protoOperation = res.result.proto;
      this.$refs.editG.dscpOperation = res.result.dscp;
    });

    },
  methods: {
    choseTenant() {
      //根据租户获取列表
      // Get the list by tenant
      //Get the list by tenant
      this.num = 1;
      this.getApply();
    },
    tabsEvent(el) {
      this.activeIndex = el.id;
      this.favFlag = el.id === 0 ? false : true;

      if(el.id === 0 ){
        this.tab2Show = false;
        this.tab1Show = true;
        this.num = 1 ;
        this.size = 10;
        this.getApply();
        APPGetSelect({  tenantId: this.tenantId, }).then((res) => {
            this.$refs.editG.ActItem = res.result.acl;
            this.$refs.editG.AppNames = res.result.apps;
            this.$refs.editG.protoOperation = res.result.proto;
            this.$refs.editG.dscpOperation = res.result.dscp;
        })
      }else{
        this.tab2Show = true;
        this.tab1Show = false;
        let params = {
          pageNumber: 1,
          pageSize: 10,
          tenantId: this.tenantId,
          appName: this.input3,
        };
        this.AppGroup(params);
      }

    },
    AppGroup(params){
      AppGroupGetByCondition(params).then((res) => {
        this.allItem = res.result.totalElements;
        this.tableDataG = res.result.content;
      });
    },
    filterSelect(data) {
      let arr = [];
      let item = Object.entries(data);
      item.map((el) => {
        arr.push({ id: el[0], name: el[1] });
      });
      return arr;
    },
    indexMethod(index) {
      return index + 1 + (this.num == 1 ? 0 : this.size * (this.num - 1));
    },
    query() {
      this.num = 1;
      if(this.tab1Show){
        this.getApply();
      }else{
        let params = {
          pageNumber: 1,
          pageSize: 10,
          tenantId: this.tenantId,
          appName: this.input3,
        };
        this.AppGroup(params);
      }

    },
    edit(row) {
          applyGet({id:row.id}).then( res => {


              this.$refs.editG.editableTabsValue = "1";
              this.$refs.editG.editForm.appId=row.appId;
              this.$refs.editG.editForm.id = row.id;
              this.$refs.editG.editForm.appName = row.appName;
              this.$refs.editG.editForm.appDescription = row.appDescription;
              this.$refs.editG.editForm.tenantId = row.tenantId;
              this.$refs.editG.editForm.apps = row.apps;
              this.$refs.editG.editForm.appPriority = row.appPriority;
              this.$refs.editG.editForm.oldAppPriority = row.appPriority;
              this.$refs.editG.editForm.matchingCriteria = row.matchingCriteria;

              let eantry = res.result.appEantryList[0];

              var name=''
              var _dis = false;
              let opts = this.$refs.editG.protoOperation;
              this.$refs.editG.protoOperation.map(r=>{
                if(r.id==eantry.protocol){
                  name=r.name
                }
              })
              if(name == 'ICMP'){
                _dis = true;
              }else{
                _dis = false;
              }

              this.$refs.editG.editForm.eantryId = eantry.id,
              //DSCP
              this.$refs.editG.editForm.appDscp= eantry.dscp,
              //协议
              this.$refs.editG.editForm.protocol= eantry.protocol,
              //源IP
              this.$refs.editG.editForm.sIp= eantry.sourceIp,
              //源端口
              this.$refs.editG.editForm.sourcePort= eantry.sourcePort,
              //目标地址
              this.$refs.editG.editForm.dIp= eantry.destinationIp,
              //目的端口
              this.$refs.editG.editForm.destinationPort= eantry.destinationPort,
              //优先级
              this.$refs.editG.editForm.priority= eantry.priority,
              this.$refs.editG.editForm.dis=_dis,
            this.editGShow = true;
       });
    },
    editGroupApp(row) {
      this.editGroupShow = true;
      this.$refs.editGroup.appForm.id = row.id;
      this.$refs.editGroup.appForm.tenantId = row.tenantId;
      this.$refs.editGroup.appForm.groupName = row.groupName;
      this.$refs.editGroup.appForm.groupDesc = row.groupDesc;
      this.$refs.editGroup.lodName =  row.groupName;
    },
    del(index, row) {
      //单条删除
      // A single delete
      //A single delete
      let params = {
        action: "del",
        verifyIds: [row.id],
      };

      var show2 = localStorage.getItem("show2");
      if(show2 == 'true'){
        applyDel(params).then((res) => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("App.hint3"),
              });
              this.getApply();
            } else {
              let arr = res.message.split(",");
              let str = "";
              arr.forEach((item) => {
                str += `${item}<br/>`;
              });
              this.$message({
                message: str,
                dangerouslyUseHTMLString: true,
                type: "warning",
              });
            }
          });
      }else{
        this.$confirm(this.$t("Mobile.areYouSure")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue2\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("Home.warning"), {
          confirmButtonText: this.$t("App.ok"),
          cancelButtonText: this.$t("App.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning",
        })
        .then(() => {
          applyDel(params).then((res) => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("App.hint3"),
              });
              this.getApply();
              localStorage.setItem("show2",localStorage.getItem("checkedValue2"));
            } else {
              let arr = res.message.split(",");
              let str = "";
              arr.forEach((item) => {
                str += `${item}<br/>`;
              });
              this.$message({
                message: str,
                dangerouslyUseHTMLString: true,
                type: "warning",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("App.hint2"),
          });
        });
      }
    },
    delGroup(row) {
      //单条删除
      var show3 = localStorage.getItem("show3");
      if(show3 == 'true'){
        let params = {appid:row.id };
          delAppGroup(params).then((res) => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("App.hint3"),
              });
              let params= {tenantId: this.rent};
              this.AppGroup(params);
            } else {
              this.$message({
                message: this.$t("App.appDel"),
                dangerouslyUseHTMLString: true,
                type: "warning",
              });
            }
          });
      }else{
        this.$confirm(this.$t('Mobile.areYouSure')+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue3\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t('vsr1000.OK'),
          cancelButtonText: this.$t('vsr1000.cancel'),
          dangerouslyUseHTMLString: true,
          type: "warning"
        }).then(() => {
          let params = {appid:row.id };
          delAppGroup(params).then((res) => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("App.hint3"),
              });
              let params= {tenantId: this.rent};
              this.AppGroup(params);
              localStorage.setItem("show3",localStorage.getItem("checkedValue3"));
            } else {
              this.$message({
                message: this.$t("App.appDel"),
                dangerouslyUseHTMLString: true,
                type: "warning",
              });
            }
          });
        });
      }
    },
    changePage(val) {
      //页数改变
      // Page number change
      //Page number change
      this.num = val;
      this.getApply();
    },
    changeSize(val) {
      //页面容量改变
      // Page size change
      //Page size change
      this.size = val;
      this.num = 1;
      this.getApply();
    },
    getApply() {
      //获取应用列表
      // Getting a list of applications
      //Getting a list of applications
      let params = {
        pageVo: {
          pageNumber: this.num,
          pageSize: this.size,
        },
        searchKey: this.input2,
        tenantId: this.tenantId,
      };
      apply(params).then((res) => {
        this.allItem = res.result.totalElements;
        this.tableData = res.result.content;
      });
    },
    add(){
      this.addGShow = true;
      this.$refs.addG.selectList();
    },
    addG(){
      this.addGroupShow = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
  components: {addG,editG,addGroup ,editGroup},
};
</script>
<style lang="scss" scoped>
.noInfo {
  font-size: 16px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  span {
    color: #3678c8;
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
  padding: 0px 30px;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;

  .edit {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    border: none;
    background: none;
    cursor: pointer;
  }
  .noen{
    color: #999999;
  }
  .control {
    margin-bottom: 20px;
    text-align: right;
    &::after{
      clear: both;
      display: block;
      content: '';
    }
    button {
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: none;
      color: white;
      margin-left: 14px;
    }
    .add {
      img {
        width: 14px;
        height: 14px;
        position: relative;
        top: 2px;
      }
    }
    .add:hover {
      background: rgba(96, 149, 214, 1);
    }
    .but button:nth-of-type(1) {
      background: rgba(239, 239, 239, 1);
      color: rgba(51, 51, 51, 1);
      border: 1px solid rgba(209, 215, 224, 1);
    }
  }
  .opt {
    display: flex;
    margin-top: 20px;
    padding-right: 30px;
    span {
      margin-right: 10px;
      line-height: 34px;
      color: #333333;
    }
    button {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      border: none;
    }
    button:hover {
      background: rgba(96, 149, 214, 1);
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
    height: 10px;
  }
  .opt {
    float: left;
  }
}
.search {
  width: 100%;
  height: 116px;
  background: white;
  padding: 20px 30px;
  position: relative;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;

  .opt {
    display: flex;
    margin-top: 20px;
    padding-right: 30px;
    span {
      margin-right: 10px;
      line-height: 34px;
      color: #333333;
    }
    button {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      border: none;
    }
    button:hover {
      background: rgba(96, 149, 214, 1);
    }
  }
  .op-but {
    // float: right;
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
.yinyon {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
}
.limit {
  position: relative;
  i {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 9px;
    left: 10px;
    z-index: 3;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style lang="scss">
.yinyon .search {
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
  .limit {
    .el-input,
    .el-select {
      width: 240px;
    }
  }
}
.fl{
  float: left;
}
.fr{
  float: right;
}

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
    font-family: arial, sans-serif;
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
.imgs {
  width: 14px;
  height: 14px;
  position: relative;
  top: 2px;
}
</style>
