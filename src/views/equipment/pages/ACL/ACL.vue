<template>
  <div class="logical">
    <!-- ACL -->
    <div class="operate">
      <div class="left">
        <button @click="tabs(0)" :class="{active:index===0}">IPV4</button>
        <!-- <button @click="tabs(1)" :class="{active:index===1}">IPV6</button> -->
      </div>
      <div class="right">
        <button class="add" @click="addAclList" v-control>
          <img src="@/assets/newPage/icon_add@2x.png" alt />
          {{$t('vsr1000.add')}}
        </button>
        <button class="close" @click="removeList" v-control>{{$t('vsr1000.delete')}}</button>
      </div>
    </div>
    <div class="tableView">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
        stripe
        size="small"
        fit
      >
        <el-table-column type="selection" width="55" align="center" show-overflow-tooltip :resizable="false"></el-table-column>
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('vsr1000.index')"
          align="center"
          width="70"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column> -->
        <el-table-column
          prop="name"
          :label="$t('vsr1000.name')"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <!-- <el-table-column prop label="permit" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop label="deny" align="center" show-overflow-tooltip></el-table-column>-->
        <!-- <el-table-column prop :label="$t('vsr1000.action')" align="center" show-overflow-tooltip></el-table-column> -->
        <el-table-column
          prop="description"
          :label="$t('vsr1000.describe')"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column :label="$t('vsr1000.operate')" align="center" :resizable="false">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t('vsr1000.edit')}}</el-button>
            <el-button
              type="text"
              size="small"
              @click="details(scope.row)"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t("vsr1000.check")}}</el-button>
            <el-button
              type="text"
              size="small"
              @click="remove(scope.row)"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t('vsr1000.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allNum"
          @size-change="pageChange"
          @current-change="sizeChange"
          :current-page="index === 0 ? lNumber : Spage"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addACL :isShow="isShow" ref="addACL" />
    <editACL :isShow2="isShow2" ref="editACL" />
    <addIpvsAcl v-show="isShowAddS" ref="addIpvsAcl" />
    <editIpvsAcl v-show="isShowEditS" ref="editIpvsAcl" />
    <acldetails v-show="detailShow" ref="acldetails" />
  </div>
</template>
<script>
import addACL from "./components/addACL.vue";
import editACL from "./components/editACL";
import addIpvsAcl from "./components/addIpvsAcl";
import editIpvsAcl from "./components/editIpvsAcl";
import acldetails from "./components/aclDetails";
import { delBatchAcl, getAclList, aclVsrCheck } from "@/services/";
export default {
  props: {},
  components: {
    addACL,
    editACL,
    addIpvsAcl,
    editIpvsAcl,
    acldetails
  },
  data() {
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      isShow: false,
      isShow2: false,
      detailShow: false,
      isShowAddS: false,
      isShowEditS: false,
      allNum: 0, //数据总条数 Total number of data bars
                 // Total number of data bars
      lNumber: 1, //当前页数, The current number of pages
                  // The current number of pages
      Size: 10,
      //ipv6分页设置
      // Ipv6 paging Settings
      //ipv6 paging Settings
      ipvsAllNum: 0,
      Spage: 1,
      SpageSize: 10,
      tableData: [],
      multipleSelection: [],
      index: 0
    };
  },
  computed: {},
  methods: {
    //tab切换
    // The TAB to switch
    // TAB to switch
    tabs(index) {
      this.index = index;
      let params = {
        deviceId: this.deviceId,
        pageSize: this.index === 0 ? this.Size : this.SpageSize,
        pageNumber: this.index === 0 ? this.lNumber : this.Spage,
        // type: index
      };
      this.getAclListInit(params);
    },
    indexMethod(index) {
      let num = null;
      if (this.index === 0) {
        num =
          index + 1 + (this.lNumber == 1 ? 0 : this.Size * (this.lNumber - 1));
      } else if (this.index === 1) {
        num =
          index + 1 + (this.Spage == 1 ? 0 : this.SpageSize * (this.Spage - 1));
      }
      return num;
    },
    handleSelectionChange(val) {
      //列表多选获取
      // List multiple selection fetch
      //List multiple selection fetch
      this.multipleSelection = val;
    },
    handleClick(row) {
      //列表编辑
      // A list of editing
      // List editing
      aclVsrCheck({
        action: "edit",
        verifyIds: [row.id]
      }).then(res => {
        if (res.code === 10000) {
          if (this.index === 0) {
            this.isShow2 = true;
            this.$refs.editACL.selectList(row);
          } else if (this.index === 1) {
            this.isShowEditS = true;
            this.$refs.editIpvsAcl.selectList(row);
          }
        } else {
          this.$message({
            type: "warning",
            message: res.message
          });
        }
      });

      // console.log(row);
    },
    //查看
    // To view
    // check
    details(row) {
      this.detailShow = true;
      this.$refs.acldetails.selectList(row);
    },
    pageChange(val) {
      //页数总条目改变
      // Total page entries change
      // Total page entries changed
      let deviceId = this.deviceId;
      this.Size = val
      this.SpageSize = val
      let params = {
        pageSize: this.index === 0 ? this.Size : this.SpageSize,
        pageNumber: 1,
        deviceId,
        // type: this.index
      };
      this.lNumber = 1;
      this.Spage = 1;
      this.getAclListInit(params);
    },
    sizeChange(val) {
      //页数改变
      // Page number change
      // Page change
      // console.log(123123, val);
      let deviceId = this.deviceId;
      this.index === 0 ? (this.lNumber = val) : (this.Spage = val);
      let params = {
        pageSize: this.index === 0 ? this.Size : this.SpageSize,
        pageNumber: this.index === 0 ? this.lNumber : this.Spage,
        deviceId,
        // type: this.index
      };
      console.log(params);
      this.getAclListInit(params);
    },
    // getAclListInit(params) {
    //   //调取获取acl列表
    // Retrieves the ACL list
    //   this.$emit("getAclListInit", params);
    // },
    addAclList(params) {
      //添加列表项下拉菜单数据初始化
      // Add list item drop-down menu data initialization
      //Add list item drop-down menu data initialization
      if (this.index === 0) {
        this.isShow = true;
        this.$refs.addACL.selectList();
      } else if (this.index === 1) {
        this.isShowAddS = true;
        this.$refs.addIpvsAcl.selectList();
      }
    },
    removeList() {
      //多选择删除
      // Multiple select delete
      // Multiple select delete
      if (this.multipleSelection.length) {
        let deviceId = this.deviceId;
        let ids = this.multipleSelection.map(item => item.id);
        var show11 = localStorage.getItem("show11");
        if(show11 == 'true') {
          aclVsrCheck({
              action: "del",
              verifyIds: ids
            }).then(res => {
            if (res.code == 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.aclremind[0]")
                });
                this.getAclListInit({
                  pageSize: this.index === 0 ? this.Size : this.SpageSize,
                  pageNumber: 1,
                  deviceId,
                  // type: this.index
                });
                this.lNumber = 1;
                this.Spage = 1;
              } else {
                this.$message({
                  type: "warning",
                  message: res.message
                });
                this.getAclListInit({
                  pageSize: this.index === 0 ? this.Size : this.SpageSize,
                  pageNumber: 1,
                  deviceId,
                  // type: this.index
                });
                this.lNumber = 1;
                this.Spage = 1;
              }
            });
        }else{
          this.$confirm(this.$t("vsr1000.aclremind[1]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue11\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
            confirmButtonText: this.$t("vsr1000.OK"),
            cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning"
          })
          .then(() => {
            aclVsrCheck({
              action: "del",
              verifyIds: ids
            }).then(res => {
              if (res.code == 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.aclremind[0]")
                });
                this.getAclListInit({
                  pageSize: this.index === 0 ? this.Size : this.SpageSize,
                  pageNumber: 1,
                  deviceId,
                  // type: this.index
                });
                this.lNumber = 1;
                this.Spage = 1;
                localStorage.setItem("show11",localStorage.getItem("checkedValue11"));
              } else {
                this.$message({
                  type: "warning",
                  message: res.message
                });
                this.getAclListInit({
                  pageSize: this.index === 0 ? this.Size : this.SpageSize,
                  pageNumber: 1,
                  deviceId,
                  // type: this.index
                });
                this.lNumber = 1;
                this.Spage = 1;
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("vsr1000.aclremind[2]")
            });
          });
          }
      } else {
        this.$message({
          type: "warning",
          message: this.$t("vsr1000.aclremind[4]")
        });
      }
    },
    remove(row) {
      //单项删除
      // Single delete
      // Item deletion
      let deviceId = this.deviceId;
      var show12 = localStorage.getItem("show12");
        if(show12 == 'true') {
          aclVsrCheck({
            action: "del",
            verifyIds: [row.id]
          }).then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t('TenDomain.hint5')
              });
              this.getAclListInit({
                pageSize: this.index === 0 ? this.Size : this.SpageSize,
                pageNumber: 1,
                deviceId,
                // type: this.index
              });
              this.lNumber = 1;
              this.Spage = 1;
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
              this.getAclListInit({
                pageSize: this.index === 0 ? this.Size : this.SpageSize,
                pageNumber: 1,
                deviceId,
                // type: this.index
              });
              this.lNumber = 1;
              this.Spage = 1;
            }
          });
        }else{
        this.$confirm(this.$t("vsr1000.aclremind[1]")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue12\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          aclVsrCheck({
            action: "del",
            verifyIds: [row.id]
          }).then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t('TenDomain.hint5')
              });
              this.getAclListInit({
                pageSize: this.index === 0 ? this.Size : this.SpageSize,
                pageNumber: 1,
                deviceId,
                // type: this.index
              });
              this.lNumber = 1;
              this.Spage = 1;
              localStorage.setItem("show12",localStorage.getItem("checkedValue12"));
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
              this.getAclListInit({
                pageSize: this.index === 0 ? this.Size : this.SpageSize,
                pageNumber: 1,
                deviceId,
                // type: this.index
              });
              this.lNumber = 1;
              this.Spage = 1;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("vsr1000.aclremind[2]")
          });
        });
        }
    },
    //获取acl列表
    // Getting the ACL list
    // Get the ACL list
    async getAclListInit(params) {
      let data = await getAclList(params);
      // console.log(data);
      if (data.code === 10000) {
        this.allNum = data.result.totalElements;
        this.tableData = data.result.content;
      }
    }
  },
  created() {
    this.getAclListInit({
      deviceId: this.deviceId,
      pageSize: this.index === 0 ? this.Size : this.SpageSize,
      pageNumber: this.index === 0 ? this.lNumber : this.Spage,
    });
    console.log(this.deviceId)
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.logical {
  padding: 20px 30px 0 30px;
}
.operate {
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .left {
    float: left;
    button {
      width: 84px;
      height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      outline: none;
      cursor: pointer;
      margin-right: 15px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
    }
    button:hover {
      background: rgba(54, 120, 200, 1);
      color: #fff;
      border-color: #fff;
    }
    .active {
      background: rgba(54, 120, 200, 1);
      color: #fff;
      border-color: #fff;
    }
    .active:hover {
      background: #6095d6;
    }
  }
  .right {
    float: right;
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
      outline: none;
      cursor: pointer;
      display: table-cell;
      vertical-align: middle;
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
    .close {
      background: rgba(239, 239, 239, 1);
      color: #333333;
      border: 1px solid rgba(209, 215, 224, 1);
      margin-left: 23px;
    }
  }
}
.tableView {
  padding-top: 20px;
}
</style>