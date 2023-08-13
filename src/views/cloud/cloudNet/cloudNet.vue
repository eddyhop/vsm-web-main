<template>
  <div class="cloudNet">
    <div class="top">
      <h3>
        {{$t('cloudNet.Rute.title')}}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{$t('cloudNet.Rute.second')}}</span>
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{$t('cloudNet.Rute.RoutingManagement')}}</span>
      </h3>
      <div class="btns">
        <button @click="cloudType='AWS_CHINA',startgetList(),tabs=true" :class="{active:cloudType=='AWS_CHINA'}">aws{{$t('cloudNet.Rute.ChinaRoutingTable')}}</button>
        <!-- <button @click="cloudType='ALIBABACLOUD',tabs=false" :class="{active:cloudType=='ALIBABACLOUD'}">azure{{$t('cloudNet.Rute.routingTable')}}</button> -->
      </div>
      <div class="search">
        <div class="selectData">
          <div class="searchItem">
            <span>{{$t('cloudNet.Rute.CloudAcount')}}</span>
            <el-select filterable v-model="cloudAccount" :placeholder="$t('cloudNet.Rute.remind[0]')" @change="cloudAccountChange()">
              <el-option 
              v-for="item in cloudAccountList" 
              :key="item.id" 
              :label="item.accountName" 
              :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="searchItem">
            <span>VPC{{$t('cloudNet.Rute.territory')}}</span>
            <el-select filterable v-model="regionId" :placeholder="$t('cloudNet.Rute.remind[0]')" @change="regionIdChange()">
              <el-option 
              v-for="item in regionList" 
              :key="item.regionId" 
              :label="item.localName" 
              :value="item.regionId"></el-option>
            </el-select>
          </div>
          <div class="searchItem">
            <span>VPC ID</span>
            <el-select filterable v-model="vpcId" :placeholder="$t('cloudNet.Rute.remind[0]')" @change="vpcIdChange()">
              <el-option 
              v-for="item in vpcList" 
              :key="item.vpcId" 
              :label="item.vpcId" 
              :value="item.vpcId"></el-option>
            </el-select>
          </div>
        </div>
        <div>
          <button class="add" @click="searchRoute()">{{$t('cloudNet.Rute.search')}}</button>
        </div>
      </div>
    </div>
    <awsList v-show="tabs" :routeList="routeList" ref="awsList" />
    <azureList v-show="!tabs" />
  </div>
</template>
<script>
import awsList from "./components/awsList";
import azureList from "./components/azureList";
import { getCloudAccountList, getRegionList, getVpcList, getRouteList, getAccountByType} from "@/services"
export default {
  props: {},
  components: {
    awsList,
    azureList
  },
  data() {
    return {
      tabs: true,
      tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId,
      cloudType:"AWS_CHINA",  //当前服务器类型
                              // Current server type
      cloudAccount:"",        //下拉选择器云账号
                              // Drop down the selector cloud account
      cloudAccountList:[],    //云账号列表
                              // Cloud account List
      regionId:"",            //下拉选择器地域ID
                              // Drop down selector region ID
      regionList:[],          //地域列表
                              // Regional list
      vpcId:"",               //下拉选择器vpcID
                              // The drop-down selector vpcID
      vpcList:[],             //VPC列表
                              // VPC list
      routeList:[],           //路由表列表
                              // Routing table list
    };
  },
  computed: {},
  methods: {
    //搜索
    // search
    searchRoute(){
      this.getRouteList();
    },
    //云账号改变时回调
    // Call back when your cloud account changes
    cloudAccountChange(){
      this.getVPCList();
      this.$store.state.Routing.cloudAccount = this.cloudAccount;
    },
    //VPC地域改变时回调
    // Call-back when VPC geography changes
    regionIdChange(){
      this.getVPCList();
      this.$store.state.Routing.regionId = this.regionId;
    },
    //VPCID改变回调
    // VPCID changes callbacks
    vpcIdChange(){
      this.$store.state.Routing.vpcId = this.vpcId;
    },
    //获取路由表列表
    // Gets a list of routing tables
    getRouteList(status=0){
      getRouteList({
        cloudAccountId:this.cloudAccount,
        regionId:this.regionId,
        vpcId:this.vpcId
      }).then(res => {
        if(res.code === 10000){
          this.routeList = res.result;
          this.$refs.awsList.pagenation(res.result);
          this.$refs.awsList.getTableData(res.result);
          if(status == 1){
            this.$refs.awsList.getNewEntry(res.result);
          }
        }
      })
    },
    //获取VPC列表
    // Gets the VPC list
    getVPCList(){
      getVpcList({
        cloudAccountId:this.cloudAccount,
        regionId:this.regionId,
      }).then(res => {
        if(res.code === 10000){
          this.vpcList = res.result;
          this.vpcId = res.result[0].vpcId;
          this.$store.state.Routing.vpcId = this.vpcId;
          this.$store.state.Routing.vpcList = res.result;
        }
      })
    },
    //开始获取云账号列表、地域列表、VPC列表
    // Start getting cloud account lists, geographic lists, and VPC lists
    async startgetList(){
      await getAccountByType({
        cloudType:this.cloudType,
        tenantId:this.tenantId,
      }).then(res => {
        if(res.code === 10000){
          this.cloudAccountList = res.result;
          this.$store.state.Routing.cloudAccountList = res.result;
          this.cloudAccount = res.result[0].id;
          this.$store.state.Routing.cloudAccount = this.cloudAccount;
        }
      })
      await getRegionList({
        cloudType:this.cloudType,
        tenantId:this.tenantId,
      }).then(res => {
        if(res.code === 10000){
          this.regionList = res.result;
          this.$store.state.Routing.regionList = res.result;
          this.regionId = res.result[0].regionId;
          this.$store.state.Routing.regionId = this.regionId;
        }
      })
      await getVpcList({
        cloudAccountId:this.cloudAccount,
        regionId:this.regionId,
      }).then(res => {
        if(res.code === 10000){
          this.vpcList = res.result;
          this.vpcId = res.result[0].vpcId;
          this.$store.state.Routing.vpcId = this.vpcId;
          this.$store.state.Routing.vpcList = res.result;
        }
      })
      await this.getRouteList();
    }
  },
  created() {
    this.$store.state.Routing.cloudType = this.cloudType;
  },
  mounted() {
    this.startgetList();
  }
};
</script>
<style scoped lang="scss">
.cloudNet {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.top {
  width: 100%;
  padding: 20px 30px 20px 30px;
  background: #fff;
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
.btns {
  padding-top: 20px;
  button {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    width: 175px;
    height: 34px;
    background: #fff;
    border-radius: 7px;
    border: none;
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-right: 26px;
  }
  .active {
    background: rgba(54, 120, 200, 1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 1);
  }
  .active:hover {
    background: rgba(96, 149, 214, 1);
  }
}
.search {
  width: 100%;
  padding-top: 20px;
  zoom: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .add{
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
    &:hover {
      background: #6095d6;
    }
  }
  // &:after {
  //   display: block;
  //   clear: both;
  //   content: "";
  //   visibility: hidden;
  //   height: 0;
  // }
  .searchItem {
    float: left;
    margin-right: 34px;
    span {
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      padding-right: 10px;
    }
  }
}
</style>
<style lang="scss">
.cloudNet .search .el-input {
  width: 140px;
  height: 34px;
  // input{
  //   border:1px solid rgba(209,215,224,1);
  // }
  .el-input__inner {
    height: 100%;
    border:1px solid rgba(209,215,224,1) !important;
  }
  .el-input__icon {
    line-height: normal;
  }
}

</style>