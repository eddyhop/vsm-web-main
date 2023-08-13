<template>
    <div class="routeEntry">
        <div class="content">
            <h4 class="title">
                <span>路由条目</span>
                <i class="close" @click="close"></i>
            </h4>
            <div class="event">
                <div class="btns">
                    <button class="add" @click="addEntry" v-control>
                        <img src="@/assets/newPage/icon_add@2x.png" alt />
                        新增路由条目
                    </button>
                    <button class="cancel" :disabled="entryList.length==1 && entryList[0].instanceId == 'local'" @click="delEntry()" v-control>删除路由条目</button>
                </div>
                <div class="routes">
                    <el-table
                        ref="multipleTable"
                        :data="entryList"
                        stripe
                        size="small"
                        tooltip-effect="dark"
                        style="width: 100%;font-size:14px"
                        @selection-change="handleSelectionChange">
                         <!-- <el-table-column type="index" :index="indexMethod" label="序号" width="50" :resizable="false"></el-table-column> -->
                         <el-table-column type="selection" width="55" :selectable="selectDisableRoom" :resizable="false"></el-table-column>
                         <el-table-column prop="destinationCidrBlock" label="CIDR block" show-overflow-tooltip :resizable="false"></el-table-column>
                         <el-table-column prop="type" label="下一跳类型" show-overflow-tooltip :resizable="false"></el-table-column>
                         <el-table-column prop="instanceId" label="实例ID / 网段" show-overflow-tooltip :resizable="false"></el-table-column>
                         <el-table-column :label="$t('cloudNet.Rute.operate')" :resizable="false">
                            <template slot-scope="scope">
                                <el-button class="edit" type="text" size="small" @click="linkEdit(scope.row)" 
                                style="font-size:14px;font-weight:400"
                                :style="{'color':scope.row.instanceId == 'local'?'#999':'#3678C8'}"
                                     :disabled="scope.row.instanceId == 'local'"
                                >删除</el-button>
                            </template>
                         </el-table-column>  
                         <!-- <template slot="empty">
                            <div class="empty">
                                <span>暂无云-路由表-路由条目，快去</span>
                                <span id="newAdd" @click="addEntry">新增</span>一条
                            </div>
                        </template>      -->
                    </el-table>
                    <!-- 分页器 -->
                    <div class="page">
                        <el-pagination
                            background
                            :page-sizes="[5, 10]"
                            :total="allItem"
                            :page-size="pageSize"
                            @size-change="pageChange"
                             :pager-count="3"
                            @current-change="sizeChange"
                            :current-page="page"
                            layout="total, sizes, prev, pager, next, jumper"
                            style="font-family: arial, sans-serif"
                        ></el-pagination>
                    </div>
                </div>
                <div class="submit">
                    <button
                    class="save"
                    type="primary"
                    @click.prevent="close()"
                    >{{$t('cloudNet.Rute.ok')}}</button>
                </div>
            </div>
        </div>
        <addRoute v-if="isShowAdd" ref="addEntry" :entryScoped="entryScoped" />
        <delRoute v-show="isShowDel" :tableSelected="tableSelected" :entryScoped="entryScoped" />
    </div>
</template>

