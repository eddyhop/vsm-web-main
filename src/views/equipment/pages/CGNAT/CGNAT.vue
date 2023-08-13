<template>
  <div class="logical">
    <!-- CGNAT-->
    <div class="operate">
      <button class="close" @click="removeList">{{$t('attr.delete')}}</button>
      <button class="add" @click="addCGNAT">
        <img src="@/assets/newPage/equipment_icon_add@2x.png" alt />
        {{$t('attr.add')}}
      </button>
    </div>
    <div class="tableView">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
        size="small"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="name" :label="$t('facility.name')" align="center"></el-table-column>
        <el-table-column prop="tcpTimeOut" :label="$t('facility.tcpOutTime')" align="center"></el-table-column>
        <el-table-column prop="udpTimeOut" :label="$t('facility.udpOutTime')" align="center"></el-table-column>
        <el-table-column prop="icmpTimeOut" :label="$t('facility.icmpOutTime')" align="center"></el-table-column>
        <el-table-column prop="outAddr" :label="$t('facility.outAddress')" align="center">
          <template slot-scope="scope">
            <div
              class="tableList"
              v-for="(item,index) in scope.row.outAddr.split(',')"
              :key="index"
            >{{item}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="inAddr" :label="$t('facility.innerAddress')" align="center"></el-table-column>

        <el-table-column :label="$t('facility.operator')" align="center">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
            >{{$t('facility.edit')}}</el-button>
            <el-button type="text" size="small" @click="remove(scope.row)">{{$t('facility.delete')}}</el-button>
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
    <addCGNTA ref="addCGNTA" :isShow="isShow" />
    <editCGNTA ref="editCGNTA" :isShow2="isShow2" />
  </div>
</template>
<script>
import addCGNTA from "./components/addCGNAT.vue";
import editCGNTA from "./components/editCGNTA";
import { delBatchCgnat,getCgnatList } from "@/services";
export default {
  props: {},
  components: {
    addCGNTA,
    editCGNTA
  },
  data() {
    return {
      isShow: false,
      isShow2: false,
      allNum: 0, //数据总条数
                 // Total number of data bars
      lNumber: 0, //当前页数,
                  // Current number of pages,
      Size: 10,
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
    handleClick(row) {
      console.log(row);
      this.isShow2 = true;
      this.$refs.editCGNTA.dataInit();
      this.$refs.editCGNTA.editData(row);
    },
    pageChange(val) {
      //页数总条目改变
      // Total page entries change
      let mid = sessionStorage.getItem("mid");
      this.Size = val;
      let params = {
        pageSize: this.Size,
        page: 0,
        mid: mid
      };
      this.lNumber = 0;
      this.getCgnatListInit(params);
    },
    sizeChange(val) {
      //页数改变
      // Page number change
      // console.log(val)
      let mid = sessionStorage.getItem("mid");
      this.lNumber = val;
      let params = {
        pageSize: this.Size,
        page: this.lNumber,
        mid: mid
      };
      this.getCgnatListInit(params);
    },
    addCGNAT() {
      this.isShow = true;
      this.$refs.addCGNTA.dataInit();
    },
    // getCgnatListInit(params) {
    //   this.$emit("getCgnatListInit", params);
    // },
    removeList() {
      if (this.multipleSelection.length) {
        let mid = sessionStorage.getItem("mid");
        let ids = this.multipleSelection.map(item => item.id);
        this.$confirm("确认删除吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
          .then(() => {
            delBatchCgnat(ids).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getCgnatListInit({ pageSize: this.Size, page: this.lNumber, mid });
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
    remove(row) {
      let mid = sessionStorage.getItem("mid");

      this.$confirm("确认删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          delBatchCgnat([row.id]).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getCgnatListInit({ pageSize: this.Size, page: this.lNumber, mid });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    async getCgnatListInit(params) {
      let data = await getCgnatList(params);
      this.tableData = data.result[0];
      this.allNum = data.result[1];
    },
  },
  created() {
    this.getCgnatListInit({mid:sessionStorage.getItem("mid"),pageSize:this.Size})
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
  button {
    float: right;
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
  .close {
    float: right;
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-left: 23px;
  }
}
.tableView {
  padding-top: 20px;
}

</style>