<template>
  <div class="zhpath">
    <div class="search">
      <h3>{{$t('TenDomain.base')}}<img src="@/assets/icon_right@2x.png" alt=""/><span>{{$t('TenDomain.tenDomain')}}</span></h3>
      <el-row :gutter="20">
        <el-col :span="5">
          <div class="opt">
            <span class="lab-height">{{$t('TenDomain.tenant')}}</span>
            <el-select filterable size="small" v-model="rent" :placeholder="$t('TenDomain.hint6')" @change="choseTenant(rent)" :disabled="type==2?false:true">
              <el-option value="" :label="$t('TenDomain.all')"></el-option>
              <el-option v-for="(item,index) in rentList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="opt">
            <div class="limit">
              <i>
                <img src="@/assets/newPage/icon_search@2x.png" alt />
              </i>
              <el-input  v-model="searchKey" prefix-icon="el" :placeholder="$t('TenDomain.domainName')" size="small"></el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="opt op-but">
            <button v-debounce="query">{{$t('TenDomain.search')}}</button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <div class="control">
        <div class="but">
          <button class="add" v-show="type==2" @click="add">{{$t('TenDomain.add')}}</button>
        </div>
      </div>
      <el-table :data="tableData" border stripe size="small" style="width: 100%">
        <el-table-column prop="name" :label="$t('TenDomain.name')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="tenantName" :label="$t('TenDomain.tenant')" show-overflow-tooltip :resizable="false"></el-table-column>
        <!-- <el-table-column prop="maxItem" :label="$t('TenDomain.maxiMum')" show-overflow-tooltip :resizable="false"></el-table-column> -->
        <el-table-column prop="description" :label="$t('TenDomain.description')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column :label="$t('TenDomain.operation')" show-overflow-tooltip :resizable="false">
          <template slot-scope="scope">
            <span v-if="scope.row.name!='default'">
              <button class="edit" v-show="type==2" @click="edit(scope.row)" v-control>{{$t('TenDomain.edit')}}</button>
              <button class="edit" @click="del(scope.row)" v-control>{{$t('TenDomain.del')}}</button>
            </span>
              <span class="edit" v-else :style="'background:#EFEFEF;color:#979797'">{{$t('TenDomain.default')}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allItem"
          :page-size="10"
          @size-change="changeSize"
          @current-change="changePage"
          :current-page="this.num"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addZh ref="addZh" v-show="addShow"></addZh>
    <editZh ref="editZh" v-show="editShow"></editZh>
  </div>
</template>
<script>
import addZh from "./addzh";
import editZh from "./editzh";
import { rentRF, rentRFdel,deviceSelect } from "@/services";
export default {
  data() {
    return {
      addShow: false,
      editShow: false,
      searchKey: "",
      tableData: [],
      allItem: 0,
      num: 1,
      size: 10,
      rent:JSON.parse(sessionStorage.getItem('userData')).tenantId,
      rentList:[],
      type:JSON.parse(sessionStorage.getItem('userData')).type
    };
  },
  created() {
    this.getAll();
  },
  methods: {
    async getAll(){
      let list = await this.getList()
      let select = await this.getSelect()
    },
    getSelect(){
      deviceSelect().then(res=>{
        this.rentList = res.result
        this.$refs.addZh.form.options = res.result
        this.$refs.editZh.form.options = res.result
      })
    },
    choseTenant(val){
      this.num = 1
      this.getList()
    },
    query(){
      this.num = 1
      this.getList()
    },
    edit(row){
      this.editShow = true
      this.$refs.editZh.form.name = row.name
      this.$refs.editZh.form.rent = row.tenantId
      this.$refs.editZh.form.max = row.maxItem
      this.$refs.editZh.form.describe = row.description
      this.$refs.editZh.form.id = row.id
    },
    del(row) {
      var show8 = localStorage.getItem("show8");
      if(show8 == 'true') {
        rentRFdel({ id: row.id }).then(res => {
          if (res.code == 10000) {
            this.$message({
              type: "success",
              message: this.$t('TenDomain.hint5')
            });
            this.getList();
            localStorage.setItem("show8",localStorage.getItem("checkedValue8"));
          }else{
            this.$message({
              type: "warning",
              message: res.message
            });
          }
        });
      }else{
        this.$confirm(this.$t('TenDomain.hint3')+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='sessionStorage.setItem(\"checkedValue8\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t('TenDomain.ok'),
          cancelButtonText: this.$t('TenDomain.cancel'),
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          rentRFdel({ id: row.id }).then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t('TenDomain.hint5')
              });
              this.getList();
              localStorage.setItem("show8",localStorage.getItem("checkedValue8"));
            }else{
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
            message: this.$t('TenDomain.hint4')
          });
        });
      }
    },
    changePage(val) {
      this.num = val;
      this.getList();
    },
    changeSize(val) {
      this.size = val;
      this.num = 1
      this.getList();
    },
    add() {
      this.addShow = true;
    },
    getList() {
      let params = {
          tenantId:this.type==1?JSON.parse(sessionStorage.getItem('userData')).tenantId:this.rent,
          page:this.num,
          pageSize:this.size,
          searchKey:this.searchKey
      }
      rentRF(params).then(res => {
        this.tableData = res.result.content;
        this.allItem = res.result.totalElements;
      });
    }
  },
  components: { addZh,editZh }
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
  .control {
    text-align: right;
    // display: flex;
    // justify-content: space-between;
    margin-bottom: 20px;
    .limit {
      width: 240px;
    }
    .add:hover{
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
  .edit {
      // width:28px;
      height: 20px;
      border: none;
      background: none;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(54, 120, 200, 1);
    }
}
.search {
  width: 100%;
  height: 116px;
  background: white;
  padding: 20px 30px;
  position: relative;
  .opt{
    display: flex;
    margin-top: 20px;
    span{  
      width: 108px;
      line-height: 34px;
      color: #333333;
    }
    .limit{
      width: 250px;
    }
    button{
      width:100px;
      height:34px;
      background:rgba(54,120,200,1);
      border-radius:2px;
      font-size:14px;
      font-family:arial, sans-serif;
      font-weight:400;
      color:rgba(255,255,255,1);
      border: none
    }
    button:hover{
      background: rgba(96, 149, 214, 1);
    }
  }
  .op-but{
    justify-content: flex-end;
  }
  h3 {
    font-size: 15px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    span{
      font-size: 14px;
      line-height: 8px;
    }
    img{
      width:5px;
      height:8px;
      margin-left: 5px;
      margin-right: 5px;
    }
  }
}
.zhpath {
  width: 100%;
  height: 100%;
  // background: white;
  box-sizing: border-box;
  display: flex;
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