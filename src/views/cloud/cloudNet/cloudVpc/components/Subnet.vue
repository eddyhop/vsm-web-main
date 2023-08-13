<template>
     <div class="list" id="accountList">
        <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        >
            <el-table-column type="index" :label="$t('cloudNet.vpc.index')" width="70" :resizable="false"></el-table-column>
            <el-table-column prop="cloudAccountName" :label="$t('cloudNet.vpc.CloudAccount')" :resizable="false"></el-table-column>
            <el-table-column prop="regionId" :label="$t('cloudNet.vpc.territory')" :resizable="false"></el-table-column>
            <el-table-column prop="zoneId" :label="$t('cloudNet.vpc.ThAvailableArea')" width="180" :resizable="false"></el-table-column>
            <el-table-column prop="subnetName" :label="$t('cloudNet.vpc.subnet')+$t('cloudNet.vpc.name')" :resizable="false"></el-table-column>
            <el-table-column prop="subnetId" :label="$t('cloudNet.vpc.subnet')+ 'ID'" :resizable="false"></el-table-column>
            <el-table-column prop="cidrBlock" :label="$t('cloudNet.vpc.subnet')" :resizable="false"></el-table-column>
            <el-table-column prop="vpcCidrBlock" :label="'VPC'+$t('cloudNet.vpc.segment')" :resizable="false"></el-table-column>
            <el-table-column :label="$t('cloudNet.vpc.operate')" :resizable="false">
                <template slot-scope="scope">
                    <el-button @click="delSubnet(scope.row)" type="text" v-control class="listBotton">{{$t('cloudNet.vpc.del')}}</el-button>
                </template>
            </el-table-column>
            <template slot="empty">
                <div class="empty">
                    <span>{{$t('cloudNet.vpc.NoCloudSubnet')}}{{$t('cloudNet.vpc.go')}}</span>
                    <span id="newAdd" @click="addSubnet()">{{$t('cloudNet.vpc.kadd')}}</span>{{$t('cloudNet.vpc.one')}}
                </div>
            </template>
            </el-table>
            <div class="page">
            <el-pagination
                :page-sizes="[5, 10]"
                :total="total"
                @size-change="litePage"
                @current-change="liteSize"
                :current-page="page"
                :page-size="10"
                layout="total, sizes, prev, next, jumper"
                style="font-family: arial, sans-serif"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
    import { getSubnetList, } from "@/services";
    export default {
        props:["subnetMsg","searchContent"],
        data() {
            return {
                tableData:[],
                //分页器
                // The pager
                total:0,
                page:1,
                pageSize:10,
                delSubnetMsg:null,
            }
        },
        methods:{
            //新增子网
            // The new subnet
            addSubnet(){
                if(this.total == 200){
                    this.$message.warning("已达到最大子网数量")
                }else{
                    this.$parent.addSubent();
                }
            },
            //页数条数改变
            // The number of pages has changed
            litePage(val){
                this.pageSize = val;
                this.getSubnetList();
            },
            //页数改变
            // Page number change
            liteSize(val){
                this.page = val;
                this.getSubnetList();
            },
            //获取子网列表
            // Gets the subnet list
            getSubnetList(){
                getSubnetList({
                    content:this.$parent.searchContent,
                    page:this.page,
                    pageSize:this.pageSize,
                    tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId,
                    vpcId:this.subnetMsg.vpcId
                }).then(res => {
                    if(res.code === 10000){
                        this.tableData = res.result.records;
                        this.total = res.result.total;
                    }
                })
            },
            //删除子网
            // Delete the subnet
            delSubnet(scope){
                this.delSubnetMsg = scope;
                this.$parent.isShowDelSubnet = true;
            },
            
        },
        mounted(){
            this.page = 1;
            this.pageSize = 10;
            this.getSubnetList();
        }
    }
</script>

<style lang="scss" scoped>
.list {
    .listBotton {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    }
    .empty {
    font-size: 16px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    }
}
#newAdd{
  color:#3678C8;
  cursor: pointer;
}
</style>