<template>
  <!-- 云账号管理 -->
  <div class="account">
    <div class="top">
      <span>{{$t('TenServiceSet.set')}}</span>
      <img src="@/assets/icon_right@2x.png" alt />
      <span>{{$t('cloudAccount.second')}}</span>
    </div>
    <div class="main">
      <div class="mainTop" id="account">
        <div class="input">
          <i>
            <img src="@/assets/newPage/icon_search@2x.png" alt />
          </i>
          <el-input
            v-model="input"
            class="search"
            :placeholder="$t('cloudDev.remind[3]')"
            @change="getTableList()"
          ></el-input>
        </div>
        <div class="button">
          <button class="add" @click="addAccount" v-control>
            <i>
              <img src="../../../assets/newPage/icon_add@2x.png" alt />
            </i>
            {{$t('cloudAccount.add')}}
          </button>
          <button class="cancel" @click="removeList" v-control>{{$t('cloudAccount.del')}}</button>
        </div>
      </div>
      <div class="list" id="accountList">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :cell-class-name="tableState"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" :resizable="false"></el-table-column>
          <!-- <el-table-column
            type="index"
            :index="indexMethod"
            :label="$t('cloudAccount.index')"
            width="180"
            :resizable="false"
          ></el-table-column> -->
          <el-table-column
            prop="accountName"
            :label="$t('cloudAccount.name')"
            width="180"
            :resizable="false"
          ></el-table-column>
          <el-table-column
            prop="manufacturerName"
            :label="$t('cloudAccount.factory')"
            :resizable="false"
          ></el-table-column>
          <el-table-column :label="$t('cloudAccount.state')" :resizable="false">
            <template
              slot-scope="scope"
            >{{!scope.row.status ? $t('cloudAccount.close'):$t('cloudAccount.inuse')}}</template>
          </el-table-column>
          <el-table-column :label="$t('cloudAccount.control')" :resizable="false">
            <template slot-scope="scope">
              <el-button
                @click="editAccount(scope.row)"
                type="text"
                v-control
                class="listBotton"
              >{{$t('cloudAccount.edit')}}</el-button>
              <el-button
                @click="remove(scope.row)"
                type="text"
                v-control
                class="listBotton"
              >{{$t('cloudAccount.del')}}</el-button>
            </template>
          </el-table-column>
          <!-- <template slot="empty">
            <div class="empty">
              <span>暂无云-云账号，快去</span>
              <span id="newAdd" @click="addAccount">新增</span>一条
            </div>
          </template>-->
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
            style="font-family: arial, sans-serif"
          ></el-pagination>
        </div>
      </div>
    </div>
    <Add v-if="isShowAdd"></Add>
    <Edit v-show="isShowEdit" :scopeEdit="scopeEdit" ref="edit"></Edit>
    <!-- <Del v-if="isShowDel" :multipleSelection="multipleSelection" :delStatus="delStatus" :delAccountId="delAccountId"></Del> -->
  </div>
