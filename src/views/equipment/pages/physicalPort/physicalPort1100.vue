<template>
  <div class="physical">
    <!-- 物理端口 -->
    <div class="operate">
      <!-- <button @click="editPort">{{$t('facility.save')}}</button> -->
    </div>
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
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('vsr1000.index')"
          align="center"
          width="70"
          :resizable="false"
        ></el-table-column> -->
        <el-table-column
          :label="$t('vsr1000.portName')"
          prop="portName"
          align="center"
          width="128"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          :label="$t('vsr1000.portType')"
          prop="ptype"
          align="center"
          :resizable="false"
        >
          <template slot-scope="scope">
            <!-- <el-select filterable v-model="scope.row.portClass" :placeholder="$t('facility.select')"> -->
            <el-select filterable v-model="scope.row.ptype" placeholder="请选择" >
              <el-option
              v-for="(x,i) in ptypes"
              :value="x.value" :key="i"
              >
              {{x.value}}
              </el-option>
            </el-select>
          </template>
         <!-- {{ $t("vsr1000.auto") }}测试-->
        </el-table-column>
        <el-table-column
          label="dhcp/static"
          prop="portRateId"
          align="center"
          :resizable="false"
        >
           <template slot-scope="scope">
            <el-select filterable
              v-model="scope.row.ipDistribution"
              :disabled="scope.row.portClass==='1'"
            >
              <el-option
                v-for="item in ipDistributions"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        <!--  {{ $t("vsr1000.auto") }} -->
        </el-table-column>
        <el-table-column
          label="ipv4"
          prop="portIp"
          align="center"
          :resizable="false"
        >
          <template slot-scope="scope">
          <el-input v-model="scope.row.portIp" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="gateway"
          align="center"
          prop="portGateway"
          :resizable="false"
        >
         <template slot-scope="scope">
             <el-input v-model="scope.row.portGateway" size="small"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('vsr1000.portState')"
          prop="portSwitch"
          align="center"
          :resizable="false"
        ></el-table-column>

        <el-table-column
          label="优先级"
          prop="priority"
          align="center"
          :resizable="false"
        >
          <template slot-scope="scope">
          <el-input v-model="scope.row.priority" size="small"></el-input>
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('vsr1000.operate')" :resizable="false">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              v-control
              @click="editPort(scope.row)"
              >{{ $t("vsr1000.save") }}</el-button
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
  </div>
</template>
<script>
import {
  editPhyPort,
  getPhyPortList,
  vsrgetPortType,
  vsrgetDupStu,
  getDevRate,
  getNewPortByCondition,
  // updateNewPort,
} from "@/services";
export default {
  props: {
    activeName: {
      type: String,
    },
  },
  components: {},
  data() {
    return {
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      tableData: [],
      // path: "ws://192.168.100.193:8888/vsm/ws/long",
      path: "ws://114.116.17.229:8080/vsm/ws/long",
      socket: "",
      data: [],
      multipleSelection: [],
      page: 1,
      pageSize: 10,
      allNum: 0,
      ptypes: [
        {value:"wan"},
        {value:"lan"}
      ],
      ipDistributions: [
        {value:"dhcp"},
        {value:"static"}
      ]
    };
  },
  computed: {},
  methods: {
    pageChange(val) {
      // console.log(val)
      //页数总条目改变 Total page entries change
      // Total page entries change Total Page Entries Change
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
      // Page change Page Number change
      // console.log(val)
      this.page = val;
      let params = {
        deviceId: this.deviceId,
        // randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)),
        pageSize: this.pageSize,
        pageNumber: this.page,
      };
      this.physicalPortInit(params);
    },
    //表格序号 Form the serial number
    // Form the serial number
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //多选选择物理端口 Select multiple physical ports
    // Select multiple physical ports
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //物理端口表格数据获取 Physical port table data acquisition
    // Physical Port Table data acquisition
    physicalPortInit(params) {
      let _this = this;
      async function init(params) {
        let data = await getNewPortByCondition(params);
        _this.allNum = data.result.totalElements;
        data.result.content.forEach((item) => {
          item.portSwitch = item.portEnabled ? "up" : "down";
        });
        _this.tableData = data.result.content
      }
      init(params);
    },
    gettypes(){
      
    },
    kai(row) {
      this.data.push(row);
      // console.log(this.data);
    },
    editPort(row) {
      let params = {
        portEnabled: row.portEnabled,
        id: row.id,
        deviceId: this.deviceId,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)),
        ptype: row.ptype,
        ipDistribution: row.ipDistribution,
        portIp: row.portIp,
        portGateway: row.portGateway,
        priority: row.priority
      };
      //报错注释
      // updateNewPort(params).then((res) => {
      //   if (res.code === 10000) {
      //     this.$message({
      //       message: this.$t("vsr1000.remind[0]"),
      //       type: "success",
      //     });
      //     this.physicalPortInit({
      //       deviceId: this.deviceId,
      //       pageSize: this.pageSize,
      //       page: this.page,
      //     });
      //   } else {
      //     this.$message({
      //       type: "warning",
      //       dangerouslyUseHTMLString: true,
      //       message: res.message,
      //     });
      //     let params = {
      //       deviceId: this.deviceId,
      //       pageSize: this.pageSize,
      //       page: this.page,
      //     };
      //     this.physicalPortInit(params);
      //   }
      // });
    },
    initWs() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
        //Your browser does not support sockets
      } else {
        // 实例化socket instantiation socket
        // Instantiation of sockets
        this.socket = new WebSocket(this.path);
        // 监听socket连接 Monitor socket connection
        // Monitor Socket Connection
        this.socket.onopen = this.open;
        // 监听socket错误信息 Listen for socket error messages
        // Listen for Socket error messages
        this.socket.onerror = this.error;
        // 监听socket消息 Listen for socket messages
        // Listen for Socket messages
        this.socket.onmessage = this.getMessage;
        //关闭socket close socket
        // Socket Close Socket
        this.socket.onclose = this.close;
      }
    },
    open: function () {
      this.send(parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)) + "");
      console.log("socket连接成功");
      //Socket connection successful
    },
    error: function () {
      console.log("连接错误");
      // connection error
    },
    getMessage: function (msg) {
      console.log(msg);
    },
    send: function (params) {
      this.socket.send(params);
    },
    close: function () {
      console.log("socket已经关闭");
      //Socket has been closed.
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
  },
  created() {
    // this.initWs(); //开启webscoket Open webscoket
    // this.initWs(); So let's go ahead and Open up webket
    this.physicalPortInit({
      deviceId: this.deviceId,
      pageSize: this.pageSize,
      pageNumber: this.page,
    });
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