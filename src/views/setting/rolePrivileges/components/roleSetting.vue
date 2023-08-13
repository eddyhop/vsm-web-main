<template>
  <!-- 角色权限设置 -->
  <div class="roleSetting" ref="roleSetting">
    <div class="content">
      <h4 class="title">
        <span>{{ data.name }}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div :class="lang == 'en' ? 'formListEn formList' : 'formList'">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          :label-width="lang == 'en' ? '120px' : '80px'"
          class="demo-ruleForm"
          :hide-required-asterisk="true"
          :inline="true"
        >
          <el-form-item :label="$t('Role.roleName')" prop="roleName">
            <el-input
              v-model="ruleForm.roleName"
              :placeholder="$t('Role.hint1')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('Role.tenant')" prop="tenName" class="item">
            <!-- <el-input v-model="ruleForm.tenName" :placeholder="$t('Role.enterTenName')"></el-input> -->
            <el-select filterable
              v-model="ruleForm.tenName"
              :disabled="data.type === 'edit'"
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

          <!-- <el-form-item
            :label="$t('Role.setPermission')"
            prop="power"
            class="radioPower"
          >
            <el-radio-group v-model="ruleForm.power" @change="changeRole">
              <el-radio :label="1">{{ $t("Role.readWite") }}</el-radio>
              <el-radio :label="2">{{ $t("Role.readOnly") }}</el-radio>
            </el-radio-group>
          </el-form-item> -->
        </el-form>
        <div class="roleList">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="CheckAllEvent"
            >{{ $t("Role.all") }}</el-checkbox
          >

          <div
            class="roleItem"
            v-for="(item, index) in allMenuList"
            :key="item.id"
          >
            <el-checkbox
              v-model="item.checked"
              @change="handleCheckAllChange(item.checked, index)"
              :disabled="item.disabled"
              :indeterminate="item.isIndeterminate"
              >{{ item.title }}</el-checkbox
            >
            <div class="roleChildren">
              <!-- {{item.children}} -->
              <el-checkbox-group
                v-model="item.checkedStateArr"
                @change="handleCheckedChange(item, index)"
              >
                <el-checkbox
                  v-for="el in item.children"
                  :label="el.title"
                  :key="el.id"
                  style="margin-top: 16px"
                  :disabled="el.disabled"
                  >{{ el.title }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="submit">
          <button class="save" v-debounce.prevent="submitForm">
            {{ $t("vsr1000.save") }}
          </button>
          <button class="cancel" @click.prevent="close">
            {{ $t("vsr1000.cancel") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getRoleTree, addRole, editRole } from "@/services";
export default {
  data() {
    return {
      lang: sessionStorage.getItem("lang") || 'en',
      ruleForm: {
        tenName: "",
        roleName: "",
        // power: 1,
      },
      rules: {
        roleName: [
          {
            required: true,
            message: this.$t("Role.hint1"),
          },
        ],
        tenName: [
          {
            required: true,
            message: this.$t("Role.hint7"),
          },
        ],
        // power: [
        //   {
        //     required: true,
        //     message: this.$t("Role.hint8"),
        //   },
        // ],
      },
      tenData: [],
      roleType: "",
      checkAll: false,
      checkedCities: [],
      isIndeterminate: true,
      allMenuList: [],
      maxHeights: "",
    };
  },
  props: ["data"],
  methods: {
    //取消
    // cancel
    close() {
      this.$parent.isShow = false;
    },
    //提交
    // submit
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.data.type === "add") {
            let arr = this.getChenkedRoleId();
            let params = {
              name: this.ruleForm.roleName,
              type: 1,
              tenantId: this.ruleForm.tenName,
              permissionIds: arr,
            };
            addRole(params).then((res) => {
              if (res.code === 10000) {
                this.$parent.isShow = false;
                this.$parent.getRolelist();
                this.$message({
                  message: this.$t("TenMan.hint8"),
                  type: "success",
                });
              } else {
                this.$parent.isShow = false;
                this.$message.error(this.$t("Role.fail"));
              }
            });
          } else {
            let arr = this.getChenkedRoleId();
            let params = {
              name: this.ruleForm.roleName,
              type: 1,
              tenantId: this.ruleForm.tenName,
              permissionIds: arr,
              id: this.data.row.id,
            };
            editRole(params).then((res) => {
              if (res.code === 10000) {
                this.$parent.isShow = false;
                this.$parent.getRolelist();
                this.$message({
                  message: this.$t("TenMan.hint13"),
                  type: "success",
                });
              } else {
                this.$parent.isShow = false;
                this.$message.error(this.$t("Role.fail"));
              }
            });
          }
        }
      });
    },
    //获取下发角色id
    // Gets the issuing role ID
    getChenkedRoleId() {
      let arr = [];
      this.allMenuList.forEach((item) => {
        if (item.checked) {
          arr.push(item.id);
        } else if (item.isIndeterminate) {
          arr.push(item.id);
        }
        if (item.children.length) {
          item.children.forEach((el) => {
            if (el.checked) {
              arr.push(el.id);
            }
          });
        }
      });
      return arr;
    },
    //获取角色数据
    // Get role data
    getRoleTreeData() {
      getRoleTree().then((res) => {
        if (res.code === 10000) {
          let allMenuData = [];
          // console.log(res.result)
          res.result.forEach((el) => {
            if (el.type == -1) {
              // console.log(el)
              el.children.forEach((item) => {
                // console.log(item)
                allMenuData.push(item);
              });
            }
          });
          // console.log(allMenuData)
          allMenuData.forEach((item) => {
            if (item.children.length === 0) {
              item.children = [];
            } else {
              item.children.forEach((el) => {
                el.disabled = false;
                el.title = this.lang == "en" ? el.titleEnglish : el.title;
                // el.isIndeterminate = false
              });
            }
            
            item.title = this.lang == "en" ? item.titleEnglish : item.title;
            item.checkedStateArr = [];
            item.disabled = false;
            item.isIndeterminate = false;
          });
          // console.log(allMenuData)
          //默认首页与用户管理选中
          // Default home page and user management selected
          allMenuData.forEach((item) => {
            let arr = [];
            if (item.name == "home") {
              item.checked = true;
              item.disabled = true;
              item.isIndeterminate = false;
            } else if (item.name == "setting") {
              // item.isIndeterminate = true;
              item.children.forEach((el) => {
                // if (el.name == "user") {
                //   el.checked = true;
                //   el.disabled = true;
                //   arr.push(el.title);
                // }
              });
            }
            item.checkedStateArr = arr;
          });
          // console.log(allMenuData)
          if (this.data.type === "add") {
            this.allMenuList = allMenuData;
          } else {
            allMenuData.forEach((item) => {
              if (
                this.data.permissions
                  .map((item) => item.permissionId)
                  .includes(item.id)
              ) {
                item.checked = true;
              }
              let arr = [];
              if (item.children.length>0) {
                item.children.forEach((el) => {
                  if (
                    this.data.permissions
                      .map((item) => item.permissionId)
                      .includes(el.id)
                  ) {
                    el.checked = true;
                    arr.push(el.title);
                  }
                });
              }
              item.checkedStateArr = arr;
            });
            // console.log(allMenuData)
            this.allMenuList = allMenuData;
            this.checkAll = this.allMenuList.every((item) => {
              return item.checked;
            });
           // this.ruleForm.tenName = this.data.row.tenantId;
            this.ruleForm.roleName = this.data.row.name;
            // this.ruleForm.power = this.data.row.type;
          }
        }
      });
    },
    //全选
    // Future generations
    CheckAllEvent(val) {
      if (val) {
        this.allMenuList.forEach((item) => {
          item.checked = true;
          item.checkedStateArr = item.children.map((el) => {
            el.checked = true;
            return el.title;
          });
        });
        this.isIndeterminate = false;
      } else {
        this.allMenuList.forEach((item) => {
          if (item.name == "home") {
            item.checked = true;
          } else {
            item.checked = false;
          }
          item.checkedStateArr = [];
          item.children.forEach((el) => {
            // if (el.name == "user") {
            //   item.checkedStateArr = [el.title]
            //   el.checked = true;
            // } else {
              el.checked = false;
            // }
          });
        });
        this.isIndeterminate = true;
      }
    },
    //单项全选
    // Single selection
    handleCheckAllChange(val, index) {
      if (val) {
        this.allMenuList[index].checkedStateArr = this.allMenuList[
          index
        ].children.map((item) => {
          item.checked = true;
          return item.title;
        });
        this.allMenuList[index].isIndeterminate = false;
      } else {
        let arr = [];
        this.allMenuList[index].children.map((item) => {
          // if (item.name == "user") {
          //   item.checked = true;
          //   arr.push(item.title);
          // } else {
            item.checked = false;
          // }
        });
        this.allMenuList[index].checkedStateArr = arr;
      }
      this.checkAll = this.allMenuList.every((item) => {
        return item.checked;
      });
      this.isIndeterminate = !this.checkAll;
    },
    //单选
    // The radio
    handleCheckedChange(item, index) {
      let checkedCount = item.checkedStateArr.length;
      this.allMenuList[index].checked = checkedCount === item.children.length;
      this.allMenuList[index].isIndeterminate =
        checkedCount > 0 && checkedCount < item.children.length;
      this.checkAll = this.allMenuList.every((el) => {
        return el.checked;
      });
      this.isIndeterminate = !this.checkAll;
      this.allMenuList[index].children.forEach((el) => {
        if (item.checkedStateArr.includes(el.title)) {
          el.checked = true;
        } else {
          el.checked = false;
        }
      });
    },
    //权限划分
    // Purview division
    changeRole() {},
    // winResize(h) {
    //   window.addEventListener("resize", () => {
    //     if (h < 610) {
    //       document.querySelector(".content").style.maxHeight = 550 + "px";
    //     }
    //   });
    // },
  },
  // watch: {
  //   maxHeights: {
  //     handler(newValue, oldValue) {
  //       this.winResize(newValue);
  //     },
  //     deep: true,
  //   },
  // },
  created() {
    console.log(4567);
    let tenName = "";
    if(this.data.row){
      tenName = this.data.row.tenantName;
    }
    this.tenData = this.$parent.tenData.filter((item) => {
      if(item.name===tenName){
        this.ruleForm.tenName = item.id;
      }
      return item.name !== "default";
    });
   // this.ruleForm.tenName = this.data.row.tenantId;
    this.roleType = this.$parent.roleType;
    this.getRoleTreeData();
  },
  mounted() {
    if (this.$refs.roleSetting.clientHeight < 600) {
      document.querySelector(".content").style.maxHeight = 500 + "px";
    }
  },
};
</script>
<style scoped lang="scss">
.roleSetting {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.content {
  width: 770px;
  max-height: 650px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%);
  margin-left: -385px;
  overflow: auto;
  .title {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    i {
      width: 14px;
      height: 14px;
      background: url("../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.formList {
  padding: 30px 30px 0 30px;
}
.submit {
  width: 100%;
  text-align: center;
  margin-top: 20px;
  padding-bottom: 20px;
  .save {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    outline: none;
    border: 0;
    cursor: pointer;
    margin-left: 18px;
  }
  .cancel {
    width: 70px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    margin-left: 18px;
  }
  .save:hover {
    background: #6095d6;
  }
}
.roleList {
  width: 710px;
  min-height: 350px;
  border: 1px solid #ebebeb;
  // overflow: auto;
  padding: 30px 20px;
  .roleItem {
    padding-top: 16px;
    .roleChildren {
      padding-left: 26px;
    }
  }
}
.roleList::-webkit-scrollbar {
  width: 4px;
}
.roleList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.roleList::-webkit-scrollbar-track  {
     -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
     border-radius: 0;
     background: rgba(0, 0, 0, 0.1);
}
</style>
<style lang="scss">
.roleSetting {
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #3678c8;
    background: #3678c8;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: rgba(51, 51, 51, 1);
  }
  .el-input,
  .el-select {
    // width: 322px;
    width: 100%;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .el-form-item {
    width: 48%;
    margin-right: 0;
    .el-form-item__content {
      width: calc(100% - 80px);
    }
  }
  .formListEn {
    .el-form-item {
      width: 48%;
      margin-right: 0;
      .el-form-item__content {
        width: calc(100% - 120px);
      }
    }
    .radioPower {
      width: 100%;
    }
  }
  .el-form-item:first-of-type {
    margin-right: 20px;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 0px;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    border-color: #3678c8;
    background: #3678c8;
  }
}
</style>