</template>
<script>
import Add from "./components/add";
import Edit from "./components/edit";
import Del from "./components/del";
import { cloudAccountGetByCondition, cloudAccountDel } from "@/services";
export default {
  components: {
    Add,
    Edit,
    Del,
  },
  data() {
    return {
      input: "",
      lSize: 10, //每页条数 Number each page
                 // Number each page
      lNumber: 1, //当前页号 The current page number
                  // The current Page number
      alllite: 0, //总条数  total number
                  // Total number total number
      isShowAdd: false,
      isShowEdit: false,
      isShowDel: false,
      multipleSelection: [], //删除项集合  Delete item collection
                             // Delete Item Collection Delete Item Collection
      delAccountId: null, //单个删除的ID  A single deleted ID
                          // Single deleted ID A single Deleted ID
      delStatus: false, //判断当前删除是单个删除还是多选删除 Determines whether the current delete is a single delete or a multi-select delete
                        // Determines whether the current delete is a single or multi-selected delete or a multi-select delete
      scopeEdit: null, //点击编辑的当前云账号的信息 Click to edit the current cloud account information
                       // Click to edit the current Cloud Account Information
      tableData: [],
    };
  },
  methods: {
    //页数条数改变
    // The number of pages has changed
    //The number of pages has changed
    litePage(val) {
      this.lSize = val;
      this.getTableList();
    },
    //页数改变
    // Page number change
    //Page number change
    liteSize(val) {
      this.lNumber = val;
      this.getTableList();
    },
    // 索引岁页面变化
    // Index year page changes
    indexMethod(index) {
      return (
        index + 1 + (this.lNumber == 1 ? 0 : this.lSize * (this.lNumber - 1))
      );
    },
    // 状态颜色切换
    // State color switch
    // Index year page changes
    tableState({ row }) {
      if (row.status === 0) {
        return "lose";
      } else if (row.status === 1) {
        return "usable";
      }
    },
    // 新增账户
    // The new account
    // New account
    addAccount() {
      this.isShowAdd = true;
    },
    // 编辑账户
    // Edit account
    // Edit accounts
    editAccount(scope) {
      this.isShowEdit = true;
      this.scopeEdit = scope;
      this.$refs.edit.editAssignment(scope);
    },
    // 获取多选删除id集合
    // Gets the multi-select delete ID collection
    // Gets the multi-select delete ID collection
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //单项删除
    // Single delete
    // Item deletion
    remove(row) {
      var show9 = localStorage.getItem("show9");
      if(show9 == 'true') {
        cloudAccountDel({ ids: row.id }).then((res) => {
          if (res.code === 10000) {
            this.$message({
              type: "success",
              message: this.$t("vsr1000.remind2[2]"),
            });
            this.lNumber = 1;
            this.getTableList();
          } else if (res.code !== 10000) {
            this.lNumber = 1;
            this.getTableList();
            this.$message({
              type: "warning",
              message: res.message,
            });
          }
        });
      }else{
        this.$confirm(this.$t("vsr1000.qosremind[1]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue9\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning",
        })
        .then(() => {
          cloudAccountDel({ ids: row.id }).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]"),
              });
              this.lNumber = 1;
              this.getTableList();
              localStorage.setItem("show9",localStorage.getItem("checkedValue9"));
            } else if (res.code !== 10000) {
              this.lNumber = 1;
              this.getTableList();
              this.$message({
                type: "warning",
                message: res.message,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("vsr1000.qosremind[2]"),
          });
        });
      }
    },
    //多项删除
    // A number of deleted
    // Multiple deletions
    removeList() {
      if (this.multipleSelection.length) {
        let ids = this.multipleSelection.map((item) => item.id);
        var show10 = localStorage.getItem("show10");
        if(show10 == 'true') {
          cloudAccountDel({ ids: ids.join(",") }).then((res) => {
              if (res.code === 10000) {
                this.lNumber = 1;
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]"),
                });
                this.getTableList();
              } else if (res.code !== 10000) {
                this.lNumber = 1;
                this.getTableList();
                this.$message({
                  type: "warning",
                  message: res.message,
                });
              }
            });
        }else{
          this.$confirm(this.$t("vsr1000.qosremind[1]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue10\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
            confirmButtonText: this.$t("vsr1000.OK"),
            cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning",
          })
          .then(() => {
            cloudAccountDel({ ids: ids.join(",") }).then((res) => {
              if (res.code === 10000) {
                this.lNumber = 1;
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]"),
                });
                this.getTableList();
                localStorage.setItem("show10",localStorage.getItem("checkedValue10"));
              } else if (res.code !== 10000) {
                this.lNumber = 1;
                this.getTableList();
                this.$message({
                  type: "warning",
                  message: res.message,
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("vsr1000.qosremind[2]"),
            });
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: this.$t("vsr1000.qosremind[4]"),
        });
      }
    },
    // 获取云账号列表
    // Get a list of cloud accounts
    // Get a list of cloud accounts
    getTableList() {
      let tenantId =JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId;
      cloudAccountGetByCondition({
        searchKey: this.input,
        pageNumber: this.lNumber,
        pageSize: this.lSize,
        // cloudType:"AWS_CHINA"
      }).then((res) => {
        if (res.code === 10000) {
          this.tableData = res.result.content;
          this.alllite = res.result.totalElements;
        }
      });
    },
  },
  created() {
    this.getTableList();
  },
};
</script>
<style lang="scss" scoped>
.account {
  width: 100%;
  height: 100%;
  font-family: arial, sans-serif;
  .top {
    height: 62px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    padding-left: 30px;
    line-height: 62px;
    span:nth-child(1) {
      font-size: 16px;
      color: #333333;
      font-weight: 400;
    }
    img {
      width: 6px;
      height: 10px;
      margin: 0 4px;
    }
    span:nth-child(3) {
      color: #333333;
    }
  }
  .main {
    height: calc(100% - 82px);
    margin-top: 20px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    padding: 20px 30px;
    .mainTop {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .input {
        width: 242px;
        position: relative;
        i {
          position: absolute;
          z-index: 10;
          left: 10px;
          top: 9px;
          img {
            width: 16px;
            height: 16px;
          }
        }
        .search {
          width: 242px;
          border-radius: 7px;
        }
      }
      .button {
        display: flex;
        align-items: center;
        .add {
          width: 100px;
          height: 34px;
          background: rgba(54, 120, 200, 1);
          border-radius: 7px;
          border: none;
          padding: 0px;
          font-size: 14px;
          font-family: arial, sans-serif;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
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
        .cancel {
          width: 100px;
          height: 34px;
          background: rgba(239, 239, 239, 1);
          border-radius: 7px;
          border: 1px solid rgba(209, 215, 224, 1);
          padding: 0px;
          margin-left: 14px;
        }
      }
    }
    .list {
      .listBotton {
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(54, 120, 200, 1);
      }
      .empty {
        font-size: 16px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
}
#newAdd {
  color: #3678c8;
  cursor: pointer;
}
</style>
<style lang="scss">
#account {
  .el-input__inner {
    height: 34px;
    padding-left: 36px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    &:hover {
      border-color: #3678c8;
    }
  }
}
#accountList {
  .el-table .lose:nth-child(5) .cell {
    color: #ba2727;
  }
  .el-table .usable:nth-child(5) .cell {
    color: #029805;
  }
}
</style>