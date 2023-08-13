<template>
  <div class="physical">
    <!-- 物理端口 -->
    <div class="tableView">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        stripe
        size="small"
        fit
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          :label="$t('vsr1000.name')"
          prop="portName"
          align="center"
          width="128"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>


        <el-table-column
          :label="$t('vsr1000.type')"
          align="center"
          :resizable="false"
        >
           <template slot-scope="scope">
             {{getPortType(scope.row.portType)}}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('vsr1000.configuredState')"
          align="center"
          :resizable="false"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.portEnabled"
              active-color="#3678C8"
              inactive-color="#D1D7E0"
              :disabled="!online"
              @change="kai(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('vsr1000.operations')" :resizable="false" >
          <template slot-scope="scope">
            <el-button :disabled="(scope.row.portType!=1024 && scope.row.portType!=768) || scope.row.portEnabled==false"
              type="text"
              size="small"
              style="font-size: 14px; font-weight: 400"
              v-control
              @click="edit(scope.row)"
              >{{ $t("vsr1000.edit") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        :page-sizes="[5, 10]"
        :total="allNum"
        @size-change="pageChange"
        @current-change="sizeChange"
        :current-page="page"
        :page-size="10"
        layout="total, sizes, prev, next, jumper"
        style="font-family: arial, sans-serif"
      ></el-pagination>
    </div>
    <editLTE ref="editInfo" v-show="editLTEShow"  :portName="portName" :lteApn="lteApn"></editLTE>
    <editWIFI ref="editWIFIInfo" v-show="editWIFIShow" :portName="portName" ></editWIFI>

  </div>
</template>
<script>
import editLTE from "./components/editLTE";
import editWIFI from "./components/editWIFI";
import {
  getPortByCondition, initDefaultPort,
  updatePort,userInfo,
} from "@/services";
export default {
  props: {
    activeName: {
      type: String,
    },
  },
  components: {
    editLTE,
    editWIFI
  },
  data() {
    return {
      lang: sessionStorage.getItem("lang") || "en",
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      deviceSerialNumber:JSON.parse(this.$route.query.devData).vsrSeries,
      tenantId : JSON.parse(this.$route.query.devData).tenantId,
      online : JSON.parse(this.$route.query.devData).online,
      location : JSON.parse(this.$route.query.devData).location,
      tableData: [],
      // path: "ws://192.168.100.193:8888/vsm/ws/long",
      path: "ws://114.116.17.229:8080/vsm/ws/long",
      socket: "",
      data: [],
      multipleSelection: [],
      page: 1,
      pageSize: 10,
      allNum: 0,
      editLTEShow:false,
      editWIFIShow:false,
      portName:"",
      lteApn:"",
      ssid:"",
      pwd:"",
      bands:"",
      countryCode:"",
      type:"",
    };
  },
  computed: {},
  methods: {
    pageChange(val) {
      //页数总条目改变 Total page entries change
      this.pageSize = val;
      let params = {
        deviceId: this.deviceId,
        pageSize: this.pageSize,
        pageNumber: 1,
      };
      this.page = 1;
      this.physicalPortInit(params);
    },
    sizeChange(val) {
      //页数改变 Page number change
      this.page = val;
      let params = {
        deviceId: this.deviceId,
        pageSize: this.pageSize,
        pageNumber: this.page,
      };
      this.physicalPortInit(params);
    },
    //表格序号 Form the serial number
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //多选选择物理端口 Select multiple physical ports
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //物理端口表格数据获取 Physical port table data acquisition
    physicalPortInit(params) {
      let _this = this;
      async function init(params) {
        let data = await getPortByCondition(params);
        _this.allNum = data.result.totalElements;
        data.result.content.forEach((item) => {
          item.portSwitch = item.portEnabled ? "up" : "down";
          if(item.portName=="G0"){
            item.portEnabled = true;
          }
        });
        _this.tableData = data.result.content;
      }
      init(params);
    },
    async physicalPortList(params) {
        let data = await getPortByCondition(params);
        this.allNum = data.result.totalElements;
        this.tableData = data.result.content;
    },
    kai(row) {
      this.data.push(row);
      this.editPort(row)
    },
    devCheckOnline() {
      let  online = JSON.parse(this.$route.query.devData).online;
      if(!online){
        this.$message({
          type: "warning",
          message: this.$t("Configuration.EdgeConfiguration"),
        });
        return ;
      }
      return online;
      // return true;
    },
    edit(row){
      if(!this.devCheckOnline()){
        return;
      }
      if(row.portType=="1024"){
        this.portName = row.portName ;
        this.lteApn = row.lteApn;
        this.$refs.editInfo.from.portName = row.portName;
        this.$refs.editInfo.from.apn = row.lteApn;
        this.editLTEShow = true;
      }else if(row.portType=="768"){
        this.portName = row.portName;
        this.$refs.editWIFIInfo.dataInit(row, this.index);
        this.editWIFIShow = true;
      }
    },
    editPort(row) {
      let params = {
        portEnabled: row.portEnabled,
        portName: row.portName,
        id: row.id,
        deviceId: this.deviceId,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)),
      };
      updatePort(params).then((res) => {
        if (res.code === 10000) {
          this.$message({
            message: this.$t("vsr1000.remind[0]"),
            type: "success",
          });
          this.physicalPortInit({
            deviceId: this.deviceId,
            pageSize: this.pageSize,
            page: this.page,
          });
        } else {
          this.$message({
            type: "warning",
            dangerouslyUseHTMLString: true,
            message: res.message,
          });
          let params = {
            deviceId: this.deviceId,
            pageSize: this.pageSize,
            page: this.page,
          };
          this.physicalPortInit(params);
        }
      });
    },
    initWs() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        // 实例化socket instantiation socket
        this.socket = new WebSocket(this.path);
        // 监听socket连接 Monitor socket connection
        this.socket.onopen = this.open;
        // 监听socket错误信息 Listen for socket error messages
        this.socket.onerror = this.error;
        // 监听socket消息 Listen for socket messages
        this.socket.onmessage = this.getMessage;
        //关闭socket close socket
        this.socket.onclose = this.close;
      }
    },
    open: function () {
      this.send(parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)) + "");
     // console.log("socket连接成功");
      //Socket connection successful
    },
    error: function () {
     // console.log("连接错误");
      // connection error
    },
    getMessage: function (msg) {
     // console.log(msg);
    },
    send: function (params) {
      this.socket.send(params);
    },
    close: function () {
     // console.log("socket已经关闭");
      //Socket has been closed.
    },
    handleEdit(index, row) {
     // console.log(index, row);
    },
    handleDelete(index, row) {
     // console.log(index, row);
    },
    getPortType(portType){
      if(portType=="1024"){
        return "LTE";
      }else if(portType=="768"){
        return "Wi-Fi";
      }else {
        return this.$t("vsr1000.ethemet");
      }
      // console.log(row)
    }
  },
  created() {
    // this.initWs(); //开启webscoket Open webscoket
    // this.initWs(); So let's go ahead and Open up webket
    this.physicalPortInit({
      deviceId: this.deviceId,
      pageSize: this.pageSize,
      pageNumber: this.page,
    });

    if (this.online) {
      userInfo().then((res) => {
        this.type = res.result.type;
        if (this.location == "NaaS Edge" && !(this.type == 1)) {
          this.online = false;
        }
      });
    }
    
    initDefaultPort({deviceId:this.deviceId,tenantId:this.tenantId,deviceSerialNumber:this.deviceSerialNumber});
  },
  mounted() {},
  destroyed() {
    // this.socket.onclose()
  },
};
</script>
<style scoped lang="scss">
.physical {
  padding: 20px 30px 20px 30px;
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
  button {
    float: right;
    font-size: 14px;
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
  }
  button:hover {
    background: #6095d6;
  }
}
</style>
<style lang="scss">
.physical .tableView {
  .el-input__inner {
    width: 130px;
    height: 28px;
  }
  .el-input__icon {
    line-height: normal;
  }
}
</style>