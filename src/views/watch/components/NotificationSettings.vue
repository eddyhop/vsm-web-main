<template>
  <div class="content devList setting">
    <div class="head">
      <button class="bg" @click="hit(0)">{{this.$t('Monit.set')}}</button>
      <button class="add" @click="hit(1)">{{this.$t('Monit.add')}}</button>
    </div>
    <el-table
      :data="tableData"
      stripe
      border
      size="small"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <!-- <el-table-column
        type="index"
        :index="indexMethod"
        :label="$t('Upgrade.index')"
        align="center"
        width="70"
        :resizable="false"
      ></el-table-column> -->
      <el-table-column prop="name" :label="this.$t('Monit.name')" :resizable="false" width="180"></el-table-column>
      <el-table-column prop="address" :resizable="false" :label="this.$t('Monit.type')">
        <template slot-scope="scope">
          <span>{{scope.row.type == 2?$t('Monit.outlink'):$t('Monit.outdev')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" show-overflow-tooltip :resizable="false" :label="$t('Monit.devLink')">
        <template slot-scope="scope">
          <span v-for="i in scope.row.items" :key="i.id">{{i.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" :resizable="false" :label="$t('Monit.people')">
        <template slot-scope="scope">
          <span v-for="i in scope.row.noticeMails" :key="i">{{i}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" :resizable="false" :label="$t('Monit.operate')">
        <template slot-scope="scope">
          <button class="edit" @click="edit(scope.row)" v-control>{{$t('Monit.edit')}}</button>
          <button class="edit" @click="del(scope.row)" v-control>{{$t('Monit.del')}}</button>
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
    <Edit v-show="isShowEdit" :scopeEdit="scopeEdit" ref="edit"></Edit>
    <Add v-show="isShowAdd" :scopeAdd="scopeAdd" ref="Add"></Add>
    <Consignee v-show="isShowConsignee" :scopeConsignee="scopeConsignee" ref="consignee"></Consignee>
  </div>
</template>
<script>
// 请求连接地址
// Request connection address
import {
  getMail,
  getMailGroup,
  getMailSelectType,
  mailDel, userInfo,
} from "@/services/index.js";
import Edit from "./edit";
import Add from "./add";
import Consignee from "./consignee";
export default {
  components: { Edit, Add, Consignee },
  data() {
    return {
      type: 0,
      state: "",
      multipleSelection: [],
      tableData: [],
      lSize: 10, //每页条数
                 // Number each page
      lNumber: 1, //页数
                  // Number of pages
      alllite: 0, //总条数
                  // The total number of article
      scopeEdit: null, //点击编辑当前的账号的信息
                       // Click edit the current account information
      scopeConsignee: null,
      scopeAdd: null, //点击编辑当前的账号的信息
                      // Click edit the current account information
      isShowEdit: false,
      isShowAdd: false,
      isShowConsignee: false,
    };
  },
  created() {
    this.tenantId = sessionStorage.getItem("tenantValue") ;

    userInfo().then(res => {
      this.id = res.result.userId;
      this.userType = res.result.type;

    });

    this.getList();
    // this.getInfos();
    // console.log(this.tenantId+'-------所需数据')
    // Console. Log (this.tenantid +'-- Data needed ')
    // this.getRestaurantsData();
  },
  methods: {
    getList(params) {
      getMail(params).then((res) => {
        this.alllite = res.result.totalElements;
        this.tableData = res.result.content;
      });
    },
    async edit(row) {
      this.isShowEdit = true;
      let a = await getMailGroup().then((res) => {
        this.$refs.edit.groupList = res.result;
      });
      let b = await getMailSelectType({ type: 1 }).then((res) => {
        this.$refs.edit.data = res.result.freeItems.concat(
          res.result.selectedItems
        );
        this.$refs.edit.data2 = res.result.freeItems.concat(
          res.result.selectedItems
        );
        // this.$refs.Add.value = this.$refs.Add.value2 = res.result.selectedItems.map(item=>{
        //   return item.name+','+item.id
        // })
      });
      let c = await getMailSelectType({ type: 2 }).then((res) => {
        this.$refs.edit.linkData = res.result.freeItems.concat(
          res.result.selectedItems
        );
        this.$refs.edit.linkData2 = res.result.freeItems.concat(
          res.result.selectedItems
        );
        // this.$refs.Add.linkValue = this.$refs.Add.linkValue2 = res.result.selectedItems.map(item=>{
        //   return item.name+','+item.id
        // })
      });
      this.$refs.edit.dataInit(row);
      // console.log(row)
    },
    del(row) {
      var show102 = localStorage.getItem("show102");
      if(show102 == 'true'){
        
          mailDel({ id: row.id }).then((res) => {
            if (res.code == 10000) {
              this.$message({
                message: this.$t('Monit.remind1'),
                type: "success",
              });
              this.getList();
            } else {
              this.$message({
                message: this.$t('Monit.remind2'),
                type: "warning",
              });
            }
          });
      }else{
        this.$confirm(this.$t("App.hint1")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue102\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("App.hint"), {
          confirmButtonText: this.$t("App.ok"),
          cancelButtonText: this.$t("App.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning",
        })
        .then(() => {
          mailDel({ id: row.id }).then((res) => {
            if (res.code == 10000) {
              this.$message({
                message: this.$t('Monit.remind1'),
                type: "success",
              });
              this.getList();
              localStorage.setItem("show102",localStorage.getItem("checkedValue102"));
            } else {
              this.$message({
                message: this.$t('Monit.remind2'),
                type: "warning",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("App.hint2"),
          });
        });
      }
      
    },
    // 索引岁页面变化
    // Index year page changes
    indexMethod(index) {
      return (
        index + 1 + (this.lNumber == 1 ? 0 : this.lSize * (this.lNumber - 1))
      );
    },
    //页数总条目改变
    // Total page entries change
    litePage(val) {
      this.lSize = val;
      let params = {
        pageSize: this.lSize,
        pageNumber: 1,
      };
      this.getList(params);
    },
    //页数改变
    // Page number change
    liteSize(val) {
      this.lNumber = val;
      let params = {
        pageSize: this.lSize,
        pageNumber: val,
      };
      this.getList(params);
    },
    // 改变按钮样式,切换已处理和待处理
    // Change the button style to switch between processed and pending
    hit(i) {
      switch (i) {
        case 0:
          getMailGroup().then((res) => {
            this.$refs.consignee.dynamicValidateForm.domains = res.result.map(
              (item) => {
                let obj = {
                  id: item.id,
                  name: item.name,
                  email: item.noticeMail,
                };
                return obj;
              }
            );
            // console.log(this.$refs.consignee.dynamicValidateForm.domains)
          });
          this.isShowConsignee = true;
          break;
        case 1:
          this.isShowAdd = true;
          getMailGroup().then((res) => {
            this.$refs.Add.groupList = res.result;
          });
          getMailSelectType({ type: 1 }).then((res) => {
            this.$refs.Add.data = res.result.freeItems.concat(
              res.result.selectedItems
            );
            this.$refs.Add.data2 = res.result.freeItems.concat(
              res.result.selectedItems
            );
            // this.$refs.Add.value = this.$refs.Add.value2 = res.result.selectedItems.map(item=>{
            //   return item.name+','+item.id
            // })
          });
          getMailSelectType({ type: 2 }).then((res) => {
            this.$refs.Add.linkData = res.result.freeItems.concat(
              res.result.selectedItems
            );
            this.$refs.Add.linkData2 = res.result.freeItems.concat(
              res.result.selectedItems
            );
            // this.$refs.Add.linkValue = this.$refs.Add.linkValue2 = res.result.selectedItems.map(item=>{
            //   return item.name+','+item.id
            // })
          });
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: calc(100% - 154px);
  background: #fff;
  // padding: 20px 30px 0 30px;
  margin-top: 20px;
  overflow: auto;
  .edit {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    border: none;
    background: none;
  }
  .head {
    width: 100%;
    height: 34px;
    // display: flex;
    text-align: right;
    margin-bottom: 20px;
    button {
      width: 106px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      outline: none;
      font-size: 14px;
      color: #fff;
      &:hover {
        background: rgba(96, 149, 214, 1);
        color: #fff;
        border: none;
      }
    }
    .bg {
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: 1px solid #d1d7e0;
      cursor: pointer;
      margin-right: 14px;
      &:hover {
        background: rgba(96, 149, 214, 1);
        border: none;
      }
    }
    .add {
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: 1px solid #d1d7e0;
      cursor: pointer;
      &:hover {
        background: rgba(96, 149, 214, 1);
        border: none;
      }
    }
  }
  .table {
    margin-top: 20px;
    overflow: visible;
  }
  .page {
    padding-bottom: 20px;
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
</style>