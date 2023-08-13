<template>
  <div class="istatic">
    <!-- Vsr-vpn -->
    <div class="operate">
      <button class="add" @click="addShow=true" v-control>
        <img src="@/assets/newPage/icon_add@2x.png" alt />
        {{$t('vsr100.static.add')}}
      </button>
      <!-- <button class="close" @click="chosedel" v-control>{{$t('vsr100.static.delete')}}</button> -->
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
        <!-- <el-table-column type="selection" :selectable="isDisabled" width="55" :resizable="false"></el-table-column> -->
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('vsr100.static.index')"
          align="center"
          width="70"
          :resizable="false"
        ></el-table-column> -->
        <el-table-column
          prop="interName"
          :label="$t('vsr100.static.name')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="des"
          :label="$t('vsr100.static.description')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>

        <el-table-column
          prop="ip"
          :label="$t('vsr100.static.destinationNetwork')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>

        <el-table-column
          prop="nextHopIp"
          :label="$t('vsr100.static.nextHop')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="distance"
          :label="$t('vsr100.static.distance')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <!-- <el-table-column
          prop="tag"
          :label="$t('vsr100.static.tag')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column> -->
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
    <addStatic v-if="addShow"></addStatic>
    <editStatic ref="editStatic" v-show="editShow"></editStatic>
  </div>
</template>
<script>
import addStatic from "./components/addStatic";
import editStatic from "./components/editStatic";
import {
  getLStatic,
  delLStatic,
  findStaticVpn,
  getDict,
  getFindStaticOutInter
} from "@/services";
export default {
  props: {},
  components: { addStatic, editStatic },
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
      getLStatic(params).then(res => {
        this.tableData = res.result.content;
        this.allNum = res.result.total;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    del(row) {
      let params = {
        ids: [row.id],
        deviceId: this.mid,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)) + "" //随机Id
                                                                           // Random Id
      };
      var show41 = localStorage.getItem("show41");
      if(show41 == 'true'){
        delLStatic(params).then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr100.static.remind[4]")
              });
              this.getList();
            }
          });
      }else{
        this.$confirm(this.$t("vsr100.static.remind[0]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue41\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
          confirmButtonText: this.$t("vsr100.confirm"),
          cancelButtonText: this.$t("vsr100.static.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          delLStatic(params).then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr100.static.remind[4]")
              });
              this.getList();
              localStorage.setItem("show41",localStorage.getItem("checkedValue41"));
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
        deviceId: this.mid,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)) + ""
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
        var show42 = localStorage.getItem("show42");
        if(show42 == 'true'){
          delLStatic(params).then(res => {
              if (res.code == 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr100.static.remind[4]")
                });
                this.getList();
              }
            });
        }else{
          this.$confirm(this.$t("vsr100.static.remind[0]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue42\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
            confirmButtonText: this.$t("vsr100.confirm"),
            cancelButtonText: this.$t("vsr100.static.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning"
          })
          .then(() => {
            delLStatic(params).then(res => {
              if (res.code == 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr100.static.remind[4]")
                });
                this.getList();
                localStorage.setItem("show42",localStorage.getItem("checkedValue42"));
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
      let apiArr = await getFindStaticOutInter({
        devId: this.mid
      });
      this.$refs.editStatic.form.dis = row.distance;
      this.$refs.editStatic.form.ip = row.ip;
      this.$refs.editStatic.form.title = Number(row.tag);
      this.$refs.editStatic.form.nextHopIp = row.nextHopIp;
      this.$refs.editStatic.form.id = row.id;
      this.$refs.editStatic.form.api = row.interName;
      this.$refs.editStatic.apiArr = apiArr.result;
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
.istatic {
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