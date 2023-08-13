<template>
  <div class="fifthGeneration">
    <!-- 5g-->
    <div class="operate">
      <button class="add" @click="addShow=true" v-control :disabled="isAble">
        <img src="@/assets/newPage/icon_add@2x.png" alt />
        {{$t('vsr100.static.add')}}
      </button>
      <button class="close" @click="chosedel" v-control>{{$t('vsr100.static.delete')}}</button>
    </div>
    <div class="tableView">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        stripe
        size="small"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :selectable="isDisabled" width="55" :resizable="false"></el-table-column>
       <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('vsr100.static.index')"
          align="center"
          width="70"
          :resizable="false"
        ></el-table-column> -->
        <!-- <el-table-column
          prop="conName"
          label="Name"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column> -->
        <el-table-column
          prop="apn"
          label="Apn"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column :label="$t('vsr100.static.operate')" :resizable="false">
          <template slot-scope="scope">
            <button
              @click="edit(scope.row)"
              class="edit"
              v-control
            >{{scope.row.dataFrom==2 ? $t('newLang100.static.title1'):$t('newLang100.static.title2')}}</button>
            <el-button
              type="text"
              size="small"
              :style="'color:#3678C8;font-size:14px;font-weight:400'"
              @click="del(scope.row)"
              v-show="scope.row.dataFrom!=2"
              class="edit"
              v-control
            >{{$t('vsr100.static.delete')}}</el-button>
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
          :page-size="this.Size"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addFifthGeneration v-if="addShow"></addFifthGeneration>
    <editFifthGeneration ref="editStatic" v-show="editShow"></editFifthGeneration>
  </div>
</template>
<script>
import addFifthGeneration from "./components/addFifthGeneration";
import editFifthGeneration from "./components/editFifthGeneration";
import {
addFifthG,
delFifthG,
editFifthG,
getFifthG,
} from "@/services";
export default {
  props: {},
  components: { addFifthGeneration, editFifthGeneration },
  data() {
    return {
      addShow: false,
      editShow: false,
      allNum: 0, //数据总条数 Total number of data bars
                 // Total number of data bars
      lNumber: 1, //当前页数, The current number of pages
                  // The current number of pages
      Size: 10,
      tableData: [],
      multipleSelection: [],
      mid: JSON.parse(this.$route.query.devData).deviceId,
    };
  },
  computed: {},
  methods: {
    //选择禁用 Choose to disable
    // Choose Choose to disable
    isDisabled(row) {
      if (row.dataFrom == 2) {
        return 0;
      } else {
        return 1;
      }
    },
    indexMethod(index) {
      return (
        index + 1 + (this.lNumber == 1 ? 0 : this.Size * (this.lNumber - 1))
      );
    },
    getList() {
      let params = {
        pageNumber: this.lNumber,
        pageSize: this.Size,
        deviceId: this.mid
      };
      getFifthG(params).then(res => {
        this.tableData = res.result.content;
        this.allNum = res.result.totalElements;
        if(res.result.content.length>0){
            this.isAble = true;
        }else{
            this.isAble = false;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    del(row) {
      let params = {
        ids: [row.id]
      };
      var show23 = localStorage.getItem("show23");
      if(show23 == 'true'){
        delFifthG(params).then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr100.static.remind[4]")
              });
              this.getList();
            }
          });
      }else{
        this.$confirm(this.$t("vsr100.static.remind[0]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue23\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
          confirmButtonText: this.$t("vsr100.confirm"),
          cancelButtonText: this.$t("vsr100.static.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning"
        }).then(() => {
          delFifthG(params).then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr100.static.remind[4]")
              });
              this.getList();
              localStorage.setItem("show23",localStorage.getItem("checkedValue23"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("vsr100.static.remind[1]")
          });
        });
      }
      
    },
    chosedel() {
      let ids = [];
      this.multipleSelection.map(item => {
        ids.push(item.id);
      });
      let params = {
        ids,
      };
      if (this.tableData.length == 0) {
        this.$message({
          message: this.$t("vsr100.static.remind[2]"),
          type: "warning"
        });
      } else if (params.ids.length == 0) {
        this.$message({
          message: this.$t("vsr100.static.remind[3]"),
          type: "warning"
        });
      } else {
        var show24 = localStorage.getItem("show24");
        if(show24 == 'true'){
          delFifthG(params).then(res => {
              if (res.code == 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr100.static.remind[4]")
                });
                this.getList();
              }
            });
        }else{
          this.$confirm(this.$t("vsr100.static.remind[0]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue24\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
            confirmButtonText: this.$t("vsr100.confirm"),
            cancelButtonText: this.$t("vsr100.static.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning"
          })
            .then(() => {
              delFifthG(params).then(res => {
                if (res.code == 10000) {
                  this.$message({
                    type: "success",
                    message: this.$t("vsr100.static.remind[4]")
                  });
                  this.getList();
                  localStorage.setItem("show24",localStorage.getItem("checkedValue24"));
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: this.$t("vsr100.static.remind[1]")
              });
            });
        }
        
      }
    },
    async edit(row) {
      // console.log(row);
      this.editShow = true;
      this.$refs.editStatic.isEdit = row.dataFrom != 2;
      this.$refs.editStatic.form.id = row.id;
      this.$refs.editStatic.form.conName = row.conName;
      this.$refs.editStatic.form.apn = row.apn;
    },
    pageChange(val) {
      //页数总条目改变 Total page entries change
      // Total page entries change Total Page Entries Change
      this.Size = val;

      this.getList();
      // this.getlite(params);
    },
    sizeChange(val) {
      //页数改变 Page number change
      // Page change Page Number change
      this.lNumber = val;
      this.getList();
    }
  },
  created() {
    this.getList();
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.fifthGeneration {
  padding: 20px 30px;
  .edit {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    border: none;
    background: none;
  }
}
.operate {
  text-align: right;
  button {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    color: white;
    border: none;
    outline: none;
    cursor: pointer;
  }
  .add:hover {
    background: rgba(96, 149, 214, 1);
  }
  img {
    width: 14px;
    height: 14px;
    position: relative;
    top: 2px;
  }
  .close {
    background: rgba(239, 239, 239, 1);
    border: 1px solid rgba(209, 215, 224, 1);
    color: rgba(51, 51, 51, 1);
    margin-left: 14px;
  }
}
.tableView {
  padding-top: 20px;
}
</style>