<script>
    import addRoute from "./components/addRoute";
    import delRoute from "./components/delRoute";
    import { delRouteEntry, } from "@/services";
    export default {
        components:{
            addRoute,
            delRoute,
        },
        props:["entryScoped"],
        data() {
            return {
                routeList:[],
                //分页器
                // The pager
                page:1,
                pageSize:10,
                allItem:0,
                isShowAdd:false,
                isShowDel:false,    
                entryList:[],       //路由条目列表(表格)
                                    // List of routing entries (table)
                tableSelected:"",   //选中的路由条目数据
                                    // The selected route entry data
            }
        },
        methods: {
            //table多选是否禁用
            // Table multi-select whether disabled or not
            // checkboxT(row,index){
            //     if(this.tableSelected.length){
            //         return 0
            //     }else{
            //         return 1
            //     }
            // },
            //路由条目列表
            // Routing entry list
            getEntryList(list){
                this.allItem = list.length;
                this.entryList = list.slice((this.page - 1) * this.pageSize,this.page * this.pageSize);
            },
            close(){
                this.$parent.isShowEntry = false;
            },
            //新增路由条目
            // New route entry
            addEntry(){
                if(this.$parent.entryScoped.routes.length == 50){
                    this.$message.warning("已达到最大路由条目数量")
                }else{
                    this.isShowAdd = true;
                }
            },
            //删除路由条目(多选删除)
            // Delete route entries (multi-select delete)
            delEntry(){
                if(this.tableSelected == ""){
                    this.$message("请勾选需要删除的路由条目")
                }else{
                    this.isShowDel = true;
                }
            },
            //删除路由条目(单个删除)
            // Delete route entries (single delete)
            linkEdit(scope){
                this.isShowDel = true;
                this.tableSelected = scope.destinationCidrBlock;
            },
            handleSelectionChange(val){
                let cidrBlocks = "";
                val.map((v,i) => {
                    cidrBlocks = cidrBlocks + v.destinationCidrBlock + ","
                })
                cidrBlocks = cidrBlocks.substr(0,cidrBlocks.length-1)
                this.tableSelected = cidrBlocks;
            },
            pageChange(val){
                this.pageSize = val;
                this.getEntryList(this.entryScoped.routes)
            },
            sizeChange(val){
                this.page = val;
                this.getEntryList(this.entryScoped.routes)
            },
            selectDisableRoom(row,index){
                if(row.instanceId == "local"){
                    return false;
                }else{
                    return true
                }
            },
            //自定义表格序号
            // Custom table number
            indexMethod(index){
                return (index+1) + (this.page - 1) * this.pageSize;
            },
        },
    }
</script>

<style lang="scss" scoped>
.routeEntry{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(176, 181, 194, 0.3);
    z-index: 100;
}
.content{
    width:644px;
    height:656px;
    background:rgba(255,255,255,1);
    box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
    border-radius:2px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: auto;
    .title {
        width: 100%;
        height: 48px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        border-bottom: 1px solid rgba(231, 231, 231, 1);
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        i {
        width: 14px;
        height: 14px;
        background: url("../../../../../assets/icon_close.png") no-repeat;
        background-size: cover;
        cursor: pointer;
        }
    }
}
.btns {
  text-align: right;
  padding-bottom: 30px;
  button {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    width: 130px;
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
  .cancel {
        width: 130px;
        height: 34px;
        padding: 0px;
        margin-left: 14px;
        background:rgba(239,239,239,1);
        border-radius:2px;
        border:1px solid rgba(209,215,224,1);
        color: #333333;
    }
}
.event{
    padding:30px;
}
.routes{
    width:100%;
    min-height: 420px;
    background:rgba(255,255,255,1);
    border-radius:2px;
    border:1px solid rgba(209,215,224,1);
    position: relative;
    display:flex;
    flex-direction: column;
    justify-content:space-between ;
    align-items: center;;

}
.page{
    margin:15px 0px;
    // position: absolute;
    // bottom:19px;
    // left:50%;
    // transform: translate(-50%,0);
}
#newAdd{
  color:#3678C8;
  cursor: pointer;
}
.submit {
  width: 100%;
  text-align: center;
  margin-top:30px;
  .save {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    outline: none;
    border: 0;
    cursor: pointer;
    margin-left: 18px;
  }
  .cancel {
    width: 70px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    margin-left: 18px;
    cursor: pointer;
  }
  .save:hover {
    background: rgba(96, 149, 214, 1);
    border: 0;
  }
}
.routes .el-table::before {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0px;
}
.page .el-select--mini{
    height:26px;
}

</style>
<style lang="scss">
    .routes .el-table th > .cell{
        font-size: 14px;
    }
    body .el-table th.gutter {
        display: table-cell !important
    }
    .routes .page .el-input{
        height:28px;
    }
    .routes .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #3678C8;
        color: #FFF;
        font-weight: normal;
        font-family: arial, sans-serif;
    }
</style>