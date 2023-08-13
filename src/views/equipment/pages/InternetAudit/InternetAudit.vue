<template>
  <!-- 上网审计 -->
  <div class="InternetAudit">
    <div class="open">
      <span>{{$t('newModel.port.open')}}</span>
      <el-switch v-model="value" active-color="#3678C8" inactive-color="#D1D7E0" @change="open"></el-switch>
    </div>
    <div class="set">
      <div class="timeSet">
        <span>{{$t('newModel.audit.AuditSettings')}}</span>
        <el-input :placeholder="$t('newModel.audit.msg1')" v-model.number="maxlimit" max="5000"></el-input>
        <button @click="setLimit">{{$t('newModel.audit.set')}}</button>
      </div>
      <div class="right">
        <div class="timer">
          <el-date-picker
            v-model="timeVal"
            size="mini"
            type="datetimerange"
            @change="choseTime"
            range-separator="——"
            :start-placeholder="$t('vsr1000.startTime')"
            :end-placeholder="$t('vsr1000.endTime')"
            prefix-icon="el-icon-time"
            class="datePicker"
          ></el-date-picker>
        </div>
        <div class="exportExc">
          <button @click="downLoad">{{$t('newModel.audit.export')}}Excel</button>
        </div>
      </div>
    </div>
    <div class="tableList">
      <el-table :data="tableData" border stripe style="width: 100%" size="small">
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('DeviceMan.index')"
          align="center"
          width="70"
          :resizable="false"
        ></el-table-column> -->
        <el-table-column prop="browserTime" :label="$t('newModel.audit.accessTime')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="accessAddress" :label="$t('newModel.audit.visitWebsite')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="accessProtocol" :label="$t('newModel.audit.AccessProtocol')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="clientAddress" :label="$t('newModel.audit.localPort')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="statusCode" :label="$t('newModel.audit.ToEndPort')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="size" :label="$t('newModel.audit.AccessToSize')" show-overflow-tooltip :resizable="false"></el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allNum"
          :page-size="10"
          @size-change="pageChange"
          @current-change="sizeChange"
          :current-page="page"
          layout="total, sizes, prev, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {
  browserecordGetBrowserRecord,
  browserecordGetFile,
  browserecordGetLimit,
  browserecordSetLimit,
  browserecordGetState,
  browserecordOpenBrowserRecord
} from "@/services"
import { getToken } from "@/utils/cookie";
import axios from "axios";
export default {
  data() {
    return {
      timeVal: [],
      value: "",
      maxlimit: "",
      page: 1,
      pageSize: 10,
      allNum: 0,
      tableData: [],
      tenantId: sessionStorage.getItem("tenantValue"),
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      start: "",
      end: "",
    };
  },
  methods: {
    //导出
    // export
    //export 
    downLoad(){
      var form = {
        startDate: this.start,
        endDate: this.end,
        deviceId: this.deviceId,
        tenantId: this.tenantId
      };
      var show31 = localStorage.getItem("show31");
      if(show31 == 'true'){
        
          axios({
            // 用axios发送post请求
            // Send a POST request using AXIOS
            //Send a POST request using AXIOS
            method: "get",
            url: " /vsm//browserecord/getFile", // 请求地址 Request the address
                                                // Browserecord /getFile", Request the address
            params: form, // 参数 parameter
                          // Parameter the parameter
            responseType: "blob", // 表明返回服务器返回的数据类型 Indicates the type of data returned by the return server
                                  // Indicates that the type of data returned by the return server Indicates that the return server returned by the Return server
            headers: {
              "Content-Type": "application/json",
              accessToken: getToken()
            }
          }).then(res => {
            // 处理返回的文件流 Process the returned file flow
            // Process the returned file flow
            const blob = new Blob([res]); //new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层） New Blob([RES]) returns the [Objece Objece] content in the image below without adding data (take one less layer)
                                          // New Blob([RES]) without data returns the content of [Objece objece] in the image below (take one less layer). New Blob([RES]) returns the [Objece objece] content in the image below without data (take one less layer).
            const fileName = this.$t("newModel.vsr100.InternetAudit") + ".xlsx"; //下载文件名称 Download file name
                                                                                 // Download file name
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象 Release the URL object
                                             // Release the URL object Release the URL object
            document.body.removeChild(elink);
          });
      }else{
        this.$confirm(this.$t("Log.hint1"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue31\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
        confirmButtonText: this.$t("Log.ok"),
        cancelButtonText: this.$t("Log.cancel"),
          dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios({
            // 用axios发送post请求
            // Send a POST request using AXIOS
            //Send a POST request using AXIOS
            method: "get",
            url: " /vsm//browserecord/getFile", // 请求地址 Request the address
                                                // Browserecord /getFile", Request the address
            params: form, // 参数 parameter
                          // Parameter the parameter
            responseType: "blob", // 表明返回服务器返回的数据类型 Indicates the type of data returned by the return server
                                  // Indicates that the type of data returned by the return server Indicates that the return server returned by the Return server
            headers: {
              "Content-Type": "application/json",
              accessToken: getToken()
            }
          }).then(res => {
            // 处理返回的文件流 Process the returned file flow
            // Process the returned file flow
            const blob = new Blob([res]); //new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层） New Blob([RES]) returns the [Objece Objece] content in the image below without adding data (take one less layer)
                                          // New Blob([RES]) without data returns the content of [Objece objece] in the image below (take one less layer). New Blob([RES]) returns the [Objece objece] content in the image below without data (take one less layer).
            const fileName = this.$t("newModel.vsr100.InternetAudit") + ".xlsx"; //下载文件名称 Download file name
                                                                                 // Download file name
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象 Release the URL object
                                             // Release the URL object Release the URL object
            document.body.removeChild(elink);
            localStorage.setItem("show31",localStorage.getItem("checkedValue31"));
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("Log.hint2")
          });
        });
      }
      
    },
    //设置上限 Set the upper limit
    // Set the upper limit
    setLimit(){
      browserecordSetLimit({devId:this.deviceId,limit:this.maxlimit}).then(res=>{
        if(res.code==10000){
          this.$message({
            message: this.$t('vsr100.lan.remind[0]'),
            type: 'success'
          });
        }else{
          this.$message({
            message: this.$t('newModel.msg26'),
            type: 'error'
          });
        }
      })
    },
    //选择时间 selection time
    // Selection time selection time
    choseTime(val){
      if(val==null){
        this.getList({pageNumber:1,pageSize:10,deviceId:this.deviceId})
      }else{
        this.start = this.getTime(this.timeVal[0]);
        this.end = this.getTime(this.timeVal[1]);
        let params = {
          startDate:this.start,
          endDate:this.end,
          deviceId:this.deviceId,
          pageSize: this.pageSize,
          pageNumber: 1,
        }
        this.getList(params)
      }
     
    },
    //开关 on-off
    // On - off switch
    async open(val){
      let waitOpen = await browserecordOpenBrowserRecord({enable:val?1:0,devId: this.deviceId}).then(res=>{
        if(res.code==10000){
          this.$message({
            message: this.$t('newModel.port.modifySuccessfully'),
            type: 'success'
          });
        }else{
          this.$message({
            message: res.message,
            type: 'error'
          });
        }

      })
      let limit = await browserecordGetLimit({devId:this.deviceId})
      this.maxlimit = limit.result
      // console.log(val)
    },
    //页面条数改变 The number of page bars changed
    // The number of page bars changes
    pageChange(val) {
      this.pageSize = val;
      this.page = 1;
      let params = {
        startDate:this.start,
        endDate:this.end,
        deviceId:this.deviceId,
        pageSize: val,
        pageNumber: 1,
      }
      this.getList(params)
    },
    //页数改变 Page number change
    // Page change Page Number change
    sizeChange(val) {
      this.page = val;
      let params = {
        startDate:this.start,
        endDate:this.end,
        deviceId:this.deviceId,
        pageSize: this.pageSize,
        pageNumber: val,
      }
      this.getList(params)
    },
    //序号展示 The serial number display
    // The serial Number display
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    getList(params){
      browserecordGetBrowserRecord(params).then(res=>{
        this.tableData = res.result.content
        this.allNum = res.result.totalElements
      })
    },
    async dataInit(){
      //获取开关状态 Get switch status
      // Get the switch status
      let openState = await browserecordGetState({devId:this.deviceId})
      this.value = openState.result==1?true:false
      //获取存储上限 Get storage ceiling
      // Get storage ceiling Get storage ceiling
      let limit = await browserecordGetLimit({devId:this.deviceId})
      this.maxlimit = limit.result
      //获取列表 To obtain a list of
      // To obtain a list of words
      let list = await browserecordGetBrowserRecord({pageNumber:1,pageSize:10,deviceId:this.deviceId})
      this.tableData = list.result.content
      this.tableData.map(item=>{
        item.size = item.size + 'KB'
      })
      this.allNum = list.result.totalElements
    },
    getTime(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let miao = date.getSeconds();
      let list = [year, month, day, hour, minute, miao];
      let list2 = [];
      for (let i in list) {
        if (list[i] < 10) {
          let a = "" + 0 + list[i];
          list2.push(a);
        } else {
          list2.push(list[i]);
        }
      }
      let needTime =
        "" +
        list2[0] +
        "-" +
        list2[1] +
        "-" +
        list2[2] +
        " " +
        list2[3] +
        ":" +
        list2[4] +
        ":" +
        list2[5];
      return needTime;
    },
  },
  created(){
    this.dataInit()
  }
};
</script>
<style scoped lang="scss">
.InternetAudit {
  padding: 27px 30px 0 30px;
}
.set {
  padding-top: 27px;
  width: 100%;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  > div {
    float: left;
  }
  .right {
    float: right;
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
  }
  .exportExc {
    float: left;
    button {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: 0;
      outline: none;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
    button:hover {
      background: rgba(96, 149, 214, 1);
    }
  }
  .timer {
    float: left;
    margin-right: 30px;
    width: 330px;
    height: 34px;
  }
}
.open {
  padding-right: 20px;
  line-height: 34px;
  span {
    margin-right: 10px;
  }
}
.timeSet {
  padding-right: 20px;
  span {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-right: 20px;
  }
  button {
    width: 60px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    border: 0;
    outline: none;
    cursor: pointer;
    margin-left: 14px;
  }
  button:hover {
    background: rgba(96, 149, 214, 1);
  }
}

.tableList {
  padding-top: 20px;
}
</style>
<style lang="scss">
.InternetAudit {
  .datePicker {
    position: relative;
    .el-icon-time {
      position: absolute;
      right: 10px;
      top: 8px;
      width: 14px;
      height: 14px;
    }
    .el-icon-time:before {
      display: block;
      width: 14px;
      height: 14px;
      background: url("../../../../assets/homePage/home_icon_calendar@2x.png")
        no-repeat center;
      background-size: cover;
      content: "";
    }
  }
}
.InternetAudit .set {
  .el-input {
    width: 150px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .el-range-editor--mini.el-input__inner {
    width: 100%;
    height: 100%;
  }
}
</style>