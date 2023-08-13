<template>
    <div class="vpc">
        <div class="top">
            <img src="@/assets/cloudPage/Icon-fanhui.png" alt="" class="back" v-show="!isShowSubnet" @click="backing()">
            <span>{{$t('cloudNet.vpc.title')}}</span>
            <img src="@/assets/icon_right@2x.png" alt />
            <span>{{$t('cloudNet.vpc.second')}}</span>
            <img src="@/assets/icon_right@2x.png" alt />
            <span>VPC{{$t('cloudNet.vpc.establish')}}</span>
            <img src="@/assets/icon_right@2x.png" alt  v-show="!isShowSubnet"/>
            <span v-show="!isShowSubnet">{{$t('cloudNet.vpc.SubnetManagement')}}</span>
        </div>
        <div class="main">
            <div class="mainTop" id="account">
                <div class="input">
                    <i>
                        <img src="@/assets/newPage/icon_search@2x.png" alt />
                    </i>
                    <el-input v-model="searchContent" class="search" :placeholder="isShowSubnet? $t('cloudNet.vpc.remind[4]'): $t('cloudNet.vpc.remind[5]')" @change="getTableList()"></el-input>
                    </div>
                    <div class="button">
                    <button class="add" v-control @click="addSubent()">
                        <i>
                        <img src="../../../../assets/newPage/icon_add@2x.png" alt />
                        </i>
                        {{$t('cloudNet.vpc.add')}}
                    </button>
                </div>
            </div>
            <div class="list" id="accountList" v-show="isShowSubnet">
                <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%"
                >
                <el-table-column type="index" :label="$t('cloudNet.vpc.index')" width="70" :resizable="false"></el-table-column>
                <el-table-column prop="manufacturerName" :label="$t('cloudNet.vpc.CloudProviders')" width="180" :resizable="false"></el-table-column>
                <el-table-column prop="cloudAccountName" :label="$t('cloudNet.vpc.CloudAccount')" :resizable="false"></el-table-column>
                <el-table-column prop="regionId" :label="$t('cloudNet.vpc.territory')" :resizable="false"></el-table-column>
                <el-table-column prop="vpcName" :label="'VPC' + $t('cloudNet.vpc.name')" :resizable="false"></el-table-column>
                <el-table-column prop="vpcId" label="VPC ID" :resizable="false"></el-table-column>
                <el-table-column prop="cidrBlock" :label="'VPC' + $t('cloudNet.vpc.segment')" :resizable="false"></el-table-column>
                <el-table-column :label="$t('cloudNet.vpc.operate')" :resizable="false">
                    <template slot-scope="scope">
                    <el-button
                        @click="editSubnet(scope.row)"
                        type="text"
                        v-control
                        class="listBotton"
                    >{{$t('cloudNet.vpc.SubnetManagement')}}</el-button>
                    <el-button @click="delSubent(scope.row)" type="text" v-control class="listBotton">{{$t('cloudNet.vpc.del')}}</el-button>
                    </template>
                </el-table-column>
                <!-- <template slot="empty">
                    <div class="empty">
                        <span>{{$t('cloudNet.vpc.NoCloud')}}{{$t('cloudNet.vpc.go')}}</span>
                        <span id="newAdd" @click="addSubent">{{$t('cloudNet.vpc.kadd')}}</span>{{$t('cloudNet.vpc.one')}}
                    </div>
                </template> -->
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
            <Subnet v-if="!isShowSubnet" :searchContent="searchContent" :subnetMsg="subnetMsg" ref="Subnet"></Subnet>
        </div>
        <addVpc v-show="isShowAdd" ref="addSubnet"></addVpc>
        <delVpc v-if="isShowDel" :delMsg="delMsg"></delVpc>
        <addSubnet v-if="isShowAddSubnet" :subnetMsg="subnetMsg" ref="add"></addSubnet>
        <delSubnet v-if="isShowDelSubnet" :delSubnetMsg="this.$refs.Subnet.delSubnetMsg"></delSubnet>
    </div>
</template>

