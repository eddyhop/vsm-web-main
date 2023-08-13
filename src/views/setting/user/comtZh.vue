<template>
  <div class="content">
    <div class="control">
      <div class="limit" style="width:auto">
        <div style="float:left; width:240px;">
        <i>
          <img src="@/assets/newPage/icon_search@2x.png" alt />
        </i>
        <el-input
          :placeholder="$t('UserMan.TenAdministratorName')"
          prefix-icon="el"
          size="small"
          @change="rentQuery"
          v-model="rentKey"
        ></el-input>
        </div>
        <div style="float:left;" class="opt op-but">
          <button @click="rentQuery" :class="lang=='en'?'btnEn':''">{{$t('DeviceMan.search')}}</button>
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
      :data="rentList"
      border
      stripe
      size="small"
      tooltip-effect="dark"
      style="width: 100%"
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
        prop="tenantName"
        :label="$t('UserMan.tenant')"
        show-overflow-tooltip
        :resizable="false"
      ></el-table-column>
      <el-table-column
        prop="roleName"
        :label="$t('UserMan.permission')"
        show-overflow-tooltip
        :resizable="false"
      ></el-table-column>
      <el-table-column :label="$t('UserMan.operation')" :resizable="false">
        <template slot-scope="scope">
          <button class="edit" @click="editRent(scope.row)" v-control>{{$t('UserMan.edit')}}</button>
          <button class="edit" @click="delRent(scope.row)" v-control>{{$t('UserMan.delete')}}</button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        :page-sizes="[5, 10]"
        :total="allrent"
        :page-size="10"
        @size-change="changeRentSize"
        @current-change="changeRentPage"
        :current-page="this.rentNum"
        layout="total, sizes, prev, next, jumper"
        style="font-family: arial, sans-serif"
      ></el-pagination>
    </div>
    <editZh ref="editRent" v-show="editZhShow"></editZh>
    <addZh ref="addRent" v-show="zhShow"></addZh>
  </div>
</template>
<script>
import {
  getUserList,
  delControlUser,
  deviceSelect,
  getUserPermission
} from "@/services";
import editZh from "./editZh";
import addZh from "./addZh";
export default {
  data() {
    return {
      zhShow: false,
      editZhShow: false,
      rentList: [],
      multipleSelection: [],
      rentNum: 1,
      rentSize: 10,
      allrent: 0,
      rentKey: "",
      lang : sessionStorage.getItem("lang")
    };
  },
  methods: {
    add() {
      this.zhShow = true;
      getUserPermission({
        tenantId: sessionStorage.getItem("tenantValue")
      }).then(res => {
        this.$refs.addRent.form.opt2 = res.result;
      });
    },
    indexMethod(index) {
      return (
        index + 1 + (this.rentNum == 1 ? 0 : this.rentSize * (this.rentNum - 1))
      );
    },
    //租户管理员
    // Tenant administrator
    changeRentSize(val) {
      //页面容量改变
      // Page size change
      // console.log(val)
      this.rentSize = val;
      this.rentNum = 1;
      this.getRentList();
    },
    changeRentPage(val) {
      //当前页数改变
      // Current page change
      // console.log()
      this.rentNum = val;
      this.getRentList();
    },
    editRent(row) {
      console.log(row,"123")
      this.editZhShow = true;
      getUserPermission({ tenantId: row.tenantId }).then(res => {
        this.$refs.editRent.form.opt2 = res.result;
      });

      this.$refs.editRent.form.options = [{id:row.tenantId,name:row.tenantName}];
      this.$refs.editRent.form.name = row.username;
      this.$refs.editRent.form.val = row.tenantId;
      this.$refs.editRent.form.val2 = row.roleId;
      this.$refs.editRent.form.id = row.id;
    },
    delRent(row) {
      //    console.log(row)
      var show95 = localStorage.getItem("show95");
      if(show95 == 'true'){
          delControlUser({ userId: row.id }).then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("UserMan.hint14")
              });
              this.rentNum = 1;
              this.getRentList();
            }
          });
      }else{
        this.$confirm(this.$t("UserMan.hint13")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue95\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("UserMan.hint"), {
          confirmButtonText: this.$t("UserMan.ok"),
          cancelButtonText: this.$t("UserMan.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          delControlUser({ userId: row.id }).then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("UserMan.hint14")
              });
              this.rentNum = 1;
              this.getRentList();
              localStorage.setItem("show95",localStorage.getItem("checkedValue95"));
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
    rentQuery() {
      //租户管理员查询
      // Tenant Administrator query
      this.rentNum = 1;
      this.getRentList();
      // if (this.rentKey === "") {
      //   this.$message({
      //     message: "请输入你要查询的用户",
      // Message: "Please enter the user you want to query ",
      //     type: "warning"
      //   });
      //   let params = {
      //     type: "1"
      //   };
      //   this.getRentList(params);
      // } else {
      //   let params = {
      //     type: "1",
      //     username: this.rentKey
      //   };
      //   this.getRentList(params);
      // }
    },
    getRentList() {
      console.log("租户管理员")
      let params = {
        type:2,
        username: this.rentKey,
        pageNumber: this.rentNum,
        pageSize: this.rentSize
      };
      getUserList(params).then(res => {
        this.rentList = res.result.content;
        this.allrent = res.result.totalElements;
        //    console.log(res)
        if(this.lang=="en"){
          this.rentList.forEach(item=>{
            if(item.roleName=='超级管理员'){
              item.roleName = "Super Administrator" 
            }
          })
        }
        if (this.rentList.length == 0 && this.rentKey != "") {
          this.$message({
            message: this.$t("UserMan.hint16"),
            type: "warning"
          });
        }
      });
    }
  },
  created() {
    //获取所属租户列表
    // Gets a list of owned tenants
    deviceSelect().then(res => {
      this.$refs.addRent.form.options = res.result.filter(item => {
        return item.name !== "default";
      });
      this.$refs.editRent.form.options = res.result.filter(item => {
        return item.name !== "default";
      });
      //    console.log(res)
    });
  },
  components: { editZh, addZh }
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
      position: relative;
      img {
        width: 14px;
        height: 14px;
        position: relative;
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
      padding: 0px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
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