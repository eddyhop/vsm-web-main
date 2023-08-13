<template>
  <div class="note">
    <div class="search">
      <h3>
        {{$t('Log.monitoring')}}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{$t('Log.note')}}</span>
      </h3>
    </div>
    <div class="content">
      <div class="control">
        <div>
          <el-date-picker
            class="datePicker"
            v-model="value"
            type="datetimerange"
            range-separator="——"
            size="small"
            @change="choseTime"
            :start-placeholder="$t('Log.startDate')"
            :end-placeholder="$t('Log.endDate')"
            prefix-icon="el-icon-time"
          ></el-date-picker>
          <button class="tm" @click="refresh">
            <i class="el-icon-refresh-right"></i>
          </button>
        </div>
        <!-- <button class="vsa">保存日志</button> -->
        <div class="but">
          <button v-debounce="out" class="save">{{$t('Log.export')}}</button>
          <button @click="del" v-control>{{$t('Log.clearAllNote')}}</button>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        border
        stripe
        size="small"
        style="width: 100%"
      >
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('Log.index')"
          align="center"
          width="70"
          :resizable="false"
        ></el-table-column> -->
        <el-table-column prop="username" :label="$t('Log.user')" width="120" :resizable="false"></el-table-column>
        <el-table-column prop="menuName" :label="$t('Log.menu')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="action" :label="$t('Log.actions')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="showtime" :label="$t('Log.time')" show-overflow-tooltip :resizable="false">
          <template slot-scope="scope">
            <span>{{scope.row.showtime.indexOf('.') ? scope.row.showtime.substring(0,scope.row.showtime.length-2) : scope.row.showtime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="descp" :label="$t('Log.noteContent')" show-overflow-tooltip :resizable="false"></el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allNum"
          @size-change="sizeChange"
          @current-change="pageChange"
          :current-page="page"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getlog, delLogNote } from "@/services/index";
import { getToken } from "@/utils/cookie";
import axios from "axios";
export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      value: [],
      allNum: 0,
      page: 1,
      size: 10,
      start: "",
      end: "",
      tenantId: "",
      type: ""
    };
  },
  methods: {
    //页面刷新
    // A page refresh
    refresh() {
      let params = {
        pageNumber: 1,
        pageSize: this.size,
        tenantId: this.tenantId,
        type: this.type
      };
      this.start = ""
      this.end = ""
      this.value = []
      this.getlogList(params);
    },
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.size * (this.page - 1));
    },
    pageChange(val) {
      //页数改变
      // Page number change
      this.page = val;
      let params = {
        pageNumber: this.page,
        pageSize: this.size,
        startDate: this.start,
        endDate: this.end,
        tenantId: this.tenantId,
        type: this.type
      };
      this.getlogList(params);
    },
    sizeChange(val) {
      //页面容量改变
      // Page size change
      this.size = val;
      this.page = 1;
      let params = {
        pageNumber: this.page,
        pageSize: this.size,
        startDate: this.start,
        endDate: this.end,
        tenantId: this.tenantId,
        type: this.type
      };
      this.getlogList(params);
    },
    del() {
      var show97 = localStorage.getItem("show97");
      if(show97 == 'true'){
        
          let params = {
            type: this.type,
            tenantId: this.tenantId
          };
          delLogNote(params).then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("Log.hint5")
              });
              let params = {
                startDate: this.start,
                endDate: this.end,
                tenantId: this.tenantId,
                type: this.type
              };
              this.getlogList(params);
              
            }
          });
      }else{
        this.$confirm(this.$t("Log.hint3")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue97\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", this.$t("Log.hint"), {
          confirmButtonText: this.$t("Log.ok"),
          cancelButtonText: this.$t("Log.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          let params = {
            type: this.type,
            tenantId: this.tenantId
          };
          delLogNote(params).then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t("Log.hint5")
              });
              let params = {
                startDate: this.start,
                endDate: this.end,
                tenantId: this.tenantId,
                type: this.type
              };
              this.getlogList(params);
              localStorage.setItem("show97",localStorage.getItem("checkedValue97"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("Log.hint4")
          });
        });
      }
      
    },
    getlogList(params) {
      getlog(params).then(res => {
        this.tableData = res.result.content;
        this.allNum = res.result.totalElements;
        // console.log(res)
      });
    },
    choseTime() {
      this.start = this.getTime(this.value[0]);
      this.end = this.getTime(this.value[1]);
      let params = {
        startDate: this.start,
        endDate: this.end,
        tenantId: this.tenantId,
        type: this.type
      };
      this.getlogList(params);
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
    out() {
      //window.location.href='http://192.168.100.156:8888/vsm/monitor/logs/download'
      // window.location.href='http://127.0.0.1:8888/vsm/monitor/logs/download'
      //         axios.get('/vsm/monitor/logs/download',{responseType: 'arraybuffer'}).then(res=>{
      //           let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});

      // 　　　　　 let objectUrl = URL.createObjectURL(blob)

      // 　　　　　 window.location.href = objectUrl;
      //         })
      var form = {
        startDate: this.start,
        endDate: this.end,
        type: this.type,
        tenantId: this.tenantId
      };
      var show98 = localStorage.getItem("show98");
      if(show98 == 'true'){
        
          axios({
            // 用axios发送post请求
            // Send a POST request using AXIOS
            method: "get",
            url: " /vsm/monitor/log/download", // 请求地址
                                               // Request the address
            params: form, // 参数
                          // parameter
            responseType: "blob", // 表明返回服务器返回的数据类型
                                  // Indicates the type of data returned by the return server
            headers: {
              "Content-Type": "application/json",
              accessToken: getToken()
            }
          }).then(res => {
            // 处理返回的文件流
            // Process the returned file flow
            const blob = new Blob([res]); //new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
                                          // New Blob([RES]) returns the [Objece Objece] content in the image below without adding data (take one less layer)
            const fileName = this.$t("Log.note") + "日志.xlsx"; //下载文件名称
                                                              // Download file name
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
                                             // Release the URL object
            document.body.removeChild(elink);
          });
      }else{
        this.$confirm(this.$t("Log.hint1")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue98\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
          confirmButtonText: this.$t("Log.ok"),
          cancelButtonText: this.$t("Log.cancel"),
          dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          axios({
            // 用axios发送post请求
            // Send a POST request using AXIOS
            method: "get",
            url: " /vsm/monitor/log/download", // 请求地址
                                               // Request the address
            params: form, // 参数
                          // parameter
            responseType: "blob", // 表明返回服务器返回的数据类型
                                  // Indicates the type of data returned by the return server
            headers: {
              "Content-Type": "application/json",
              accessToken: getToken()
            }
          }).then(res => {
            // 处理返回的文件流
            // Process the returned file flow
            const blob = new Blob([res]); //new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
                                          // New Blob([RES]) returns the [Objece Objece] content in the image below without adding data (take one less layer)
            const fileName = this.$t("Log.note") + "日志.xlsx"; //下载文件名称
                                                              // Download file name
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
                                             // Release the URL object
            document.body.removeChild(elink);
            localStorage.setItem("show98",localStorage.getItem("checkedValue98"));
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("Log.hint2")
          });
        });
      }
      
      
    }
  },
  created() {
    this.tenantId =JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId || "";
    this.type = JSON.parse(sessionStorage.getItem("userData")).type;
    let params = {
      tenantId: this.tenantId,
      type: this.type
    };
    this.getlogList(params);
  }
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
  .edit {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    border: none;
    background: none;
  }
  .control {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .limit {
      width: 240px;
    }
    .save:hover {
      background: rgba(96, 149, 214, 1);
    }
    button {
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: none;
      color: white;
      margin-left: 14px;
    }
    .but button:nth-of-type(2) {
      background: rgba(239, 239, 239, 1);
      color: #333333;
      border: 1px solid rgba(209, 215, 224, 1);
      padding: 0px;
      &:hover {
        background: #3678c8;
        color: white;
        border: none;
      }
    }
    .tm {
      font-size: 17px;
      width: 34px;
      height: 32px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      color: #333333;
    }
    .tm:hover {
      border-color: #3678c8;
      i {
        color: #3678c8;
      }
    }
  }
}
.search {
  width: 100%;
  height: 62px;
  background: white;
  padding: 20px 30px;
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
.note {
  width: 100%;
  height: 100%;
  // background: white;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
}
</style>
<style lang="scss">
  .note .datePicker {
    position: relative;
    .el-icon-time {
      position: absolute;
      left: 14px;
      top: 8px;
      width: 14px;
      height: 14px;
    }
    .el-icon-time:before {
      display: block;
      width: 14px;
      height: 14px;
      background: url("../../assets/homePage/home_icon_calendar@2x.png")
        no-repeat center;
      background-size: cover;
      content: "";
    }
  }
</style>