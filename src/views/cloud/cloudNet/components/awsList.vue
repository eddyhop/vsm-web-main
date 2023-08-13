<template>
  <div class="awsMain">
    <div class="btns">
      <button class="add" @click="addEvent" v-control>
        <img src="@/assets/newPage/icon_add@2x.png" alt />
        {{$t('cloudNet.Rute.AddRoutingTable')}}
      </button>
    </div>
    <div id="routeList">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        stripe
        size="small"
        tooltip-effect="dark"
        style="width: 100%"
        :cell-class-name="tableState"
      >
        <!-- <template slot="empty">
              <p class="noInfo">暂无基础-应用，快去 <span @click="add">新增</span>一条</p>
        </template>-->
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('cloudNet.Rute.index')"
          align="center"
          width="70"
          :resizable="false"
        ></el-table-column> -->
        <el-table-column prop="accountName" :label="$t('cloudNet.Rute.CloudAccountName')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="routeTableId" :label="$t('cloudNet.Rute.routingTable')+'ID'" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="associationMain" :label="$t('cloudNet.Rute.mainTable')" show-overflow-tooltip :resizable="false">
          <template slot-scope="scope">
            {{scope.row.associationMain?$t('cloudNet.Rute.yes'):$t('cloudNet.Rute.no')}}
          </template>
        </el-table-column>
        <el-table-column prop="vpcId" label="VPC ID" show-overflow-tooltip :resizable="false"></el-table-column>
        <!-- <el-table-column prop="destinationPort" :label="$t('attr.goalPort')" show-overflow-tooltip></el-table-column> -->
        <el-table-column :label="$t('cloudNet.Rute.operate')" :resizable="false">
          <template slot-scope="scope">
            <!-- <button class="edit" @click="edit(scope.row)" v-control>{{$t('attr.edit')}}</button> -->
            <el-button
              class="edit"
              type="text"
              size="small"
              @click="routerEdit(scope.row)"
              v-control
              style="color:#3678C8;font-size:14px;font-weight:400"
            >{{$t('cloudNet.Rute.route')}}</el-button>
            <el-button
              class="edit"
              type="text"
              size="small"
              @click="linkEdit(scope.row)"
              v-control
              style="color:#3678C8;font-size:14px;font-weight:400"
            >{{$t('cloudNet.Rute.AssociatedSubnets')}}</el-button>
            <el-button
              class="edit"
              type="text"
              size="small"
              @click="linkClose(scope.row)"
              v-control
              style="color:#3678C8;font-size:14px;font-weight:400"
            >{{$t('cloudNet.Rute.CancelTheAssociated')}}</el-button>
            <el-button
              class="edit"
              type="text"
              size="small"
              @click="del(scope.row)"
              v-control
              style="color:#3678C8;font-size:14px;font-weight:400"
            >{{$t('cloudNet.Rute.del')}}</el-button>
            <!-- <button class="edit" @click="copy(scope.row)" v-control>{{$t('attr.copy')}}</button> -->
          </template>
        </el-table-column>
        <!-- <template slot="empty">
          <div class="empty">
            <span>{{$t("cloudNet.Rute.NoCloud")}}{{$t("cloudNet.Rute.go")}}</span>
            <span id="newAdd" @click="addEvent">{{$t("cloudNet.Rute.add")}}</span>{{$t("cloudNet.Rute.one")}}
          </div>
        </template> -->
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allItem"
          :page-size="pageSize"
          @size-change="pageChange"
          @current-change="sizeChange"
          :current-page="page"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    
    <addAws v-if="isShowAdd" />
    <closeAws v-show="isShowDel" ref="delRoute" :delScoped="delScoped" />
    <AssociatedSubnets v-show="isShowAss" ref="Ass" :bindScoped="bindScoped" />
    <unAssociatedSubnets v-show="isShowUnAss" :unBindScoped="unBindScoped" ref="unAss" />
    <routeEntry v-show="isShowEntry" :entryScoped="entryScoped" ref="entry" />
  </div>
