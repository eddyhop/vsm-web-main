<template>
  <div class="cloudDev">
    <div class="search">
      <h3>
        {{this.$t('cloudDev.title')}}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{$t('cloudDev.second')}}</span>
      </h3>
    </div>
    <div class="content">
      <div class="mainTop" id="account">
          <div class="inputs">
            <i>
                <img src="@/assets/newPage/icon_search@2x.png" alt />
            </i>
            <el-input v-model="searchContent" class="searchs" :placeholder="$t('cloudDev.remind[3]')" @change="getDevList()"></el-input>
          </div>
          <div class="button">
            <button class="add" @click="addDev()" v-control>
                <i>
                <img src="../../../assets/newPage/icon_add@2x.png" alt />
                </i>
                {{$t('cloudDev.add')}}
            </button>
          </div>
      </div>
      <!-- <div class="control">
        <el-input width="242" prefix-icon="el-icon-search" placeholder="租户" size="small"></el-input>
      </div> -->
      <el-table 
      :data="tableData" 
      border 
      stripe 
      size="small" 
      style="width: 100%"
      highlight-current-row
      :cell-class-name="tableState">
        <el-table-column type="index" :label="$t('cloudDev.index')" show-overflow-tooltip width="70" :resizable="false"></el-table-column>
        <el-table-column prop="sequenceCode" :label="$t('cloudDev.number')" show-overflow-tooltip width="130" :resizable="false"></el-table-column>
        <el-table-column prop="manufacturerName" :label="$t('cloudDev.submit')" show-overflow-tooltip width="130" :resizable="false"></el-table-column>
        
        <el-table-column prop="cloudAccountName" :label="$t('cloudDev.account')" show-overflow-tooltip width="130" :resizable="false"></el-table-column>
        <el-table-column prop="regionId" :label="$t('cloudDev.please')" show-overflow-tooltip width="130" :resizable="false"></el-table-column>
        <el-table-column prop="instanceName" :label="$t('cloudDev.device')" show-overflow-tooltip width="130" :resizable="false"></el-table-column>
        <el-table-column prop="instanceType" :label="$t('cloudDev.example')" show-overflow-tooltip width="130" :resizable="false"></el-table-column>
        <el-table-column prop="businessAddress" :label="$t('cloudDev.bussiness')" show-overflow-tooltip width="130" :resizable="false"></el-table-column>
        <el-table-column prop="manageAddress" :label="$t('cloudDev.control')" show-overflow-tooltip width="130" :resizable="false">
          <template slot-scope="scope" width="130">
            <a target="_blank" :href="`https://${scope.row.manageAddress}:1234`">{{scope.row.manageAddress}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="vpcId" label="VPC ID" show-overflow-tooltip width="130" :resizable="false"></el-table-column>
        <el-table-column prop="vpcNetworkSegment" :label="$t('cloudDev.vpcnet')" show-overflow-tooltip width="130" :resizable="false"></el-table-column>
        <el-table-column :label="$t('cloudDev.state')" :resizable="false">
          <template slot-scope="scope" width="54">
            {{Status(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('cloudDev.operate')" width="199" show-overflow-tooltip :resizable="false">
          <template slot-scope="scope">
              <div class="btn">
                <!-- <span @click="updateVersin(scope.row)">{{$t('cloudDev.update')}}</span> -->
                <el-button 
                type="text"
                size="small" 
                style="color:#3678C8;font-size:14px;font-weight:400" 
                @click="config(scope.row)" 
                v-control>{{$t('cloudDev.deviceConfig')}}</el-button> 
                <el-button 
                type="text"
                size="small" 
                style="color:#3678C8;font-size:14px;font-weight:400"  
                @click="delDev(scope.row)" v-control>{{$t('cloudDev.del')}}</el-button>
              </div>
          </template>
        </el-table-column>
        <!-- <template slot="empty">
          <div class="empty">
            <span>暂无云-云设备，快去</span>
            <span id="newAdd" @click="addDev">新增</span>一条
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
    <Load v-show="LoadShow"/>
    <addDevice ref="addDevice" v-show="isShowAdd" />
    <delDevice v-if="isShowDel" :delMsg="delMsg" />
  </div>
</template>
<script>
import Load from './components/loading'
import addDevice from "./components/addDevice"
import delDevice from "./components/delDevice"
import { getDevList,findAllCloudDeviceSerialNumbers } from "@/services"
export default {
  components:{
    Load,
    addDevice,
    delDevice
  },
  data() {
    return {
      //分页器
      // The pager
      page:1,
      pageSize:10,
      total:0,
      tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId,
      LoadShow:false,
      isShowAdd:false,
      isShowDel:false,
      delMsg:null,  //当前需要删除的设备信息
                    // The device information currently needs to be deleted
      searchContent:"",
      tableData: [],
      page:1,
      pageSize:10,
      total:0,
    };
  },
  methods: {
    config(row){
      this.$router.push('/vsr')
      sessionStorage.setItem("deviceId", row.deviceId);
      sessionStorage.setItem(
          "devData",
          JSON.stringify({
            deviceName: row.deviceName,
            vsrSeries: row.sequenceCode,
            tenantId: row.deviceTenantId
          })
        );
    },
    //页数条数改变
    // The number of pages has changed
    litePage(val){
      this.pageSize = val;
      this.getDevList()
    },
    //页数改变
    // Page number change
    liteSize(val) {
        this.page = val;
        this.getDevList()
    },
    // 状态颜色切换
    // State color switch
    tableState({ row }) {
      if (row.state === 0) {
        return "lose";
      } else if (row.state === 1) {
        return "usable";
      }
    },
    updateVersin(){
      this.LoadShow = true;
    },
    //表格状态
    // Form state
    Status(scope){
      if(scope.state == 0){
        return this.$t('cloudDev.offline')
      }else{
        return this.$t('cloudDev.online')
      }
    },
    //获取设备列表
    // Get device list
    getDevList(){
        getDevList({
            tenantId:this.tenantId,
            pageNumber:this.page,
            pageSize:this.pageSize,
            content:this.searchContent
        }).then(res => {
            if(res.code === 10000){
                this.tableData = res.result.records;
                this.total = res.result.total;
            }
        })
    },
    addDev(){
      this.isShowAdd = true;
      findAllCloudDeviceSerialNumbers({tenantId:this.tenantId}).then(res=>{
        this.$refs.addDevice.codeList = res.result
      })
    },
    delDev(scope){
      this.delMsg = scope;
      this.isShowDel = true;
    },
  },
  mounted(){
    this.getDevList();
  },
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
  .btn{
      display: flex;
      justify-content: space-around;
      // text-align: center;
      span{
        // flex:1;
        cursor: pointer;
        color:rgba(54,120,200,1);
      }
  }
  .online {
    color: rgba(2, 152, 5, 1);
  }
  .outline {
    color: rgba(186, 39, 39, 1);
  }
  .control {
    margin-bottom: 20px;
    div {
      width: 242px;
    }
  }
}
.cloudDev {
  width: 100%;
  height: 100%;
  background: #eaeef4;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  .search {
    width: 100%;
    height: 62px;
    background: white;
    padding: 20px 30px;
    position: relative;
    button {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      border: none;
      color: rgba(255, 255, 255, 1);
    }
    .opt {
      display: flex;
      margin-top: 20px;
      font-size: 14px;
      .limit {
        width: 242px;
      }
      span {
        width: 108px;
        line-height: 34px;
      }
    }
    .op-but {
      justify-content: flex-end;
      button:hover {
        background: rgba(96, 149, 214, 1);
      }
    }
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
}
.mainTop {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .inputs {
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
    .searchs {
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
  }
}
#newAdd{
  color:#3678C8;
  cursor: pointer;
}
</style>
<style lang="scss">
// 滚动条的宽度
// The width of the scroll bar
  .cloudDev .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px; // 横向滚动条
                // Horizontal scroll bar
    height: 6px; // 纵向滚动条 必写
                 // Vertical scroll bars must be written
  }
  // 滚动条的滑块
  // The slider of the scroll bar
  .cloudDev .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 3px;
  }
  .cloudDev .el-input .el-input__inner{
  border:1px solid rgba(209,215,224,1) !important;
}
.cloudDev {
  .el-table .lose:nth-child(11) .cell {
    color: #ba2727;
  }
  .el-table .usable:nth-child(11) .cell {
    color: #029805;
  }
}
.cloudDev .mainTop .inputs{
  .el-input__inner{
      height:34px;
      line-height: 34px;
      padding:0 34px;
    }
}
</style>