<template>
  <div class="rolePrivilege">
    <div class="top">
      <div class="title">
        <span>{{$t('Role.set')}}</span>
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{$t('Role.rolePermission')}}</span>
      </div>
      <div class="operate" id="operate">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item :label="$t('Role.tenant')" class="lab-height">
            <el-select filterable v-model="formInline.region" :disabled="roleType===2">
              <el-option :label="$t('Role.all')" value></el-option>
              <el-option v-for="item in tenData" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="limit">
            <i>
              <img src="@/assets/newPage/icon_search@2x.png" alt />
            </i>
            <el-input
              :placeholder="$t('Role.tenNameRoleName')"
              prefix-icon="el"
              v-model="formInline.user"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getRolelist">{{$t('Role.search')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="bottom">
      <div class="head">
        <button @click="addRole" v-control>
          <i>
            <img src="../../../assets/newPage/icon_add@2x.png" alt />
          </i>
          {{$t('Role.add')}}
        </button>
      </div>
      <div class="show" id="show">
        <el-table :data="tableData" border style="width: 100%">
          <!-- <el-table-column
            type="index"
            :index="indexMethod"
            :label="$t('Role.index')"
            :width="lang == 'en' ? '65' : '55'"
            show-overflow-tooltip
          ></el-table-column> -->
          <!-- <el-table-column prop="id" label="ID" show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="name" :label="$t('Role.roleName')" show-overflow-tooltip></el-table-column>
          <el-table-column prop="tenantName" :label="$t('Role.tenant')" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="permissionInfo"
            :label="$t('Role.permission')"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column :label="$t('Role.operation')" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button
                @click="editRole(scope.row)"
                type="text"
                :disabled="roleType===2 || scope.row.id==1"
              >{{$t('Role.edit')}}</el-button>
              <el-button
                @click="cancelRole(scope.row)"
                type="text"
                :disabled="roleType===2 || scope.row.id==1"
              >{{$t('Role.del')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            :page-sizes="[5, 10]"
            :total="alllite"
            @size-change="litePage"
            @current-change="liteSize"
            :current-page="lNumber"
            :page-size="10"
            layout="total, sizes, prev, next, jumper"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- <rolePop v-if="isShow" :data="popData"></rolePop> -->
    <roleSetting v-if="isShow" :data="popData" />
  </div>
</template>
<script>
import roleSetting from "./components/roleSetting";
import rolePop from "./components/rolePop";
import { getRolelists, delRole, deviceSelect } from "@/services/index.js";
export default {
  components: {
    rolePop,
    roleSetting
  },
  data() {
    return {
      isShow: false,
      lSize: 10, //每页条数
                 // Number each page
      lNumber: 1, //当前页号
                  // The current page number
      alllite: 0, //总条数
                  // The total number of article
      tenData: [], //租户信息
                   // Tenant information
      roleType: "", //角色类型

      lang: sessionStorage.getItem("lang") || "en",
      langType: sessionStorage.getItem("lang") || "en", //语言标识
      // The role type
      //lang: sessionStorage.getItem("lang"),
      //langType: sessionStorage.getItem("lang") || "cn", //语言标识
                                                        // Language identification
      popData: {
        name: "",
        type: ""
      },
      formInline: {
        user: "",
        region: ""
      },
      tableData: []
    };
  },
  created() {
    this.roleType = JSON.parse(sessionStorage.getItem("userData")).type;
    let tenId =JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId;
    this.formInline.region = tenId;
    this.getRolelist();
    this.getAllTenInfo();
  },
  methods: {
    // 获取角色权限列表
    // Gets a list of role permissions
    getRolelist() {
      let params = {
        name: this.formInline.user,
        pageNumber: this.lNumber,
        pageSize: this.lSize,
        tenantId: this.formInline.region
      };
      getRolelists(params).then(res => {
        if (res.code === 10000) {
          this.tableData = res.result.content;
          this.alllite = res.result.totalElements;
          this.tableData.forEach(item => {
              item.permissionInfo = Array.from(new Set(item.permissionInfo.split("|").map(el => {return el.trim()}))).join(" | ")
              if(item.tenantName=="default"){
                item.name = "super administrator"
              }
          });
        }
      });
    },
    // 角色新增
    // The role of new
    addRole() {
      this.isShow = true;
      this.popData = {
        name: this.$t("Role.RolePermissionSet"),
        type: "add"
      };
    },
    // 角色编辑
    // Role editor
    editRole(val) {
      console.log(val);
      this.isShow = true;
      this.popData = {
        name: this.$t("Role.RolePermissioEdit"),
        type: "edit",
        permissions: val.permissions,
        row: val
      };
    },
    //页数条数改变
    // The number of pages has changed
    litePage(val) {
      this.lSize = val;
      this.getRolelist();
    },
    //页数改变
    // Page number change
    liteSize(val) {
      this.lNumber = val;
      this.getRolelist();
    },
    // 刪除角色
    // Delete the role
    cancelRole(row) {
      var show92 = localStorage.getItem("show92");
      if(show92 == 'true'){
        
          delRole(row.id).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("Role.hint4")
              });
              this.getRolelist();
              localStorage.setItem("show92",localStorage.getItem("checkedValue92"));
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          });
      }else{
        this.$confirm(this.$t("Role.hint3")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue92\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("Role.hint"), {
          confirmButtonText: this.$t("Role.ok"),
          cancelButtonText: this.$t("Role.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          delRole(row.id).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("Role.hint4")
              });
              this.getRolelist();
              localStorage.setItem("show92",localStorage.getItem("checkedValue92"));
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("Role.hint6")
          });
        });
      }
      
    },
    // 获取所有租户信息
    // Get all tenant information
    getAllTenInfo() {
      deviceSelect().then(res => {
        if (res.code === 10000) {
          this.tenData = res.result;
        }
      });
    },
    // 索引岁页面变化
    // Index year page changes
    indexMethod(index) {
      return (
        index + 1 + (this.lNumber == 1 ? 0 : this.lSize * (this.lNumber - 1))
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.rolePrivilege {
  height: 100%;
  font-family: arial, sans-serif;
  .top {
    height: 116px;
    background: #fff;
    border-radius: 7px;
    padding: 20px 0 0 30px;
    .title {
      margin-bottom: 21px;
      span:nth-child(1) {
        font-size: 16px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-right: 4px;
      }
      img {
        width: 6px;
        height: 10px;
      }
      span:nth-child(3) {
        font-size: 14px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-left: 4px;
      }
    }
  }
  .bottom {
    height: calc(100% - 136px);
    background: #fff;
    margin-top: 20px;
    border-radius: 7px;
    padding: 20px 30px 0;
    .head {
      button {
        float: right;
        width: 100px;
        height: 34px;
        background: rgba(54, 120, 200, 1);
        border-radius: 7px;
        outline: none;
        border: none;
        font-size: 14px;
        color: #fff;
        font-family: arial, sans-serif;
        font-weight: 400;
        padding: 0px;
        margin-bottom: 20px;
        i {
          vertical-align: middle;
          img {
            width: 14px;
            height: 14px;
          }
        }
        &:hover {
          background: #6095d6;
        }
      }
    }
  }
}
.limit {
  position: relative;
  i {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 4px;
    left: 10px;
    z-index: 100;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style lang="scss">
#operate {
  .el-form--inline .el-form-item__label {
    color: rgba(51, 51, 51, 1);
    padding: 0 10px 0 0;
  }
  .el-input--suffix .el-input__inner {
    width: 140px;
    height: 34px;
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    padding: 0 10.6px 0 8px;
    &:hover {
      border-color: #3678c8;
    }
  }
  .el-form--inline .el-form-item:nth-child(1) {
    margin-right: 26px;
  }
  .el-form--inline .el-form-item:nth-child(2) {
    margin-right: 30px;
  }
  .el-input--prefix .el-input__inner {
    width: 242px;
    height: 34px;
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    &:hover {
      border-color: #3678c8;
    }
  }
  .el-button--primary {
    width: 100px;
    height: 34px;
    padding: 0px;
    border-radius: 7px;
    font-family: arial, sans-serif;
    font-weight: 400;
    &:hover {
      background: #6095d6 !important;
    }
  }
}
#show {
  .el-button--text {
    color: #3678c8;
    font-weight: 400;
  }
  .el-table .cell {
    white-space: nowrap;
  }
  .el-button.is-disabled {
    color: #c0c4cc;
  }
}
</style>