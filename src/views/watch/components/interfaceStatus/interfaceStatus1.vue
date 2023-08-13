<template>
  <div class="logical">
    <div class="operate">
      <button @click="qhuan(1)" class="flBut" :class="{'onBut':qhuanInt==1}" v-control>{{$t('Monit.physicalInterfaces')}}</button>
      <button @click="qhuan(2)" class="flBut" :class="{'onBut':qhuanInt==2}" v-control>{{$t('Monit.logicalInterfaces')}}</button>
      <button class="add" v-control @click="refresh()">
        {{$t('Monit.refresh')}}
      </button>
    </div>
    <!-- 物理端口-->
    <div v-if="qhuanInt==1" class="tableView">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
        stripe
        fit
        size="small"
      >
        <el-table-column prop="portName" :label="$t('Monit.interfaceName')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="macAddress" :label="$t('Monit.macAddress')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="portSwitch" :label="$t('Monit.configuredState')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="portStatus" :label="$t('Monit.opreationalState')" show-overflow-tooltip :resizable="false"></el-table-column>

        <el-table-column  :label="$t('Monit.operations')" :resizable="false">
          <template slot-scope="scope">
            <button
              @click="goSetPage(scope.row)"
              type="text" class="edit"
              size="small" v-control
              style="color:#3678C8;font-size:14px;font-weight:400"
            >{{$t('Monit.moreDetails')}}</button>
            <button type="text" size="small" class="edit" v-control style="color:#3678C8;font-size:14px;font-weight:400">{{$t('Monit.refresh')}}</button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="totalNum"
          @size-change="sizeChange"
          @current-change="pageChange"
          :current-page="page"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <!-- 逻辑端口-->
    <div v-if="qhuanInt==2" class="tableView">
      <el-table
        ref="multipleTable"
        :data="tableData1"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
        stripe
        fit
        size="small"
      >
        <el-table-column prop="name" :label="$t('Monit.interfaceName')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="state" :label="$t('Monit.state')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="mtu" :label="$t('Monit.mtu')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="dhcpClient" :label="$t('Monit.dhcpClient')" show-overflow-tooltip :resizable="false">
          <template slot-scope="socp">
            <span v-if="socp.row.dhcpClient==true">{{$t('vsr1000.enabled')}}</span>
            <span v-if="socp.row.dhcpClient==false">{{$t('vsr1000.disabled')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ipv4" :label="$t('Monit.ipAddress')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="gateway" :label="$t('Monit.gateway')" show-overflow-tooltip :resizable="false"></el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allNum"
          @size-change="sizeChange"
          @current-change="pageChange"
          :current-page="lNumber"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <!-- <editPort ref="editPort" v-show="editShow"></editPort>
    <addPzInfo ref="addPzInfo" :pzShow="pzShow"></addPzInfo> -->
  </div>
</template>
<script>
// import editPort from "./components/editPort";
// import addPzInfo from "./components/addPz";
import {

  logicalPortGet, getPortByCondition
} from "@/services/index";
export default {
  props: {},
  components: {
    // editPort,
    // addPzInfo
  },
  data() {
    return {
      qhuanInt:1,
      // deviceSerialNumber:JSON.parse(this.$route.query.devData).vsrSeries,
      isShow: false,
      pzShow: false,
      editShow: false,
      allNum: 0, //数据总条数 Total number of data bars
                 // Total number of data bars
      lNumber: 1, //当前页数, The current number of pages
                  // The current number of pages
      Size: 10,
      totalNum:0,
      page: 1,
      pageSize: 10,
      tableData: [],
      tableData1: [],
      multipleSelection: [],
      deviceId: this.$parent.edgeName ,
      tenantId :""
    };
  },
  computed: {},
  methods: {
    qhuan(r){
      this.qhuanInt = r
    },
    //表格序号 Form the serial number
    // Form the serial number
    indexMethod(index) {
      return index + 1 + (this.lNumber==1?0:this.Size*(this.lNumber-1));
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
    ,
    sizeChange(val) {
      //页数总条目改变 Total page entries change
      // Total page entries change Total Page Entries Change
      this.Size = val;
      this.lNumber = 1
      this.getList();
    },
    pageChange(val) {
      //页数改变 Page number change
      // Page change Page Number change
      // console.log(val)
      this.lNumber = val;
      this.getList();
    },
    getlogicalPortList() {
      this.deviceId = this.$parent.edgeName ;
      let params = {
         deviceId:this.deviceId,
         pageNumber:this.lNumber,
         pageSize:this.Size,
      }
      logicalPortGet(params).then(res => {
        this.allNum = res.result.totalElements;
        this.tableData1 = res.result.content;
      });
    },
    physicalPortInit() {
      this.deviceId = this.$parent.edgeName ;
      let params ={
        deviceId: this.deviceId,
        pageSize: this.pageSize,
        page: this.page,
      }
       getPortByCondition(params).then( res =>{
              this.totalNum = res.result.totalElements;
              res.result.content.forEach((item) => {
               item.portSwitch = item.portEnabled ? "Up" : "Down";
             });
             this.tableData = res.result.content;
           }
       );
    },
    refresh(){
     if("1"==this.qhuanInt){
       this.physicalPortInit();
     }else{
       this.getlogicalPortList();
     }
    },
    goSetPage(row) {
      var lan = this.$i18n.locale;
      if(lan=="en"){
        sessionStorage.setItem("lan", "English");
        sessionStorage.setItem("lang", "en");
        sessionStorage.setItem("User-Language", "en-US");
      }else if(lan=="cn"){
        sessionStorage.setItem("lan", "简体中文");
        sessionStorage.setItem("lang", "cn");
        sessionStorage.setItem("User-Language", "zh-CN");
      }

      // sessionStorage.setItem("deviceId", row.id);
      let params = {
        deviceId: this.deviceId ,
        tenantId: this.tenantId,
      };
      this.$router.push({
        path: "/devSet/allocation",
        query: { devData: JSON.stringify(params) },
      });
    }
  },
  created() {
    this.tenantId = sessionStorage.getItem("tenantValue");
    this.physicalPortInit();
    this.getlogicalPortList();
  },
  mounted() {}
};
</script>
<style lang="scss">
.logical {
  .el-table th {
    text-align: center;
  }
  .el-table td {
    text-align: center;
  }
}
</style>
<style scoped lang="scss">
.logical {
  padding: 20px 30px 0 30px;
}
.operate {
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .add:hover{
    background: #6095D6;
  }
  button {
    float: right;
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    border: none;
    outline: none;
    cursor: pointer;
    display: table-cell;
    vertical-align: middle;
    img {
      width: 14px;
      height: 14px;
      position: relative;
      top: 1px;
    }
  }
  .flBut{
    padding: 0 15px;
    &.onBut{
      background: rgba(54, 120, 200, 1);
      color: #ffffff;
    }
    width: auto;
    float: left;
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-right: 20px;
    &:hover{
      background: #6095D6;
      color: #ffffff;
    }
  }
  .close {
    float: right;
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-left: 23px;
  }
}
.tableView {
  padding-top: 20px;
  .edit{
    font-size:11px;
    font-family:arial, sans-serif;
    font-weight:400;
    color:rgba(54,120,200,1);
    border: none;
    background: none;
  }
}
</style>