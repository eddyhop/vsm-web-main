<template>
  <div class="content">
    <div class="control">
      <div class="limit" style="width:auto">
        <div style="float:left; width:240px;">
        <i>
          <img src="@/assets/newPage/icon_search@2x.png" alt />
        </i>
        <el-input
          :placeholder="$t('UserMan.superName')"
          prefix-icon="el"
          size="small"
          @change="userQuery"
          v-model="userKey"
        ></el-input>
        </div>
        <div style="float:left;" class="opt op-but">
          <button @click="userQuery" :class="lang=='en'?'btnEn':''">{{$t('DeviceMan.search')}}</button>
        </div>
      </div>
      
      <div class="but">
        <button @click="add" class="add" v-control>
          <img src="@/assets/newPage/icon_add@2x.png" alt />
          {{$t('UserMan.add')}}
        </button>
        <!-- <button>删除</button> -->
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      border
      stripe
      style="width: 100%"
      size="small"
      :empty-text="$t('UserMan.noData')"
    >
      <!-- <el-table-column
        type="index"
        :index="indexMethod"
        :label="$t('UserMan.index')"
        align="center"
        width="70"
        :resizable="false"
      ></el-table-column> -->
      <el-table-column
        prop="username"
        :label="$t('UserMan.username')"
        show-overflow-tooltip
        :resizable="false"
      ></el-table-column>
      <el-table-column
        :label="$t('UserMan.password')"
        show-overflow-tooltip
        :resizable="false"
      >******</el-table-column>
      <el-table-column
        prop="permissionName"
        :label="$t('UserMan.permission')"
        show-overflow-tooltip
        :resizable="false"
      >
        <!-- <template slot-scope="scope">
          <span>{{scope.row.roles.name}}</span>
        </template>-->
        {{$t('UserMan.super')}}
      </el-table-column>
      <el-table-column :label="$t('UserMan.operation')" :resizable="false">
        <template slot-scope="scope">
          <button class="edit" @click="editUser(scope.row)" v-control>{{$t('UserMan.edit')}}</button>
          <button
            class="edit"
            @click="del(scope.$index,scope.row)"
            v-control
            v-show="scope.row.username!='vsmAdmin'"
          >{{$t('UserMan.delete')}}</button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        :page-sizes="[5, 10]"
        :total="alluser"
        :page-size="10"
        @size-change="changeSize"
        @current-change="changePage"
        :current-page="this.userNum"
        layout="total, sizes, prev, next, jumper"
        style="font-family: arial, sans-serif"
      ></el-pagination>
    </div>
    <addUser ref="addUser" v-show="userShow"></addUser>
    <editUser ref="editUser" v-show="editUserShow"></editUser>
  </div>
</template>
<script>
import { getUserList, delControlUser } from "@/services";
import addUser from "./addUser";
import editUser from "./editUser";
export default {
  data() {
    return {
      userShow: false,
      editUserShow: false,
      tableData: [],
      alluser: 0,
      userNum: 1,
      userSize: 10,
      userKey: "",
      lang : sessionStorage.getItem("lang")
    };
  },
  methods: {
    add() {
      this.userShow = true;
      // getUserPermission({ tenantId: "" }).then(res => {
      //   this.$refs.addUser.form.options = res.result;
      // });
    },
    indexMethod(index) {
      return (
        index + 1 + (this.userNum == 1 ? 0 : this.userSize * (this.userNum - 1))
      );
    },
    userQuery() {
      //超级管理员查询
      // Super Administrator query
      this.userNum = 1;
      this.getUserList();
      // if (this.userKey === "") {
      //   this.$message({
      //     message: "请输入你要查询的用户",
      // Message: "Please enter the user you want to query ",
      //     type: "warning"
      //   });
      //   let params = {
      //     type: "2"
      //   };
      //   this.getUserList(params);
      // } else if (this.userKey != "") {
      //   let params = {
      //     type: "2",
      //     username: this.userKey
      //   };
      //   this.getUserList(params);
      // }
    },
    del(index, row) {
      let params = {
        userId: row.id
      };
      var show94 = localStorage.getItem("show94");
      if(show94 == 'true'){
        
          delControlUser(params).then(res => {
            // console.log(res)
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("UserMan.hint14")
              });
              this.userNum = 1;
              this.getUserList();
            }
          });
      }else{
        this.$confirm(this.$t("UserMan.hint13")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue94\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("UserMan.hint"), {
          confirmButtonText: this.$t("UserMan.ok"),
          cancelButtonText: this.$t("UserMan.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          delControlUser(params).then(res => {
            // console.log(res)
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("UserMan.hint14")
              });
              this.userNum = 1;
              this.getUserList();
              localStorage.setItem("show94",localStorage.getItem("checkedValue94"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("UserMan.hint15")
          });
        });
      }
    },
    changeSize(val) {
      this.userSize = val;
      this.getUserList();
    },
    changePage(val) {
      this.userNum = val;
      this.getUserList();
    },
    editUser(row) {
      this.editUserShow = true;
      // getUserPermission({ tenantId: "" }).then(res => {
      //   this.$refs.editUser.form.options = res.result;
      // });
      this.$refs.editUser.form.name = row.username;
      this.$refs.editUser.form.id = row.id;
      this.$refs.editUser.form.value = row.perId;
    },
    getUserList() {
      console.log("超级管理员")
      let params = {
        type:1,
        username: this.userKey,
        pageSize: this.userSize,
        pageNumber: this.userNum
      };
      getUserList(params).then(res => {
        this.tableData = res.result.content;
        this.alluser = res.result.totalElements;
        //    console.log(res)
        if (this.tableData.length == 0 && this.userKey != "") {
          this.$message({
            message: this.$t("UserMan.hint16"),
            type: "warning"
          });
        }
      });
    }
  },
  components: { addUser, editUser }
};
</script>
<style lang="scss" scoped>
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
  .edit {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    border: none;
    background: none;
  }
  .control {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .limit {
      width: 240px;
    }
    .add {
      font-size: 14px;
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
    button {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: none;
      color: white;
      margin-left: 14px;
    }
    .but button:nth-of-type(2) {
      background: rgba(239, 239, 239, 1);
      color: rgba(51, 51, 51, 1);
      border: 1px solid rgba(209, 215, 224, 1);
    }
  }
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