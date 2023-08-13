<template>
  <div class="logical">
    <!-- VSR-DHCP -->
    <div class="operate">
      <button class="add" @click="isShow=true">{{$t('facility.new')}}</button>
      <button class="close" @click="removeList">{{$t('facility.delete')}}</button>
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
        <el-table-column prop="name" :label="$t('facility.name')"></el-table-column>
        <el-table-column prop="addressPool" :label="$t('facility.addressPool')"></el-table-column>
        <el-table-column prop="gateIp" :label="$t('facility.defaultGateway')"></el-table-column>
        <el-table-column prop="dnsSer" :label="$t('facility.dnsServer')"></el-table-column>
        <el-table-column :label="$t('facility.operator')">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">{{$t('facility.edit')}}</el-button>
            <el-button type="text" size="small" @click="remove(scope.row)">{{$t('facility.delete')}}</el-button>
            <el-button type="text" size="small" @click="staticClick(scope.row)">{{$t('facility.staticDhcp')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allNum"
          @size-change="pageChange"
          @current-change="sizeChange"
          :current-page="lNumber"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addDHCP :isShow="isShow" />
    <editDHCP :isShow2="isShow2" ref="editDHCP" />
    <staticDHCP ref="staticDHCP" />
  </div>
</template>
<script>
import addDHCP from "./components/addDHCP.vue";
import editDHCP from "./components/editDHCP.vue";
import staticDHCP from "./components/staticDHCP.vue";
import { delBatchDhcpSer } from "@/services/index";
export default {
  props: {},
  components: {
    addDHCP,
    editDHCP,
    staticDHCP
  },
  data() {
    return {
      isShow: false,
      isShow2: false,
      allNum: 0,
      lSize: 10, //每页条数
                 // Number each page
      lNumber: 0, //页数
                  // Number of pages
      editData: {},
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
    //表格多选选择事件
    // Table multiple select select event
    handleClick(row) {
      console.log(row);
      this.isShow2 = true;
      this.$refs.editDHCP.dataInit(row);
    },
    //静态DHCP
    // Static DHCP
    staticClick(row) {
      // console.log(row,"[[[[[[[")
      sessionStorage.setItem("vDHCPIp", row.id);
      this.$refs.staticDHCP.$el.classList.remove("isShow");
      this.$refs.staticDHCP.dataInit({
        page: this.lNumber,
        pageSize: this.lSize,
        dhcpId: row.id
      });
    },
    pageChange(val) {
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
    sizeChange(val) {
      //页数改变
      // Page number change
      let mid = sessionStorage.getItem("mid");
      this.lNumber = val;
      let params = {
        pageSize: this.lSize,
        page: this.lNumber,
        mid: mid
      };
      this.getlite(params);
    },
    //获取DHCP列表
    // Gets the DHCP list
    getlite(params) {
      this.$emit("getDhcpListInit", params);
    },
    //多选删除列表
    // Multiple - select delete list
    removeList(params) {
      if (this.multipleSelection.length) {
        let arr = [];
        let _this = this;
        this.multipleSelection.forEach(item => {
          arr.push(item.id);
        });
        this.$confirm("确认删除吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
          .then(() => {
            delBatchDhcpSer(arr).then(res => {
              let mid = sessionStorage.getItem("mid");
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
      //批量删除dhcp服务
      // Batch delete DHCP service
    },
    //删除单项数据
    // Delete single data
    remove(row) {
      let _this = this;
      this.$confirm("确认删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          delBatchDhcpSer([row.id]).then(res => {
            let mid = sessionStorage.getItem("mid");
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