<script>
    import { getVpcListByPage, } from "@/services"
    import addVpc from "./components/addVpc"
    import delVpc from "./components/delVpc"
    import Subnet from "./components/Subnet"
    import addSubnet from "./components/components/addSubnet"
    import delSubnet from "./components/components/delSubnet"
    export default {
        components:{
            addVpc,
            delVpc,
            Subnet,
            addSubnet,
            delSubnet,
        },
        data() {
            return {
                searchContent:"",   //搜索内容
                                    // Search content
                tableData:[],
                //分页器
                // The pager
                total:0,
                page:1,
                pageSize:10,
                delMsg:null,         //删除的VPC名称
                                     // The name of the DELETED VPC
                isShowAdd:false,
                isShowDel:false,
                isShowSubnet:true,
                isShowAddSubnet:false,
                isShowDelSubnet:false,
                subnetMsg:null,     //当前的路由条目数据
                                    // Current route entry data
            }
        },
        methods:{
            //搜索
            // search
            getTableList(){
                if(!this.isShowSubnet){
                  this.$refs.Subnet.getSubnetList();
                }else{
                  this.getVPCList();
                }
                
            },
            //新增
            // add
            async addSubent(){
                if(this.isShowSubnet){
                  this.isShowAdd = true;
                }else{
                  this.isShowAddSubnet = true;
                }
            },
            //删除
            // delete
            delSubent(scope){
                this.isShowDel = true;
                this.delMsg = scope;
            },
            //子网管理
            // Subnet management
            async editSubnet(scope){
                this.subnetMsg = scope;
                this.isShowSubnet = false;
                this.searchContent = "";
            },
            //返回VPC列表
            // Returns the VPC list
            backing(){
              this.isShowSubnet = true;
              this.searchContent = "";
              this.tableData = [];
              this.getVPCList();
            },
            // 索引岁页面变化
            // Index year page changes
            indexMethod(index) {
                return (
                    index + 1 + (this.lNumber == 1 ? 0 : this.lSize * (this.lNumber - 1))
                );
            },
            //页数条数改变
            // The number of pages has changed
            litePage(val){
              this.pageSize = val;
              this.getVPCList()
            },
            //页数改变
            // Page number change
            liteSize(val) {
                this.page = val;
                this.getVPCList()
            },
            //获取VPC列表
            // Gets the VPC list
            getVPCList(){
                getVpcListByPage({
                    content:this.searchContent,
                    page:this.page,
                    pageSize:this.pageSize,
                    tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId,
                }).then(res => {
                    if(res.code === 10000){
                        this.tableData = res.result.records;
                        this.total = res.result.total;
                    }
                })
            },
        },
        mounted() {
            this.getVPCList();
        },
    }
</script>

<style lang="scss" scoped>
.vpc {
  width: 100%;
  height: 100%;
  font-family: arial, sans-serif;
  .top {
    height: 62px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    padding-left: 30px;
    line-height: 62px;
    span:nth-child(1) {
      font-size: 16px;
      color: #333333;
      font-weight: 400;
    }
    span:nth-child(2) {
      font-size: 14px;
      color: #333333;
      font-weight: 400;
    }
    img {
      width: 6px;
      height: 10px;
      margin: 0 4px;
    }
    .back{
        width:10px;
        height:17px;
        position: relative;
        top:4px;
        margin-right:20px;
        margin-left:0;
        cursor: pointer;
        // line-height: 62px;
        // margin:0 20px;
        // margin-top:16px;
    }
    span:nth-child(3) {
      color: #333333;
      font-size: 14px;
      font-weight: 400;
    }
  }
  .main {
    height: calc(100% - 82px);
    margin-top: 20px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    padding: 20px 30px;
    .mainTop {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .input {
        width: 242px;
        position: relative;
        i {
          position: absolute;
          z-index: 10;
          left: 10px;
          top: 9px;
          img {
            width: 16px;
            height: 16px;
          }
        }
        .search {
          width: 242px;
          border-radius: 7px;
        }
      }
      .button {
        display: flex;
        align-items: center;
        .add {
          width: 100px;
          height: 34px;
          background: rgba(54, 120, 200, 1);
          border-radius: 7px;
          border: none;
          padding: 0px;
          font-size: 14px;
          font-family: arial, sans-serif;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          i {
            vertical-align: middle;
            img {
              width: 14px;
              height: 14px;
            }
          }
          &:hover {
            background: #6095d6;
          }
        }
        .cancel {
          width: 100px;
          height: 34px;
          background: rgba(239, 239, 239, 1);
          border-radius: 7px;
          border: 1px solid rgba(209, 215, 224, 1);
          padding: 0px;
          margin-left: 14px;
        }
      }
    }
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
  }
}
#newAdd{
  color:#3678C8;
  cursor: pointer;
}
</style>
<style lang="scss">
    #account {
    .el-input__inner {
        height: 34px;
        padding-left: 36px;
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        &:hover {
            border-color: #3678c8;
        }
    }
}
.vpc .el-input .el-input__inner{
  border:1px solid rgba(209,215,224,1) !important;
}
</style>