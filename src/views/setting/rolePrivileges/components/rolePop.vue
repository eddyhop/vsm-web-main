<template>
  <div class="content">
    <div class="add">
      <div class="title">
        <span>{{data.name}}</span>
        <i @click="close">
          <img src="../../../../assets/icon_close.png" alt />
        </i>
      </div>
      <div class="main">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          label-width="auto"
          class="demo-ruleForm"
          :hide-required-asterisk="true"
        >
          <div id="addRolePrivileges">
            <div class="input">
              <el-form-item :label="$t('Role.roleName')" prop="roleName">
                <el-input v-model="ruleForm.roleName" :placeholder="$t('Role.hint1')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Role.tenant')" prop="tenName" class="item">
                <!-- <el-input v-model="ruleForm.tenName" :placeholder="$t('Role.enterTenName')"></el-input> -->
                <el-select filterable
                  v-model="ruleForm.tenName"
                  :disabled="roleType===2"
                  :placeholder="$t('Role.hint2')"
                >
                  <!-- <el-option :label="$t('Role.all')" value=""></el-option> -->
                  <el-option
                    v-for="item in tenData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item :label="$t('Role.setPermission')" prop="power" class="radioPower">
              <el-radio-group v-model="ruleForm.power" @change="changeRole">
                <el-radio
                  v-for="item in radioButton"
                  :key="item.id"
                  :label="langType==='cn'?item.title:item.titleEnglish"
                  :checked="item.checked"
                ></el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="options devList" id="options">
            <el-form-item>
              <div v-for="(item, indexkey) in menu" :key="item.id">
                <el-checkbox
                  class="check1"
                  style="margin-bottom: 17.7px "
                  v-model="menusIds"
                  :label="item.id"
                  :checked="item.checked"
                  :disabled="item.title==='首页'"
                  @change="handleCheck(1,indexkey,$event)"
                >{{langType==='cn'?item.title:item.titleEnglish}}</el-checkbox>
                <div style="padding:0 6px 0 6px;">
                  <div
                    v-for="list in item.children"
                    class="line-check"
                    :key="list.id"
                    style="display: inline-block; margin-left: 20px;margin-bottom: 17.7px;"
                  >
                    <el-checkbox
                      @change="handleCheck(2,indexkey,$event)"
                      v-model="menusIds"
                      :checked="list.checked"
                      :label="list.id"
                      :disabled="data.type!=='edit' && (list.title==='角色权限' || list.title==='用户管理')"
                    >{{langType==='cn'?list.title:list.titleEnglish}}</el-checkbox>
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
          <el-form-item class="button">
            <el-button type="primary" v-debounce="submitForm" class="save">{{$t('Role.save')}}</el-button>
            <el-button @click="resetForm('form')" class="cancel">{{$t('Role.cancel')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getRoleButton,
  getRoleTree,
  // saveRole,
  getRoleInfo,
  editRole
} from "@/services/index.js";
import { removeToken } from "@/utils/cookie";
export default {
  data() {
    return {
      menu: [], //角色菜单树，
                // Role menu tree,
      menusIds: [], //已选的菜单id数组
                    // Array of selected menu ids
      radioButton: [], //单选框按钮数据
                       // Radio button data
      allId: [], //所有的菜单id
                 // All menu ids
      powerId: "", //权限id
                   // Authorization id
      powerIdAry: [], //权限id集合
                      // Collection of permission ids
      tenData: [], //租户信息数据
                   // Tenant information data
      roleType: "", //角色类型

      langType: sessionStorage.getItem("lang") || "en", //语言标识
                    // The role type
      //langType: sessionStorage.getItem("lang") || "cn", //语言标识
                                                        // Language identification
      ruleForm: {
        roleName: "",
        tenName: "",
        power: ""
      },
      rules: {
        roleName: [
          {
            required: true,
            message: this.$t("Role.hint1")
          }
        ],
        tenName: [
          {
            required: true,
            message: this.$t("Role.hint7")
          }
        ],
        power: [
          {
            required: true,
            message: this.$t("Role.hint8")
          }
        ]
      }
    };
  },
  props: ["data"],
  created() {
    this.getButton();
    this.getRoleTrees();
    this.tenData = this.$parent.tenData.filter(item => {
      return item.name !== "default";
    });
    this.roleType = this.$parent.roleType;
    if (this.roleType === 2) {
      this.ruleForm.tenName = JSON.parse(
        sessionStorage.getItem("userData")
      ).tenantId;
      this.ruleForm.roleName = this.data.roleName;
      this.menusIds = ["240000000000000001"];
    } else {
      this.ruleForm.tenName = this.data.tenId;
      this.ruleForm.roleName = this.data.roleName;
      this.menusIds = [
        "240000000000000001",
        "240000000000000014",
        "240000000000000016"
      ];
    }
  },
  methods: {
    // 关闭弹窗
    // Close Windows
    close() {
      this.$parent.isShow = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.menusIds.push(this.powerId);
          let copyId = JSON.parse(JSON.stringify(this.menusIds));
          if (copyId.indexOf(1) !== -1) {
            let i = this.menusIds.indexOf(1);
            copyId.splice(i, 1);
          }
          if (this.data.type === "add") {
            let params = {
              name: this.ruleForm.roleName,
              permIds: copyId,
              tenantId: this.ruleForm.tenName
            };
            //报错注释
            // saveRole(params).then(res => {
            //   if (res.code === 10000) {
            //     this.$parent.isShow = false;
            //     this.$parent.getRolelist();
            //     this.$message({
            //       message: this.$t("Role.saved"),
            //       type: "success"
            //     });
            //   } else {
            //     this.$parent.isShow = false;
            //     this.$message.error(this.$t("Role.fail"));
            //   }
            // });
          } else {
            let params = {
              name: this.ruleForm.roleName,
              permIds: copyId,
              tenantId: this.ruleForm.tenName,
              id: this.data.roleId
            };
            editRole(params).then(res => {
              if (res.code === 10000) {
                this.$parent.isShow = false;
                this.$parent.getRolelist();
                this.$message({
                  message: this.$t("Role.saved"),
                  type: "success"
                });
              } else {
                this.$parent.isShow = false;
                this.$message.error(this.$t("Role.fail"));
              }
            });
          }
        } else {
          this.$message.error(this.$t("Role.fail"));
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$parent.isShow = false;
    },
    handleCheck(type, a = 0, e) {
      // 多选框
      // Boxes,
      if (type == 2) {
        // 二级菜单点击
        // Level 2 menu click
        let index = 0;
        this.menu[a].children.map(item => {
          if (this.menusIds.indexOf(item.id) > -1) {
            index += 1;
          }
        });
        if (index > 0) {
          if (this.menusIds.indexOf(this.menu[a].id) < 0) {
            this.menusIds.push(this.menu[a].id);
          }
        } else {
          if (this.menusIds.indexOf(this.menu[a].id) > 0) {
            this.menusIds.splice(this.menusIds.indexOf(this.menu[a].id), 1);
          }
        }
      } else {
        if (this.menusIds.indexOf(this.menu[a].id) > -1) {
          this.menu[a].children.map(item => {
            if (this.menusIds.findIndex(n => n == item.id) < 0) {
              this.menusIds.push(item.id);
            }
          });
        } else {
          this.menu[a].children.map(item => {
            if (this.menusIds.findIndex(n => n == item.id) > -1) {
              this.menusIds.splice(
                this.menusIds.findIndex(n => n == item.id),
                1
              );
            }
          });
        }
      }
      if (a === 0 && e) {
        this.menusIds = this.allId;
      } else if (a === 0 && !e) {
        if (this.roleType === 2 && this.data.type!=='edit') {
          this.menusIds = [
            "240000000000000001",
            "240000000000000014",
            "240000000000000016"
          ];
        } else {
          this.menusIds = ["240000000000000001"];
        }
      }
      if (!e) {
        this.menusIds = this.menusIds.filter(item => {
          return item !== 1;
        });
      }
      if (this.menusIds.length === this.allId.length - 1) {
        this.menusIds = this.allId;
      }
    },
    // 获取获取权限按钮
    // Get the get permission button
    getButton() {
      getRoleButton().then(res => {
        if (res.code === 10000) {
          this.radioButton = res.result;
          this.radioButton.map(item => {
            if (this.langType === "cn") {
              this.powerIdAry.push({ id: item.id, title: item.title });
            } else if (this.langType === "en") {
              this.powerIdAry.push({ id: item.id, title: item.titleEnglish });
            }
          });
        }
      });
    },
    // 获取角色菜单树
    // Gets the role menu tree
    getRoleTrees() {
      getRoleTree().then(res => {
        if (res.code === 10000) {
          this.menu = res.result;
          if (this.roleType === 2) {
            this.menu.map(item => {
              if (item.children.length !== 0) {
                item.children = item.children.filter(item => {
                  return (
                    // item.title !== "移动端地址池分配" &&
                    // item.title ! == "Mobile address pool allocation" &&
                    // item.title !== "移动用户设置"
                    // item.title ! == "Mobile User Settings"
                    item.title !== "身份认证"
                  );
                });
              }
            });
          }
          if (this.roleType === 1) {
            this.menu.map(item => {
              if (item.children.length !== 0) {
                item.children = item.children.filter(item => {
                  return (
                    item.title !== "用户管理" &&
                    item.title !== "角色权限" &&
                    item.title !== "身份认证"
                  );
                });
              }
            });
          }
          this.menu.unshift({
            id: 1,
            title: "全部",
            titleEnglish: "All",
            children: []
          });
          this.menu.map(item => {
            this.allId.push(item.id);
            item.children.map(item => {
              this.allId.push(item.id);
            });
          });
          // 编辑角色时获取角色详情
          // Get the role details when editing the role
          if (this.data.type === "edit") {
            let params = {
              id: this.data.roleId
            };
            getRoleInfo(params).then(res => {
              if (res.code === 10000) {
                res.result.permissionList.map(item => {
                  if (item.type !== 1) {
                    this.menusIds.push(item.id);
                  } else {
                    this.ruleForm.power = item.title;
                    this.powerId = item.id;
                  }
                });
                this.menusIds = [...new Set(this.menusIds)];
                if (this.menusIds.length === this.allId.length - 1) {
                  this.menusIds = this.allId;
                }
              }
            });
          }
        }
      });
    },
    // 权限改变
    // Permission to change
    changeRole(val) {
      this.powerIdAry.map(item => {
        if (item.title === val) {
          this.powerId = item.id;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.5);
  z-index: 100;
  font-family: arial, sans-serif;
  font-weight: 400;
  .add {
    position: absolute;
    width: 770px;
    height: 731px;
    background: #fff;
    border-radius: 7px;
    top: 50%;
    left: 50%;
    z-index: 10;
    transform: translate(-50%, -50%);
    .title {
      height: 48px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #d1d7e0;
      span {
        color: rgba(51, 51, 51, 1);
      }
      i {
        img {
          width: 14px;
          height: 14px;
        }
      }
    }
    .main {
      padding: 30px;
      .input {
        display: flex;
        // justify-content: space-between;
        padding: 0 20px;
        position: relative;
        .item {
          position: absolute;
          right: 0px;
          margin-right: 20px;
        }
      }
      .radioPower {
        padding: 0 0 0 20px;
      }
      .options {
        width: 710px;
        height: 452px;
        border: 1px solid rgba(235, 235, 235, 1);
        padding: 22px 0 18px 20px;
        position: relative;
        // overflow-y: auto;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .button {
        position: relative;
        top: 30px;
        margin-left: 195px;
        .save {
          width: 100px;
          height: 34px;
          background: #3678c8;
          border-radius: 7px;
          padding: 0px;
          font-family: arial, sans-serif;
          font-weight: 400;
          &:hover {
            background: #6095d6 !important;
          }
        }
        .cancel {
          width: 70px;
          height: 34px;
          border-radius: 7px;
          border: 1px solid rgba(209, 215, 224, 1);
          padding: 0px;
          margin-left: 18px;
          font-family: arial, sans-serif;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          &:hover {
            background: #3678c8 !important;
            color: #fff;
          }
        }
      }
    }
  }
  .devList::-webkit-scrollbar {
    width: 4px;
  }
  .devList::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .devList::-webkit-scrollbar-track  {
       -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
       border-radius: 0;
       background: rgba(0, 0, 0, 0.1);
  }
  ::v-deep .el-input__icon {
    line-height: 0px;
  }
}
</style>
<style lang="scss">
#addRolePrivileges {
  .el-form-item__label {
    padding: 0 10px 0 0;
    color: #333333;
  }
  .el-radio__label {
    color: #333333;
  }
  .el-input__inner {
    width: 250px;
    height: 34px;
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    padding: 0 0 0 10px;
  }
  .el-radio__inner {
    width: 16px;
    height: 16px;
    border-radius: 7px;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border: none;
    background: url("../../../../assets/newPage/equipment_icon_selected.png")
      no-repeat;
  }
  .el-radio__inner::after {
    display: none;
  }
  .el-form-item {
    margin-bottom: 13px;
  }
  .el-form-item__error {
    color: #ba2727;
    top: 86%;
    left: 10px;
  }
  .el-form-item.is-error .el-input__inner {
    border-color: #ba2727;
  }
  .el-form-item__content {
    align-items: center;
  }
}
#options {
  .el-form-item__content {
    line-height: 0px;
    width: 688px;
    position: relative;
    left: -66px;
  }
  .el-checkbox__label {
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 0px;
  }
  .el-checkbox__inner {
    width: 16px;
    height: 16px;
  }
  .el-checkbox__inner::after {
    top: 3px;
    left: 5px;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background: #3978c8 !important;
  }
  .el-checkbox__input {
    line-height: 0;
  }
}
</style>
