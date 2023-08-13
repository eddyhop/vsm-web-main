<template>
  <div class="zhcontrol">
    <div class="search">
      <h3>
        {{$t('TenMan.set')}}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{$t("TenMan.tenMan")}}</span>
      </h3>
    </div>
    <div class="content">
      <div class="control">
        <div class="limit" style="width:auto">
          <div style="float:left;width: 240px;">
          <i>
            <img src="@/assets/newPage/icon_search@2x.png" alt />
          </i>
          <el-input
            prefix-icon="el"
            size="small"
            @change="zhQuery"
            v-model="zhKey"
            :placeholder="$t('TenMan.tenNameOrgName')"
          ></el-input>
          </div>
          <div style="float:left"><el-button type="primary" @click="zhQuery">{{$t('Role.search')}}</el-button></div>
        </div>
        <div class="but">
          <button @click="add" v-show="type==2?false:true" class="add" v-control >
            <img src="@/assets/newPage/icon_add@2x.png" alt />
            {{$t('TenMan.add')}}
          </button>
          <!-- <button>删除</button> -->
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        size="small"
        style="width: 100%"
      >
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('TenMan.index')"
          align="center"
          width="70"
          :resizable="false"
        ></el-table-column> -->
        <el-table-column prop="name" :label="$t('TenMan.tenName')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="description" :label="$t('TenMan.tenDes')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column
          prop="organizationName"
          :label="$t('TenMan.organization')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column prop="domain" :label="$t('TenMan.TenDomainName')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column :label="$t('TenMan.operation')" show-overflow-tooltip :resizable="false">
          <template slot-scope="scope">
            <button
              @click="edit(scope.row)"
              class="edit"
              v-if="scope.row.name!='default'"
              v-control
            >{{$t('TenMan.edit')}}</button>
            <button
              @click="del(scope.row)"
              class="edit"
              v-show="type==2?false:true"
              v-if="scope.row.name!='default'"
              v-control
            >{{$t('TenMan.del')}}</button>
            <button class="edit" style="color:gray" v-if="scope.row.name=='default'">{{$t('TenMan.default')}}</button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allitem"
          :page-size="10"
          @size-change="changeSize"
          @current-change="changePage"
          :current-page="this.num"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <zhcAdd v-show="addShow"></zhcAdd>
    <zhEdit ref="zhEdit" v-show="editShow"></zhEdit>
  </div>
</template>
<script>
import {rentGet, rentDel, userInfo} from "@/services";
import zhcAdd from "./zhcAdd.vue";
import zhEdit from "./zhEdit.vue";
export default {
  data() {
    return {
      type: "",
      userId:"",
      lang: sessionStorage.getItem("lang") || 'en',
      addShow: false,
      editShow: false,
      tableData: [],
      allitem: 0,
      num: 1,
      size: 10,
      zhKey: "",
      tenantId:""
    };
  },
  created() {
    userInfo().then(res => {
      this.tenantId= res.result.type == 2 ? "" :res.result.type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  res.result.tenantId
      this.type = res.result.type;
      this.userId = res.result.userId;
      this.getRent();
    });
  },
  methods: {
    indexMethod(index) {
      return index + 1 + (this.num == 1 ? 0 : this.size * (this.num - 1));
    },
    zhQuery() {
      this.num = 1;
      this.getRent();
    },
    changeSize(val) {
      this.size = val;
      this.num = 1;
      this.getRent();
    },
    changePage(val) {
      this.num = val;
      this.getRent();
    },
    getRent() {
      //获取列表
      // To obtain a list of
      let params = {
        pageSize: this.size,
        pageNumber: this.num,
        searchKey: this.zhKey,
        tenantId: this.tenantId,
        userId: this.userId
      };
      rentGet(params).then(res => {
      //  this.tableData = res.result.content;
        this.allitem = res.result.totalElements;
        // console.log(res)
      /*  res.result.content.forEach(item=>{
          if(item.name!='default'){
            this.tableData.push(item);
            //item.description="default tenants are used by super administrators (globally unique, unmodifiable!).";
            //item.organizationName = "The default organization name"
          }
        })*/
        this.tableData = res.result.content;
      });
    },
    add() {
      //添加
      // add
      this.addShow = true;
    },
    edit(row) {
      //编辑
      // edit
      this.editShow = true;
      this.$refs.zhEdit.form.nameEdit = row.name;
      this.$refs.zhEdit.form.msEdit = row.description;
      this.$refs.zhEdit.form.zzEdit = row.organizationName;
      this.$refs.zhEdit.form.zhEdit = row.domain;
      this.$refs.zhEdit.form.id = row.id;
      // console.log(row)
    },
    del(row) {
      //删除
      // delete
      let params = { id: row.id,userId: this.userId };
      var show96 = localStorage.getItem("show96");
      if(show96 == 'true'){
        
          rentDel(params).then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("TenMan.hint2")
              });
              this.num = 1;
              this.getRent();
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
            }
          });
      }else{
        this.$confirm(this.$t("TenMan.confirmDel")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue96\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("TenMan.ok"),
          cancelButtonText: this.$t("TenMan.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          rentDel(params).then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("TenMan.hint2")
              });
              this.num = 1;
              this.getRent();
              localStorage.setItem("show96",localStorage.getItem("checkedValue96"));
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("TenMan.cancel1")
          });
        });
      }
    }
  },
  components: { zhcAdd, zhEdit }
};
</script>
<style lang="scss" scoped>
.content::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.content {
  flex: 1;
  background: white;
  margin-top: 20px;
  padding: 20px 30px;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  .edit {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    border: none;
    background: none;
  }
  .control {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .limit {
      width: 240px;
    }
    .add {
      font-size: 14px;
      img {
        width: 14px;
        height: 14px;
        position: relative;
        top: 2px;
      }
    }
    .add:hover {
      background: rgba(96, 149, 214, 1);
    }
    button {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: none;
      color: white;
      margin-left: 14px;
    }
    .but button:nth-of-type(2) {
      background: rgba(239, 239, 239, 1);
      color: rgba(51, 51, 51, 1);
      border: 1px solid rgba(209, 215, 224, 1);
    }
  }
}
.search {
  width: 100%;
  height: 62px;
  background: white;
  padding: 20px 30px;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  h3 {
    font-size: 15px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    span {
      font-size: 14px;
      line-height: 8px;
    }
    img {
      width: 5px;
      height: 8px;
      margin-left: 5px;
      margin-right: 5px;
    }
  }
}
.zhcontrol {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  padding-left: 20px;
  flex-flow: column;
}
.limit {
      position: relative;
      i {
        width: 16px;
        height: 16px;
        position: absolute;
        top: 9px;
        left: 10px;
        z-index: 3;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
</style>
<style lang="scss">
.el-input--prefix .el-input__inner {
  padding-right: 0px;
}
</style>