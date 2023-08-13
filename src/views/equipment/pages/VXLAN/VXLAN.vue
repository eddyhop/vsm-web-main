<template>
  <div class="logical">
    <!-- VXLAN -->
    <div class="operate">
      <button class="add" @click="isShow=true">{{$t('attr.add')}}</button>
      <button class="close" @click="removeList">{{$t('attr.delete')}}</button>
    </div>
    <div class="tableView">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" :label="$t('attr.name')"></el-table-column>
        <el-table-column prop="vrfName" :label="$t('attr.tenantRoutingDomain')"></el-table-column>
        <el-table-column prop="sourceIp" :label="$t('attr.sourceIP')"></el-table-column>
        <el-table-column prop="aimIp" :label="$t('attr.destIP')"></el-table-column>
        <el-table-column prop="tunIp" :label="$t('attr.tunnelIP')"></el-table-column>
        <el-table-column :label="$t('attr.operate')">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">{{$t('attr.edit')}}</el-button>
            <el-button type="text" size="small" @click="grandeClick(scope.row)">{{$t('attr.expertSet')}}</el-button>
            <el-button type="text" size="small" @click="remove(scope.row)">{{$t('attr.delete')}}</el-button>
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
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addXLAN :isShow="isShow" />
    <grandeSet ref="grandeSet" />
    <editXLAN ref="editXLAN" :isShowE="isShowE" />
  </div>
</template>
<script>
import addXLAN from "./components/addXLAN.vue";
import grandeSet from "./components/grandeSet.vue";
import editXLAN from "./components/editXLAN.vue";
import { delBatchVxLan } from "@/services";
export default {
  props: {},
  components: {
    addXLAN,
    grandeSet,
    editXLAN
  },
  data() {
    return {
      isShow: false,
      isShowE: false,
      lSize: 10, //每页条数
                 // Number each page
      lNumber: 0, //页数
                  // Number of pages
      alllite: 0,
      tableData: [],
      multipleSelection: []
    };
  },
  computed: {},
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //编辑vxlan
    // Edit vxlan
    handleClick(row) {
      this.isShowE = true;
      this.$refs.editXLAN.dataInit(row);
      console.log(row);
    },
    //高级设置
    // Advanced Settings
    grandeClick(row) {
      console.log(row);
      this.$refs.grandeSet.$el.classList.remove("isShow");
      this.$refs.grandeSet.getSelectList({ mid: row.mid }, { id: row.id });
    },
    litePage(val) {
      //页数总条目改变
      // Total page entries change
      let mid = sessionStorage.getItem("mid");
      this.lSize = val;
      let params = {
        pageSize: this.lSize,
        page: 0,
        mid: mid
      };
      this.lNumber = 0;
      this.getlite(params);
    },
    liteSize(val) {
      //页数改变
      // Page number change
      // console.log(val)
      let mid = sessionStorage.getItem("mid");
      this.lNumber = val;
      let params = {
        pageSize: this.lSize,
        page: this.lNumber,
        mid: mid
      };
      this.getlite(params);
    },
    //获取列表数据
    // Getting list data
    getlite(params) {
      this.$emit("getVxLanListInt", params);
    },
    //多选删除列表
    // Multiple - select delete list
    removeList(params) {
      // console.log(this.multipleSelection)
      if (this.multipleSelection.length) {
        let arr = [];
        let _this = this;
        let mid = sessionStorage.getItem("mid");
        this.multipleSelection.forEach(item => {
          arr.push(item.id);
        });

        // console.log(arr);
        //批量删除dhcp服务
        // Batch delete DHCP service
        this.$confirm("确认删除吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
          .then(() => {
            delBatchVxLan(arr).then(res => {
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                _this.getlite({
                  mid: mid,
                  page: this.lNumber,
                  pageSize: this.lSize
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择你要删除的选项!"
        });
      }
    },
    //删除单项数据
    // Delete single data
    remove(row) {
      let _this = this;
      let mid = sessionStorage.getItem("mid");

      this.$confirm("确认删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          delBatchVxLan([row.id]).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              _this.getlite({
                mid: mid,
                page: this.lNumber,
                pageSize: this.lSize
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.logical {
  padding: 18px 36px 0 36px;
}
.operate {
  button {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    width: 70px;
    height: 26px;
    background: rgba(82, 138, 250, 1);
    box-shadow: 0px 1px 3px 0px rgba(86, 175, 254, 0.5);
    border-radius: 13px;
    color: white;
    border: none;
    outline: none;
    cursor: pointer;
  }
  .close {
    background: rgba(255, 255, 255, 1);
    border: 2px solid rgba(82, 138, 250, 1);
    border-radius: 22px;
    font-family: arial, sans-serif;
    font-weight: 500;
    color: rgba(82, 138, 250, 1);
    margin-left: 23px;
  }
}
.tableView {
  padding-top: 32px;
}
</style>