</template>
<script>
import addAws from "./awsComponents/addAws"
import closeAws from "./awsComponents/closeAws"
import AssociatedSubnets from "./awsComponents/AssociatedSubnets"
import unAssociatedSubnets from "./awsComponents/unAssociatedSubnets"
import routeEntry from "./awsComponents/routeEntry"
import { getRouteById, } from "@/services"

export default {
  props: ["routeList"],
  components: {
      addAws,
      closeAws,
      AssociatedSubnets,
      unAssociatedSubnets,
      routeEntry
  },
  data() {
    return {
      tableData: [],
      page:1,
      pageSize:10,
      allItem:0,
      isShowAdd:false,
      isShowDel:false,
      isShowAss:false,
      isShowUnAss:false,
      isShowEntry:false,
      delScoped:null,     //当前删除的路由表数据
                          // The currently deleted routing table data
      bindScoped:null,    //当前关联子网的路由表数据
                          // The routing table data for the current associated subnet
      unBindScoped:null,  //当前取消关联的路由表数据
                          // Currently unassociated routing table data
      entryScoped:[],   //当前路由表的路由条目数据
                        // Route entry data for the current route table
    };
  },
  computed: {},
  methods: {
    //获取路由表数据
    // Gets the routing table data
    getTableData(list){
      this.tableData = list.slice((this.page-1) * this.pageSize,this.pageSize * this.page);
    },
    //序号
    // The serial number
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //路由条目
    // Routing entry
    routerEdit(scope){
      this.isShowEntry = true
      this.entryScoped = scope;
      this.$refs.entry.getEntryList(scope.routes)
    },
    //关联子网
    // Associated subnets
    linkEdit(scope){
      // this.isShowAss = true;
      this.bindScoped = scope;
      this.$refs.Ass.getSubnetUnbind(scope)
    },
    //取消关联
    // Cancel the associated
    linkClose(scope){
      if(scope.routeTableAssociations.length == 0){
        this.$message("该路由表暂未关联任何子网")
      }else{
        // this.isShowUnAss = true;
        this.unBindScoped = scope;
        this.$refs.unAss.getSubnetbind(scope)
      }
    },
    //删除
    // delete
    del(scope){
      if(scope.associationMain){
        this.$message.warning("该路由表为主路由表，不可删除")
      }else{
        if(scope.routeTableAssociations.length == 0){
          this.isShowDel = true;
          this.delScoped = scope;
        }else{
          this.$message.warning("请先取消所关联的子网")
        }
      }
      
    },
    //根据ID获取路由表
    // Gets the routing table based on ID
    getNewEntry(list){
        let Index = list.findIndex((v,i) => {
            return v.routeTableId == this.entryScoped.routeTableId;
        })
        this.entryScoped = list[Index];
        this.$refs.entry.getEntryList(this.entryScoped.routes)
    },
    //页数改变
    // Page number change
    pageChange(val){
      this.pageSize = val;
      this.getTableData(this.routeList)
    },
    //条数改变
    // A number of changes
    sizeChange(val){
      this.page = val;
      this.getTableData(this.routeList)

    },
    //分页器数据总数赋值
    // Assignment of total pager data
    pagenation(list){
      this.allItem = list.length;
    },
    //新增
    // add
    addEvent(){
      if(this.$parent.routeList.length == 200){
        this.$message.warning("已达到最大路由数量")
      }else{
        this.isShowAdd = true;
      }
    },
    // 状态颜色切换
    // State color switch
    tableState({ row }) {
      if (!row.associationMain) {
        return "losed";
      } else{
        return "usabled";
      }
    },
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.awsMain {
  flex: 1;
  padding: 20px 30px;
  background: #fff;
  margin-top: 20px;
  overflow-x: hidden;
  overflow-y: auto;
}
.awsMain::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.awsMain::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.awsMain::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.btns {
  text-align: right;
  padding-bottom: 20px;
  button {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    width: 160px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: none;
    color: white;
    margin-left: 14px;
  }
  .add {
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
}
#newAdd{
  color:#3678C8;
  cursor: pointer;
}

</style>
<style lang="scss">
  #routeList {
  .el-table .losed:nth-child(4) .cell {
    color: #ba2727;
  }
  .el-table .usabled:nth-child(4) .cell {
    color: #029805;
  }
}
#routeList .page .el-input{
  height:28px;    
}
</style>
